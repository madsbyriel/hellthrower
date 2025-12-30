import { HashRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Layout from "./components/Layout";
import { useConfigProvider } from "./contexts/ConfigProvider";
import { Container } from "react-bootstrap";
import NameForm from "./components/NameForm";
import { useEffect, useState } from "react";
import CreateLoadoutPage from "./pages/CreateLoadoutPage";
import ViewLoadoutPage from "./pages/ViewLoadoutPage";
import EditLoadoutPage from "./pages/EditLoadoutPage";
import ActivateLoadoutPage from "./pages/ActivateLoadoutPage";
import { Loadout } from "./components/Types";
import ActivatedLoadoutPage from "./pages/ActivatedLoadoutPage";
import { invoke } from "@tauri-apps/api/core";

function App() {
    const { config } = useConfigProvider();

    const hasError = config.error != undefined && config.error.trim().length != 0;
    const hasName = config.name != undefined && config.name.trim().length != 0;

    const [activatedLoadout, setActivatedLoadout] = useState<Loadout | undefined>(undefined);

    useEffect(() => {
        const preventNavigation = (e: any) => {
            // Mouse button 3 = back, button 4 = forward
            if (e.button === 3 || e.button === 4) {
                e.preventDefault();
            }
        };

        window.addEventListener('mouseup', preventNavigation);

        return () => {
            window.removeEventListener('mouseup', preventNavigation);
        };
    }, []);

    const onLoadoutActivated = async (index: number) => {
        setActivatedLoadout(config.loadouts[index]);
        console.log("starting listener");
        await invoke("start_listening", { loadoutS: JSON.stringify(config.loadouts[index]) })
    }
    const deactivateLoadout = async () => {
        setActivatedLoadout(undefined);
        await invoke("stop_listener");
    }

    return <>
        {activatedLoadout == undefined ? <>
            {hasError ?
                <h1>{config.error}</h1>
            : <>
                {!hasName ? <>
                    <Container className="p-5">
                        <NameForm />
                    </Container>
                </> : <>
                    <HashRouter>
                        <Routes>
                            <Route element={<Layout />}>
                                <Route path="/" element={<Home />} />
                                <Route path="/create_loadout" element={<CreateLoadoutPage />} />
                                <Route path="/view_loadout" element={<ViewLoadoutPage />} />
                                <Route path="/edit_loadout" element={<EditLoadoutPage />} />
                                <Route path="/activate_loadout" element={<ActivateLoadoutPage onActivate={onLoadoutActivated} />}/>
                            </Route>
                        </Routes>
                    </HashRouter>
                </>}
            </>}
        </> : <>
            <ActivatedLoadoutPage loadout={activatedLoadout} onDeactivate={() => deactivateLoadout()} />
        </>}
    </>
}

export default App;
