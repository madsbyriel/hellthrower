export type ArrowDir = "up" | "down" | "left" | "right";

export type StratagemCategory =
  | "Patriotic Administration Center"
  | "Orbital Cannons"
  | "Hangar"
  | "Bridge"
  | "Engineering Bay"
  | "Robotics Workshop";

export type DangerLevel = "none" | "yellow" | "red";

export interface Stratagem {
  id: string;
  name: string;
  category: StratagemCategory;
  code: ArrowDir[];
  description: string;
  danger: DangerLevel;
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

export const CATEGORY_ACCENTS: Record<StratagemCategory, string> = {
  "Patriotic Administration Center": "#ffd92e",
  "Orbital Cannons": "#ff7a3d",
  Hangar: "#4dc9ff",
  Bridge: "#b18cff",
  "Engineering Bay": "#6dff9c",
  "Robotics Workshop": "#ff5d8f",
};

export const DANGER_LABEL: Record<DangerLevel, string> = {
  none: "",
  yellow: "HAZARD",
  red: "HIGH YIELD",
};

export function comboToString(combo: ComboToken[]): string {
  return combo.map((t) => t.label).join("+");
}

export function uid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}
