import type { Loadout } from "../types";
import { Emblem } from "./Emblem";
import { IconPencil, IconPlus, IconPower, IconTrash } from "./icons";

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function Sidebar({
  loadouts,
  selectedId,
  activeId,
  kitCount,
  kitSelected,
  onSelectKit,
  onSelect,
  onCreate,
  onEdit,
  onDelete,
  onActivate,
}: {
  loadouts: Loadout[];
  selectedId: string | null;
  activeId: string | null;
  kitCount: number;
  kitSelected: boolean;
  onSelectKit: () => void;
  onSelect: (id: string) => void;
  onCreate: () => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onActivate: (id: string) => void;
}) {
  return (
    <aside className="sidebar">
      <div className="sidebar-head">
        <h2 className="panel-title">LOADOUTS</h2>
        <span className="count-chip">{loadouts.length}</span>
        <button className="btn primary sm new-btn" onClick={onCreate}>
          <IconPlus size={14} />
          New Loadout
        </button>
      </div>

      <div
        className={`kit-entry ${kitSelected ? "selected" : ""}`}
        onClick={onSelectKit}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter") onSelectKit();
        }}
        title="Bindings active in every loadout"
      >
        <span className="kit-entry-icon" aria-hidden="true">
          <Emblem size={20} />
        </span>
        <div className="loadout-item-main">
          <div className="loadout-item-top">
            <span className="loadout-name">STANDARD KIT</span>
            <span className="kit-chip">GLOBAL</span>
          </div>
          <div className="loadout-meta">
            <span>
              {kitCount} STRATAGEM{kitCount === 1 ? "" : "S"}
            </span>
          </div>
        </div>
      </div>

      <div className="loadout-list">
        {loadouts.length === 0 && (
          <div className="sidebar-empty">
            <p>NO LOADOUTS ON FILE</p>
            <span>Create one to begin deployment.</span>
          </div>
        )}
        {loadouts.map((loadout) => {
          const isActive = loadout.id === activeId;
          const isSelected = loadout.id === selectedId;
          return (
            <div
              key={loadout.id}
              className={`loadout-item ${isActive ? "active" : ""} ${isSelected ? "selected" : ""}`}
              onClick={() => onSelect(loadout.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter") onSelect(loadout.id);
              }}
            >
              <div className="loadout-item-main">
                <div className="loadout-item-top">
                  <span className="loadout-name" title={loadout.name}>
                    {loadout.name}
                  </span>
                  {isActive && <span className="active-chip">ACTIVE</span>}
                </div>
                <div className="loadout-meta">
                  <span>{loadout.bindings.length} STRATAGEM{loadout.bindings.length === 1 ? "" : "S"}</span>
                  <span className="meta-dot">•</span>
                  <span>UPDATED {timeAgo(loadout.updatedAt)}</span>
                </div>
              </div>
              <div className="loadout-item-actions">
                {!isActive && (
                  <button
                    className="icon-btn deploy"
                    title="Activate loadout"
                    aria-label={`Activate ${loadout.name}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onActivate(loadout.id);
                    }}
                  >
                    <IconPower size={15} />
                  </button>
                )}
                <button
                  className="icon-btn"
                  title="Edit loadout"
                  aria-label={`Edit ${loadout.name}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(loadout.id);
                  }}
                >
                  <IconPencil size={15} />
                </button>
                <button
                  className="icon-btn danger"
                  title="Delete loadout"
                  aria-label={`Delete ${loadout.name}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(loadout.id);
                  }}
                >
                  <IconTrash size={15} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="sidebar-foot">
        <span className="foot-line">SUPER EARTH ARMED FORCES</span>
        <span className="foot-line dim">ORBITAL ORDNANCE DIVISION</span>
      </div>
    </aside>
  );
}
