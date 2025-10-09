import React, { useState, useEffect } from "react";
import {
  Box, Button, Stepper, Step, StepLabel, TextField, Typography, Card,
  CardContent, CardActions, Grid, IconButton,
} from "@mui/material";
import { X, Plus, Minus, CheckCircle } from "lucide-react";
import "../assets/styles/reservationModal.css";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { StaticDateTimePicker } from "@mui/x-date-pickers/StaticDateTimePicker";
import dayjs from "dayjs";
import "dayjs/locale/es";
dayjs.locale("es");

import { getReservationOptions as getOptions } from "../services/reservation.js";
import { useCart } from "../context/CartContext.jsx"; 

const steps = ["Datos de reservación", "Paquetes", "Personalización", "Resumen"];
const SALON_BASE_PRICE = 3000;

const bufferToDataUrl = (buffer) => {
  if (!buffer || !buffer.data) {
    return "https://via.placeholder.com/150?text=No+Imagen";
  }
  
  let binary = '';
  const bytes = new Uint8Array(buffer.data);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const base64String = btoa(binary);
  return `data:image/png;base64,${base64String}`;
};

const ReservationModal = ({ isOpen, onClose, openCartModal }) => {
  const { addReservationToCart } = useCart(); 
  const [activeStep, setActiveStep] = useState(0);
  const [options, setOptions] = useState({ packages: [], snacks: [], music: [], drinks: [] });
  const [occupiedDates, setOccupiedDates] = useState([]); 
  const [formData, setFormData] = useState({
    nombre: "", apellidos: "", telefono: "", ine: null, fecha: null, horaInicio: null, horaFin: null,
  });
  const [selections, setSelections] = useState({
    packageId: null,
    addons: {}, 
    musicIds: [],
  });
  const [totalPrice, setTotalPrice] = useState(SALON_BASE_PRICE);

  useEffect(() => {
    if (isOpen) {
      const loadOptions = async () => {
        try {
          const res = await getOptions();
          setOptions({
            packages: res.data.packages || [],
            snacks: res.data.snacks || [],
            music: res.data.music || [],
            drinks: res.data.drinks || [],
          });
        } catch (error) { console.error("Error al cargar las opciones:", error); }
      };
      loadOptions();
    }
  }, [isOpen]);

  useEffect(() => {
    let total = SALON_BASE_PRICE;
    const allItems = [
      ...(options.packages || []), ...(options.snacks || []),
      ...(options.music || []), ...(options.drinks || [])
    ];
    
    if (selections.packageId) {
      const item = allItems.find(p => p.id === selections.packageId);
      if (item) total += parseFloat(item.price);
    }
    
    Object.entries(selections.addons).forEach(([id, qty]) => {
      const item = allItems.find(s => s.id == id);
      if (item) total += parseFloat(item.price) * qty;
    });

    selections.musicIds.forEach(musicId => {
      const item = allItems.find(m => m.id === musicId);
      if (item) total += parseFloat(item.price);
    });

    setTotalPrice(total);
  }, [selections, options]);

  if (!isOpen) return null;

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);
  const handleFileChange = (e) => setFormData({ ...formData, ine: e.target.files?.[0] || null });

  const handleDateChange = (date) => {
    if (!date) return;
    const start = date.toDate();
    const end = new Date(start.getTime() + 7 * 60 * 60 * 1000);
    setFormData({ ...formData, fecha: date, horaInicio: start, horaFin: end });
  };
  const isDateDisabled = (date) => occupiedDates.some((d) => dayjs(d).isSame(date, "day"));

  const handleQuantityChange = (item, delta, isPackage = false) => {
    if (isPackage) {
      setSelections(prev => ({ ...prev, packageId: prev.packageId === item.id && delta < 0 ? null : item.id }));
    } else {
      setSelections(prev => {
        const currentQty = prev.addons[item.id] || 0;
        const newQty = Math.max(0, currentQty + delta);
        const newAddons = { ...prev.addons };
        if (newQty === 0) {
          delete newAddons[item.id];
        } else {
          newAddons[item.id] = newQty;
        }
        return { ...prev, addons: newAddons };
      });
    }
  };

  const handleMusicSelection = (musicId) => {
    setSelections(prev => {
      const newMusicIds = [...prev.musicIds];
      const index = newMusicIds.indexOf(musicId);
      if (index > -1) {
        newMusicIds.splice(index, 1); 
      } else {
        newMusicIds.push(musicId); 
      }
      return { ...prev, musicIds: newMusicIds };
    });
  };

  const handleAddToCart = () => {
    const { nombre, apellidos, telefono, fecha, ine } = formData;
    if (!nombre || !apellidos || !telefono || !fecha) {
      alert("Por favor, completa los campos requeridos del primer paso.");
      return;
    }

    const dataToSend = new FormData();
    dataToSend.append('clientName', `${nombre} ${apellidos}`);
    dataToSend.append('clientPhone', telefono);
    dataToSend.append('eventDate', dayjs(fecha).format('YYYY-MM-DD'));
    dataToSend.append('eventTime', dayjs(fecha).format('HH:mm'));
    if (ine) {
      dataToSend.append('idPhoto', ine);
    }
    dataToSend.append('totalPrice', totalPrice);
    dataToSend.append('paymentMethod', 'transfer'); 
    if (selections.packageId) dataToSend.append('packageId', selections.packageId);
    Object.keys(selections.snackIds).forEach(id => dataToSend.append('snackIds', id));
    selections.musicIds.forEach(id => dataToSend.append('musicIds', id));

   const reservationSummary = {
        cliente: `${nombre} ${apellidos}`,
        fecha: dayjs(fecha).format('DD/MM/YYYY'),
        hora: dayjs(formData.horaInicio).format('hh:mm A'),
        total: totalPrice,
        packageId: selections.packageId,
        snackIds: selections.snackIds,
        musicIds: selections.musicIds,
    };
 
    addReservationToCart({ dataToSend, summary: reservationSummary, allOptions: options });
    
    alert("¡Reservación añadida al carrito!");
    onClose();
    openCartModal(); 
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 rounded-3xl shadow-2xl w-full max-w-4xl mx-auto relative animate-scale-in overflow-y-auto min-h-2/3 max-h-[90vh]">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 transition-colors"><X size={28} /></button>
        <Box className="p-6">
          <Typography variant="h4" className="text-center mb-4 font-bold text-gray-800">Reservación del Salón</Typography>
          <Stepper activeStep={activeStep} alternativeLabel className="mt-5">{steps.map((label) => (<Step key={label}><StepLabel>{label}</StepLabel></Step>))}</Stepper>
          
          <div className="mt-2 bg-blue-50 p-3 rounded-lg border border-blue-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" clipRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" />
                </svg>
              </div>
              <div className="ml-3 flex-grow text-center">
                <h3 className="text-md font-medium text-blue-800">
                  {activeStep === 0 && `La renta del salón tiene un costo base de $${SALON_BASE_PRICE}. Ingresa tus datos y selecciona fecha y hora (horario admitido: 8:00 AM a 4:00 PM).`}
                  {activeStep === 1 && "Puedes elegir un paquete o pasar al siguiente paso para personalizar tu experiencia."}
                  {activeStep === 2 && "¡Ármate con lo que necesites para tu evento!"}
                  {activeStep === 3 && "Revisa tu selección final antes de añadir al carrito."}
                </h3>
                {activeStep === 0 && (<p className="text-xs text-blue-700 mt-1">De la manera más amable se le solicita <b>asistir con 30 minutos de anticipación</b>, para la entrega del salón.</p>)}
              </div>
            </div>
          </div>

          <Box className="mt-4">
            {activeStep === 0 && (
              <Card className="shadow-lg rounded-2xl py-3 px-2">
                <CardContent className="flex">
                  <Grid container spacing={2}>
                    <Grid item xs={6}><TextField variant="standard" label="Nombre" required fullWidth value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}/></Grid>
                    <Grid item xs={6}><TextField variant="standard" label="Apellidos" required fullWidth value={formData.apellidos} onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })}/></Grid>
                    <Grid item xs={6}><TextField variant="standard" label="Teléfono" required fullWidth value={formData.telefono} onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}/></Grid>
                    <Grid item xs={6}>
                      <Button variant="contained" component="label" style={{ backgroundColor: '#A96E4A' }}>
                        Subir Identificación
                        <input type="file" hidden onChange={handleFileChange} accept="image/*,application/pdf" />
                      </Button>
                      {formData.ine && (<Typography variant="body2" className="mt-2 text-green-700">{formData.ine.name}</Typography>)}
                      <Typography variant="caption" display="block" className="text-gray-600 mt-1">
                        <b>*Se le pide la identificación por seguridad, no es obligatorio.</b>
                      </Typography>
                    </Grid>
                  </Grid>
                  <Box>
                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
                      <StaticDateTimePicker 
                        orientation="landscape" 
                        value={formData.fecha} 
                        onChange={handleDateChange} 
                        shouldDisableDate={isDateDisabled}
                        minTime={dayjs().hour(8).minute(0)}  
                        maxTime={dayjs().hour(16).minute(0)} 
                      />
                    </LocalizationProvider>
                    {formData.horaInicio && (<p className="mt-2 text-gray-600 text-lg">Inicio: {formData.horaInicio.toLocaleTimeString()} | Fin: {formData.horaFin.toLocaleTimeString()}</p>)}
                  </Box>
                </CardContent>
                <CardActions className="justify-end"><Button variant="contained" onClick={handleNext} style={{ backgroundColor: "#A96E4A" }}>Siguiente</Button></CardActions>
              </Card>
            )}
            {activeStep === 1 && (
              <Card className="shadow-lg rounded-2xl bg-transparent">
                <CardContent>
                  <Typography className="text-center font-bold text-xl text-amber-900 mb-4">Paquetes Predeterminados</Typography>
                  <Grid container spacing={4} justifyContent="center">
                    {options.packages.map((item) => (
                      <Grid item xs={12} sm={6} md={4} key={item.id}>
                        <Card className="p-3 shadow-md border border-gray-200 rounded-xl h-full flex flex-col text-center">
                          <img src={bufferToDataUrl(item.image)} alt={item.name} className="w-full h-40 object-contain rounded-lg mb-2" />
                          <CardContent className="flex-grow p-1">
                            <Typography className="font-bold text-gray-800 text-lg">{item.name}</Typography>
                            <Typography variant="body2" color="text.secondary" className="my-1">{item.description}</Typography>
                            <Typography className="text-green-700 font-semibold mt-1 text-lg">${item.price} MXN</Typography>
                          </CardContent>
                          <CardActions className="justify-center p-0">
                            <IconButton onClick={() => handleQuantityChange(item, -1, true)}><Minus size={18}/></IconButton>
                            <span className="font-bold text-xl mx-3">{selections.packageId === item.id ? 1 : 0}</span>
                            <IconButton onClick={() => handleQuantityChange(item, 1, true)}><Plus size={18}/></IconButton>
                          </CardActions>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
                <CardActions className="justify-between px-4 pb-4"><Button onClick={handleBack}>Atrás</Button><Button variant="contained" onClick={handleNext} style={{ backgroundColor: "#A96E4A" }}>Siguiente</Button></CardActions>
              </Card>
            )}

            {activeStep === 2 && (
            <Card className="rounded-2xl shadow-lg bg-transparent">
              <CardContent>
                <h3 className="text-center font-bold text-xl text-amber-800 mb-4">
                  Personaliza tu experiencia
                </h3>
                <Grid container spacing={3}>
                  {[
                    { title: "Botanas", data: options.snacks },
                    { title: "Bebidas", data: options.drinks },
                    { title: "Música", data: options.music },
                  ].map((category) => (
                    <Grid item xs={12} sm={6} md={4} key={category.title}>
                      <Typography className="mb-2 font-semibold text-amber-900 text-lg">
                        {category.title}
                      </Typography>
                      {(category.data || []).map((item) => (
                        <Card
                          key={item.id}
                          className="p-2 mb-3 border border-amber-300 rounded-lg flex items-center"
                        >
                          {/* ✨ Contenedor de la imagen con tamaño fijo para que no se encoja */}
                          <Box className="flex-shrink-0 mr-3">
                            <img
                              src={bufferToDataUrl(item.image)}
                              alt={item.name}
                              className="w-16 h-16 object-contain rounded-md"
                            />
                          </Box>
                          
                          {/* ✨ Contenedor principal para texto y controles */}
                          <Box className="flex-grow flex flex-col justify-between min-w-0">
                            
                            {/* ✨ Contenedor para el texto */}
                            <Box className="min-w-0">
                              <Typography 
                                className="font-medium truncate" // 'truncate' evita que el texto se desborde
                                title={item.name} // Muestra el nombre completo al pasar el mouse
                              >
                                {item.name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                ${item.price} MXN
                              </Typography>
                            </Box>

                            {/* ✨ Contenedor para los controles, alineado a la derecha */}
                            <Box className="flex items-center self-end">
                              <IconButton
                                onClick={() => handleQuantityChange(item, -1)}
                                size="small"
                              >
                                <Minus size={16} />
                              </IconButton>
                              <span className="font-bold mx-1 w-4 text-center">
                                {selections.addons[item.id] || 0}
                              </span>
                              <IconButton
                                onClick={() => handleQuantityChange(item, 1)}
                                size="small"
                              >
                                <Plus size={16} />
                              </IconButton>
                            </Box>
                          </Box>
                        </Card>
                      ))}
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
              <CardActions className="justify-between px-4 pb-4">
                <Button onClick={handleBack}>Atrás</Button>
                <Button
                  variant="contained"
                  onClick={handleNext}
                  style={{ backgroundColor: "#A96E4A" }}
                >
                  Siguiente
                </Button>
              </CardActions>
            </Card>
          )}
            {activeStep === 3 && (
                 <Card className="shadow-lg rounded-2xl">
                 <CardContent>
                   <Typography variant="h6" className="mb-4 text-amber-900">Resumen de tu reservación</Typography>
                   <ul className="list-disc ml-6 mb-1 text-gray-700">
                     <li><b>Cliente:</b> {formData.nombre} {formData.apellidos}</li>
                     <li><b>Teléfono:</b> {formData.telefono}</li>
                     <li><b>Fecha:</b> {dayjs(formData.fecha).format('DD/MM/YYYY')} {dayjs(formData.horaInicio).format('hh:mm A')}</li>
                   </ul>
                   <Typography className="text-lg font-bold text-green-700 text-right">Total: ${totalPrice.toFixed(2)} MXN</Typography>
                 </CardContent>
                 <CardActions className="justify-between">
                   <Button onClick={handleBack}>Atrás</Button>
                   <Button variant="contained" color="success" onClick={handleAddToCart}>Confirmar y Enviar al Carrito</Button>
                 </CardActions>
               </Card>
            )}
          </Box>
        </Box>
      </div>
    </div>
  );
};

export default ReservationModal;