import { useState } from "react";
import EditLoadout from "../components/EditLoadout";
import { Loadout } from "../components/Types";
import { useConfigProvider } from "../contexts/ConfigProvider";
import { useNavigate } from "react-router-dom";

export default function CreateLoadoutPage() {
    const [loadout, setLoadout] = useState(new Loadout());
    const { config, saveConfig, setConfig } = useConfigProvider();
    const navigate = useNavigate();

    const onLoadoutUpdated = (loadout: Loadout) => {
        setLoadout(loadout);
    }
    
    const onLoadoutCreated = (loadout: Loadout) => {
        setLoadout(loadout);

        let c = {... config, loadouts: [... config.loadouts, loadout]};
        setConfig(c);
        saveConfig(c);

        navigate("/")
    }

    return <>
        <EditLoadout 
            readonly={false}
            loadout={loadout}
            onLoadoutCreated={onLoadoutCreated}
            onLoadoutUpdated={onLoadoutUpdated} />
    </>
}
