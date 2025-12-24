import { Outlet } from "react-router-dom";
import BootstrapNavbar from "./Navbar";
import ConfigProvider from "../contexts/ConfigProvider";

export default function Layout() {
  return (
    <main>
      <BootstrapNavbar />
      <Outlet /> {/* Child routes render here */}
    </main>
  );
}
