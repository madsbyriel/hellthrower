import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { HashRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Layout from "./components/Layout";
import Loadouts from "./pages/Loadouts";

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    setGreetMsg(await invoke("press_enter"));
  }

  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/loadouts" element={<Loadouts />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
