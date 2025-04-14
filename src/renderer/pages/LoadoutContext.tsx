import { createContext, useState } from "react";

interface LoadoutContextType {
  loadouts: Loadout[];
  addLoadout: (name: string) => string;
  setLoadouts: (value: React.SetStateAction<Loadout[]>) => void
}

interface Loadout {
  name: string;
  id: number,
  stratagemBindings: StratagemBinding[];
}

interface StratagemBinding {
  name: string
}

export function defaultLoadoutContext(): LoadoutContextType {
  const [loadouts, setLoadouts] = useState<Loadout[]>([]);

  const addLoadout = (name: string) => {
    if (loadouts?.some(l => l.name.toLowerCase() == name.toLowerCase())) {
      return "A loadout with this name already exists!"
    }

    const newLoadout: Loadout = {
      id: Math.max(0, ...loadouts.map(l => l.id)) + 1,
      name: name,
      stratagemBindings: [],
    }

    setLoadouts([...loadouts, newLoadout])
    return ""
  }

  return {
    addLoadout: addLoadout,
    setLoadouts: setLoadouts,
    loadouts: loadouts,
  }
}

export const LoadoutContext = createContext<LoadoutContextType | undefined>(undefined)
