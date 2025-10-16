import { NavLink, useNavigate } from "react-router-dom";
import {
  CalendarDays, 
  BanknoteArrowUp,
  ChartColumnStacked,
  CalendarSearch,
  X, 
  LogOut,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

export default function SidebarAdmin({ isOpen, onClose }) { 
  const { logout } = useAuth(); 
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    onClose(); 
    navigate('/login'); 
  };
  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <ChartColumnStacked size={24} /> },
    { name: "Calendario", path: "/admin/calendario", icon: <CalendarDays size={24} /> },
    { name: "Reservas", path: "/admin/reservas", icon: <CalendarSearch size={24} /> },
    { name: "Pagos", path: "/admin/pagos", icon: <BanknoteArrowUp size={24} /> },
  ];

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/50 z-30 transition-opacity lg:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      <aside
        className={`fixed top-0 left-0 h-full w-64 shadow-lg border-r z-40 transition-transform transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
        style={{ backgroundColor: "#D2B074", border: "None" }}
      >
        <div className="flex items-center justify-between h-20 px-4">
          <div className="flex items-center">
            <div className="w-12 h-12 mr-2 bg-gradient-to-br from-amber-900 to-orange-950 rounded-full flex items-center justify-center">
              <img src="/src/assets/img/logo.png" alt="logo" className="w-11 h-11 object-cover" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-amber-900 to-orange-950 bg-clip-text text-transparent">
                Casa Chetumal
              </h1>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden text-amber-800">
            <X size={24} />
          </button>
        </div>

        <nav className="mt-6 flex flex-col">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={onClose} 
              className={({ isActive }) =>
                `flex items-center justify-between px-6 py-3 text-lg font-medium transition-all duration-200 ${
                  isActive
                    ? "text-white bg-[#d3a24dff] border-r-4 border-white"
                    : "text-amber-800 hover:bg-[#d3a24dff]/50"
                }`
              }
            >
              <span>{item.name}</span>
              <div>{item.icon}</div>
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto p-4">
          <button
            onClick={handleLogout}
            className="flex items-center justify-between w-full px-6 py-3 text-lg font-medium text-red-800 hover:bg-red-200/50 rounded-lg transition-all duration-200"
          >
            <span>Cerrar Sesión</span>
            <div><LogOut size={24} /></div>
          </button>
        </div>
      </aside>
    </>
  );
}