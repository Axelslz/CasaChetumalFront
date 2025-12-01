import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  Filter,
  Calendar,
  User,
  DollarSign,
  CreditCard,
  Search,
  Clock 
} from "lucide-react";

import { getAllReservationsRequest } from "../../services/reservation.js"; 
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
dayjs.extend(isBetween);

const PaidReservations = () => {
  const [pagos, setPagos] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
  
  // Filtros
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("Todos"); 
  const [dateFilter, setDateFilter] = useState("all"); 
  
  const [showFilters, setShowFilters] = useState(false);
  const [showDateFilters, setShowDateFilters] = useState(false); 

  useEffect(() => {
    const fetchPaidReservations = async () => {
      try {
        setLoading(true);
        const response = await getAllReservationsRequest();
        const paidOnly = response.data.filter(r => 
            r.status === 'paid' || r.status === 'confirmed' || r.estado === 'paid' || r.estado === 'confirmed'
        );
        
        setPagos(paidOnly); 
        setError(null);
      } catch (err) {
        setError("No se pudieron cargar los pagos. Intenta de nuevo más tarde.");
        console.error(err);
      } finally {
        setLoading(false); 
      }
    };

    fetchPaidReservations();
  }, []); 

  const filteredPagos = pagos.filter((pago) => {
    const pagoDate = dayjs(pago.fecha);
    const now = dayjs();

    const matchesSearch =
      pago.cliente.toLowerCase().includes(search.toLowerCase()) ||
      pago.fecha.toLowerCase().includes(search.toLowerCase());

    const matchesTypeFilter =
      activeFilter === "Todos" || pago.metodo === activeFilter;

    let matchesDateFilter = true;
    if (dateFilter === "month") {
        matchesDateFilter = pagoDate.month() === now.month() && pagoDate.year() === now.year();
    } else if (dateFilter === "6months") {
        const sixMonthsAgo = now.subtract(6, 'month');
        matchesDateFilter = pagoDate.isAfter(sixMonthsAgo);
    } else if (dateFilter === "year") {
        matchesDateFilter = pagoDate.year() === now.year();
    }
    return matchesSearch && matchesTypeFilter && matchesDateFilter;
  });

  const totalIngresos = filteredPagos.reduce(
    (acc, pago) => acc + (pago.monto || 0), 
    0
  );

  const dateFilterLabels = {
      all: "Todo el historial",
      month: "Este Mes",
      "6months": "Últimos 6 Meses",
      year: "Este Año"
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-amber-50">
        <p className="text-amber-800 font-semibold">Cargando pagos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-red-50">
        <p className="text-red-600 font-semibold">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <div className="flex-1 p-4 lg:p-8 w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 lg:mb-8 space-y-4 sm:space-y-0">
          <h2 className="text-2xl lg:text-4xl font-bold text-amber-900">
            Pagos Realizados
          </h2>
          <div className="bg-white shadow-md rounded-lg px-4 py-3 flex items-center space-x-3 border border-amber-100">
            <div className="bg-green-100 p-2 rounded-full">
                <DollarSign className="w-6 h-6 text-green-700" />
            </div>
            <div className="flex flex-col">
                <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Total Filtrado</span>
                <span className="font-bold text-xl text-gray-800">
                ${totalIngresos.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </span>
            </div>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="bg-white rounded-xl shadow-lg p-4 lg:p-6 mb-4 lg:mb-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
            
            {/* Search Input */}
            <div className="relative w-full lg:w-1/3">
              <input
                type="text"
                placeholder="Buscar por cliente o fecha..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-100 focus:bg-white focus:ring-2 focus:ring-amber-400 transition-colors duration-200 text-sm outline-none border border-transparent focus:border-amber-300"
              />
              <Search className="w-5 h-5 text-gray-500 absolute left-3 top-2.5" />
            </div>

            {/* Filters Group */}
            <div className="flex gap-2 w-full lg:w-auto">
                
                {/* Filtro de Fecha */}
                <div className="relative">
                <button
                    onClick={() => { setShowDateFilters(!showDateFilters); setShowFilters(false); }}
                    className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-3 lg:px-4 py-2 rounded-lg transition-colors duration-200 text-sm font-medium text-gray-700 border border-gray-200"
                >
                    <Clock className="w-4 h-4 text-gray-600" />
                    <span>{dateFilterLabels[dateFilter]}</span>
                    <ChevronDown className="w-4 h-4 text-gray-600" />
                </button>
                {showDateFilters && (
                    <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-20 overflow-hidden">
                    {Object.entries(dateFilterLabels).map(([key, label]) => (
                        <button
                        key={key}
                        onClick={() => {
                            setDateFilter(key);
                            setShowDateFilters(false);
                        }}
                        className={`block w-full text-left px-4 py-2 text-sm hover:bg-amber-50 transition-colors ${
                            dateFilter === key ? "bg-amber-100 text-amber-900 font-semibold" : "text-gray-700"
                        }`}
                        >
                        {label}
                        </button>
                    ))}
                    </div>
                )}
                </div>

                {/* Filtro de Método */}
                <div className="relative">
                <button
                    onClick={() => { setShowFilters(!showFilters); setShowDateFilters(false); }}
                    className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-3 lg:px-4 py-2 rounded-lg transition-colors duration-200 text-sm font-medium text-gray-700 border border-gray-200"
                >
                    <Filter className="w-4 h-4 text-gray-600" />
                    <span>{activeFilter}</span>
                    <ChevronDown className="w-4 h-4 text-gray-600" />
                </button>
                {showFilters && (
                    <div className="absolute top-full left-0 mt-2 w-40 bg-white rounded-lg shadow-xl border border-gray-200 z-20 overflow-hidden">
                    {["Todos", "Transferencia", "Efectivo"].map((f) => (
                        <button
                        key={f}
                        onClick={() => {
                            setActiveFilter(f);
                            setShowFilters(false);
                        }}
                        className={`block w-full text-left px-4 py-2 text-sm hover:bg-amber-50 transition-colors ${
                            activeFilter === f ? "bg-amber-100 text-amber-900 font-semibold" : "text-gray-700"
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
        </div>
        
        {/* Contenedor de la tabla y tarjetas */}
        {filteredPagos.length > 0 ? (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
            {/* Tabla para Desktop */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider">
                    <th className="px-6 py-4 text-left font-semibold text-gray-600">Cliente</th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-600">Fecha Evento</th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-600">Método</th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-600">Monto</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredPagos.map((pago) => (
                    <tr
                      key={pago.id}
                      className="hover:bg-amber-50/50 transition-colors duration-200"
                    >
                      <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="bg-amber-100 p-2 rounded-full mr-3">
                                <User className="w-4 h-4 text-amber-700" />
                            </div>
                            <span className="text-gray-900 font-medium">{pago.cliente}</span>
                          </div>
                      </td>
                      <td className="px-6 py-4">
                          <div className="flex items-center text-gray-600">
                            <Calendar className="w-4 h-4 mr-2" />
                            {pago.fecha}
                          </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                            pago.metodo === "Transferencia"
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : "bg-green-50 text-green-700 border-green-200"
                          }`}
                        >
                          {pago.metodo === "Transferencia" ? <CreditCard className="w-3 h-3 mr-1"/> : <DollarSign className="w-3 h-3 mr-1"/>}
                          {pago.metodo}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-900 font-bold">
                          ${pago.monto?.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Tarjetas para Móviles */}
            <div className="lg:hidden divide-y divide-gray-200">
              {filteredPagos.map((pago) => (
                <div key={pago.id} className="p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start mb-2">
                      <h3 className="text-gray-900 font-bold">{pago.cliente}</h3>
                      <span className="text-amber-800 font-bold">${pago.monto?.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center text-gray-500 text-sm mb-3">
                    <Calendar className="w-4 h-4 mr-1" />
                    {pago.fecha}
                  </div>
                  <div className="flex items-center">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        pago.metodo === "Transferencia"
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : "bg-green-50 text-green-700 border-green-200"
                      }`}
                    >
                      {pago.metodo}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl shadow-lg border border-gray-100">
            <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No se encontraron pagos</h3>
            <p className="text-gray-500 mt-1">Intenta ajustar los filtros de fecha o búsqueda.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaidReservations;
