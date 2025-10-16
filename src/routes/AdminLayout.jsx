import React, { useState } from 'react';
import { Outlet } from "react-router-dom";
import SidebarAdmin from "../components/SidebarAdmin.jsx"; 
import { Menu } from 'lucide-react';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-gray-100">
      <SidebarAdmin isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 transition-all duration-300 lg:pl-64"> 
        <div className="lg:hidden p-4 flex justify-between items-center bg-white shadow-md">
           <h1 className="text-xl font-bold text-amber-800">Panel de Admin</h1>
           <button onClick={() => setSidebarOpen(true)}>
            <Menu size={28} className="text-gray-700" />
          </button>
        </div>
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}