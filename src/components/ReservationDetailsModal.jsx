import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, Grid, Chip, CircularProgress, Alert } from '@mui/material';
// Importa todos los iconos necesarios
import { X, User, Calendar, Clock, Package, Music, FileText, DollarSign, ShoppingBasket, GlassWater, Trash2, Soup, CupSoda, Sparkles } from 'lucide-react';
import { getReservationOptions } from '../services/reservation.js'; // Necesitamos esto para los nombres

// Función Helper para formatear fecha
const formatDate = (dateString) => {
  if (!dateString) return 'No especificada';
  // Intentar crear fecha asumiendo YYYY-MM-DD (DATEONLY from Sequelize/MySQL)
  const dateParts = String(dateString).split('-');
  let date = null;
  if (dateParts.length === 3) {
      // Crear fecha en UTC para evitar problemas de zona horaria
      date = new Date(Date.UTC(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2])));
  } else {
      // Fallback si el formato no es el esperado
      date = new Date(dateString);
  }

  if (isNaN(date.getTime())) return 'Fecha inválida'; // Check if date is valid

  const options = { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' };
  return date.toLocaleDateString('es-ES', options);
};


// Componente Helper para mostrar selecciones de Paquete
const PackageSelectionsDisplay = ({ title, selections, items, icon }) => {
  const hasSelections = selections && typeof selections === 'object' && Object.keys(selections).length > 0;
  if (!hasSelections) return null;

  let totalCount = 0;
  const selectedItems = Object.entries(selections).map(([id, quantity]) => {
    const numQuantity = Number(quantity);
    if (isNaN(numQuantity) || numQuantity <= 0) return null;
    const item = items.find(i => String(i.id) === String(id));
    totalCount += numQuantity;
    return { name: item ? item.name : `ID ${id}`, quantity: numQuantity };
  }).filter(Boolean);

  if (selectedItems.length === 0 || totalCount === 0) return null;

  return (
    <Box mb={2}>
      <Typography variant="subtitle2" className="font-semibold text-gray-600 flex items-center mb-1">
        {icon} {title} (Total: {totalCount})
      </Typography>
      <Box className="pl-6">
        {selectedItems.map((item, index) => (
          <Typography key={index} variant="body2" className="text-gray-700">
            - {item.name}: {item.quantity}
          </Typography>
        ))}
      </Box>
    </Box>
  );
};

// --- ✨ Componente Helper REVISADO para mostrar Addons Extra ---
const ExtraAddonsDisplay = ({ title, addonsObject, items, typePrefix, icon }) => {
   // Filtrar addonsObject por el prefijo correcto y cantidad > 0
   const relevantAddons = Object.entries(addonsObject)
       .filter(([key, quantity]) => key.startsWith(typePrefix + '_') && Number(quantity) > 0)
       .map(([key, quantity]) => {
           const id = key.split('_')[1];
           const item = items.find(i => String(i.id) === String(id)); // Comparar como string
           const numQuantity = Number(quantity); // Asegurar número
           // Devolver null si no se encuentra el item o la cantidad no es válida
           if (!item || isNaN(numQuantity) || numQuantity <= 0) return null;
           return { name: item.name, quantity: numQuantity };
       })
       .filter(Boolean); // Filtrar los nulls

   // No renderizar si no hay extras válidos de este tipo
   if (relevantAddons.length === 0) return null;

   return (
      <Box mb={2}> {/* Añadido margen inferior */}
         <Typography variant="body2" className="font-medium text-gray-700 mb-1 pl-2 flex items-center">
            {icon} {title}:
         </Typography>
         <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, pl: 4 }}>
            {relevantAddons.map((addon, index) => (
               <Chip
                  key={`${typePrefix}-${index}`}
                  label={`${addon.name} (x${addon.quantity})`}
                  variant="outlined"
                  size="small"
                  // Podrías añadir un color distinto por tipo si quieres
                  // color={typePrefix === 'drink' ? 'info' : typePrefix === 'disposable' ? 'default' : 'secondary'}
               />
            ))}
         </Box>
      </Box>
   );
};
// --- FIN HELPER ---


const ReservationDetailsModal = ({ isOpen, onClose, reservation }) => {
  // Cargar TODAS las opciones para poder mapear IDs a nombres
  const [options, setOptions] = useState({ snacks: [], drinks: [], disposables: [] });
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [errorOptions, setErrorOptions] = useState(null);

  useEffect(() => {
    // Cargar opciones siempre que el modal esté abierto
    if (isOpen) {
      setLoadingOptions(true);
      setErrorOptions(null);
      getReservationOptions()
        .then(response => {
          setOptions({
            snacks: response.data.snacks || [],
            drinks: response.data.drinks || [],
            disposables: response.data.disposables || [],
          });
        })
        .catch(err => {
          console.error("Error cargando opciones para detalles:", err);
          setErrorOptions("No se pudieron cargar los detalles de los productos.");
        })
        .finally(() => {
          setLoadingOptions(false);
        });
    }
  }, [isOpen]); // Dependencia solo de isOpen


  if (!isOpen || !reservation) return null;

  // Función segura para parsear JSON
  const safeParseJson = (jsonString, defaultVal = {}) => {
    if (!jsonString) return defaultVal;
    if (typeof jsonString === 'object' && jsonString !== null && !Array.isArray(jsonString)) return jsonString;
    if (typeof jsonString !== 'string' || jsonString.trim() === '') return defaultVal;
    try {
      const parsed = JSON.parse(jsonString);
      return (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) ? parsed : defaultVal;
    } catch (e) {
      console.warn("Warning parsing JSON:", e, "String:", jsonString); // Usar warn para no detener ejecución
      return defaultVal;
    }
  };

  // Parsear todos los datos necesarios
  const packageSnackSelections = safeParseJson(reservation.packageSnackSelections);
  const packageDrinkSelections = safeParseJson(reservation.packageDrinkSelections);
  const includedDisposableQuantities = safeParseJson(reservation.includedDisposableQuantities);
  const musicSchedule = safeParseJson(reservation.musicSchedule);
  // --- ✨ LEER extraAddons ---
  const extraAddons = safeParseJson(reservation.extraAddons);
  // --- FIN LEER ---

  const extraSnacks = reservation.Snacks || []; // Snacks extra (de la relación)

  // Determinar si hay algún extra seleccionado (snacks, drinks, disposables, music)
  const hasAnyExtras = extraSnacks.length > 0 ||
                       Object.keys(extraAddons).length > 0 ||
                       reservation.Music?.length > 0;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl mx-auto relative animate-scale-in overflow-y-auto max-h-[90vh]">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors">
          <X size={24} />
        </button>

        <Box className="p-6">
          <Typography variant="h5" className="font-bold text-amber-800 text-center mb-6">
            Detalles de la Reservación #{reservation.id}
          </Typography>

          {/* Info Cliente y Evento (Sin cambios) */}
          <Grid container spacing={3} className="mb-4">
            <Grid item xs={12} md={6}>
              <Card variant="outlined" className="p-3 h-full">
                <Typography variant="subtitle2" className="font-semibold text-gray-600 flex items-center mb-2"><User size={16} className="mr-2"/>Cliente</Typography>
                <Typography><b>Nombre:</b> {reservation.clientName}</Typography>
                <Typography><b>Teléfono:</b> {reservation.clientPhone}</Typography>
                 {reservation.idPhotoUrl && (
                   <Typography><b>INE:</b> <a href={reservation.idPhotoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Ver Imagen</a></Typography>
                 )}
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card variant="outlined" className="p-3 h-full">
                <Typography variant="subtitle2" className="font-semibold text-gray-600 flex items-center mb-2"><Calendar size={16} className="mr-2"/>Evento</Typography>
                <Typography><b>Fecha:</b> {formatDate(reservation.eventDate)}</Typography>
                <Typography><b>Hora:</b> {reservation.eventTime ? reservation.eventTime.substring(0, 5) : 'No especificada'}</Typography>
                <Typography><b>Estado:</b> <Chip label={reservation.status || 'Desconocido'} size="small" color={reservation.status === 'confirmed' || reservation.status === 'paid' ? 'success' : reservation.status === 'cancelled' ? 'error' : 'warning'} /></Typography>
              </Card>
            </Grid>
          </Grid>

          {/* --- Detalles del Paquete y Selecciones --- */}
          <Card variant="outlined" className="p-4 mb-4">
             <Typography variant="subtitle2" className="font-semibold text-gray-600 flex items-center mb-2"><Package size={16} className="mr-2"/>Paquete Seleccionado</Typography>
             {reservation.Package ? (
                <>
                  <Chip label={reservation.Package.name} color="primary" variant="outlined" className="mr-2 mb-2" />

                  {/* Indicador de carga/error para nombres de items del paquete */}
                  {loadingOptions && <CircularProgress size={20} className="ml-4"/>}
                  {errorOptions && !loadingOptions && <Alert severity="warning" sx={{mt: 1, fontSize: '0.8rem'}}>No se pudieron cargar nombres de items.</Alert>}

                  {/* Mostrar selecciones del paquete (si no hay error y no está cargando) */}
                  {!loadingOptions && !errorOptions && (
                    <>
                     <PackageSelectionsDisplay
                       title="Botanas del Paquete"
                       selections={packageSnackSelections}
                       items={options.snacks} // Necesita options.snacks
                       icon={<ShoppingBasket size={16} className="mr-1 text-orange-600"/>}
                     />
                     <PackageSelectionsDisplay
                       title="Refrescos del Paquete"
                       selections={packageDrinkSelections}
                       items={options.drinks} // Necesita options.drinks
                       icon={<GlassWater size={16} className="mr-1 text-blue-600"/>}
                     />
                    </>
                  )}

                  {/* Desechables Incluidos (Condicional por paquete) */}
                  {reservation.Package.maxDesechables > 0 && (
                    <Box mt={2}>
                      <Typography variant="subtitle2" className="font-semibold text-gray-600 flex items-center mb-1">
                        <Trash2 size={16} className="mr-1 text-gray-500"/> Desechables Incluidos (Cantidades)
                      </Typography>
                      {Object.values(includedDisposableQuantities).some(v => v > 0) ? (
                          <Grid container spacing={1} className="pl-6">
                            {Object.entries(includedDisposableQuantities)
                               .filter(([key, value]) => value > 0)
                               .map(([key, value]) => (
                                  <Grid item xs={6} sm={4} md={3} key={key}>
                                     <Typography variant="body2" className="text-gray-700 capitalize">- {key}: {value}</Typography>
                                  </Grid>
                             ))}
                          </Grid>
                      ) : (
                          <Typography variant="body2" className="text-gray-500 pl-6">No se especificaron cantidades.</Typography>
                      )}
                    </Box>
                  )}
                </>
             ) : (
                <Typography variant="body2" className="text-gray-500 ml-2">Sin paquete seleccionado.</Typography>
             )}
          </Card>

          {/* --- ✨ MOSTRAR TODOS LOS EXTRAS SELECCIONADOS --- */}
          {/* Renderizar la tarjeta solo si hay algún extra */}
          {hasAnyExtras && (
              <Card variant="outlined" className="p-4 mb-4">
                  <Typography variant="subtitle2" className="font-semibold text-gray-600 flex items-center mb-3">
                      <Sparkles size={16} className="mr-2 text-purple-600"/> Extras Seleccionados (Personalización)
                  </Typography>

                  {/* Indicador de carga/error para nombres de items extra */}
                  {loadingOptions && <CircularProgress size={20} />}
                  {errorOptions && !loadingOptions && <Alert severity="warning" sx={{fontSize: '0.8rem'}}>No se pudieron cargar nombres de items extra.</Alert>}

                  {/* Mostrar extras solo si no hay error y no está cargando */}
                  {!loadingOptions && !errorOptions && (
                      <>
                          {/* Mostrar Snacks Extra (de la relación M-M) */}
                          {extraSnacks.length > 0 && (
                              <Box mb={2}>
                                  <Typography variant="body2" className="font-medium text-gray-700 mb-1 pl-2 flex items-center">
                                      <Soup size={14} className="mr-1 text-red-600"/> Snacks:
                                  </Typography>
                                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, pl: 4 }}>
                                      {extraSnacks.map(snack => (
                                          <Chip key={`extra-snack-${snack.id}`} label={snack.name} variant="outlined" size="small" />
                                          // La cantidad exacta no está fácilmente disponible aquí
                                      ))}
                                  </Box>
                              </Box>
                          )}

                          {/* Mostrar Bebidas Extra (del JSON extraAddons) */}
                          <ExtraAddonsDisplay
                              title="Bebidas"
                              addonsObject={extraAddons} // Pasar el objeto parseado
                              items={options.drinks}    // Pasar la lista de bebidas
                              typePrefix="drink"
                              icon={<CupSoda size={14} className="mr-1 text-cyan-600"/>}
                          />

                          {/* Mostrar Desechables Extra (del JSON extraAddons) */}
                          <ExtraAddonsDisplay
                              title="Desechables"
                              addonsObject={extraAddons} // Pasar el objeto parseado
                              items={options.disposables} // Pasar la lista de desechables
                              typePrefix="disposable"
                              icon={<Trash2 size={14} className="mr-1 text-gray-600"/>}
                          />

                          {/* Mostrar Música (si existe) */}
                          {reservation.Music?.length > 0 && (
                             <Box mt={2}> {/* Margen superior para separar de otros addons */}
                                <Typography variant="body2" className="font-medium text-gray-700 mb-1 pl-2 flex items-center">
                                    <Music size={14} className="mr-1 text-indigo-600"/> Música:
                                </Typography>
                                 <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, pl: 4, mb: 1 }}>
                                    {reservation.Music.map(item => (
                                      <Chip key={`extra-music-${item.id}`} label={item.name} variant="outlined" size="small" />
                                    ))}
                                </Box>
                                 {/* Horarios y Notas de Música */}
                                {Object.keys(musicSchedule).length > 0 && (
                                   <Box mt={1} pl={4}>
                                      <Typography variant="caption" className="font-semibold text-gray-600">Horarios Programados:</Typography>
                                      {reservation.Music.map(item => (
                                          musicSchedule[item.id] && <Typography key={`schedule-${item.id}`} variant="caption" className="block text-gray-700">- {item.name}: {musicSchedule[item.id]}</Typography>
                                      ))}
                                   </Box>
                                )}
                                 {reservation.musicNotes && (
                                    <Box mt={2} p={2} className="bg-gray-50 rounded-md mx-2">
                                       <Typography variant="caption" className="font-semibold flex items-center"><FileText size={12} className="mr-1"/>Notas de Música</Typography>
                                       <Typography variant="caption" className="whitespace-pre-wrap block">{reservation.musicNotes}</Typography>
                                    </Box>
                                 )}
                             </Box>
                          )}
                      </>
                  )}

                  {/* Mensaje si no hay NINGÚN extra (opcional) */}
                  {!loadingOptions && !errorOptions && !hasAnyExtras && (
                      <Typography variant="body2" className="text-gray-500 pl-2">No se seleccionaron extras.</Typography>
                  )}
              </Card>
          )}
          {/* --- FIN EXTRAS SELECCIONADOS --- */}


            {/* --- Info Pago (Sin cambios) --- */}
            <Card variant="outlined" className="p-4 mb-4">
              <Typography variant="subtitle2" className="font-semibold text-gray-600 flex items-center mb-2"><DollarSign size={16} className="mr-2"/>Información de Pago</Typography>
              <Grid container spacing={1}>
                  <Grid item xs={12} sm={6}>
                      <Typography><b>Método:</b> <Chip label={reservation.paymentMethod || 'N/A'} size="small" /></Typography>
                  </Grid>
                   <Grid item xs={12} sm={6}>
                       <Typography><b>Estado Pago:</b> <Chip label={reservation.paymentStatus || 'N/A'} size="small" color={reservation.paymentStatus === 'paid' ? 'success' : 'warning'} /></Typography>
                  </Grid>
                   {reservation.paymentDeadline && (
                      <Grid item xs={12}>
                          <Typography><b>Fecha Límite (Efectivo):</b> {formatDate(reservation.paymentDeadline)}</Typography>
                      </Grid>
                   )}
                   {reservation.cashPaymentDateTime && (
                        <Grid item xs={12}>
                            <Typography><b>Cita Pago Efectivo:</b> {new Date(reservation.cashPaymentDateTime).toLocaleString('es-ES', { dateStyle: 'long', timeStyle: 'short' })}</Typography>
                        </Grid>
                    )}
                   {reservation.paymentReceiptUrl && (
                      <Grid item xs={12}>
                         <Typography><b>Comprobante:</b> <a href={reservation.paymentReceiptUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Ver Comprobante</a></Typography>
                      </Grid>
                   )}
              </Grid>
            </Card>


           {/* --- Total (Sin cambios) --- */}
           <Box className="text-right mt-6">
             <Typography variant="h6" className="font-bold text-green-700 flex items-center justify-end">
               <DollarSign size={20} className="mr-1"/> Total: ${parseFloat(reservation.totalPrice || 0).toFixed(2)} MXN
             </Typography>
           </Box>
        </Box>
      </div>
    </div>
  );
};

export default ReservationDetailsModal;