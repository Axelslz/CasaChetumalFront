import React, { useState, useEffect } from 'react';
import { ChevronDown, Filter, Calendar, User, Package, Menu } from 'lucide-react';
import {
  getAllReservationsRequest,
  updateReservationStatusRequest,
} from '../../services/reservation.js'; 

const ReservasAdmin = () => {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [activeFilter, setActiveFilter] = useState('Todos los estados');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await getAllReservationsRequest();
        setReservas(response.data);
      } catch (err) {
        setError('No se pudieron cargar las reservaciones.');
      } finally {
        setLoading(false);
      }
    };
    fetchReservations();
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await updateReservationStatusRequest(id, newStatus);
      setReservas((prevReservas) =>
        prevReservas.map((reserva) =>
          reserva.id === id ? { ...reserva, estado: newStatus } : reserva
        )
      );
    } catch (error) {
      alert('Error al actualizar el estado. Inténtalo de nuevo.');
    }
  };

  const getStatusColor = (estado) => {
    const statusMap = {
      confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      paid: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200',
    };
    return statusMap[estado] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  const getActionButton = (reserva) => {
    switch (reserva.estado) {
      case 'pending':
        return (
          <button
            onClick={() => handleUpdateStatus(reserva.id, 'confirmed')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
          >
            Confirmar
          </button>
        );
      case 'confirmed':
        return (
          <button
            onClick={() => handleUpdateStatus(reserva.id, 'paid')}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
          >
            Marcar Pagado
          </button>
        );
      case 'paid':
        return <span className="text-gray-500 font-medium">Completado</span>;
      case 'cancelled':
         return (
          <button
            onClick={() => handleUpdateStatus(reserva.id, 'pending')}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
          >
            Re-activar
          </button>
        );
      default:
        return null;
    }
  };

  if (loading) return <div className="p-8 font-semibold">Cargando reservaciones...</div>;
  if (error) return <div className="p-8 text-red-600 font-semibold">{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <div className="flex-1 p-4 lg:p-8 w-full">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-amber-900">
            Administrar Reservas
          </h2>
          <button className="w-full mt-4 sm:mt-0 sm:w-auto bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-medium shadow-lg transition-colors duration-200">
            + Agregar Reserva
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-left">
                  <th className="px-6 py-4 text-sm font-semibold text-gray-700"><User className="w-4 h-4 inline-block -mt-1 mr-2" />Cliente</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-700"><Calendar className="w-4 h-4 inline-block -mt-1 mr-2" />Fecha del Evento</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-700"><Package className="w-4 h-4 inline-block -mt-1 mr-2" />Paquete</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-700">Estado</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-700">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {reservas.length > 0 ? (
                  reservas.map((reserva) => (
                    <tr key={reserva.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">{reserva.cliente}</td>
                      <td className="px-6 py-4 text-gray-600">{formatDate(reserva.fecha)}</td>
                      <td className="px-6 py-4 text-gray-800">{reserva.paquete}</td>
                      <td className="px-6 py-4">
                        <span className={`capitalize inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(reserva.estado)}`}>
                          {reserva.estado}
                        </span>
                      </td>
                      <td className="px-6 py-4">{getActionButton(reserva)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-10 text-gray-500">
                      No hay reservaciones para mostrar.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservasAdmin;
