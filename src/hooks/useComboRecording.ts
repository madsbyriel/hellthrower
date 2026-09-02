import { useEffect, useRef, useState } from "react";
import { listen, type UnlistenFn } from "@tauri-apps/api/event";
import { cancelComboRecording, startComboRecording } from "../lib/keys";

interface RecordUpdatePayload {
  pressed: string[];
}

interface RecordCompletePayload {
  combo: string[];
}

interface RecordErrorPayload {
  message: string;
}

/**
 * Drive a keyrs-backed combo recording session from the UI.
 *
 * `start()` asks the Rust backend to capture a chord; live key state
 * streams into `draft`, and `onComplete` fires once every key has been
 * released. Only one session can exist at a time (backend-enforced).
 */
export function useComboRecording(onComplete: (combo: string[]) => void) {
  const [recording, setRecording] = useState(false);
  const [draft, setDraft] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;
  const unlistenRef = useRef<UnlistenFn[]>([]);
  const disposedRef = useRef(false);

  const stopListening = () => {
    for (const fn of unlistenRef.current) fn();
    unlistenRef.current = [];
  };

  const start = async () => {
    setError(null);
    try {
      await startComboRecording();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      return;
    }
    if (disposedRef.current) {
      // Unmounted while the backend call was in flight.
      cancelComboRecording().catch(() => {
        /* backend already idle */
      });
      return;
    }
    stopListening();
    setDraft([]);
    setRecording(true);

    const fns: UnlistenFn[] = [];
    const subscriptions: Array<[string, (event: unknown) => void]> = [
      ["keyrs-record-update", (event: unknown) => {
        setDraft((event as { payload: RecordUpdatePayload }).payload.pressed);
      }],
      ["keyrs-record-complete", (event: unknown) => {
        stopListening();
        setRecording(false);
        setDraft([]);
        onCompleteRef.current(
          (event as { payload: RecordCompletePayload }).payload.combo,
        );
      }],
      ["keyrs-record-error", (event: unknown) => {
        stopListening();
        setRecording(false);
        setError((event as { payload: RecordErrorPayload }).payload.message);
      }],
    ];
    for (const [event, handler] of subscriptions) {
      try {
        const fn = await listen(event, handler);
        if (disposedRef.current) {
          fn();
          cancelComboRecording().catch(() => {
            /* backend already idle */
          });
          return;
        }
        fns.push(fn);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
        return;
      }
    }
    unlistenRef.current = fns;
  };

  const cancel = () => {
    stopListening();
    setRecording(false);
    setDraft([]);
    cancelComboRecording().catch(() => {
      /* backend already idle */
    });
  };

  // Cancel the backend session if the component unmounts mid-recording.
  useEffect(() => {
    disposedRef.current = false;
    return () => {
      disposedRef.current = true;
      stopListening();
      cancelComboRecording().catch(() => {
        /* backend already idle */
      });
    };
  }, []);

  return { recording, draft, error, start, cancel };
}
