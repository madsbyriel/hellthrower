import { useEffect, useState } from "react";
import { Emblem } from "./Emblem";
import { IconAlert } from "./icons";

/**
 * Full-screen boot UI: a linking splash while the stratagem database syncs,
 * or a locked-out error screen when there is no data and no connection.
 *
 * The error screen doubles as the escape hatch for a dead server: it lets
 * the user edit the Stratbase server location before retrying, so the app
 * can be pointed at a server that moved without leaving the user locked out.
 */
export function BootScreen({
  status,
  message,
  serverUrl,
  onRetry,
}: {
  status: "loading" | "error";
  message?: string | null;
  /** Current Stratbase server location, seeded into the editor on the error screen. */
  serverUrl?: string;
  onRetry: (url: string) => void;
}) {
  const [draftUrl, setDraftUrl] = useState(serverUrl ?? "");
  const [touched, setTouched] = useState(false);

  // Seed the editor from the prop (e.g. when the app-default location
  // resolves late) — but never clobber what the user is typing.
  useEffect(() => {
    if (!touched) setDraftUrl(serverUrl ?? "");
  }, [serverUrl, touched]);

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

        <form
          className="boot-error-form"
          onSubmit={(e) => {
            e.preventDefault();
            onRetry(draftUrl.trim());
          }}
        >
          <label className="boot-server-label" htmlFor="boot-server-url">
            SERVER LOCATION
          </label>
          <div className="boot-server-row">
            <input
              id="boot-server-url"
              className="server-url-input"
              type="text"
              value={draftUrl}
              onChange={(e) => {
                setDraftUrl(e.target.value);
                setTouched(true);
              }}
              placeholder="http://localhost:8000"
              spellCheck={false}
              autoCorrect="off"
              autoCapitalize="none"
            />
            {draftUrl.trim() !== "" && (
              <button
                type="button"
                className="btn"
                onClick={() => setDraftUrl("")}
                title="Point the uplink at the app's default Stratbase location"
              >
                Use Default
              </button>
            )}
            <button type="submit" className="btn primary">
              Retry Connection
            </button>
          </div>
          <p className="boot-hint">
            POINT THE UPLINK AT YOUR STRATBASE SERVER, THEN RETRY. LEAVING
            THE FIELD EMPTY USES THE APP DEFAULT.
          </p>
        </form>

        <p className="boot-hint">
          THE APP WILL REMAIN LOCKED UNTIL STRATBASE CAN BE REACHED.
        </p>
      </div>
    </div>
  );
}
