import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { listen, type UnlistenFn } from "@tauri-apps/api/event";
import { BindingEditor, type BindingDraft } from "./components/BindingEditor";
import { BootScreen } from "./components/BootScreen";
import { ConfirmDialog } from "./components/ConfirmDialog";
import { Header } from "./components/Header";
import { LoadoutEditor, type LoadoutDraft } from "./components/LoadoutEditor";
import { EmptyPanel, LoadoutPanel } from "./components/LoadoutPanel";
import { SettingsModal } from "./components/SettingsModal";
import { Sidebar } from "./components/Sidebar";
import { Toasts } from "./components/Toasts";
import {
  activateBackend,
  buildActivationConfig,
  deactivateBackend,
  errMsg,
  loadSettings,
  saveSettings,
  setAppFocused,
  setPointerInApp,
} from "./lib/keys";
import {
  defaultStratbaseUrl,
  fetchStratagemsFromClient,
  loadStratagemCache,
  remapLoadoutBindings,
  reviveLoadouts,
  saveStratagemCache,
  seedLoadouts,
} from "./lib/stratagems";
import type {
  AppSettings,
  ArrowDir,
  Binding,
  Loadout,
  Stratagem,
  SyncStatus,
  Toast,
  ToastKind,
} from "./types";
import { uid } from "./types";
import "./App.css";

const STORAGE_LOADOUTS = "hellthrower.loadouts.v1";
const STORAGE_ACTIVE = "hellthrower.active.v1";

function loadStored<T>(key: string, fallback: () => T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as T;
  } catch {
    /* corrupted storage — fall back */
  }
  return fallback();
}

function loadLoadouts(): Loadout[] {
  try {
    const raw = localStorage.getItem(STORAGE_LOADOUTS);
    if (raw) return reviveLoadouts(JSON.parse(raw));
  } catch {
    /* corrupted storage — start empty */
  }
  return [];
}

// ── Modals ────────────────────────────────────────────────────────────

type ModalState =
  | { kind: "loadout"; loadoutId: string | null }
  | { kind: "binding"; loadoutId: string; bindingId: string | null }
  | { kind: "deleteLoadout"; loadoutId: string }
  | { kind: "deleteBinding"; loadoutId: string; bindingId: string }
  | { kind: "settings" }
  | null;

function FxLayers() {
  return (
    <>
      <div className="fx fx-grid" aria-hidden="true" />
      <div className="fx fx-scanlines" aria-hidden="true" />
      <div className="fx fx-vignette" aria-hidden="true" />
    </>
  );
}

interface TriggerPayload {
  stratagem: string;
}

// ── App ───────────────────────────────────────────────────────────────

export default function App() {
  const [stratagems, setStratagems] = useState<Stratagem[] | null>(null);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>("loading");
  const [syncError, setSyncError] = useState<string | null>(null);
  const [appReady, setAppReady] = useState(false);
  /** The backend's default Stratbase location (empty until resolved). */
  const [defaultServerUrl, setDefaultServerUrl] = useState("");

  const [loadouts, setLoadouts] = useState<Loadout[]>(loadLoadouts);
  const [settings, setSettings] = useState<AppSettings>(loadSettings);
  const [activeId, setActiveId] = useState<string | null>(() =>
    loadStored<string | null>(STORAGE_ACTIVE, () => null),
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [modal, setModal] = useState<ModalState>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [inputs, setInputs] = useState<ArrowDir[]>([]);

  const bootingRef = useRef(false);
  // Mirror of `settings` that the (stable) boot callback can read without
  // re-creating itself on every settings change.
  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  const pushToast = useCallback((message: string, kind: ToastKind = "ok") => {
    const id = uid();
    setToasts((prev) => [...prev.slice(-3), { id, message, kind }]);
    window.setTimeout(
      () => setToasts((prev) => prev.filter((t) => t.id !== id)),
      3400,
    );
  }, []);

  // ── stratagem sync boot sequence ──
  const finishBoot = useCallback((list: Stratagem[]) => {
    if (localStorage.getItem(STORAGE_LOADOUTS) !== null) {
      // Existing loadouts: re-point stale stratagem ids to the fresh list.
      setLoadouts((prev) => remapLoadoutBindings(prev, list));
    } else {
      // First launch: seed demo loadouts against whatever the API returned.
      setLoadouts(seedLoadouts(list));
    }
    setStratagems(list);
    setAppReady(true);
  }, []);

  const boot = useCallback(
    async (requestedUrl?: string) => {
      if (bootingRef.current) return;
      bootingRef.current = true;
      setSyncStatus("loading");
      setSyncError(null);
      try {
        // The configured server location wins; empty means "app default"
        // (STRATBASE_URL env var, else the backend's baked-in default).
        const baseUrl = (requestedUrl ?? settingsRef.current.serverUrl).trim();
        const fresh = await fetchStratagemsFromClient(baseUrl);
        saveStratagemCache(fresh);
        finishBoot(fresh);
        setSyncStatus("online");
      } catch (err) {
        const cached = loadStratagemCache();
        if (cached) {
          finishBoot(cached.stratagems);
          setSyncStatus("offline");
          pushToast(
            "STRATBASE UNREACHABLE — USING CACHED STRATAGEM DATABASE",
            "warn",
          );
        } else {
          setSyncStatus("error");
          setSyncError(err instanceof Error ? err.message : String(err));
        }
      } finally {
        bootingRef.current = false;
      }
    },
    [finishBoot, pushToast],
  );

  useEffect(() => {
    boot();
  }, [boot]);

  // Learn the backend's default Stratbase location (env var / baked-in
  // default) so the UI can show it when the user hasn't configured one.
  useEffect(() => {
    let alive = true;
    defaultStratbaseUrl().then((url) => {
      if (alive && url) setDefaultServerUrl(url);
    });
    return () => {
      alive = false;
    };
  }, []);

  // ── mock persistence (write only after boot to avoid clobbering seeds) ──
  useEffect(() => {
    if (!appReady) return;
    try {
      localStorage.setItem(STORAGE_LOADOUTS, JSON.stringify(loadouts));
    } catch {
      /* storage unavailable — in-memory only */
    }
  }, [loadouts, appReady]);

  useEffect(() => {
    try {
      if (activeId) localStorage.setItem(STORAGE_ACTIVE, JSON.stringify(activeId));
      else localStorage.removeItem(STORAGE_ACTIVE);
    } catch {
      /* storage unavailable */
    }
  }, [activeId]);

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  // Keep a valid selection when loadouts change (seed, delete, …).
  useEffect(() => {
    if (loadouts.length > 0 && !loadouts.some((l) => l.id === selectedId)) {
      setSelectedId(loadouts[0].id);
    }
  }, [loadouts, selectedId]);

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

  // ── engine feedback: toast when a chord fires ──
  useEffect(() => {
    let disposed = false;
    let unlisten: UnlistenFn | undefined;
    listen<TriggerPayload>("autothrow-trigger", (event) => {
      pushToast(`DEPLOYING STRATAGEM: ${event.payload.stratagem}`);
    })
      .then((fn) => {
        // StrictMode dev: the effect may be cleaned up before listen()
        // resolves — unregister the stale listener immediately so each
        // trigger event is handled exactly once.
        if (disposed) {
          fn();
        } else {
          unlisten = fn;
        }
      })
      .catch(() => {
        /* not running inside Tauri — no engine events */
      });
    return () => {
      disposed = true;
      unlisten?.();
    };
  }, [pushToast]);

  // ── engine feedback: surface emission failures ──
  useEffect(() => {
    let disposed = false;
    let unlisten: UnlistenFn | undefined;
    listen<{ message: string }>("autothrow-error", (event) => {
      pushToast(`AUTOTHROW ERROR: ${event.payload.message}`, "danger");
    })
      .then((fn) => {
        if (disposed) {
          fn();
        } else {
          unlisten = fn;
        }
      })
      .catch(() => {
        /* not running inside Tauri — no engine events */
      });
    return () => {
      disposed = true;
      unlisten?.();
    };
  }, [pushToast]);

  // ── report window focus + pointer position to the engine ──
  // Chords never fire while the app is focused (the user is in the UI,
  // not in-game), and mouse-button chords never fire while the pointer is
  // over this window (such a click never reaches the game).
  useEffect(() => {
    const onFocus = () => void setAppFocused(true);
    const onBlur = () => void setAppFocused(false);
    const onPointerEnter = () => void setPointerInApp(true);
    const onPointerLeave = () => void setPointerInApp(false);
    void setAppFocused(document.hasFocus());
    window.addEventListener("focus", onFocus);
    window.addEventListener("blur", onBlur);
    document.addEventListener("mouseenter", onPointerEnter);
    document.addEventListener("mouseleave", onPointerLeave);
    return () => {
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("blur", onBlur);
      document.removeEventListener("mouseenter", onPointerEnter);
      document.removeEventListener("mouseleave", onPointerLeave);
    };
  }, []);

  const selectedLoadout = useMemo(
    () => loadouts.find((l) => l.id === selectedId) ?? null,
    [loadouts, selectedId],
  );
  const activeLoadout = useMemo(
    () => loadouts.find((l) => l.id === activeId) ?? null,
    [loadouts, activeId],
  );

  const stratagemById = useMemo(
    () => new Map((stratagems ?? []).map((s) => [s.id, s])),
    [stratagems],
  );
  const stratagemFor = useCallback(
    (binding: Binding) => stratagemById.get(binding.stratagemId),
    [stratagemById],
  );

  // ── engine arming helpers ──
  const rearm = useCallback(
    (loadout: Loadout, directionKeys: AppSettings["directionKeys"]) => {
      const config = buildActivationConfig(loadout, stratagemById, directionKeys);
      activateBackend(config).catch((err) => {
        pushToast(`RE-ARM FAILED: ${errMsg(err)}`, "danger");
      });
    },
    [stratagemById, pushToast],
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
    if (activeId === loadoutId) {
      // Never keep emitting after the armed loadout is gone.
      deactivateBackend().catch(() => {
        /* backend already idle */
        pushToast("DELETE LOADOUT DEACTIVATE BACKEND", "danger");
      });
      setActiveId(null);
    }
    const remaining = loadouts.filter((l) => l.id !== loadoutId);
    setLoadouts(remaining);
    if (selectedId === loadoutId) setSelectedId(remaining[0]?.id ?? null);
    setModal(null);
    pushToast("LOADOUT PURGED FROM MANIFEST", "danger");
  };

  const activateLoadout = (id: string) => {
    const loadout = loadouts.find((l) => l.id === id);
    if (!loadout) return;
    if (loadout.bindings.length === 0) {
      pushToast("CANNOT ARM — LOADOUT HAS NO BINDINGS", "danger");
      return;
    }
    const config = buildActivationConfig(
      loadout,
      stratagemById,
      settings.directionKeys,
    );
    activateBackend(config)
      .then(() => {
        setActiveId(id);
        setSelectedId(id);
        pushToast(`LOADOUT DEPLOYED — "${loadout.name}" ARMED`);
      })
      .catch((err) => {
        pushToast(`ARMING FAILED: ${errMsg(err)}`, "danger");
      });
  };

  const disarm = () => {
    deactivateBackend().catch(() => {
      /* backend already idle */
      pushToast("DISARM DEACTIVATE BACKEND", "danger");
    });
    setActiveId(null);
    pushToast("AUTOTHROW DISARMED — SYSTEM ON STANDBY", "warn");
  };

  const updateSettings = (next: AppSettings) => {
    // Store the server location trimmed; empty = use the app default.
    const updated: AppSettings = { ...next, serverUrl: next.serverUrl.trim() };
    const serverChanged = updated.serverUrl !== settings.serverUrl;
    setSettings(updated);
    setModal(null);
    // Re-arm with the new direction keys so the engine stays in sync.
    if (activeLoadout) rearm(activeLoadout, updated.directionKeys);
    if (serverChanged) {
      // The uplink target moved — re-fetch the stratagem database from it.
      pushToast("SERVER LOCATION CHANGED — REESTABLISHING UPLINK", "warn");
      void boot(updated.serverUrl);
    } else {
      pushToast("INPUT MAPPING SAVED");
    }
  };

  // ── binding CRUD ──
  const saveBinding = (draft: BindingDraft) => {
    if (modal?.kind !== "binding" || !draft.stratagemId) return;
    const { loadoutId, bindingId } = modal;
    const { combo, stratagemId } = draft;
    const next = loadouts.map((l) => {
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
    });
    setLoadouts(next);
    const updated = next.find((l) => l.id === loadoutId);
    if (activeId === loadoutId && updated) {
      rearm(updated, settings.directionKeys);
    }
    setModal(null);
    pushToast(bindingId ? "BINDING UPDATED" : "BINDING ADDED TO LOADOUT");
  };

  const deleteBinding = () => {
    if (modal?.kind !== "deleteBinding") return;
    const { loadoutId, bindingId } = modal;
    const next = loadouts.map((l) =>
      l.id === loadoutId
        ? {
            ...l,
            updatedAt: Date.now(),
            bindings: l.bindings.filter((b) => b.id !== bindingId),
          }
        : l,
    );
    setLoadouts(next);
    const updated = next.find((l) => l.id === loadoutId);
    if (activeId === loadoutId && updated) {
      rearm(updated, settings.directionKeys);
    }
    setModal(null);
    pushToast("BINDING REMOVED", "warn");
  };

  // ── boot / locked-out screens ──
  if (syncStatus === "loading") {
    return (
      <div className="app">
        <BootScreen
          key="loading"
          status="loading"
          onRetry={() => void boot()}
        />
        <FxLayers />
      </div>
    );
  }

  if (syncStatus === "error" || stratagems === null) {
    // The configured server location, or the app default when none is set —
    // shown in the error screen's editor so the user can repoint the uplink.
    // (Keyed so the editor re-seeds from `serverUrl` each time we get here.)
    const currentServerUrl = settings.serverUrl.trim() || defaultServerUrl;
    return (
      <div className="app">
        <BootScreen
          key="error"
          status="error"
          message={syncError}
          serverUrl={currentServerUrl}
          onRetry={(url) => {
            // Remember what was typed so the next launch (and this retry)
            // targets the same server.
            setSettings((prev) => ({ ...prev, serverUrl: url }));
            void boot(url);
          }}
        />
        <FxLayers />
      </div>
    );
  }

  // ── main UI ──
  return (
    <div className="app">
      <Header
        inputs={inputs}
        activeLoadout={activeLoadout}
        offline={syncStatus === "offline"}
        onOpenSettings={() => setModal({ kind: "settings" })}
        onDisarm={disarm}
      />

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
              stratagems={stratagems}
              onSave={saveBinding}
              onClose={() => setModal(null)}
            />
          );
        })()}

      {modal?.kind === "settings" && (
        <SettingsModal
          settings={settings}
          defaultServerUrl={defaultServerUrl}
          onSave={updateSettings}
          onClose={() => setModal(null)}
        />
      )}

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
            ? stratagemById.get(binding.stratagemId)
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

      <FxLayers />
    </div>
  );
}
