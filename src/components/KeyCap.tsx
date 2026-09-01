import type { ArrowDir, ComboToken } from "../types";
import { ArrowGlyph } from "./ArrowGlyph";

const ARROW_KEYS: Record<string, ArrowDir> = {
  "↑": "up",
  "↓": "down",
  "←": "left",
  "→": "right",
};

export function KeyCap({
  token,
  size = "md",
}: {
  token: ComboToken;
  size?: "sm" | "md" | "lg";
}) {
  const isMod = token.kind === "mod";
  const isArrow = !isMod && token.label in ARROW_KEYS;
  return (
    <span
      className={`keycap ${isMod ? "mod" : ""} ${isArrow ? "arrow" : ""} ${size}`}
    >
      {isArrow ? <ArrowGlyph dir={ARROW_KEYS[token.label]} size={13} /> : token.label}
    </span>
  );
}

export function ComboDisplay({
  combo,
  size = "md",
  empty = "NO COMBO",
}: {
  combo: ComboToken[];
  size?: "sm" | "md" | "lg";
  empty?: string;
}) {
  if (combo.length === 0) {
    return <span className="combo-empty">{empty}</span>;
  }
  return (
    <span className="combo-display">
      {combo.map((token, i) => (
        <span className="combo-token" key={i}>
          {i > 0 && <span className="combo-plus">+</span>}
          <KeyCap token={token} size={size} />
        </span>
      ))}
    </span>
  );
}
