import { useCallback, useMemo, useState } from "react";
import { STRATAGEM_BY_ID } from "../data/stratagems";
import type { Binding, ComboToken } from "../types";
import { KeyRecorder } from "./KeyRecorder";
import { Modal } from "./Modal";
import { StratagemPicker } from "./StratagemPicker";

export interface BindingDraft {
  combo: ComboToken[];
  stratagemId: string | null;
}

export function BindingEditor({
  initial,
  otherBindings,
  onSave,
  onClose,
}: {
  initial: BindingDraft;
  otherBindings: Binding[];
  onSave: (draft: BindingDraft) => void;
  onClose: () => void;
}) {
  const [combo, setCombo] = useState<ComboToken[]>(initial.combo);
  const [stratagemId, setStratagemId] = useState<string | null>(
    initial.stratagemId,
  );

  const handleCombo = useCallback((next: ComboToken[]) => setCombo(next), []);

  const conflicts = useMemo(
    () => otherBindings.map((b) => b.combo),
    [otherBindings],
  );

  const selected = stratagemId ? STRATAGEM_BY_ID.get(stratagemId) : undefined;
  const valid = combo.length > 0 && stratagemId !== null;

  return (
    <Modal
      title={initial.combo.length > 0 ? "EDIT BINDING" : "ADD BINDING"}
      subtitle={`MAP A KEY COMBINATION TO A STRATAGEM${selected ? ` — ${selected.name.toUpperCase()}` : ""}`}
      onClose={onClose}
      wide
      labelledBy="binding-editor-title"
      footer={
        <>
          <button className="btn" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn primary"
            disabled={!valid}
            onClick={() =>
              valid && onSave({ combo, stratagemId })
            }
          >
            {initial.combo.length > 0 ? "Save Binding" : "Add Binding"}
          </button>
        </>
      }
    >
      <div className="binding-editor">
        <div className="binding-editor-combo">
          <KeyRecorder value={combo} onChange={handleCombo} conflicts={conflicts} />
          <div className="editor-summary">
            <span className="summary-label">OUTPUT</span>
            <span className="summary-value">
              {selected ? selected.name : "NO STRATAGEM SELECTED"}
            </span>
          </div>
        </div>
        <div className="binding-editor-picker">
          <span className="picker-section-label">1 — CHOOSE ORDNANCE</span>
          <StratagemPicker selectedId={stratagemId} onSelect={setStratagemId} />
        </div>
      </div>
    </Modal>
  );
}
