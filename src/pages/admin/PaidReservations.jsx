import React, { useState } from "react";
import {
  ChevronDown,
  Filter,
  Calendar,
  User,
  DollarSign,
  CreditCard,
  Search,
} from "lucide-react";

const PaidReservations = () => {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("Todos");
  const [showFilters, setShowFilters] = useState(false);

  // Datos simulados (después conectarás con la API)
  const pagos = [
    {
      cliente: "Juan Pérez",
      fecha: "10 de Septiembre 2024",
      metodo: "Transferencia",
      monto: 2500,
    },
    {
      cliente: "Laura Gómez",
      fecha: "15 de Septiembre 2024",
      metodo: "Efectivo",
      monto: 1800,
    },
    {
      cliente: "Carlos Sánchez",
      fecha: "20 de Septiembre 2024",
      metodo: "Transferencia",
      monto: 3200,
    },
    {
      cliente: "María López",
      fecha: "22 de Septiembre 2024",
      metodo: "Efectivo",
      monto: 2100,
    },
  ];

  // Filtro dinámico por cliente, fecha y método
  const filteredPagos = pagos.filter((pago) => {
    const matchesSearch =
      pago.cliente.toLowerCase().includes(search.toLowerCase()) ||
      pago.fecha.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      activeFilter === "Todos" || pago.metodo === activeFilter;

    return matchesSearch && matchesFilter;
  });

  const totalIngresos = filteredPagos.reduce(
    (acc, pago) => acc + pago.monto,
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <div className="flex-1 p-4 lg:p-8 w-full lg:w-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 lg:mb-8 space-y-4 sm:space-y-0">
          <h2 className="text-2xl lg:text-4xl font-bold text-amber-900">
            Pagos
          </h2>
          <div className="bg-white shadow-md rounded-lg px-4 py-2 flex items-center space-x-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            <span className="font-semibold text-gray-800">
              Total: ${totalIngresos.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="bg-white rounded-xl shadow-lg p-4 lg:p-6 mb-4 lg:mb-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-4 lg:space-y-0">
            {/* Buscador */}
            <div className="relative w-full lg:w-1/3">
              <input
                type="text"
                placeholder="Buscar por cliente o fecha..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-100 focus:bg-white focus:ring-2 focus:ring-amber-400 transition-colors duration-200 text-sm"
              />
              <Search className="w-5 h-5 text-gray-500 absolute left-3 top-2.5" />
            </div>

            {/* Filtros */}
            <div className="relative">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-3 lg:px-4 py-2 rounded-lg transition-colors duration-200 text-sm lg:text-base"
              >
                <Filter className="w-4 h-4 text-gray-600" />
                <span className="text-gray-700 font-medium">
                  {activeFilter}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-600" />
              </button>

              {showFilters && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200">
                  {["Todos", "Transferencia", "Efectivo"].map((f) => (
                    <button
                      key={f}
                      onClick={() => {
                        setActiveFilter(f);
                        setShowFilters(false);
                      }}
                      className={`block w-full text-left px-4 py-2 text-sm hover:bg-amber-100 ${
                        activeFilter === f ? "font-semibold text-amber-800" : ""
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabla Desktop */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
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
                        Fecha
                      </span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <div className="flex items-center space-x-2">
                      <CreditCard className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-semibold text-gray-700">
                        Método
                      </span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <DollarSign className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-semibold text-gray-700">
                      Monto
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPagos.map((pago, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 text-gray-900 font-medium">
                      {pago.cliente}
                    </td>
                    <td className="px-6 py-4 text-gray-600">{pago.fecha}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          pago.metodo === "Transferencia"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {pago.metodo}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-900 font-semibold">
                      ${pago.monto.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cards Móviles */}
          <div className="lg:hidden divide-y divide-gray-200">
            {filteredPagos.map((pago, index) => (
              <div
                key={index}
                className="p-4 hover:bg-gray-50 transition-colors duration-200"
              >
                <h3 className="text-gray-900 font-medium text-lg">
                  {pago.cliente}
                </h3>
                <p className="text-gray-600 text-sm flex items-center mt-1">
                  <Calendar className="w-4 h-4 mr-1" />
                  {pago.fecha}
                </p>
                <div className="flex items-center justify-between mt-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      pago.metodo === "Transferencia"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {pago.metodo}
                  </span>
                  <span className="text-gray-900 font-semibold">
                    ${pago.monto.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaidReservations;
