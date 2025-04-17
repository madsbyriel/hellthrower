import { useParams } from "react-router";
import { useContext } from "react";
import { Loadout, LoadoutContext } from "../pages/LoadoutContext.tsx";
import React from "react";
import LoadoutPage from "../pages/LoadoutPage.tsx";

const LoadoutRouter: () => React.JSX.Element = () => {
    const errorMessage = <h1>Something went wrong!</h1>

    const { id } = useParams();
    let numberId = 0;
    try {
        numberId = Number(id);
    }
    catch (_e) {
        return errorMessage;
    }

    const loadoutContext = useContext(LoadoutContext);
    if (loadoutContext == undefined || id == undefined) return errorMessage;

    let loadout: Loadout | undefined = undefined;
    for (const l of loadoutContext.loadouts) {
        if (l.id == numberId) {
            loadout = l;
            break;
        }
    }
    if (loadout == undefined) return errorMessage;

    return LoadoutPage(loadout)
}

export default LoadoutRouter;
