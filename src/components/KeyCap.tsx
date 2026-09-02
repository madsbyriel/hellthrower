import type { ArrowDir } from "../types";
import { ArrowGlyph } from "./ArrowGlyph";

const ARROW_KEYS: Record<string, ArrowDir> = {
  Up: "up",
  Down: "down",
  Left: "left",
  Right: "right",
};

const MOD_LABELS = new Set(["Ctrl", "Shift", "Alt", "Meta"]);

/** Human-readable label for a keyrs key name. */
export function keyLabel(name: string): string {
  switch (name) {
    case "LeftCtrl":
    case "RightCtrl":
      return "Ctrl";
    case "LeftShift":
    case "RightShift":
      return "Shift";
    case "LeftAlt":
    case "RightAlt":
      return "Alt";
    case "LeftMeta":
    case "RightMeta":
      return "Meta";
    case "MouseLeft":
      return "LMB";
    case "MouseRight":
      return "RMB";
    case "MouseMiddle":
      return "MMB";
  }
  const digit = /^Digit([0-9])$/.exec(name);
  if (digit) return digit[1];
  return name;
}

export function KeyCap({
  token,
  size = "md",
}: {
  token: string;
  size?: "sm" | "md" | "lg";
}) {
  const label = keyLabel(token);
  const isArrow = token in ARROW_KEYS;
  const isMod = MOD_LABELS.has(label);
  return (
    <span
      className={`keycap ${isMod ? "mod" : ""} ${isArrow ? "arrow" : ""} ${size}`}
      title={token}
    >
      {isArrow ? <ArrowGlyph dir={ARROW_KEYS[token]} size={13} /> : label}
    </span>
  );
}

export function ComboDisplay({
  combo,
  size = "md",
  empty = "NO COMBO",
}: {
  combo: string[];
  size?: "sm" | "md" | "lg";
  empty?: string;
}) {
  if (combo.length === 0) {
    return <span className="combo-empty">{empty}</span>;
  }
  return (
    <span className="combo-display">
      {combo.map((token, i) => (
        <span className="combo-token" key={`${token}-${i}`}>
          {i > 0 && <span className="combo-plus">+</span>}
          <KeyCap token={token} size={size} />
        </span>
      ))}
    </span>
  );
}
