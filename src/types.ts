export type ArrowDir = "up" | "down" | "left" | "right";

export interface Stratagem {
  id: string;
  name: string;
  code: ArrowDir[];
}

/** One key of an activation combo. Mods are Ctrl/Alt/Shift, key is the trigger. */
export type ComboToken =
  | { kind: "mod"; label: "Ctrl" | "Alt" | "Shift" }
  | { kind: "key"; label: string };

export interface Binding {
  id: string;
  stratagemId: string;
  combo: ComboToken[];
}

export interface Loadout {
  id: string;
  name: string;
  description: string;
  bindings: Binding[];
  createdAt: number;
  updatedAt: number;
}

export type ToastKind = "ok" | "warn" | "danger";

export interface Toast {
  id: string;
  message: string;
  kind: ToastKind;
}

export function comboToString(combo: ComboToken[]): string {
  return combo.map((t) => t.label).join("+");
}

export function uid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}
