import { invoke } from "@tauri-apps/api/core";
import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useMemo, useState } from "react";
import { Stratagem } from "../components/Types";

const StratagemContext = createContext<StratagemService | undefined>(undefined);

export interface StratagemService
{
  stratagems: Stratagem[];
}

export default function StratagemProvider({ children }): ReactNode {
    const [stratagems, setStratagems] = useState<Stratagem[]>([])

    useEffect(() => {
      async function getStratagems() {
        setStratagems(JSON.parse(await invoke("stratagems")));
      }
      getStratagems();
    }, []);

    const service: StratagemService = useMemo(() => ({
        stratagems: stratagems,
    }), [stratagems])

    return (
        <StratagemContext.Provider value={service}>
          { children }
        </StratagemContext.Provider>
    );
}

export function useStratagemProvider(): StratagemService {
    const service = useContext(StratagemContext);
    if (service == undefined)
        throw "Config not loaded";

    return service;
}
