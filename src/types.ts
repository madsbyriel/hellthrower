export type ArrowDir = "up" | "down" | "left" | "right";

export interface Stratagem {
  id: string;
  name: string;
  code: ArrowDir[];
}

export interface Binding {
  id: string;
  stratagemId: string;
  /** Trigger combination — any set of keyrs key names (e.g. ["LeftCtrl", "F1"]). */
  combo: string[];
}

export interface Loadout {
  id: string;
  name: string;
  description: string;
  bindings: Binding[];
  createdAt: number;
  updatedAt: number;
}

/** Which physical keys are pressed to emit each code direction in-game. */
export interface DirectionKeys {
  up: string;
  left: string;
  down: string;
  right: string;
}

export interface AppSettings {
  directionKeys: DirectionKeys;
  /**
   * Stratbase server base URL (e.g. "http://localhost:8000"). Empty means
   * "use the app default": the `STRATBASE_URL` environment variable when
   * set, otherwise the baked-in default.
   */
  serverUrl: string;
}

export type ToastKind = "ok" | "warn" | "danger";

export interface Toast {
  id: string;
  message: string;
  kind: ToastKind;
}

/** Stratagem database sync state: syncing, fresh, cached, or unreachable. */
export type SyncStatus = "loading" | "online" | "offline" | "error";

export function comboToString(combo: string[]): string {
  return combo.join("+");
}

export function uid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}
