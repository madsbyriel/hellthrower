import type { Binding, Stratagem } from "../types";
import { ComboDisplay } from "./KeyCap";
import { IconPencil, IconTrash } from "./icons";
import { StratagemCode } from "./StratagemCode";

export interface CardTag {
  text: string;
  tone: "global" | "muted";
}

export function BindingCard({
  binding,
  stratagem,
  index,
  armed = false,
  tag,
  dimmed = false,
  onEdit,
  onDelete,
}: {
  binding: Binding;
  stratagem: Stratagem;
  index: number;
  armed?: boolean;
  tag?: CardTag;
  dimmed?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}) {
  return (
    <div
      className={`binding-card ${armed ? "armed" : ""} ${dimmed ? "dimmed" : ""}`}
    >
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
        {tag && <span className={`card-tag ${tag.tone}`}>{tag.text}</span>}
        <span className="binding-name" title={stratagem.name}>
          {stratagem.name}
        </span>
        <StratagemCode code={stratagem.code} size="sm" label={stratagem.name} />
      </div>

      {(onEdit || onDelete) && (
        <div className="binding-actions">
          {onEdit && (
            <button
              className="icon-btn"
              title="Edit binding"
              aria-label={`Edit binding for ${stratagem.name}`}
              onClick={onEdit}
            >
              <IconPencil size={15} />
            </button>
          )}
          {onDelete && (
            <button
              className="icon-btn danger"
              title="Remove binding"
              aria-label={`Remove binding for ${stratagem.name}`}
              onClick={onDelete}
            >
              <IconTrash size={15} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
