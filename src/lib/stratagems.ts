import { invoke } from "@tauri-apps/api/core";
import type {
  ArrowDir,
  Binding,
  ComboToken,
  Loadout,
  Stratagem,
} from "../types";
import { uid } from "../types";

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
 * Fetch every stratagem through the Tauri backend, which uses the
 * stratbase-client crate. Throws when the backend is unreachable, the API
 * fails, or nothing usable comes back.
 */
export async function fetchStratagemsFromClient(): Promise<Stratagem[]> {
  const raw = await invoke<RawStratagem[]>("fetch_stratagems");
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
  combo: ComboToken[],
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
        bind(stratagems, "Reinforce", [{ kind: "key", label: "F1" }]),
        bind(stratagems, "Resupply", [{ kind: "key", label: "F2" }]),
        bind(stratagems, "Eagle Airstrike", [
          { kind: "mod", label: "Ctrl" },
          { kind: "key", label: "1" },
        ]),
        bind(stratagems, "Orbital Railcannon Strike", [
          { kind: "mod", label: "Ctrl" },
          { kind: "key", label: "2" },
        ]),
        bind(stratagems, "Eagle 500KG Bomb", [
          { kind: "mod", label: "Ctrl" },
          { kind: "key", label: "3" },
        ]),
        bind(stratagems, "Orbital Laser", [
          { kind: "mod", label: "Alt" },
          { kind: "key", label: "L" },
        ]),
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
        bind(stratagems, "Reinforce", [{ kind: "key", label: "F1" }]),
        bind(stratagems, "Resupply", [{ kind: "key", label: "F2" }]),
        bind(stratagems, "Eagle Napalm Airstrike", [
          { kind: "mod", label: "Ctrl" },
          { kind: "key", label: "1" },
        ]),
        bind(stratagems, "Orbital Gatling Barrage", [
          { kind: "mod", label: "Ctrl" },
          { kind: "key", label: "2" },
        ]),
        bind(stratagems, "Orbital Gas Strike", [
          { kind: "mod", label: "Ctrl" },
          { kind: "key", label: "3" },
        ]),
      ].filter((b): b is Binding => b !== null),
    },
  ];
}
