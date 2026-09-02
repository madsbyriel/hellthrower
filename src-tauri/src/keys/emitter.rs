//! Emits stratagem codes through the keyrs virtual device.
//!
//! A code is typed the way the in-game stratagem menu expects it:
//! LeftCtrl is held down for the entire sequence and released once the
//! code is finished. A small fixed delay sits between every key state
//! change (each down and each up event).
//!
//! If deactivation cancels an emission mid-sequence, the menu key is
//! still released — Ctrl is never left stuck down.

use std::sync::Arc;
use std::time::Duration;

use keyrs::{DefaultKeyboard, InputEventSender, Key, KeyState};
use tokio::sync::mpsc;
use tokio_util::sync::CancellationToken;

/// Small delay between every key state change (each down and up event).
const STEP_DELAY: Duration = Duration::from_millis(30);

/// The key held down while a code is typed in-game.
const MENU_KEY: Key = Key::LeftCtrl;

/// Consume code sequences from `rx` and inject them. Stops as soon as
/// `cancel` fires (deactivation) — nothing is emitted after the loadout is
/// disarmed.
///
/// The keyboard is stored as an `Option` in the app runtime; it is only
/// ever set once and never taken, so unwrapping here is safe.
pub async fn run(
    keyboard: Arc<tokio::sync::Mutex<Option<DefaultKeyboard>>>,
    mut rx: mpsc::Receiver<Vec<Key>>,
    cancel: CancellationToken,
) {
    while let Some(code) = rx.recv().await {
        let menu_key_stuck = emit_code(&keyboard, &code, &cancel).await;
        // Never leave the menu key pressed, even when cancellation cut
        // the sequence short.
        if menu_key_stuck {
            send(&keyboard, MENU_KEY, KeyState::Up).await;
        }
    }
}

/// Emit one code: menu key down → code keys (down/up, with a delay after
/// every event) → menu key up.
///
/// Returns true when the menu key may still be physically down
/// (cancelled mid-sequence or a send failed), so the caller can release it.
async fn emit_code(
    keyboard: &Arc<tokio::sync::Mutex<Option<DefaultKeyboard>>>,
    code: &[Key],
    cancel: &CancellationToken,
) -> bool {
    if !send(keyboard, MENU_KEY, KeyState::Down).await {
        return false; // nothing was pressed — nothing to release
    }
    if wait_or_cancel(cancel, STEP_DELAY).await {
        return true; // cancelled while the menu key is held
    }

    for key in code {
        if !send(keyboard, *key, KeyState::Down).await {
            return true;
        }
        if wait_or_cancel(cancel, STEP_DELAY).await {
            return true;
        }
        if !send(keyboard, *key, KeyState::Up).await {
            return true;
        }
        if wait_or_cancel(cancel, STEP_DELAY).await {
            return true;
        }
    }

    // Code finished — release the menu key.
    send(keyboard, MENU_KEY, KeyState::Up).await;
    false
}

/// Inject one key state. Returns true on success.
async fn send(
    keyboard: &Arc<tokio::sync::Mutex<Option<DefaultKeyboard>>>,
    key: Key,
    state: KeyState,
) -> bool {
    let mut guard = keyboard.lock().await;
    let kb = guard.as_mut().expect("keyboard backend exists");
    kb.send_event(key, state).await.is_ok()
}

/// Sleep for `duration`, aborting early when cancelled. Returns true when
/// cancelled.
async fn wait_or_cancel(cancel: &CancellationToken, duration: Duration) -> bool {
    tokio::select! {
        _ = cancel.cancelled() => true,
        _ = tokio::time::sleep(duration) => false,
    }
}
