import { useEffect, useState } from "react";
import type { ComboToken } from "../types";
import { comboToString } from "../types";
import { ComboDisplay, KeyCap } from "./KeyCap";
import { IconAlert, IconX } from "./icons";

const MODS: Array<ComboToken> = [
  { kind: "mod", label: "Ctrl" },
  { kind: "mod", label: "Alt" },
  { kind: "mod", label: "Shift" },
];

const MOD_KEYS: Record<string, ComboToken> = {
  Control: MODS[0],
  Alt: MODS[1],
  Shift: MODS[2],
};

const ARROWS: Record<string, string> = {
  ArrowUp: "↑",
  ArrowDown: "↓",
  ArrowLeft: "←",
  ArrowRight: "→",
};

function normalizeKey(key: string): string | null {
  if (key in ARROWS) return ARROWS[key];
  if (/^[a-z]$/i.test(key)) return key.toUpperCase();
  if (/^[0-9]$/.test(key)) return key;
  if (/^F([1-9]|1[0-2])$/.test(key)) return key;
  if (key === " ") return "Space";
  return null;
}

export function KeyRecorder({
  value,
  onChange,
  conflicts,
}: {
  value: ComboToken[];
  onChange: (combo: ComboToken[]) => void;
  conflicts: ComboToken[][];
}) {
  const [recording, setRecording] = useState(false);
  const [draft, setDraft] = useState<ComboToken[]>(value);

  // Reset the live draft whenever a recording session starts.
  useEffect(() => {
    if (recording) setDraft([]);
  }, [recording]);

  useEffect(() => {
    if (!recording) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        setRecording(false);
        return;
      }
      if (e.key === "Backspace" || e.key === "Delete") {
        e.preventDefault();
        e.stopPropagation();
        onChange([]);
        return;
      }
      const mod = MOD_KEYS[e.key];
      if (mod) {
        e.preventDefault();
        e.stopPropagation();
        setDraft((prev) =>
          prev.some((t) => t.kind === "mod" && t.label === mod.label)
            ? prev
            : [...prev, mod],
        );
        return;
      }
      const label = normalizeKey(e.key);
      if (label) {
        e.preventDefault();
        e.stopPropagation();
        onChange([...draft, { kind: "key", label }]);
        setRecording(false);
      }
    };
    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, [recording, draft, onChange]);

  const matchedConflict =
    value.length > 0
      ? conflicts.find((c) => comboToString(c) === comboToString(value))
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
                <span key={i}>
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
          <button className="btn warning" onClick={() => setRecording(false)}>
            <span className="rec-dot" aria-hidden="true" />
            Recording… press modifier + key (Esc cancels)
          </button>
        ) : (
          <button className="btn" onClick={() => setRecording(true)}>
            <span className="rec-dot idle" aria-hidden="true" />
            Record Combo
          </button>
        )}
        {matchedConflict ? (
          <span className="conflict-warning">
            <IconAlert size={13} />
            COMBO ALREADY BOUND: {comboToString(matchedConflict)}
          </span>
        ) : (
          <span className="recorder-hint">
            Modifiers: Ctrl / Alt / Shift — Trigger: any key or arrow
          </span>
        )}
      </div>
    </div>
  );
}
