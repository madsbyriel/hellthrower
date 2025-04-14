import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import { LoadoutContext } from "./LoadoutContext.tsx";
import { Badge } from "react-bootstrap";

interface LoadoutProps {
  loadoutId: number;
}

export default function LoadoutPage() {
  const { id } = useParams();
  const numbersId = Number(id);
  const loadoutContext = useContext(LoadoutContext);

  const errorElement = (
    <>
      <h1>Something went wrong!</h1>
    </>
  );

  if (loadoutContext == undefined) return errorElement;

  let loadout = undefined;
  for (const l of loadoutContext.loadouts) {
    if (l.id === numbersId) {
      loadout = l;
      break;
    }
  }
  if (loadout == undefined) return errorElement;

  const testClick = (event: MouseEvent<HTMLElement, MouseEvent>) => {
    event.preventDefault();

    loadout.stratagemBindings.push({
      name: "Asd",
    });
    loadoutContext.setLoadouts([...loadoutContext.loadouts]);
  };

  const m = loadout.stratagemBindings.map((e) => (
    <>
      <h5>{e.name}</h5>
    </>
  ));

  return (
    <>
      <h1>{loadout.name}</h1>
      <Badge onClick={testClick}>
        Press
      </Badge>
      {m}
    </>
  );
}
