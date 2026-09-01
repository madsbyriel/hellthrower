import type { Binding, Loadout, Stratagem } from "../types";
import { BindingCard } from "./BindingCard";
import { Emblem } from "./Emblem";
import { IconPencil, IconPlus, IconPower, IconTrash } from "./icons";

export function LoadoutPanel({
  loadout,
  stratagemFor,
  armed,
  onActivate,
  onDisarm,
  onEdit,
  onDelete,
  onAddBinding,
  onEditBinding,
  onDeleteBinding,
}: {
  loadout: Loadout;
  stratagemFor: (binding: Binding) => Stratagem | undefined;
  armed: boolean;
  onActivate: () => void;
  onDisarm: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onAddBinding: () => void;
  onEditBinding: (bindingId: string) => void;
  onDeleteBinding: (bindingId: string) => void;
}) {
  const bindings = loadout.bindings;
  return (
    <main className="loadout-panel">
      <div className="panel-head">
        <div className="panel-head-left">
          <span className="panel-kicker">ACTIVE LOADOUT FILE</span>
          <h2 className="panel-name" title={loadout.name}>
            {loadout.name}
          </h2>
          {loadout.description && (
            <p className="panel-desc">{loadout.description}</p>
          )}
        </div>
        <div className="panel-head-right">
          <span className="meta-chip">
            {bindings.length} BINDING{bindings.length === 1 ? "" : "S"}
          </span>
          <span className="meta-chip">
            UPDATED{" "}
            {new Date(loadout.updatedAt).toLocaleDateString(undefined, {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </span>
          {armed ? (
            <button className="btn danger" onClick={onDisarm}>
              <IconPower size={15} />
              Disarm Loadout
            </button>
          ) : (
            <button className="btn primary" onClick={onActivate}>
              <IconPower size={15} />
              Activate Loadout
            </button>
          )}
          <button className="btn" onClick={onEdit}>
            <IconPencil size={15} />
            Edit
          </button>
          <button className="btn danger-ghost" onClick={onDelete}>
            <IconTrash size={15} />
            Delete
          </button>
        </div>
      </div>

      {armed && (
        <div className="armed-banner">
          <span className="armed-dot" aria-hidden="true" />
          <span>AUTOTHROW ARMED — LISTENING FOR INPUT COMBINATIONS</span>
          <span className="armed-dot" aria-hidden="true" />
        </div>
      )}

      <div className="bindings-head">
        <h3 className="section-title">STRATAGEM BINDINGS</h3>
        <span className="section-hint">
          PRESS THE TRIGGER COMBO IN-GAME TO THROW
        </span>
        <span className="head-spacer" />
        <button className="btn primary sm" onClick={onAddBinding}>
          <IconPlus size={14} />
          Add Binding
        </button>
      </div>

      {bindings.length === 0 ? (
        <div className="bindings-empty">
          <span className="empty-emblem">
            <Emblem size={72} />
          </span>
          <p>NO BINDINGS REGISTERED</p>
          <span>Add a binding to map a key combination to a stratagem.</span>
          <button className="btn primary" onClick={onAddBinding}>
            <IconPlus size={14} />
            Add Binding
          </button>
        </div>
      ) : (
        <div className="bindings-grid">
          {bindings.map((binding, i) => {
            const stratagem = stratagemFor(binding);
            if (!stratagem) return null;
            return (
              <BindingCard
                key={binding.id}
                binding={binding}
                stratagem={stratagem}
                index={i}
                armed={armed}
                onEdit={() => onEditBinding(binding.id)}
                onDelete={() => onDeleteBinding(binding.id)}
              />
            );
          })}
        </div>
      )}
    </main>
  );
}

export function EmptyPanel({ onCreate }: { onCreate: () => void }) {
  return (
    <main className="loadout-panel empty">
      <span className="empty-emblem big">
        <Emblem size={140} />
      </span>
      <h2 className="empty-title">NO LOADOUT SELECTED</h2>
      <p className="empty-sub">
        Select a loadout from the manifest, or create a new one to begin
        configuring stratagem bindings.
      </p>
      <button className="btn primary" onClick={onCreate}>
        <IconPlus size={15} />
        Create Loadout
      </button>
    </main>
  );
}
