import { Outlet } from "react-router-dom";
import NavbarAdmin from "../components/NavbarAdmin.jsx";
import SidebarAdmin from "../components/SidebarAdmin.jsx";

export default function AdminLayout() {
  return (
    <div className="flex">
      <SidebarAdmin />
      <div className="flex-1 pl-64"> 
        <NavbarAdmin />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
