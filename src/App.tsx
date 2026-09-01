import { useCallback, useEffect, useMemo, useState } from "react";
import { BindingEditor, type BindingDraft } from "./components/BindingEditor";
import { ConfirmDialog } from "./components/ConfirmDialog";
import { Header } from "./components/Header";
import { LoadoutEditor, type LoadoutDraft } from "./components/LoadoutEditor";
import { EmptyPanel, LoadoutPanel } from "./components/LoadoutPanel";
import { Sidebar } from "./components/Sidebar";
import { Toasts } from "./components/Toasts";
import { STRATAGEM_BY_ID } from "./data/stratagems";
import type {
  ArrowDir,
  Binding,
  Loadout,
  Toast,
  ToastKind,
} from "./types";
import { uid } from "./types";
import "./App.css";

const STORAGE_LOADOUTS = "hellthrower.loadouts.v1";
const STORAGE_ACTIVE = "hellthrower.active.v1";

// ── Demo seed data ────────────────────────────────────────────────────

function seedLoadouts(): Loadout[] {
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
        { id: uid(), stratagemId: "reinforce", combo: [{ kind: "key", label: "F1" }] },
        { id: uid(), stratagemId: "resupply", combo: [{ kind: "key", label: "F2" }] },
        { id: uid(), stratagemId: "eagle-airstrike", combo: [{ kind: "mod", label: "Ctrl" }, { kind: "key", label: "1" }] },
        { id: uid(), stratagemId: "orbital-railcannon", combo: [{ kind: "mod", label: "Ctrl" }, { kind: "key", label: "2" }] },
        { id: uid(), stratagemId: "eagle-500kg", combo: [{ kind: "mod", label: "Ctrl" }, { kind: "key", label: "3" }] },
        { id: uid(), stratagemId: "orbital-laser", combo: [{ kind: "mod", label: "Alt" }, { kind: "key", label: "L" }] },
      ],
    },
    {
      id: uid(),
      name: "TERMINID SWARM",
      description:
        "Area denial for bug breaches. Fire, gas and more fire. Bring a shovel.",
      createdAt: now - 1000 * 60 * 60 * 3,
      updatedAt: now - 1000 * 60 * 60 * 2,
      bindings: [
        { id: uid(), stratagemId: "reinforce", combo: [{ kind: "key", label: "F1" }] },
        { id: uid(), stratagemId: "resupply", combo: [{ kind: "key", label: "F2" }] },
        { id: uid(), stratagemId: "eagle-napalm", combo: [{ kind: "mod", label: "Ctrl" }, { kind: "key", label: "1" }] },
        { id: uid(), stratagemId: "orbital-gatling", combo: [{ kind: "mod", label: "Ctrl" }, { kind: "key", label: "2" }] },
        { id: uid(), stratagemId: "orbital-gas", combo: [{ kind: "mod", label: "Ctrl" }, { kind: "key", label: "3" }] },
      ],
    },
  ];
}

function loadStored<T>(key: string, fallback: () => T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as T;
  } catch {
    /* corrupted storage — fall back */
  }
  return fallback();
}

// ── Modals ────────────────────────────────────────────────────────────

type ModalState =
  | { kind: "loadout"; loadoutId: string | null }
  | { kind: "binding"; loadoutId: string; bindingId: string | null }
  | { kind: "deleteLoadout"; loadoutId: string }
  | { kind: "deleteBinding"; loadoutId: string; bindingId: string }
  | null;

// ── App ───────────────────────────────────────────────────────────────

export default function App() {
  const [loadouts, setLoadouts] = useState<Loadout[]>(() =>
    loadStored(STORAGE_LOADOUTS, seedLoadouts),
  );
  const [activeId, setActiveId] = useState<string | null>(() =>
    loadStored<string | null>(STORAGE_ACTIVE, () => null),
  );
  const [selectedId, setSelectedId] = useState<string | null>(
    () => loadouts[0]?.id ?? null,
  );
  const [modal, setModal] = useState<ModalState>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [inputs, setInputs] = useState<ArrowDir[]>([]);

  // ── mock persistence ──
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_LOADOUTS, JSON.stringify(loadouts));
    } catch {
      /* storage unavailable — in-memory only */
    }
  }, [loadouts]);

  useEffect(() => {
    try {
      if (activeId) localStorage.setItem(STORAGE_ACTIVE, JSON.stringify(activeId));
      else localStorage.removeItem(STORAGE_ACTIVE);
    } catch {
      /* storage unavailable */
    }
  }, [activeId]);

  // ── cosmetic input monitor (arrow keys / WASD only) ──
  useEffect(() => {
    const map: Record<string, ArrowDir> = {
      arrowup: "up",
      arrowdown: "down",
      arrowleft: "left",
      arrowright: "right",
      w: "up",
      s: "down",
      a: "left",
      d: "right",
    };
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" || target.tagName === "TEXTAREA")
      ) {
        return;
      }
      const dir = map[e.key.toLowerCase()];
      if (dir) setInputs((prev) => [...prev.slice(-7), dir]);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const pushToast = useCallback((message: string, kind: ToastKind = "ok") => {
    const id = uid();
    setToasts((prev) => [...prev.slice(-3), { id, message, kind }]);
    window.setTimeout(
      () => setToasts((prev) => prev.filter((t) => t.id !== id)),
      3400,
    );
  }, []);

  const selectedLoadout = useMemo(
    () => loadouts.find((l) => l.id === selectedId) ?? null,
    [loadouts, selectedId],
  );
  const activeLoadout = useMemo(
    () => loadouts.find((l) => l.id === activeId) ?? null,
    [loadouts, activeId],
  );

  const stratagemFor = useCallback(
    (binding: Binding) => STRATAGEM_BY_ID.get(binding.stratagemId),
    [],
  );

  // ── loadout CRUD ──
  const createLoadout = (draft: LoadoutDraft) => {
    const loadout: Loadout = {
      id: uid(),
      name: draft.name,
      description: draft.description,
      bindings: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setLoadouts((prev) => [loadout, ...prev]);
    setSelectedId(loadout.id);
    setModal(null);
    pushToast("LOADOUT CREATED — READY FOR CONFIGURATION");
  };

  const updateLoadout = (draft: LoadoutDraft) => {
    if (modal?.kind !== "loadout" || modal.loadoutId === null) return;
    setLoadouts((prev) =>
      prev.map((l) =>
        l.id === modal.loadoutId
          ? { ...l, ...draft, updatedAt: Date.now() }
          : l,
      ),
    );
    setModal(null);
    pushToast("LOADOUT UPDATED");
  };

  const deleteLoadout = () => {
    if (modal?.kind !== "deleteLoadout") return;
    const { loadoutId } = modal;
    const remaining = loadouts.filter((l) => l.id !== loadoutId);
    setLoadouts(remaining);
    if (selectedId === loadoutId) setSelectedId(remaining[0]?.id ?? null);
    if (activeId === loadoutId) setActiveId(null);
    setModal(null);
    pushToast("LOADOUT PURGED FROM MANIFEST", "danger");
  };

  const activateLoadout = (id: string) => {
    const loadout = loadouts.find((l) => l.id === id);
    setActiveId(id);
    setSelectedId(id);
    pushToast(`LOADOUT DEPLOYED — "${loadout?.name ?? id}" ARMED`);
  };

  const disarm = () => {
    setActiveId(null);
    pushToast("AUTOTHROW DISARMED — SYSTEM ON STANDBY", "warn");
  };

  // ── binding CRUD ──
  const saveBinding = (draft: BindingDraft) => {
    if (modal?.kind !== "binding" || !draft.stratagemId) return;
    const { loadoutId, bindingId } = modal;
    const { combo, stratagemId } = draft;
    setLoadouts((prev) =>
      prev.map((l) => {
        if (l.id !== loadoutId) return l;
        if (bindingId) {
          return {
            ...l,
            updatedAt: Date.now(),
            bindings: l.bindings.map((b) =>
              b.id === bindingId ? { ...b, combo, stratagemId } : b,
            ),
          };
        }
        return {
          ...l,
          updatedAt: Date.now(),
          bindings: [
            ...l.bindings,
            {
              id: uid(),
              combo,
              stratagemId,
            },
          ],
        };
      }),
    );
    setModal(null);
    pushToast(bindingId ? "BINDING UPDATED" : "BINDING ADDED TO LOADOUT");
  };

  const deleteBinding = () => {
    if (modal?.kind !== "deleteBinding") return;
    const { loadoutId, bindingId } = modal;
    setLoadouts((prev) =>
      prev.map((l) =>
        l.id === loadoutId
          ? {
              ...l,
              updatedAt: Date.now(),
              bindings: l.bindings.filter((b) => b.id !== bindingId),
            }
          : l,
      ),
    );
    setModal(null);
    pushToast("BINDING REMOVED", "warn");
  };

  // ── render ──
  return (
    <div className="app">
      <Header inputs={inputs} activeLoadout={activeLoadout} onDisarm={disarm} />

      <div className="shell">
        <Sidebar
          loadouts={loadouts}
          selectedId={selectedId}
          activeId={activeId}
          onSelect={setSelectedId}
          onCreate={() => setModal({ kind: "loadout", loadoutId: null })}
          onEdit={(id) => setModal({ kind: "loadout", loadoutId: id })}
          onDelete={(id) => setModal({ kind: "deleteLoadout", loadoutId: id })}
          onActivate={activateLoadout}
        />

        {selectedLoadout ? (
          <LoadoutPanel
            loadout={selectedLoadout}
            stratagemFor={stratagemFor}
            armed={selectedLoadout.id === activeId}
            onActivate={() => activateLoadout(selectedLoadout.id)}
            onDisarm={disarm}
            onEdit={() =>
              setModal({ kind: "loadout", loadoutId: selectedLoadout.id })
            }
            onDelete={() =>
              setModal({
                kind: "deleteLoadout",
                loadoutId: selectedLoadout.id,
              })
            }
            onAddBinding={() =>
              setModal({
                kind: "binding",
                loadoutId: selectedLoadout.id,
                bindingId: null,
              })
            }
            onEditBinding={(bindingId) =>
              setModal({
                kind: "binding",
                loadoutId: selectedLoadout.id,
                bindingId,
              })
            }
            onDeleteBinding={(bindingId) =>
              setModal({
                kind: "deleteBinding",
                loadoutId: selectedLoadout.id,
                bindingId,
              })
            }
          />
        ) : (
          <EmptyPanel
            onCreate={() => setModal({ kind: "loadout", loadoutId: null })}
          />
        )}
      </div>

      {/* ── modals ── */}
      {modal?.kind === "loadout" &&
        (() => {
          const existing =
            modal.loadoutId !== null
              ? loadouts.find((l) => l.id === modal.loadoutId)
              : undefined;
          return (
            <LoadoutEditor
              initial={{
                name: existing?.name ?? "",
                description: existing?.description ?? "",
              }}
              onSave={modal.loadoutId === null ? createLoadout : updateLoadout}
              onClose={() => setModal(null)}
            />
          );
        })()}

      {modal?.kind === "binding" &&
        (() => {
          const loadout = loadouts.find((l) => l.id === modal.loadoutId);
          if (!loadout) return null;
          const existing = modal.bindingId
            ? loadout.bindings.find((b) => b.id === modal.bindingId)
            : undefined;
          return (
            <BindingEditor
              initial={{
                combo: existing?.combo ?? [],
                stratagemId: existing?.stratagemId ?? null,
              }}
              otherBindings={loadout.bindings.filter(
                (b) => b.id !== modal.bindingId,
              )}
              onSave={saveBinding}
              onClose={() => setModal(null)}
            />
          );
        })()}

      {modal?.kind === "deleteLoadout" &&
        (() => {
          const loadout = loadouts.find((l) => l.id === modal.loadoutId);
          return (
            <ConfirmDialog
              title="DELETE LOADOUT"
              message={`Purge "${loadout?.name ?? "this loadout"}" from the manifest?`}
              detail="This action cannot be undone. All bindings will be lost to the void of space."
              confirmLabel="Delete Loadout"
              onConfirm={deleteLoadout}
              onClose={() => setModal(null)}
            />
          );
        })()}

      {modal?.kind === "deleteBinding" &&
        (() => {
          const loadout = loadouts.find((l) => l.id === modal.loadoutId);
          const binding = loadout?.bindings.find(
            (b) => b.id === modal.bindingId,
          );
          const stratagem = binding
            ? STRATAGEM_BY_ID.get(binding.stratagemId)
            : undefined;
          return (
            <ConfirmDialog
              title="REMOVE BINDING"
              message={`Remove the ${stratagem?.name ?? "stratagem"} binding from "${loadout?.name ?? "this loadout"}"?`}
              confirmLabel="Remove Binding"
              onConfirm={deleteBinding}
              onClose={() => setModal(null)}
            />
          );
        })()}

      <Toasts toasts={toasts} />

      {/* ambient effects */}
      <div className="fx fx-grid" aria-hidden="true" />
      <div className="fx fx-scanlines" aria-hidden="true" />
      <div className="fx fx-vignette" aria-hidden="true" />
    </div>
  );
}
