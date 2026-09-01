import { IconAlert, IconTrash } from "./icons";
import { Modal } from "./Modal";

export function ConfirmDialog({
  title,
  message,
  confirmLabel,
  detail,
  onConfirm,
  onClose,
}: {
  title: string;
  message: string;
  confirmLabel: string;
  detail?: string;
  onConfirm: () => void;
  onClose: () => void;
}) {
  return (
    <Modal
      title={title}
      subtitle="COMMAND CONFIRMATION REQUIRED"
      tone="danger"
      onClose={onClose}
      labelledBy="confirm-dialog-title"
      footer={
        <>
          <button className="btn" onClick={onClose}>
            Cancel
          </button>
          <button className="btn danger solid" onClick={onConfirm}>
            <IconTrash size={14} />
            {confirmLabel}
          </button>
        </>
      }
    >
      <div className="confirm-body">
        <span className="confirm-icon">
          <IconAlert size={26} />
        </span>
        <p className="confirm-message">{message}</p>
        {detail && <p className="confirm-detail">{detail}</p>}
      </div>
    </Modal>
  );
}
