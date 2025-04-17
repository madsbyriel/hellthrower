import { createContext, useState } from "react";
import { Stratagem } from "../components/StratagemContext.tsx";

export interface LoadoutContextType {
  loadouts: Loadout[];
  addLoadout: (name: string) => string;
  setLoadouts: (value: React.SetStateAction<Loadout[]>) => void;
  updateLoadouts: () => void;
}

export interface Loadout {
  name: string;
  id: number;
  stratagemBindings: StratagemBinding[];
}

export interface StratagemBinding {
  stratagem: Stratagem;
  bindings: Binding[];
}

export interface Binding {
    id: number;
    key: any;
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

  const updateLoadouts = () => {
      setLoadouts([...loadouts])
  }

  return {
    addLoadout: addLoadout,
    setLoadouts: setLoadouts,
    updateLoadouts: updateLoadouts,
    loadouts: loadouts,
  }
}

export const LoadoutContext = createContext<LoadoutContextType | undefined>(undefined)
