import { invoke } from "@tauri-apps/api/core";
import type {
  AppSettings,
  ArrowDir,
  DirectionKeys,
  Loadout,
  Stratagem,
} from "../types";

export const SETTINGS_KEY = "hellthrower.settings.v1";

/** The usual mapping: WASD for Up, Left, Down, Right. */
export const DEFAULT_DIRECTION_KEYS: DirectionKeys = {
  up: "W",
  left: "A",
  down: "S",
  right: "D",
};

export function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<AppSettings>;
      const directionKeys: Partial<DirectionKeys> = parsed.directionKeys ?? {};
      return {
        directionKeys: {
          up: typeof directionKeys.up === "string" ? directionKeys.up : DEFAULT_DIRECTION_KEYS.up,
          left: typeof directionKeys.left === "string" ? directionKeys.left : DEFAULT_DIRECTION_KEYS.left,
          down: typeof directionKeys.down === "string" ? directionKeys.down : DEFAULT_DIRECTION_KEYS.down,
          right: typeof directionKeys.right === "string" ? directionKeys.right : DEFAULT_DIRECTION_KEYS.right,
        },
      };
    }
  } catch {
    /* corrupted settings — fall back */
  }
  return { directionKeys: { ...DEFAULT_DIRECTION_KEYS } };
}

export function saveSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    /* storage unavailable */
  }
}

// ── Backend bridge ─────────────────────────────────────────────────────

/** Shape the Rust activation engine expects. */
export interface ActivationConfig {
  directionKeys: DirectionKeys;
  bindings: Array<{
    combo: string[];
    code: ArrowDir[];
    name: string;
  }>;
}

export function buildActivationConfig(
  loadout: Loadout,
  stratagemById: Map<string, Stratagem>,
  directionKeys: DirectionKeys,
): ActivationConfig {
  return {
    directionKeys,
    bindings: loadout.bindings.flatMap((binding) => {
      const stratagem = stratagemById.get(binding.stratagemId);
      if (!stratagem) return [];
      return [
        {
          combo: binding.combo,
          code: stratagem.code,
          name: stratagem.name,
        },
      ];
    }),
  };
}

export async function activateBackend(config: ActivationConfig): Promise<void> {
  await invoke("activate_loadout", { config });
}

export async function deactivateBackend(): Promise<void> {
  await invoke("deactivate_loadout");
}

export async function startComboRecording(): Promise<void> {
  await invoke("start_combo_recording");
}

export async function cancelComboRecording(): Promise<void> {
  await invoke("cancel_combo_recording");
}

// ── Helpers ────────────────────────────────────────────────────────────

/** Chords match as sets — press order does not matter. */
export function combosEqual(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  const set = new Set(a);
  return b.every((key) => set.has(key));
}

export function errMsg(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}
