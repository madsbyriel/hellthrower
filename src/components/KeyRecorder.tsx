import { useComboRecording } from "../hooks/useComboRecording";
import { combosEqual } from "../lib/keys";
import { comboToString } from "../types";
import { ComboDisplay, KeyCap } from "./KeyCap";
import { IconAlert, IconX } from "./icons";

/**
 * Combo recorder backed by keyrs: captures ANY key combination globally
 * (not just modifiers + a key). Press the chord and release every key to
 * commit it.
 */
export function KeyRecorder({
  value,
  onChange,
  conflicts,
  overrides,
}: {
  value: string[];
  onChange: (combo: string[]) => void;
  conflicts: string[][];
  /** Kit combos this binding is allowed to shadow — shown as an info note. */
  overrides?: string[][];
}) {
  const { recording, draft, error, start, cancel } = useComboRecording(
    (combo) => onChange(combo),
  );

  const matchedConflict =
    value.length > 0
      ? conflicts.find((combo) => combosEqual(combo, value))
      : undefined;
  const matchedOverride =
    !matchedConflict && value.length > 0 && overrides
      ? overrides.find((combo) => combosEqual(combo, value))
      : undefined;

  return (
    <div className={`key-recorder ${recording ? "recording" : ""}`}>
      <div className="recorder-top">
        <span className="recorder-label">ACTIVATION COMBO</span>
        <button
          className="btn sm danger-ghost"
          onClick={() => onChange([])}
          disabled={value.length === 0}
        >
          <IconX size={13} />
          Clear
        </button>
      </div>

      <div className="recorder-display">
        {recording ? (
          <span className="recorder-recording">
            {draft.length === 0 ? (
              <span className="recorder-prompt">PRESS KEYS…</span>
            ) : (
              draft.map((token, i) => (
                <span key={`${token}-${i}`}>
                  <KeyCap token={token} size="lg" />
                </span>
              ))
            )}
            <span className="recorder-caret" aria-hidden="true" />
          </span>
        ) : (
          <ComboDisplay combo={value} size="lg" empty="NO COMBO BOUND" />
        )}
      </div>

      <div className="recorder-bottom">
        {recording ? (
          <button className="btn warning" onClick={cancel}>
            <span className="rec-dot" aria-hidden="true" />
            Recording… release all keys to capture
          </button>
        ) : (
          <button className="btn" onClick={() => void start()}>
            <span className="rec-dot idle" aria-hidden="true" />
            Record Combo
          </button>
        )}
        {error ? (
          <span className="conflict-warning">
            <IconAlert size={13} />
            {error}
          </span>
        ) : matchedConflict ? (
          <span className="conflict-warning">
            <IconAlert size={13} />
            COMBO ALREADY BOUND: {comboToString(matchedConflict)}
          </span>
        ) : matchedOverride ? (
          <span className="override-note">
            OVERRIDES STANDARD KIT: {comboToString(matchedOverride)}
          </span>
        ) : (
          <span className="recorder-hint">
            Any key combination — hold the chord, release to capture
          </span>
        )}
      </div>
    </div>
  );
}
