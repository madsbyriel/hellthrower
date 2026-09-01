import type { Toast } from "../types";
import { IconAlert, IconBolt, IconCheck } from "./icons";

const ICONS = {
  ok: <IconCheck size={16} />,
  warn: <IconBolt size={16} />,
  danger: <IconAlert size={16} />,
};

export function Toasts({ toasts }: { toasts: Toast[] }) {
  return (
    <div className="toasts" aria-live="polite">
      {toasts.map((t) => (
        <div className={`toast ${t.kind}`} key={t.id}>
          <span className="toast-icon">{ICONS[t.kind]}</span>
          <div className="toast-body">
            <span className="toast-label">SYSTEM</span>
            <span className="toast-message">{t.message}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
