import type { ArrowDir } from "../types";
import { ArrowGlyph } from "./ArrowGlyph";

export function StratagemCode({
  code,
  size = "md",
  label,
}: {
  code: ArrowDir[];
  size?: "sm" | "md";
  label?: string;
}) {
  return (
    <span
      className={`stratagem-code ${size}`}
      aria-label={label ? `Stratagem code for ${label}` : "Stratagem code"}
    >
      {code.map((dir, i) => (
        <span className="code-cell" key={i}>
          <ArrowGlyph dir={dir} size={size === "sm" ? 10 : 13} />
        </span>
      ))}
    </span>
  );
}
