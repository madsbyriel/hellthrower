import { useNavigate, useSearchParams } from "react-router-dom";
import { useConfigProvider } from "../contexts/ConfigProvider";
import EditLoadout from "../components/EditLoadout";
import { Loadout } from "../components/Types";
import { useState } from "react";

export default function EditLoadoutPage() {
    const [searchParams] = useSearchParams()
    const { config, setConfig, saveConfig } = useConfigProvider()
    const navigate = useNavigate()

    const idx_s = searchParams.get('index')
    const index = idx_s == null ? 0 : parseInt(idx_s)
    const [loadout, setLoadout] = useState(config.loadouts[index]);

    const onLoadoutCreated = (loadout: Loadout) => {
        setLoadout(loadout)

        config.loadouts[index] = loadout;
        let c = {... config };
        setConfig(c)
        saveConfig(c)

        navigate('/')
    }

    const onLoadoutUpdated = (loadout: Loadout) => {
        setLoadout(loadout)
    }

    return <EditLoadout
        loadout={loadout}
        onLoadoutCreated={onLoadoutCreated}
        onLoadoutUpdated={onLoadoutUpdated}
        readonly={false}
        key={index}
    />
}
