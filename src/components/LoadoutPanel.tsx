import type { Binding, Loadout, Stratagem } from "../types";
import { combosEqual } from "../lib/keys";
import { BindingCard } from "./BindingCard";
import { Emblem } from "./Emblem";
import { IconGear, IconPencil, IconPlus, IconPower, IconTrash } from "./icons";

export function LoadoutPanel({
  loadout,
  kit,
  stratagemFor,
  armed,
  onActivate,
  onDisarm,
  onEdit,
  onDelete,
  onAddBinding,
  onEditBinding,
  onDeleteBinding,
  onManageKit,
}: {
  loadout: Loadout;
  kit: Binding[];
  stratagemFor: (binding: Binding) => Stratagem | undefined;
  armed: boolean;
  onActivate: () => void;
  onDisarm: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onAddBinding: () => void;
  onEditBinding: (bindingId: string) => void;
  onDeleteBinding: (bindingId: string) => void;
  onManageKit: () => void;
}) {
  const bindings = loadout.bindings;
  const shadowedByLoadout = (kitBinding: Binding) =>
    bindings.some((b) => combosEqual(b.combo, kitBinding.combo));
  const overridesKit = (binding: Binding) =>
    kit.some((kitBinding) => combosEqual(kitBinding.combo, binding.combo));
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
        <h3 className="section-title">STANDARD KIT</h3>
        <span className="section-hint">ACTIVE IN EVERY LOADOUT</span>
        <span className="head-spacer" />
        <button className="btn sm" onClick={onManageKit}>
          <IconGear size={13} />
          Manage Kit
        </button>
      </div>

      {kit.length === 0 ? (
        <div className="kit-empty">
          STANDARD KIT IS EMPTY —{" "}
          <button className="link" onClick={onManageKit}>
            ADD KIT BINDINGS
          </button>
        </div>
      ) : (
        <div className="bindings-list">
          {kit.map((kitBinding, i) => {
            const stratagem = stratagemFor(kitBinding);
            if (!stratagem) return null;
            const shadowed = shadowedByLoadout(kitBinding);
            return (
              <BindingCard
                key={kitBinding.id}
                binding={kitBinding}
                stratagem={stratagem}
                index={i}
                armed={armed}
                dimmed={shadowed}
                tag={
                  shadowed
                    ? { text: "OVERRIDDEN IN LOADOUT", tone: "muted" }
                    : { text: "GLOBAL", tone: "global" }
                }
              />
            );
          })}
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
        <div className="bindings-list">
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
                tag={
                  overridesKit(binding)
                    ? { text: "OVERRIDES KIT", tone: "global" }
                    : undefined
                }
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

export function EmptyPanel({
  onCreate,
  onManageKit,
}: {
  onCreate: () => void;
  onManageKit: () => void;
}) {
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
      <div className="empty-actions">
        <button className="btn primary" onClick={onCreate}>
          <IconPlus size={15} />
          Create Loadout
        </button>
        <button className="btn" onClick={onManageKit}>
          <IconGear size={15} />
          Manage Standard Kit
        </button>
      </div>
    </main>
  );
}
