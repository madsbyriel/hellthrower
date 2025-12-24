import { useContext } from "react";
import { ConfigContext } from "../contexts/ConfigProvider";

export default function Loadouts() {
  const config = useContext(ConfigContext)
  if (config == null) return <h1>Config not loaded</h1>

  return (
      <>
        <h1>Loadouts:</h1>
        <h1>{config.name}</h1>
      </>
  );
}
