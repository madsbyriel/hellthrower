import { useSearchParams } from "react-router-dom"
import { useConfigProvider } from "../contexts/ConfigProvider"
import EditLoadout from "../components/EditLoadout"

export default function ViewLoadoutPage()
{
    const [searchParams] = useSearchParams()
    const { config } = useConfigProvider()

    const idx_s = searchParams.get('index')
    const index = idx_s == null ? 0 : parseInt(idx_s)
    const loadout = config.loadouts[index];

    return <EditLoadout
            loadout={loadout}
            onLoadoutCreated={(_) => {}}
            onLoadoutUpdated={(_) => {}}
            readonly={true}
            key={index}
        />
}
