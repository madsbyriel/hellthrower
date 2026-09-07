import { invoke } from "@tauri-apps/api/core";
import type {
  AppSettings,
  ArrowDir,
  Binding,
  DirectionKeys,
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

/**
 * keyrs 0.1.1 was missing the S key in its evdev mapping, so a physical S
 * press was captured as the raw-code fallback `Other(0x1f)` (evdev KEY_S
 * = 31). Heal stored data captured with that version.
 */
const LEGACY_KEY_FIXES: Record<string, string> = {
  "Other(0x1f)": "S",
};

export function fixLegacyKeyName(name: string): string {
  return LEGACY_KEY_FIXES[name] ?? name;
}

export function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<AppSettings>;
      const directionKeys: Partial<DirectionKeys> = parsed.directionKeys ?? {};
      return {
        directionKeys: {
          up: typeof directionKeys.up === "string" ? fixLegacyKeyName(directionKeys.up) : DEFAULT_DIRECTION_KEYS.up,
          left: typeof directionKeys.left === "string" ? fixLegacyKeyName(directionKeys.left) : DEFAULT_DIRECTION_KEYS.left,
          down: typeof directionKeys.down === "string" ? fixLegacyKeyName(directionKeys.down) : DEFAULT_DIRECTION_KEYS.down,
          right: typeof directionKeys.right === "string" ? fixLegacyKeyName(directionKeys.right) : DEFAULT_DIRECTION_KEYS.right,
        },
        // Older stored settings have no server location — fall back to the
        // app default ("" = STRATBASE_URL env var / baked-in default).
        serverUrl: typeof parsed.serverUrl === "string" ? parsed.serverUrl : "",
      };
    }
  } catch {
    /* corrupted settings — fall back */
  }
  return { directionKeys: { ...DEFAULT_DIRECTION_KEYS }, serverUrl: "" };
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

/**
 * The bindings a loadout actually fires with: its own bindings plus the
 * Standard Kit, where a loadout binding with the same combo shadows the
 * kit entry (loadout wins on conflicts).
 */
export function effectiveBindings(
  kit: Binding[],
  loadoutBindings: Binding[],
): Binding[] {
  const shadowedKitIds = new Set(
    kit
      .filter((kitBinding) =>
        loadoutBindings.some((b) => combosEqual(b.combo, kitBinding.combo)),
      )
      .map((kitBinding) => kitBinding.id),
  );
  return [
    ...kit.filter((kitBinding) => !shadowedKitIds.has(kitBinding.id)),
    ...loadoutBindings,
  ];
}

export function buildActivationConfig(
  bindings: Binding[],
  stratagemById: Map<string, Stratagem>,
  directionKeys: DirectionKeys,
): ActivationConfig {
  return {
    directionKeys,
    bindings: bindings.flatMap((binding) => {
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

/** Report whether the pointer is over the app window (mouse chords are ignored while it is). */
export async function setPointerInApp(inside: boolean): Promise<void> {
  try {
    await invoke("set_pointer_in_app", { inside });
  } catch {
    /* not running inside Tauri */
  }
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
