import { invoke } from "@tauri-apps/api/core";
import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useMemo, useState } from "react";
import { Config } from "../components/Types";

const ConfigContext = createContext<ConfigService | undefined>(undefined);

export interface ConfigService
{
  config: Config;
  setConfig: Dispatch<SetStateAction<Config>>;
  saveConfig: (config: Config) => Promise<void>
}

export default function ConfigProvider({ children }): ReactNode {
    const [config, setConfig] = useState<Config>({ name: "", error: "", loadouts: [] })

    useEffect(() => {
      async function getConfig() {
        setConfig(JSON.parse(await invoke("get_config")));
      }
      getConfig();
    }, []);

    async function saveConfig(config: Config) {
        let configString = JSON.stringify(config);
        await invoke("save_config", { config: configString } )
    }

    const service: ConfigService = useMemo(() => ({
        config,
        setConfig: setConfig,
        saveConfig: saveConfig,
    }), [config])

    return (
        <ConfigContext.Provider value={service}>
          { children }
        </ConfigContext.Provider>
    );
}

export function useConfigProvider(): ConfigService {
    const service = useContext(ConfigContext);
    if (service == undefined)
        throw "Config not loaded";

    return service;
}
