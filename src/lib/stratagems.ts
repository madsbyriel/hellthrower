import { invoke } from "@tauri-apps/api/core";
import type { ArrowDir, Binding, Loadout, Stratagem } from "../types";
import { uid } from "../types";
import { fixLegacyKeyName } from "./keys";

export const STRATAGEM_CACHE_KEY = "hellthrower.stratagems.v1";

/** Shape of a stratagem as returned by the Rust backend / Stratbase API. */
interface RawStratagem {
  name: string;
  binding: string[];
}

export interface StratagemCache {
  syncedAt: number;
  stratagems: Stratagem[];
}

const BINDING_MAP: Record<string, ArrowDir> = {
  up: "up",
  down: "down",
  left: "left",
  right: "right",
};

/** Stable id for a stratagem name, so bindings survive cache refreshes. */
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Convert raw Stratbase rows into app stratagems; skips malformed or duplicate rows. */
export function normalizeStratagems(raw: RawStratagem[]): Stratagem[] {
  const seen = new Set<string>();
  const out: Stratagem[] = [];
  for (const item of raw) {
    if (!item || typeof item.name !== "string" || !Array.isArray(item.binding)) {
      continue;
    }
    const code: ArrowDir[] = [];
    let valid = true;
    for (const entry of item.binding) {
      const dir = BINDING_MAP[String(entry).toLowerCase()];
      if (!dir) {
        valid = false;
        break;
      }
      code.push(dir);
    }
    if (!valid || code.length === 0) continue;
    const id = slugify(item.name);
    if (!id || seen.has(id)) continue;
    seen.add(id);
    out.push({ id, name: item.name, code });
  }
  return out;
}

export function loadStratagemCache(): StratagemCache | null {
  try {
    const raw = localStorage.getItem(STRATAGEM_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StratagemCache;
    if (
      !parsed ||
      !Array.isArray(parsed.stratagems) ||
      parsed.stratagems.length === 0
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function saveStratagemCache(stratagems: Stratagem[]): void {
  try {
    const cache: StratagemCache = { syncedAt: Date.now(), stratagems };
    localStorage.setItem(STRATAGEM_CACHE_KEY, JSON.stringify(cache));
  } catch {
    /* storage unavailable — in-memory only */
  }
}

/**
 * The Stratbase location the app falls back to when no location is
 * configured (the `STRATBASE_URL` env var, or the baked-in default).
 * Empty string when the backend cannot be asked (e.g. plain-browser dev).
 */
export async function defaultStratbaseUrl(): Promise<string> {
  try {
    return await invoke<string>("default_stratbase_url");
  } catch {
    return "";
  }
}

/**
 * Fetch every stratagem through the Tauri backend, which uses the
 * stratbase-client crate.
 *
 * `baseUrl` is the location configured in the app; pass undefined/empty to
 * use the backend's own default (see {@link defaultStratbaseUrl}). Throws
 * when the backend is unreachable, the API fails, or nothing usable comes
 * back.
 */
export async function fetchStratagemsFromClient(baseUrl?: string): Promise<Stratagem[]> {
  const url = baseUrl?.trim();
  const raw = url
    ? await invoke<RawStratagem[]>("fetch_stratagems", { baseUrl: url })
    : await invoke<RawStratagem[]>("fetch_stratagems");
  const stratagems = normalizeStratagems(Array.isArray(raw) ? raw : []);
  if (stratagems.length === 0) {
    throw new Error("Stratbase returned no usable stratagems");
  }
  return stratagems;
}

/**
 * Re-point stored bindings whose stratagem id no longer exists to the best
 * slug-prefix match (e.g. "eagle-500kg" → "eagle-500kg-bomb"). Returns the
 * original array untouched when nothing needs remapping.
 */
export function remapLoadoutBindings(
  loadouts: Loadout[],
  stratagems: Stratagem[],
): Loadout[] {
  const byId = new Map(stratagems.map((s) => [s.id, s]));
  let changed = false;
  const remapped = loadouts.map((loadout) => {
    let loadoutChanged = false;
    const bindings = loadout.bindings.map((binding) => {
      if (byId.has(binding.stratagemId)) return binding;
      const match = stratagems.find((s) => s.id.startsWith(binding.stratagemId));
      if (!match) return binding;
      loadoutChanged = true;
      changed = true;
      return { ...binding, stratagemId: match.id };
    });
    return loadoutChanged ? { ...loadout, bindings } : loadout;
  });
  return changed ? remapped : loadouts;
}

// ── Stored-loadout revival (incl. legacy combo migration) ────────────────

const LEGACY_MOD_KEYS: Record<string, string> = {
  Ctrl: "LeftCtrl",
  Alt: "LeftAlt",
  Shift: "LeftShift",
  Meta: "LeftMeta",
};

const LEGACY_ARROW_KEYS: Record<string, string> = {
  "↑": "Up",
  "↓": "Down",
  "←": "Left",
  "→": "Right",
};

/**
 * Convert a stored combo into the current `string[]` format. Accepts both
 * modern combos (already string arrays) and the legacy
 * `{ kind: "mod" | "key", label }` token format.
 */
function migrateCombo(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  if (value.every((entry) => typeof entry === "string")) {
    return value
      .filter((entry): entry is string => entry.length > 0)
      .map(fixLegacyKeyName);
  }
  return value.flatMap((token): string[] => {
    if (!token || typeof token !== "object") return [];
    const { kind, label } = token as { kind?: unknown; label?: unknown };
    if (typeof label !== "string") return [];
    if (kind === "mod") return LEGACY_MOD_KEYS[label] ? [LEGACY_MOD_KEYS[label]] : [];
    if (kind === "key") return [fixLegacyKeyName(LEGACY_ARROW_KEYS[label] ?? label)];
    return [];
  });
}

/** Validate and revive raw localStorage data into `Loadout[]`. */
export function reviveLoadouts(parsed: unknown): Loadout[] {
  if (!Array.isArray(parsed)) return [];
  return parsed.flatMap((item): Loadout[] => {
    if (!item || typeof item !== "object") return [];
    const loadout = item as Partial<Loadout>;
    if (typeof loadout.id !== "string" || typeof loadout.name !== "string") {
      return [];
    }
    const rawBindings = Array.isArray(loadout.bindings) ? loadout.bindings : [];
    const bindings = rawBindings.flatMap((raw): Binding[] => {
      if (!raw || typeof raw !== "object") return [];
      const binding = raw as Partial<Binding>;
      if (typeof binding.id !== "string" || typeof binding.stratagemId !== "string") {
        return [];
      }
      const combo = migrateCombo(binding.combo);
      if (combo.length === 0) return [];
      return [{ id: binding.id, stratagemId: binding.stratagemId, combo }];
    });
    return [
      {
        id: loadout.id,
        name: loadout.name,
        description: typeof loadout.description === "string" ? loadout.description : "",
        bindings,
        createdAt: typeof loadout.createdAt === "number" ? loadout.createdAt : Date.now(),
        updatedAt: typeof loadout.updatedAt === "number" ? loadout.updatedAt : Date.now(),
      },
    ];
  });
}

// ── Demo seed loadouts (first launch only) ──────────────────────────────

function findByName(
  stratagems: Stratagem[],
  name: string,
): Stratagem | undefined {
  const needle = name.toLowerCase();
  return stratagems.find((s) => s.name.toLowerCase() === needle);
}

function bind(
  stratagems: Stratagem[],
  name: string,
  combo: string[],
): Binding | null {
  const stratagem = findByName(stratagems, name);
  return stratagem ? { id: uid(), stratagemId: stratagem.id, combo } : null;
}

export function seedLoadouts(stratagems: Stratagem[]): Loadout[] {
  const now = Date.now();
  return [
    {
      id: uid(),
      name: "AUTOMATON FRONTLINE",
      description:
        "Heavy ordnance for bot fronts. Railcannon on standby, 500kg for the factory striders.",
      createdAt: now - 1000 * 60 * 60 * 26,
      updatedAt: now - 1000 * 60 * 12,
      bindings: [
        bind(stratagems, "Reinforce", ["F1"]),
        bind(stratagems, "Resupply", ["F2"]),
        bind(stratagems, "Eagle Airstrike", ["LeftCtrl", "Digit1"]),
        bind(stratagems, "Orbital Railcannon Strike", ["LeftCtrl", "Digit2"]),
        bind(stratagems, "Eagle 500KG Bomb", ["LeftCtrl", "Digit3"]),
        bind(stratagems, "Orbital Laser", ["LeftAlt", "L"]),
      ].filter((b): b is Binding => b !== null),
    },
    {
      id: uid(),
      name: "TERMINID SWARM",
      description:
        "Area denial for bug breaches. Fire, gas and more fire. Bring a shovel.",
      createdAt: now - 1000 * 60 * 60 * 3,
      updatedAt: now - 1000 * 60 * 60 * 2,
      bindings: [
        bind(stratagems, "Reinforce", ["F1"]),
        bind(stratagems, "Resupply", ["F2"]),
        bind(stratagems, "Eagle Napalm Airstrike", ["LeftCtrl", "Digit1"]),
        bind(stratagems, "Orbital Gatling Barrage", ["LeftCtrl", "Digit2"]),
        bind(stratagems, "Orbital Gas Strike", ["LeftCtrl", "Digit3"]),
      ].filter((b): b is Binding => b !== null),
    },
  ];
}
