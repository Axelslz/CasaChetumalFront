import React from 'react';
import { Box, Typography, Card, CardContent, Grid, Chip } from '@mui/material';
import { X, User, Calendar, Clock, Package, Music, FileText, DollarSign } from 'lucide-react';

const formatDate = (dateString) => {
  if (!dateString) return 'No especificada';
  const options = { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' };
  return new Date(dateString).toLocaleDateString('es-ES', options);
};

const ReservationDetailsModal = ({ isOpen, onClose, reservation }) => {
  if (!isOpen || !reservation) return null;

  const musicSchedule = reservation.musicSchedule ? JSON.parse(reservation.musicSchedule) : {};

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl mx-auto relative animate-scale-in overflow-y-auto max-h-[90vh]">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors">
          <X size={24} />
        </button>
        
        <Box className="p-6">
          <Typography variant="h5" className="font-bold text-amber-800 text-center mb-6">
            Detalles de la Reservación
          </Typography>

          {/* --- Información del Cliente y Evento --- */}
          <Grid container spacing={3} className="mb-4">
            <Grid item xs={12} md={6}>
              <Card variant="outlined" className="p-3 h-full">
                <Typography variant="subtitle2" className="font-semibold text-gray-600 flex items-center mb-2"><User size={16} className="mr-2"/>Cliente</Typography>
                <Typography><b>Nombre:</b> {reservation.clientName}</Typography>
                <Typography><b>Teléfono:</b> {reservation.clientPhone}</Typography>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card variant="outlined" className="p-3 h-full">
                <Typography variant="subtitle2" className="font-semibold text-gray-600 flex items-center mb-2"><Calendar size={16} className="mr-2"/>Evento</Typography>
                <Typography><b>Fecha:</b> {formatDate(reservation.eventDate)}</Typography>
                <Typography><b>Hora:</b> {reservation.eventTime}</Typography>
              </Card>
            </Grid>
          </Grid>

          {/* --- Detalles del Paquete y Addons --- */}
          <Card variant="outlined" className="p-4 mb-4">
             <Typography variant="subtitle2" className="font-semibold text-gray-600 flex items-center mb-2"><Package size={16} className="mr-2"/>Paquete y Servicios</Typography>
             <Chip label={reservation.Package ? reservation.Package.name : 'Sin paquete'} color="primary" variant="outlined" className="mr-2 mb-2" />
             {reservation.Snacks?.map(item => <Chip key={item.id} label={item.name} className="mr-2 mb-2" />)}
             {reservation.Drinks?.map(item => <Chip key={item.id} label={item.name} className="mr-2 mb-2" />)}
          </Card>

          {/* --- Detalles de Música (Condicional) --- */}
          {reservation.Music?.length > 0 && (
            <Card variant="outlined" className="p-4 mb-4">
              <Typography variant="subtitle2" className="font-semibold text-gray-600 flex items-center mb-2"><Music size={16} className="mr-2"/>Música</Typography>
              {reservation.Music.map(item => (
                <Box key={item.id} className="mb-2 pl-2 border-l-2">
                  <Typography><b>Servicio:</b> {item.name}</Typography>
                  <Typography><b>Hora de inicio:</b> {musicSchedule[item.id] || 'No especificada'}</Typography>
                </Box>
              ))}
              {reservation.musicNotes && (
                <Box mt={2} p={2} className="bg-gray-50 rounded-md">
                   <Typography variant="subtitle2" className="font-semibold flex items-center"><FileText size={14} className="mr-1"/>Notas Adicionales</Typography>
                   <Typography variant="body2" className="whitespace-pre-wrap">{reservation.musicNotes}</Typography>
                </Box>
              )}
            </Card>
          )}

           {/* --- Total --- */}
           <Box className="text-right mt-6">
              <Typography variant="h6" className="font-bold text-green-700 flex items-center justify-end">
                <DollarSign size={20} className="mr-1"/> Total: ${parseFloat(reservation.totalPrice).toFixed(2)} MXN
              </Typography>
           </Box>
        </Box>
      </div>
    </div>
  );
};

export default ReservationDetailsModal;