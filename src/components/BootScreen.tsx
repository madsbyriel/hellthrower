import { Emblem } from "./Emblem";
import { IconAlert } from "./icons";

/**
 * Full-screen boot UI: a linking splash while the stratagem database syncs,
 * or a locked-out error screen when there is no data and no connection.
 */
export function BootScreen({
  status,
  message,
  onRetry,
}: {
  status: "loading" | "error";
  message?: string | null;
  onRetry: () => void;
}) {
  if (status === "loading") {
    return (
      <div className="boot-screen">
        <span className="boot-emblem">
          <Emblem size={96} />
        </span>
        <h1 className="boot-title">ESTABLISHING UPLINK</h1>
        <p className="boot-sub">
          SYNCING STRATAGEM DATABASE FROM STRATBASE…
        </p>
        <span className="boot-bar" aria-hidden="true">
          <span className="boot-bar-scan" />
        </span>
      </div>
    );
  }

  return (
    <div className="boot-screen">
      <div className="boot-error-panel">
        <span className="boot-error-icon">
          <IconAlert size={32} />
        </span>
        <h1 className="boot-title danger">STRATBASE LINK FAILED</h1>
        <p className="boot-sub">
          NO STRATAGEM DATABASE AVAILABLE. A CONNECTION IS REQUIRED TO
          PROCEED.
        </p>
        {message && <pre className="boot-error-detail">{message}</pre>}
        <button className="btn primary" onClick={onRetry}>
          Retry Connection
        </button>
        <p className="boot-hint">
          THE APP WILL REMAIN LOCKED UNTIL STRATBASE CAN BE REACHED.
        </p>
      </div>
    </div>
  );
}
