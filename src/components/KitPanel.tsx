import type { Binding, Stratagem } from "../types";
import { BindingCard } from "./BindingCard";
import { Emblem } from "./Emblem";
import { IconPlus } from "./icons";

/**
 * The Standard Kit panel: bindings that fire in every loadout. Kit
 * bindings are edited here; loadouts can shadow them with same-combo
 * bindings of their own.
 */
export function KitPanel({
  kit,
  stratagemFor,
  onAddBinding,
  onEditBinding,
  onDeleteBinding,
}: {
  kit: Binding[];
  stratagemFor: (binding: Binding) => Stratagem | undefined;
  onAddBinding: () => void;
  onEditBinding: (bindingId: string) => void;
  onDeleteBinding: (bindingId: string) => void;
}) {
  return (
    <main className="loadout-panel">
      <div className="panel-head">
        <div className="panel-head-left">
          <span className="panel-kicker">GLOBAL BINDING MANIFEST</span>
          <h2 className="panel-name">STANDARD KIT</h2>
          <p className="panel-desc">
            Bindings active in every loadout. A loadout binding using the
            same combo overrides the kit entry.
          </p>
        </div>
        <div className="panel-head-right">
          <span className="meta-chip">
            {kit.length} BINDING{kit.length === 1 ? "" : "S"}
          </span>
          <button className="btn primary" onClick={onAddBinding}>
            <IconPlus size={15} />
            Add Binding
          </button>
        </div>
      </div>

      <div className="bindings-head">
        <h3 className="section-title">KIT BINDINGS</h3>
        <span className="section-hint">FIRES WITH ANY ARMED LOADOUT</span>
        <span className="head-spacer" />
      </div>

      {kit.length === 0 ? (
        <div className="bindings-empty">
          <span className="empty-emblem">
            <Emblem size={72} />
          </span>
          <p>STANDARD KIT IS EMPTY</p>
          <span>Add the essentials every Helldiver carries — Reinforce, Resupply…</span>
          <button className="btn primary" onClick={onAddBinding}>
            <IconPlus size={14} />
            Add Binding
          </button>
        </div>
      ) : (
        <div className="bindings-list">
          {kit.map((binding, i) => {
            const stratagem = stratagemFor(binding);
            if (!stratagem) return null;
            return (
              <BindingCard
                key={binding.id}
                binding={binding}
                stratagem={stratagem}
                index={i}
                tag={{ text: "GLOBAL", tone: "global" }}
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
