import { useRef, useState } from "react";
import { useComboRecording } from "../hooks/useComboRecording";
import { DEFAULT_DIRECTION_KEYS } from "../lib/keys";
import type { AppSettings, ArrowDir } from "../types";
import { ArrowGlyph } from "./ArrowGlyph";
import { KeyCap } from "./KeyCap";
import { Modal } from "./Modal";

const DIRECTIONS: Array<{ dir: ArrowDir; label: string }> = [
  { dir: "up", label: "UP" },
  { dir: "left", label: "LEFT" },
  { dir: "down", label: "DOWN" },
  { dir: "right", label: "RIGHT" },
];

/**
 * Input mapping settings: which physical keys are pressed to emit each
 * direction of a stratagem code. Defaults to WASD.
 */
export function SettingsModal({
  settings,
  onSave,
  onClose,
}: {
  settings: AppSettings;
  onSave: (settings: AppSettings) => void;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState<AppSettings>(settings);
  const [target, setTarget] = useState<ArrowDir | null>(null);
  const [rowError, setRowError] = useState<string | null>(null);

  const targetRef = useRef<ArrowDir | null>(null);
  targetRef.current = target;

  const recorder = useComboRecording((combo) => {
    const dir = targetRef.current;
    setTarget(null);
    if (!dir) return;
    if (combo.length === 1) {
      setRowError(null);
      setDraft((prev) => ({
        ...prev,
        directionKeys: { ...prev.directionKeys, [dir]: combo[0] },
      }));
    } else {
      setRowError("ONE KEY AT A TIME, SOLDIER.");
    }
  });

  const resetDefaults = () => {
    setRowError(null);
    setTarget(null);
    setDraft({ directionKeys: { ...DEFAULT_DIRECTION_KEYS } });
  };

  return (
    <Modal
      title="INPUT MAPPING"
      subtitle="DIRECTION KEYS FOR STRATAGEM CODES"
      onClose={onClose}
      labelledBy="settings-modal-title"
      footer={
        <>
          <button className="btn" onClick={resetDefaults}>
            Reset Defaults
          </button>
          <button className="btn" onClick={onClose}>
            Cancel
          </button>
          <button className="btn primary" onClick={() => onSave(draft)}>
            Save Mapping
          </button>
        </>
      }
    >
      <div className="settings-grid">
        {DIRECTIONS.map(({ dir, label }) => {
          const isRecording = recorder.recording && target === dir;
          return (
            <div className="settings-row" key={dir}>
              <span className="settings-dir">
                <ArrowGlyph dir={dir} size={14} />
                <span>{label}</span>
              </span>
              <KeyCap token={draft.directionKeys[dir]} size="lg" />
              {isRecording ? (
                <button className="btn sm warning" onClick={recorder.cancel}>
                  <span className="rec-dot" aria-hidden="true" />
                  {recorder.draft.length > 0
                    ? `CAPTURING: ${recorder.draft.join(" + ")}`
                    : "PRESS A KEY…"}
                </button>
              ) : (
                <button
                  className="btn sm"
                  onClick={() => {
                    setRowError(null);
                    setTarget(dir);
                    void recorder.start();
                  }}
                >
                  Record
                </button>
              )}
            </div>
          );
        })}
      </div>

      {recorder.error && (
        <p className="settings-error">{recorder.error}</p>
      )}
      {rowError && <p className="settings-error">{rowError}</p>}

      <p className="settings-hint">
        DEFAULTS: W = UP, A = LEFT, S = DOWN, D = RIGHT. WHEN A BINDING FIRES,
        LEFT CTRL IS HELD WHILE THE CODE IS TYPED AND RELEASED AFTERWARDS —
        WITH A SMALL DELAY BETWEEN EVERY KEY PRESS. CHORDS ARE IGNORED WHILE
        THIS WINDOW IS FOCUSED (AND MOUSE-BUTTON CHORDS WHILE THE POINTER IS
        OVER IT) — CLICK INTO THE GAME TO FIRE.
      </p>
    </Modal>
  );
}
