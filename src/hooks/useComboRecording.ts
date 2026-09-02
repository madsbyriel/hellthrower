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
    stopListening();
    setDraft([]);
    setRecording(true);
    unlistenRef.current = [
      await listen<RecordUpdatePayload>("keyrs-record-update", (event) => {
        setDraft(event.payload.pressed);
      }),
      await listen<RecordCompletePayload>("keyrs-record-complete", (event) => {
        stopListening();
        setRecording(false);
        setDraft([]);
        onCompleteRef.current(event.payload.combo);
      }),
      await listen<RecordErrorPayload>("keyrs-record-error", (event) => {
        stopListening();
        setRecording(false);
        setError(event.payload.message);
      }),
    ];
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
  useEffect(
    () => () => {
      stopListening();
      cancelComboRecording().catch(() => {
        /* backend already idle */
      });
    },
    [],
  );

  return { recording, draft, error, start, cancel };
}
