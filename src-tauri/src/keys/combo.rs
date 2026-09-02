//! Pure, device-independent logic: key-name parsing, chord matching, and
//! the recording/activation state machines. Everything here is unit-testable
//! without any hardware.

use std::collections::HashSet;

use keyrs::{InputKeyEvent, Key, KeyState};

/// Parse a key name as produced by [`Key::to_string`] back into a [`Key`].
pub fn parse_key(name: &str) -> Option<Key> {
    let trimmed = name.trim();
    Key::get_all_keys()
        .into_iter()
        .find(|key| key.to_string().eq_ignore_ascii_case(trimmed))
        .or_else(|| {
            // "Other(0x70)" — raw platform code fallback.
            let hex = trimmed.strip_prefix("Other(")?.strip_suffix(')')?;
            let hex = hex.strip_prefix("0x")?;
            u16::from_str_radix(hex, 16).ok().map(Key::Other)
        })
}

/// A chord matches exactly when the pressed set contains the combo and
/// nothing else (any press order).
pub fn is_exact_chord(pressed: &HashSet<Key>, combo: &[Key]) -> bool {
    pressed.len() == combo.len() && combo.iter().all(|key| pressed.contains(key))
}

/// Activation-engine state machine: tracks the pressed set and decides when
/// a binding's chord is completed. A binding can only fire once per press
/// session — every key must be released before it can fire again.
#[derive(Debug, Default)]
pub struct ChordTracker {
    pressed: HashSet<Key>,
    session_triggered: bool,
}

impl ChordTracker {
    pub fn new() -> Self {
        Self::default()
    }

    /// Feed one key event. Returns the index of the triggered binding, if any.
    ///
    /// `allowed` lets callers suppress triggering (e.g. while a combo
    /// recording session is running).
    pub fn on_event(&mut self, event: &InputKeyEvent, combos: &[Vec<Key>], allowed: bool) -> Option<usize> {
        match event.state {
            KeyState::Down => {
                if !allowed {
                    return None;
                }
                if self.pressed.is_empty() {
                    self.session_triggered = false;
                }
                self.pressed.insert(event.key);
                if self.session_triggered {
                    return None;
                }
                let hit = combos
                    .iter()
                    .position(|combo| is_exact_chord(&self.pressed, combo));
                if hit.is_some() {
                    self.session_triggered = true;
                }
                hit
            }
            KeyState::Up => {
                self.pressed.remove(&event.key);
                None
            }
            KeyState::Hold => None,
            _ => None,
        }
    }
}

/// What a recording session should do after consuming one event.
#[derive(Debug, Clone, PartialEq, Eq)]
pub enum RecorderAction {
    /// Nothing to report.
    None,
    /// Keys currently held, in first-press order (live display update).
    Update(Vec<Key>),
    /// The chord finished: every key was pressed and released. Carries the
    /// captured combo in first-press order.
    Complete(Vec<Key>),
}

/// Combo-recording state machine: captures the set of keys pressed together
/// as one chord. Completes when at least one key was pressed and all keys
/// have been released again.
#[derive(Debug, Default)]
pub struct ComboRecorder {
    /// Keys currently held, in first-press order.
    pressed: Vec<Key>,
    /// Snapshot of the last non-empty chord (what gets captured).
    captured: Vec<Key>,
    saw_any_down: bool,
    done: bool,
}

impl ComboRecorder {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn on_event(&mut self, event: &InputKeyEvent) -> RecorderAction {
        if self.done {
            return RecorderAction::None;
        }

        match event.state {
            KeyState::Down => {
                if !self.pressed.contains(&event.key) {
                    self.pressed.push(event.key);
                }
                self.saw_any_down = true;
                self.captured = self.pressed.clone();
                RecorderAction::Update(self.pressed.clone())
            }
            KeyState::Hold => RecorderAction::None,
            KeyState::Up => {
                self.pressed.retain(|key| *key != event.key);
                if self.pressed.is_empty() && self.saw_any_down {
                    self.done = true;
                    RecorderAction::Complete(self.captured.clone())
                } else {
                    RecorderAction::Update(self.pressed.clone())
                }
            }
            _ => RecorderAction::None,
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::time::SystemTime;
    use keyrs::DeviceId;

    fn device() -> DeviceId {
        DeviceId {
            name: "test".into(),
            location: "test".into(),
        }
    }

    fn event(key: Key, state: KeyState) -> InputKeyEvent {
        InputKeyEvent {
            key,
            state,
            device: device(),
            timestamp: SystemTime::UNIX_EPOCH,
        }
    }

    #[test]
    fn parse_key_roundtrips() {
        assert_eq!(parse_key("W"), Some(Key::W));
        assert_eq!(parse_key("leftctrl"), Some(Key::LeftCtrl));
        assert_eq!(parse_key("F13"), Some(Key::F13));
        assert_eq!(parse_key("Other(0x70)"), Some(Key::Other(0x70)));
        assert_eq!(parse_key("Nope"), None);
    }

    #[test]
    fn exact_chord_matching() {
        let pressed: HashSet<Key> = [Key::LeftCtrl, Key::Digit1].into_iter().collect();
        assert!(is_exact_chord(&pressed, &[Key::LeftCtrl, Key::Digit1]));
        assert!(is_exact_chord(&pressed, &[Key::Digit1, Key::LeftCtrl]));
        assert!(!is_exact_chord(&pressed, &[Key::LeftCtrl]));
        assert!(!is_exact_chord(&pressed, &[Key::Digit1, Key::Digit2]));
    }

    #[test]
    fn tracker_triggers_when_chord_completes() {
        let mut tracker = ChordTracker::new();
        let combos = vec![vec![Key::LeftCtrl, Key::F1]];

        assert_eq!(tracker.on_event(&event(Key::LeftCtrl, KeyState::Down), &combos, true), None);
        assert_eq!(tracker.on_event(&event(Key::F1, KeyState::Down), &combos, true), Some(0));
    }

    #[test]
    fn tracker_requires_full_release_before_retrigger() {
        let mut tracker = ChordTracker::new();
        let combos = vec![vec![Key::F1]];

        assert_eq!(tracker.on_event(&event(Key::F1, KeyState::Down), &combos, true), Some(0));
        assert_eq!(tracker.on_event(&event(Key::F1, KeyState::Hold), &combos, true), None);
        assert_eq!(tracker.on_event(&event(Key::F1, KeyState::Up), &combos, true), None);
        assert_eq!(tracker.on_event(&event(Key::F1, KeyState::Down), &combos, true), Some(0));
    }

    #[test]
    fn tracker_suppresses_when_not_allowed() {
        let mut tracker = ChordTracker::new();
        let combos = vec![vec![Key::F1]];
        assert_eq!(tracker.on_event(&event(Key::F1, KeyState::Down), &combos, false), None);
        assert_eq!(tracker.on_event(&event(Key::F1, KeyState::Up), &combos, true), None);
        assert_eq!(tracker.on_event(&event(Key::F1, KeyState::Down), &combos, true), Some(0));
    }

    #[test]
    fn recorder_captures_chord_in_press_order() {
        let mut recorder = ComboRecorder::new();
        assert_eq!(
            recorder.on_event(&event(Key::LeftCtrl, KeyState::Down)),
            RecorderAction::Update(vec![Key::LeftCtrl])
        );
        assert_eq!(
            recorder.on_event(&event(Key::F1, KeyState::Down)),
            RecorderAction::Update(vec![Key::LeftCtrl, Key::F1])
        );
        // Releasing one key is not completion.
        assert_eq!(
            recorder.on_event(&event(Key::LeftCtrl, KeyState::Up)),
            RecorderAction::Update(vec![Key::F1])
        );
        // Releasing the last key completes the chord.
        assert_eq!(
            recorder.on_event(&event(Key::F1, KeyState::Up)),
            RecorderAction::Complete(vec![Key::LeftCtrl, Key::F1])
        );
        // Nothing after completion.
        assert_eq!(recorder.on_event(&event(Key::G, KeyState::Down)), RecorderAction::None);
    }

    #[test]
    fn recorder_ignores_repeat_holds() {
        let mut recorder = ComboRecorder::new();
        recorder.on_event(&event(Key::W, KeyState::Down));
        assert_eq!(
            recorder.on_event(&event(Key::W, KeyState::Hold)),
            RecorderAction::None
        );
        assert_eq!(
            recorder.on_event(&event(Key::W, KeyState::Up)),
            RecorderAction::Complete(vec![Key::W])
        );
    }
}
