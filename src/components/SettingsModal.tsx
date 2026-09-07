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
 * Settings: which physical keys are pressed to emit each direction of a
 * stratagem code (defaults to WASD), plus the Stratbase server location the
 * app fetches the stratagem database from.
 */
export function SettingsModal({
  settings,
  defaultServerUrl,
  onSave,
  onClose,
}: {
  settings: AppSettings;
  /** The app-default Stratbase location (used when `serverUrl` is empty). */
  defaultServerUrl?: string;
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
    // Only the direction keys reset — the server location is untouched.
    setDraft((prev) => ({
      directionKeys: { ...DEFAULT_DIRECTION_KEYS },
      serverUrl: prev.serverUrl,
    }));
  };

  const appDefaultUrl = defaultServerUrl || "http://localhost:8000";

  return (
    <Modal
      title="SETTINGS"
      subtitle="INPUT MAPPING · STRATBASE UPLINK"
      onClose={onClose}
      labelledBy="settings-modal-title"
      footer={
        <>
          <button className="btn" onClick={resetDefaults}>
            Reset Direction Keys
          </button>
          <button className="btn" onClick={onClose}>
            Cancel
          </button>
          <button className="btn primary" onClick={() => onSave(draft)}>
            Save Settings
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

      <div className="settings-server">
        <span className="settings-server-label">SERVER LOCATION</span>
        <div className="settings-server-row">
          <input
            className="server-url-input"
            type="text"
            value={draft.serverUrl}
            onChange={(e) =>
              setDraft((prev) => ({ ...prev, serverUrl: e.target.value }))
            }
            placeholder={appDefaultUrl}
            spellCheck={false}
            autoCorrect="off"
            autoCapitalize="none"
            aria-label="Stratbase server location"
          />
          <button
            className="btn"
            disabled={draft.serverUrl.trim() === ""}
            onClick={() =>
              setDraft((prev) => ({ ...prev, serverUrl: "" }))
            }
            title={`Use the app default (${appDefaultUrl})`}
          >
            Use Default
          </button>
        </div>
        <p className="settings-hint">
          THE APP FETCHES THE STRATAGEM DATABASE FROM THE STRATBASE SERVER AT
          THIS ADDRESS. LEAVE IT EMPTY TO USE THE APP DEFAULT ({appDefaultUrl}).
          SAVING A NEW ADDRESS IMMEDIATELY REESTABLISHES THE UPLINK.
        </p>
      </div>

      <p className="settings-hint">
        DEFAULTS: W = UP, A = LEFT, S = DOWN, D = RIGHT. WHEN A BINDING FIRES,
        LEFT CTRL IS HELD WHILE THE CODE IS TYPED AND RELEASED AFTERWARDS —
        WITH A SMALL DELAY BETWEEN EVERY KEY PRESS. MOUSE-BUTTON CHORDS ARE
        IGNORED WHILE THE POINTER IS OVER THIS WINDOW.
      </p>
    </Modal>
  );
}
