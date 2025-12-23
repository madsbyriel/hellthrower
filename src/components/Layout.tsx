import { Link, Outlet } from "react-router-dom";
import BootstrapNavbar from "./Navbar";

export default function Layout() {
  return (
    <main>
      <BootstrapNavbar />
      <Outlet /> {/* Child routes render here */}
    </main>
  );
}
