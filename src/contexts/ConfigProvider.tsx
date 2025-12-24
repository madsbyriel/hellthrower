import { invoke } from "@tauri-apps/api/core";
import { createContext, ReactNode, useEffect, useState } from "react";

export const ConfigContext = createContext<Config | null>(null);

export class Config {
    name: string;

    constructor() {
        this.name = ""
    }
}

export default function ConfigProvider({ children }): ReactNode {
    const [config, setConfig] = useState<Config | null>(null)
    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {
      async function getConfig() {
        setConfig(JSON.parse(await invoke("get_config")));
      }
      getConfig();
    }, []);

    return (
        <ConfigContext.Provider value={config}>
          { children }
        </ConfigContext.Provider>
    );
}
