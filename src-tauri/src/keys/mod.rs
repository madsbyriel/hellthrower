//! Bridge between the keyrs keyboard backend and the UI.
//!
//! - [`start_combo_recording`]/[`cancel_combo_recording`] drive the
//!   key-capture UI (live events via `keyrs-record-update`,
//!   completion via `keyrs-record-complete`).
//! - [`activate_loadout`]/[`deactivate_loadout`] arm and disarm the
//!   autothrow engine: it tracks globally pressed keys, matches them
//!   against the loadout's chords, and emits the matching stratagem code
//!   through keyrs' uinput virtual device.
//!
//! The engine emits nothing unless armed, and nothing after deactivation
//! cancels it mid-sequence.

mod combo;
mod emitter;
mod models;

pub use models::{
    parse_binding, ActivationConfig, ParsedBinding, ParsedDirections, RecordComplete, RecordError,
    RecordUpdate, TriggerEvent,
};

use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::Arc;
use std::time::{Duration, Instant};

use keyrs::{DefaultKeyboard, InputKeyEvent, Key};
use tauri::{AppHandle, Emitter, State};
use tokio::sync::{broadcast, mpsc};
use tokio_util::sync::CancellationToken;

use combo::{ChordTracker, ComboRecorder, RecorderAction};

/// Name keyrs gives its uinput device. Events from it must never trigger
/// chords, or an emitted code would re-trigger itself forever.
const VIRTUAL_DEVICE_NAME: &str = "keyrs virtual keyboard";

/// Refractory window after a trigger: some devices (notably mice) report
/// the same physical button through several event nodes, which looks like
/// two independent presses arriving back to back.
const TRIGGER_COOLDOWN: Duration = Duration::from_millis(250);

/// Events emitted to the frontend.
pub const EVENT_RECORD_UPDATE: &str = "keyrs-record-update";
pub const EVENT_RECORD_COMPLETE: &str = "keyrs-record-complete";
pub const EVENT_RECORD_ERROR: &str = "keyrs-record-error";
pub const EVENT_TRIGGER: &str = "autothrow-trigger";
pub const EVENT_ERROR: &str = "autothrow-error";

struct EngineHandle {
    cancel: CancellationToken,
}

struct RecordingHandle {
    cancel: CancellationToken,
}

/// App-managed runtime state for the key engine.
pub struct KeyRuntime {
    /// The keyrs backend, created lazily on first use (needs /dev/input
    /// read access and /dev/uinput write access).
    keyboard: Arc<tokio::sync::Mutex<Option<DefaultKeyboard>>>,
    /// Currently armed engine, if any.
    engine: Option<EngineHandle>,
    /// Emitter channel for the armed engine.
    emitter: Option<mpsc::Sender<Vec<Key>>>,
    /// Currently running recording session, if any.
    recording: Option<RecordingHandle>,
    /// True while a recording session is running — the engine suppresses
    /// triggers during recording so capture never fires a stratagem.
    recording_active: Arc<AtomicBool>,
    /// True while the pointer is over the app window. Mouse-button chords
    /// are suppressed then: a click over our own window never reaches the
    /// game, so firing would only click our UI.
    pointer_in_app: Arc<AtomicBool>,
}

impl Default for KeyRuntime {
    fn default() -> Self {
        Self {
            keyboard: Arc::new(tokio::sync::Mutex::new(None)),
            engine: None,
            emitter: None,
            recording: None,
            recording_active: Arc::new(AtomicBool::new(false)),
            pointer_in_app: Arc::new(AtomicBool::new(false)),
        }
    }
}

/// The managed Tauri state type.
pub type ManagedKeyState = std::sync::Mutex<KeyRuntime>;

/// True for the mouse-button key variants.
fn is_mouse_button(key: &Key) -> bool {
    matches!(
        key,
        Key::MouseLeft
            | Key::MouseRight
            | Key::MouseMiddle
            | Key::MouseSide
            | Key::MouseExtra
            | Key::MouseForward
            | Key::MouseBack
    )
}

/// Report whether the pointer is currently over the app window. Kept in
/// sync by the frontend; mouse-button chords are ignored while it is.
#[tauri::command]
pub fn set_pointer_in_app(
    state: State<'_, ManagedKeyState>,
    inside: bool,
) -> Result<(), String> {
    let rt = state.lock().map_err(|_| "key state poisoned".to_string())?;
    rt.pointer_in_app.store(inside, Ordering::SeqCst);
    Ok(())
}

/// Create the keyrs backend once, if it does not exist yet.
async fn ensure_keyboard(
    keyboard: &Arc<tokio::sync::Mutex<Option<DefaultKeyboard>>>,
) -> Result<(), String> {
    let mut guard = keyboard.lock().await;
    if guard.is_none() {
        *guard = Some(DefaultKeyboard::new().map_err(|error| {
            format!(
                "keyboard backend unavailable (check /dev/input and /dev/uinput access): {error}"
            )
        })?);
    }
    Ok(())
}

fn is_virtual_device(event: &InputKeyEvent) -> bool {
    event.device.name == VIRTUAL_DEVICE_NAME
}

fn key_names(keys: &[Key]) -> Vec<String> {
    keys.iter().map(ToString::to_string).collect()
}

// ── Combo recording ────────────────────────────────────────────────────

/// Start capturing a chord. Live key state is streamed as
/// `keyrs-record-update` events; the finished combo arrives as
/// `keyrs-record-complete` once every key has been released again.
#[tauri::command]
pub async fn start_combo_recording(
    app: AppHandle,
    state: State<'_, ManagedKeyState>,
) -> Result<(), String> {
    let keyboard = {
        let rt = state.lock().map_err(|_| "key state poisoned".to_string())?;
        rt.keyboard.clone()
    };
    ensure_keyboard(&keyboard).await?;

    let rx = keyboard
        .lock()
        .await
        .as_ref()
        .ok_or_else(|| "keyboard backend missing".to_string())?
        .subscribe();

    // Replace any previous session (it will observe its cancellation).
    let (cancel, recording_active) = {
        let mut rt = state.lock().map_err(|_| "key state poisoned".to_string())?;
        if let Some(previous) = rt.recording.take() {
            previous.cancel.cancel();
        }
        let cancel = CancellationToken::new();
        rt.recording_active.store(true, Ordering::SeqCst);
        rt.recording = Some(RecordingHandle {
            cancel: cancel.clone(),
        });
        (cancel, rt.recording_active.clone())
    };

    tauri::async_runtime::spawn(recording_loop(app, rx, cancel, recording_active));
    Ok(())
}

/// Abort the running recording session, if any.
#[tauri::command]
pub fn cancel_combo_recording(state: State<'_, ManagedKeyState>) -> Result<(), String> {
    let mut rt = state.lock().map_err(|_| "key state poisoned".to_string())?;
    if let Some(recording) = rt.recording.take() {
        recording.cancel.cancel();
    }
    rt.recording_active.store(false, Ordering::SeqCst);
    Ok(())
}

async fn recording_loop(
    app: AppHandle,
    mut rx: broadcast::Receiver<InputKeyEvent>,
    cancel: CancellationToken,
    active: Arc<AtomicBool>,
) {
    let mut recorder = ComboRecorder::new();
    loop {
        tokio::select! {
            biased;
            _ = cancel.cancelled() => {
                active.store(false, Ordering::SeqCst);
                return;
            }
            event = rx.recv() => match event {
                Ok(event) => {
                    if is_virtual_device(&event) {
                        continue;
                    }
                    match recorder.on_event(&event) {
                        RecorderAction::Update(keys) => {
                            let _ = app.emit(EVENT_RECORD_UPDATE, RecordUpdate { pressed: key_names(&keys) });
                        }
                        RecorderAction::Complete(combo) => {
                            active.store(false, Ordering::SeqCst);
                            let _ = app.emit(EVENT_RECORD_COMPLETE, RecordComplete { combo: key_names(&combo) });
                            return;
                        }
                        RecorderAction::None => {}
                    }
                }
                Err(broadcast::error::RecvError::Lagged(_)) => continue,
                Err(broadcast::error::RecvError::Closed) => {
                    active.store(false, Ordering::SeqCst);
                    let _ = app.emit(EVENT_RECORD_ERROR, RecordError {
                        message: "keyboard backend closed".to_string(),
                    });
                    return;
                }
            },
        }
    }
}

// ── Activation engine ──────────────────────────────────────────────────

/// Arm a loadout: validate its bindings and start the engine. Any previous
/// engine is stopped first.
#[tauri::command]
pub async fn activate_loadout(
    app: AppHandle,
    state: State<'_, ManagedKeyState>,
    config: ActivationConfig,
) -> Result<(), String> {
    let directions = ParsedDirections::parse(&config.direction_keys)?;
    let bindings: Vec<ParsedBinding> = config
        .bindings
        .iter()
        .map(|binding| parse_binding(binding, &directions))
        .collect::<Result<Vec<_>, String>>()?;
    if bindings.is_empty() {
        return Err("loadout has no valid bindings".to_string());
    }

    let keyboard = {
        let rt = state.lock().map_err(|_| "key state poisoned".to_string())?;
        rt.keyboard.clone()
    };
    ensure_keyboard(&keyboard).await?;

    let rx = keyboard
        .lock()
        .await
        .as_ref()
        .ok_or_else(|| "keyboard backend missing".to_string())?
        .subscribe();

    // Replace any existing engine before arming the new one.
    let cancel = CancellationToken::new();
    let (emitter_tx, emitter_rx) = mpsc::channel::<Vec<Key>>(2);
    let (recording_active, pointer_in_app) = {
        let mut rt = state.lock().map_err(|_| "key state poisoned".to_string())?;
        if let Some(engine) = rt.engine.take() {
            engine.cancel.cancel();
        }
        if let Some(old_emitter) = rt.emitter.take() {
            drop(old_emitter);
        }
        rt.engine = Some(EngineHandle {
            cancel: cancel.clone(),
        });
        rt.emitter = Some(emitter_tx.clone());
        (rt.recording_active.clone(), rt.pointer_in_app.clone())
    };

    tauri::async_runtime::spawn(emitter::run(
        app.clone(),
        keyboard,
        emitter_rx,
        cancel.clone(),
    ));
    tauri::async_runtime::spawn(engine_loop(
        app, rx, bindings, emitter_tx, cancel, recording_active, pointer_in_app,
    ));
    Ok(())
}

/// Disarm: stop listening and stop emitting. In-flight emissions are
/// cancelled between key events.
#[tauri::command]
pub fn deactivate_loadout(state: State<'_, ManagedKeyState>) -> Result<(), String> {
    let mut rt = state.lock().map_err(|_| "key state poisoned".to_string())?;
    if let Some(engine) = rt.engine.take() {
        engine.cancel.cancel();
    }
    if let Some(emitter) = rt.emitter.take() {
        drop(emitter);
    }
    Ok(())
}

async fn engine_loop(
    app: AppHandle,
    mut rx: broadcast::Receiver<InputKeyEvent>,
    bindings: Vec<ParsedBinding>,
    emitter: mpsc::Sender<Vec<Key>>,
    cancel: CancellationToken,
    recording_active: Arc<AtomicBool>,
    pointer_in_app: Arc<AtomicBool>,
) {
    let combos: Vec<Vec<Key>> = bindings.iter().map(|b| b.combo.clone()).collect();
    let has_mouse_button: Vec<bool> = combos
        .iter()
        .map(|combo| combo.iter().any(is_mouse_button))
        .collect();
    let mut tracker = ChordTracker::new();
    let mut last_fire: Option<Instant> = None;

    loop {
        tokio::select! {
            biased;
            _ = cancel.cancelled() => return,
            event = rx.recv() => match event {
                Ok(event) => {
                    if is_virtual_device(&event) {
                        continue;
                    }
                    // Never trigger while the user is recording a combo.
                    let allowed = !recording_active.load(Ordering::SeqCst);
                    if let Some(index) = tracker.on_event(&event, &combos, allowed) {
                        // A mouse-button chord only makes sense when the
                        // pointer is off our own window: a click over the
                        // app never reaches the game, and would otherwise
                        // fire UI buttons instead of stratagems.
                        if has_mouse_button[index] && pointer_in_app.load(Ordering::SeqCst) {
                            continue;
                        }
                        let now = Instant::now();
                        let outside_cooldown = last_fire
                            .map_or(true, |fired| now.duration_since(fired) >= TRIGGER_COOLDOWN);
                        if !outside_cooldown {
                            continue;
                        }
                        last_fire = Some(now);
                        let binding = &bindings[index];
                        // Only report a deployment when the code was actually
                        // queued — one throw at a time, extras are dropped.
                        if emitter.try_send(binding.code.clone()).is_ok() {
                            let _ = app.emit(EVENT_TRIGGER, TriggerEvent {
                                stratagem: binding.name.clone(),
                            });
                        }
                    }
                }
                Err(broadcast::error::RecvError::Lagged(_)) => continue,
                Err(broadcast::error::RecvError::Closed) => return,
            },
        }
    }
}
