import type { ArrowDir, Loadout } from "../types";
import { ArrowGlyph } from "./ArrowGlyph";
import { Emblem } from "./Emblem";
import { IconPower } from "./icons";

export function Header({
  inputs,
  activeLoadout,
  onDisarm,
}: {
  inputs: ArrowDir[];
  activeLoadout: Loadout | null;
  onDisarm: () => void;
}) {
  const armed = activeLoadout !== null;
  return (
    <header className="header">
      <div className="brand">
        <span className="brand-emblem">
          <Emblem size={34} />
        </span>
        <div className="brand-text">
          <h1 className="brand-name">
            HELL<span>THROWER</span>
          </h1>
          <p className="brand-sub">STRATAGEM AUTO-THROW CONTROL UNIT</p>
        </div>
      </div>

      <div className="header-spacer" />

      <div className="input-monitor" aria-label="Input monitor">
        <span className="monitor-label">INPUT</span>
        <span className="monitor-track">
          {inputs.length === 0 && <span className="monitor-idle">AWAITING SIGNAL</span>}
          {inputs.map((dir, i) => (
            <span className="monitor-cell" key={i}>
              <ArrowGlyph dir={dir} size={11} />
            </span>
          ))}
          <span className="monitor-caret" aria-hidden="true" />
        </span>
      </div>

      <div className={`system-status ${armed ? "armed" : ""}`}>
        {armed ? (
          <>
            <span className="status-dot" aria-hidden="true" />
            <div className="status-text">
              <span className="status-title">AUTOTHROW ARMED</span>
              <span className="status-sub">{activeLoadout.name}</span>
            </div>
            <button className="btn sm danger" onClick={onDisarm}>
              <IconPower size={14} />
              Disarm
            </button>
          </>
        ) : (
          <>
            <span className="status-slash" aria-hidden="true" />
            <div className="status-text">
              <span className="status-title">SYSTEM STANDBY</span>
              <span className="status-sub">NO LOADOUT ACTIVE</span>
            </div>
          </>
        )}
      </div>
      <div className="header-hazard" aria-hidden="true" />
    </header>
  );
}
