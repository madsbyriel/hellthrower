import type { CSSProperties } from "react";
import type { Binding, Stratagem } from "../types";
import { CATEGORY_ACCENTS, DANGER_LABEL } from "../types";
import { ComboDisplay } from "./KeyCap";
import { IconPencil, IconTrash } from "./icons";
import { StratagemCode } from "./StratagemCode";

export function BindingCard({
  binding,
  stratagem,
  index,
  armed,
  onEdit,
  onDelete,
}: {
  binding: Binding;
  stratagem: Stratagem;
  index: number;
  armed: boolean;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const accent = CATEGORY_ACCENTS[stratagem.category];
  return (
    <div className={`binding-card ${armed ? "armed" : ""}`} style={{ "--accent": accent } as CSSProperties}>
      <span
        className={`danger-strip ${stratagem.danger}`}
        aria-hidden="true"
      />
      <div className="binding-index" aria-hidden="true">
        {String(index + 1).padStart(2, "0")}
      </div>

      <div className="binding-combo">
        <span className="binding-label">TRIGGER</span>
        <ComboDisplay combo={binding.combo} size="md" />
      </div>

      <span className="binding-flow" aria-hidden="true">
        <span className="flow-line" />
        <span className="flow-head" />
      </span>

      <div className="binding-stratagem">
        <div className="binding-stratagem-top">
          <span className="binding-name">{stratagem.name}</span>
          <span className="binding-category" style={{ color: accent }}>
            {stratagem.category.toUpperCase()}
          </span>
        </div>
        <div className="binding-stratagem-bottom">
          <StratagemCode stratagem={stratagem} size="sm" accent={accent} />
          {stratagem.danger !== "none" && (
            <span className={`danger-tag ${stratagem.danger}`}>
              {DANGER_LABEL[stratagem.danger]}
            </span>
          )}
        </div>
      </div>

      <div className="binding-actions">
        <button className="icon-btn" title="Edit binding" aria-label={`Edit binding for ${stratagem.name}`} onClick={onEdit}>
          <IconPencil size={15} />
        </button>
        <button className="icon-btn danger" title="Remove binding" aria-label={`Remove binding for ${stratagem.name}`} onClick={onDelete}>
          <IconTrash size={15} />
        </button>
      </div>
    </div>
  );
}
