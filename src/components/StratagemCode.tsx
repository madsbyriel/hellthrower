import type { CSSProperties } from "react";
import type { Stratagem } from "../types";
import { ArrowGlyph } from "./ArrowGlyph";

export function StratagemCode({
  stratagem,
  size = "md",
  accent,
}: {
  stratagem: Stratagem;
  size?: "sm" | "md";
  accent?: string;
}) {
  return (
    <span
      className={`stratagem-code ${size}`}
      aria-label={`Stratagem code for ${stratagem.name}`}
      style={accent ? ({ "--code-accent": accent } as CSSProperties) : undefined}
    >
      {stratagem.code.map((dir, i) => (
        <span className="code-cell" key={i}>
          <ArrowGlyph dir={dir} size={size === "sm" ? 10 : 13} />
        </span>
      ))}
    </span>
  );
}
