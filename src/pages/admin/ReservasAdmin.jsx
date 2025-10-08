import React, { useState } from "react";
import {
  ChevronDown,
  Filter,
  Calendar,
  User,
  Package,
  Menu,
  X,
} from "lucide-react";

const ReservasComponent = () => {
  const [activeFilter, setActiveFilter] = useState("Todos los estados");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const reservas = [
    {
      cliente: "Juan Pérez",
      fecha: "10 de Mayo 2024",
      paquete: "Premium",
      estado: "Confirmado",
      color: "blue",
    },
    {
      cliente: "Laura Gómez",
      fecha: "18 de Mayo 2024",
      paquete: "Básico",
      estado: "Pendiente",
      color: "yellow",
    },
    {
      cliente: "Carlos Sánchez",
      fecha: "25 de Mayo 2024",
      paquete: "Lujo",
      estado: "Pagado",
      color: "green",
    },
    {
      cliente: "María López",
      fecha: "3 de Junio 2024",
      paquete: "Básico",
      estado: "Cancelado",
      color: "red",
    },
    {
      cliente: "José Martínez",
      fecha: "12 de Junio 2024",
      paquete: "Premium",
      estado: "Confirmado",
      color: "blue",
    },
    {
      cliente: "Ana Rodríguez",
      fecha: "20 de Junio 2024",
      paquete: "Lujo",
      estado: "Pendiente",
      color: "yellow",
    },
  ];

  const getStatusColor = (estado) => {
    switch (estado) {
      case "Confirmado":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Pendiente":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Pagado":
        return "bg-green-100 text-green-800 border-green-200";
      case "Cancelado":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getActionButton = (estado) => {
    switch (estado) {
      case "Confirmado":
        return (
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200">
            Confirmar
          </button>
        );
      case "Pendiente":
        return (
          <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200">
            Pendear
          </button>
        );
      case "Pagado":
        return (
          <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200">
            Pendear
          </button>
        );
      case "Cancelado":
        return (
          <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200">
            Cancelar
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        {/* Main Content */}
        <div className="flex-1 p-4 lg:p-8 w-full lg:w-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 lg:mb-8 space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-amber-900 hover:bg-amber-100"
              >
                <Menu className="w-6 h-6" />
              </button>
              <h2 className="text-2xl lg:text-4xl font-bold text-amber-900">
                Reservas
              </h2>
            </div>
            <button className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700 text-white px-4 lg:px-6 py-2 lg:py-3 rounded-lg font-medium shadow-lg transition-colors duration-200 text-center">
              Agregar Reserva
            </button>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-lg p-4 lg:p-6 mb-4 lg:mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-4 w-full sm:w-auto">
                <div className="relative">
                  <button className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-3 lg:px-4 py-2 rounded-lg transition-colors duration-200 text-sm lg:text-base">
                    <Filter className="w-4 h-4 text-gray-600" />
                    <span className="text-gray-700 font-medium">Filtro</span>
                    <ChevronDown className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>

              <div className="relative w-full sm:w-auto">
                <button className="flex items-center justify-between sm:justify-center space-x-2 bg-gray-100 hover:bg-gray-200 px-3 lg:px-4 py-2 rounded-lg transition-colors duration-200 text-sm lg:text-base w-full sm:w-auto">
                  <span className="text-gray-700 font-medium">
                    {activeFilter}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Cards / Desktop Table */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Desktop Table - Hidden on mobile */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-4 text-left">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-semibold text-gray-700">
                          Cliente
                        </span>
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-semibold text-gray-700">
                          Fecha del evento
                        </span>
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left">
                      <div className="flex items-center space-x-2">
                        <Package className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-semibold text-gray-700">
                          Paquete
                        </span>
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left">
                      <span className="text-sm font-semibold text-gray-700">
                        Estado
                      </span>
                    </th>
                    <th className="px-6 py-4 text-left">
                      <span className="text-sm font-semibold text-gray-700">
                        Acciones
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {reservas.map((reserva, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 transition-colors duration-200"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                            {reserva.cliente
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                          <span className="ml-3 text-gray-900 font-medium">
                            {reserva.cliente}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {reserva.fecha}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                          {reserva.paquete}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                            reserva.estado
                          )}`}
                        >
                          {reserva.estado}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {getActionButton(reserva.estado)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards - Shown only on mobile */}
            <div className="lg:hidden divide-y divide-gray-200">
              {reservas.map((reserva, index) => (
                <div
                  key={index}
                  className="p-4 hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                        {reserva.cliente
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div className="ml-3">
                        <h3 className="text-gray-900 font-medium text-lg">
                          {reserva.cliente}
                        </h3>
                        <p className="text-gray-600 text-sm flex items-center mt-1">
                          <Calendar className="w-4 h-4 mr-1" />
                          {reserva.fecha}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                        <Package className="w-4 h-4 mr-1" />
                        {reserva.paquete}
                      </span>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                          reserva.estado
                        )}`}
                      >
                        {reserva.estado}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    {getActionButton(reserva.estado)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
};

export default ReservasComponent;
