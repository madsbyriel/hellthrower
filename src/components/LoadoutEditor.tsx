import { useState, type FormEvent } from "react";
import { Modal } from "./Modal";

export interface LoadoutDraft {
  name: string;
  description: string;
}

export function LoadoutEditor({
  initial,
  onSave,
  onClose,
}: {
  initial: LoadoutDraft;
  onSave: (draft: LoadoutDraft) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState(initial.name);
  const [description, setDescription] = useState(initial.description);
  const [touched, setTouched] = useState(false);
  const error = name.trim().length === 0;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (error) return;
    onSave({ name: name.trim(), description: description.trim() });
  };

  return (
    <Modal
      title={initial.name ? "EDIT LOADOUT" : "NEW LOADOUT"}
      subtitle="LOADOUT MANIFEST ENTRY"
      onClose={onClose}
      labelledBy="loadout-editor-title"
      footer={
        <>
          <button className="btn" onClick={onClose}>
            Cancel
          </button>
          <button className="btn primary" onClick={submit} disabled={error && touched}>
            {initial.name ? "Save Changes" : "Create Loadout"}
          </button>
        </>
      }
    >
      <form className="editor-form" onSubmit={submit}>
        <label className="field" htmlFor="loadout-name">
          <span className="field-label">
            LOADOUT DESIGNATION <span className="required">*</span>
          </span>
          <input
            id="loadout-name"
            type="text"
            autoFocus
            placeholder="E.G. AUTOMATON FRONTLINE"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => setTouched(true)}
            aria-invalid={error && touched}
          />
          {error && touched && (
            <span className="field-error">DESIGNATION REQUIRED, SOLDIER.</span>
          )}
        </label>

        <label className="field" htmlFor="loadout-desc">
          <span className="field-label">OPERATIONAL NOTES</span>
          <textarea
            id="loadout-desc"
            rows={3}
            placeholder="Optional — describe when and where this loadout gets deployed…"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
      </form>
    </Modal>
  );
}
