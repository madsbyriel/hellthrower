import { useMemo, useState } from "react";
import { STRATAGEMS } from "../data/stratagems";
import { IconSearch } from "./icons";
import { StratagemCode } from "./StratagemCode";

export function StratagemPicker({
  selectedId,
  onSelect,
}: {
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return STRATAGEMS;
    return STRATAGEMS.filter((s) => s.name.toLowerCase().includes(q));
  }, [query]);

  return (
    <div className="stratagem-picker">
      <div className="picker-search">
        <IconSearch size={15} />
        <input
          type="text"
          placeholder="SEARCH STRATAGEM…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="picker-grid" role="listbox" aria-label="Stratagems">
        {results.length === 0 && (
          <div className="picker-empty">
            NO STRATAGEMS MATCH — CHECK SPELLING, CITIZEN
          </div>
        )}
        {results.map((s) => {
          const selected = s.id === selectedId;
          return (
            <button
              key={s.id}
              type="button"
              role="option"
              aria-selected={selected}
              className={`strat-tile ${selected ? "selected" : ""}`}
              onClick={() => onSelect(s.id)}
            >
              <span className="tile-name">{s.name}</span>
              <StratagemCode code={s.code} size="sm" label={s.name} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
