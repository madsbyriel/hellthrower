import { HashRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Layout from "./components/Layout";
import Loadouts from "./pages/Loadouts";
import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Config } from "./contexts/ConfigProvider";
import { Container } from "react-bootstrap";
import NameForm from "./components/NameForm";

function App() {
  const [configRaw, setRawConfig] = useState("");

  useEffect(() => {
      async function getConfig() {
          setRawConfig(await invoke("get_config"))
      }
      getConfig()
  }, [])

  let canParseToConfig = false;
  let config: Config;
  try {
    config = JSON.parse(configRaw);
    canParseToConfig = true;
  }
  catch {}

  let canParseToError = false;
  let error: ConfigError | null = null;
  if (!canParseToConfig)
  {
    try {
      error = JSON.parse(configRaw);
      canParseToError = true;
    }
    catch {}
  }

  let isEmpty = false;
  if (!canParseToError)
  {
    isEmpty = configRaw.trim().length == 0
  }


  return (
    canParseToConfig ?
      <HashRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/loadouts" element={<Loadouts />} />
          </Route>
        </Routes>
      </HashRouter>
    : canParseToError ?
      <h1>{error?.error}</h1>
    : isEmpty ?
      <Container className="p-5">
        <h1>Hello fellow Helldiver! What would you like to be called?</h1>
        <NameForm />
      </Container>
    :
      <h1>Unknown error state</h1>
  );
}

class ConfigError {
    error: string;
    constructor() {
        this.error = "";
    }
}

export default App;
