import { useMemo, useState, type CSSProperties } from "react";
import { STRATAGEMS } from "../data/stratagems";
import type { Stratagem, StratagemCategory } from "../types";
import { CATEGORY_ACCENTS, DANGER_LABEL } from "../types";
import { IconSearch } from "./icons";
import { StratagemCode } from "./StratagemCode";

const CATEGORIES = Object.keys(CATEGORY_ACCENTS) as StratagemCategory[];

export function StratagemPicker({
  selectedId,
  onSelect,
}: {
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<StratagemCategory | null>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return STRATAGEMS.filter((s) => {
      if (category && s.category !== category) return false;
      if (!q) return true;
      return (
        s.name.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q)
      );
    });
  }, [query, category]);

  const preview: Stratagem | undefined =
    STRATAGEMS.find((s) => s.id === (hoverId ?? selectedId)) ??
    results[0];

  return (
    <div className="stratagem-picker">
      <div className="picker-controls">
        <div className="picker-search">
          <IconSearch size={15} />
          <input
            type="text"
            placeholder="SEARCH STRATAGEM DATABASE…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="category-chips">
          <button
            className={`chip ${category === null ? "on" : ""}`}
            onClick={() => setCategory(null)}
          >
            ALL
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c}
              className={`chip ${category === c ? "on" : ""}`}
              style={{ "--chip": CATEGORY_ACCENTS[c] } as CSSProperties}
              onClick={() => setCategory(category === c ? null : c)}
            >
              {c.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="picker-body">
        <div className="picker-grid" role="listbox" aria-label="Stratagems">
          {results.length === 0 && (
            <div className="picker-empty">NO STRATAGEMS MATCH — CHECK SPELLING, CITIZEN</div>
          )}
          {results.map((s) => {
            const accent = CATEGORY_ACCENTS[s.category];
            const selected = s.id === selectedId;
            return (
              <button
                key={s.id}
                type="button"
                role="option"
                aria-selected={selected}
                className={`strat-tile ${selected ? "selected" : ""}`}
                style={{ "--accent": accent } as CSSProperties}
                onClick={() => onSelect(s.id)}
                onMouseEnter={() => setHoverId(s.id)}
                onMouseLeave={() => setHoverId(null)}
              >
                <span className="tile-top">
                  <span className="tile-name">{s.name}</span>
                  {s.danger !== "none" && (
                    <span className={`tile-danger ${s.danger}`} aria-hidden="true" />
                  )}
                </span>
                <span className="tile-code">
                  <StratagemCode stratagem={s} size="sm" accent={accent} />
                </span>
              </button>
            );
          })}
        </div>

        <div className="picker-preview">
          {preview && (
            <>
              <span
                className="preview-accent"
                style={{ "--accent": CATEGORY_ACCENTS[preview.category] } as CSSProperties}
                aria-hidden="true"
              />
              <span className="preview-kicker">SELECTED ORDNANCE</span>
              <h4 className="preview-name">{preview.name}</h4>
              <span
                className="preview-category"
                style={{ color: CATEGORY_ACCENTS[preview.category] }}
              >
                {preview.category.toUpperCase()}
              </span>
              <div className="preview-code">
                <StratagemCode
                  stratagem={preview}
                  size="md"
                  accent={CATEGORY_ACCENTS[preview.category]}
                />
              </div>
              {preview.danger !== "none" && (
                <span className={`danger-tag ${preview.danger}`}>
                  {DANGER_LABEL[preview.danger]}
                </span>
              )}
              <p className="preview-desc">{preview.description}</p>
              <button
                type="button"
                className={`btn ${preview.id === selectedId ? "primary" : ""} sm`}
                disabled={preview.id === selectedId}
                onClick={() => onSelect(preview.id)}
              >
                {preview.id === selectedId ? "Selected" : "Select Stratagem"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
