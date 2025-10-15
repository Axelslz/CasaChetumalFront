import React, { useState, useEffect } from "react";
import {
  Box, Button, Stepper, Step, StepLabel, TextField, Typography, Card,
  CardContent, CardActions, Grid, IconButton, Popover, useMediaQuery, useTheme 
} from "@mui/material";
import { X, Plus, Minus, CheckCircle, Music } from "lucide-react";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { StaticDateTimePicker, TimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import "dayjs/locale/es";
dayjs.locale("es");
import { getReservationOptions as getOptions, calculateTotalRequest, getOccupiedDatesRequest, createReservationRequest } from "../services/reservation.js";
import { useCart } from "../context/CartContext.jsx";

const minTimeForPicker = dayjs('2022-01-01T08:00');
const maxTimeForPicker = dayjs('2022-01-01T16:00');

const baseSteps = ["Datos de reservación", "Paquetes", "Personalización"];
const summaryStep = "Resumen";
const musicStep = "Detalles de Música";

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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
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

  const [musicDetails, setMusicDetails] = useState({
    schedule: {},
    notes: ""
  });

  const [totalPrice, setTotalPrice] = useState(3000);
  const [anchorEl, setAnchorEl] = useState(null);

  const steps = React.useMemo(() => {
    const currentSteps = [...baseSteps];
    if (selections.musicIds.length > 0) {
      currentSteps.push(musicStep);
    }
    currentSteps.push(summaryStep);
    return currentSteps;
  }, [selections.musicIds]);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handlePopoverClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? 'salon-info-popover' : undefined;
  useEffect(() => {
    if (isOpen) {
      const loadInitialData = async () => {
        try {
          const optionsRes = await getOptions();
          setOptions({
            packages: optionsRes.data.packages || [],
            snacks: optionsRes.data.snacks || [],
            music: optionsRes.data.music || [],
            drinks: optionsRes.data.drinks || [],
          });
          const datesRes = await getOccupiedDatesRequest();
          setOccupiedDates(datesRes.data || []);
        } catch (error) {
          console.error("Error al cargar datos iniciales del modal:", error);
        }
      };
      loadInitialData();
    }
  }, [isOpen]);
  useEffect(() => {
    if (options.snacks.length === 0 && options.music.length === 0 && options.drinks.length === 0) {
      return;
    }
    const handler = setTimeout(async () => {
      try {
        const response = await calculateTotalRequest(selections);
        setTotalPrice(response.data.total);
      } catch (error) {
        console.error("Error al calcular el total desde el backend:", error);
      }
    }, 500);
    return () => {
      clearTimeout(handler);
    };
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
  const isDateDisabled = (date) => occupiedDates.some((d) => dayjs(d.date).isSame(date, "day"));
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

  const handleMusicTimeChange = (musicId, time) => {
    setMusicDetails(prev => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [musicId]: time ? dayjs(time).format('HH:mm') : null
      }
    }));
  };

  const handleMusicNotesChange = (e) => {
    setMusicDetails(prev => ({ ...prev, notes: e.target.value }));
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
    if (selections.packageId) {
      dataToSend.append('packageId', selections.packageId);
    }
    const snackIdsSet = new Set(options.snacks.map(s => s.id.toString()));
    Object.keys(selections.addons).forEach(id => {
      if (snackIdsSet.has(id)) {
        dataToSend.append('snackIds[]', id); 
      }
    });
    selections.musicIds.forEach(id => dataToSend.append('musicIds[]', id)); 

    if (selections.musicIds.length > 0) {
      dataToSend.append('musicSchedule', JSON.stringify(musicDetails.schedule));
      dataToSend.append('musicNotes', musicDetails.notes);
    }

    const reservationSummary = {
      cliente: `${nombre} ${apellidos}`,
      fecha: dayjs(fecha).format('DD/MM/YYYY'),
      hora: dayjs(formData.horaInicio).format('hh:mm A'),
      total: totalPrice,
      packageId: selections.packageId,
      addons: selections.addons,
      musicIds: selections.musicIds,
      musicDetails: selections.musicIds.length > 0 ? musicDetails : null
    };

    addReservationToCart({
      createReservation: () => createReservationRequest(dataToSend),
      summary: reservationSummary,
      allOptions: options
    });

    alert("¡Reservación añadida al carrito!");
    onClose();      
    openCartModal(); 
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 rounded-3xl shadow-2xl w-full max-w-4xl mx-auto relative animate-scale-in overflow-y-auto max-h-[90vh]">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 transition-colors"><X size={28} /></button>
        <Box className="p-6">
          <Typography variant="h4" className="text-center mb-4 font-bold text-gray-800">Reservación del Salón</Typography>
          <Stepper activeStep={activeStep} alternativeLabel className="mt-5">{steps.map((label) => (<Step key={label}><StepLabel>{label}</StepLabel></Step>))}</Stepper>
          <div className="mt-2 bg-blue-50 p-3 rounded-lg border border-blue-200">
            <div className="flex items-center justify-center">
              <div className="flex-shrink-0">
                <IconButton aria-describedby={id} onClick={handlePopoverOpen} size="small">
                  <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" clipRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" />
                  </svg>
                </IconButton>
              </div>
              <div className="ml-3 flex-grow text-center">
                <h3 className="text-md font-medium text-blue-800">
                  {activeStep === 0 && (<p className="text-xs text-blue-700 mt-1">La renta del salon tiene un costo de $3,250 (mobiliario y manteleria para 40 personas)</p>)}
                  {activeStep === 0 && `Ingresa tus datos y selecciona fecha y hora (horario admitido: 8:00 AM a 4:00 PM).`}
                  {activeStep === 1 && "Puedes elegir un paquete o pasar al siguiente paso para personalizar tu experiencia."}
                  {activeStep === 2 && "¡Ármate con lo que necesites para tu evento!"}
                  {activeStep === 3 && "Revisa tu selección final antes de añadir al carrito."}
                </h3>
                {activeStep === 0 && (<p className="text-xs text-blue-700 mt-1">De la manera más amable se le solicita <b>asistir con 30 minutos de anticipación</b>, para la entrega del salón</p>)}
              </div>
            </div>
          </div>
          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handlePopoverClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
          >
            <Box sx={{ p: 2, border: 1, borderColor: 'grey.300', borderRadius: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Información Adicional del Salón:</Typography>
              <Typography variant="body2" component="ul" sx={{ pl: 2, mt: 1 }}>
                <li>- Internet.</li>
                <li>- Acceso a área de cocina con estufa y refrigerador.</li>
                <li>- 2 baños disponibles (damas y caballeros).</li>
                <li>- Bocina con conexión Bluetooth.</li>
                <li>- Pantalla Smart TV.</li>
                <li>- Alberca y Cascada.</li>
              </Typography>
            </Box>
          </Popover>
          <Box className="mt-4">
            {activeStep === 0 && (
              <Card className="shadow-lg rounded-2xl">
                <CardContent className="flex flex-col md:flex-row gap-8 p-4 items-center">
                  <Grid container spacing={3} sx={{ flex: 1, maxWidth: '400px' }}>
                    <Grid item xs={12} sm={6}><TextField variant="standard" label="Nombre" required fullWidth value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} /></Grid>
                    <Grid item xs={12} sm={6}><TextField variant="standard" label="Apellidos" required fullWidth value={formData.apellidos} onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })} /></Grid>
                    <Grid item xs={12}><TextField variant="standard" label="Teléfono" required fullWidth value={formData.telefono} onChange={(e) => setFormData({ ...formData, telefono: e.target.value })} /></Grid>
                    <Grid item xs={12} className="mt-4">
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
                  <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', gap: 3, mb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box component="span" sx={{ width: 15, height: 15, borderRadius: '50%', bgcolor: '#A96E4A' }} />
                        <Typography variant="caption">Ocupado</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box component="span" sx={{ width: 15, height: 15, borderRadius: '50%', bgcolor: '#9E9E9E' }} />
                        <Typography variant="caption">Pendiente</Typography>
                      </Box>
                    </Box>
                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
                      <StaticDateTimePicker
                       orientation={isMobile ? 'portrait' : 'landscape'}
                        value={formData.fecha}
                        onChange={handleDateChange}
                        shouldDisableDate={isDateDisabled}
                         minTime={minTimeForPicker}
                         maxTime={maxTimeForPicker}
                        minDate={dayjs()}
                        slotProps={{
                          actionBar: { actions: [""] },
                          day: (ownerState) => {
                            const dayInfo = occupiedDates.find((d) => dayjs(d.date).isSame(ownerState.day, "day"));
                            let style = { borderRadius: "50%" };
                            if (dayInfo) {
                              if (dayInfo.status === 'confirmed') {
                                style = { ...style, backgroundColor: "#A96E4A !important", color: "white !important" };
                              } else if (dayInfo.status === 'pending') {
                                style = { ...style, backgroundColor: "#9E9E9E !important", color: "white !important" };
                              }
                            }
                            return { sx: style };
                          },
                        }}
                      />
                    </LocalizationProvider>
                   {formData.horaInicio && (
                      <p className="mt-2 text-gray-600 text-lg">
                        Inicio: {formData.horaInicio.toLocaleTimeString()} | Fin:{" "}
                        {formData.horaFin.toLocaleTimeString()}
                      </p>
                    )}
                  </Box>
                </CardContent>
                <CardActions className="justify-end pr-4 pb-3">
                  <Button variant="contained" onClick={handleNext} style={{ backgroundColor: "#A96E4A" }}>Siguiente</Button>
                </CardActions>
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
                            <IconButton onClick={() => handleQuantityChange(item, -1, true)}><Minus size={18} /></IconButton>
                            <span className="font-bold text-xl mx-3">{selections.packageId === item.id ? 1 : 0}</span>
                            <IconButton onClick={() => handleQuantityChange(item, 1, true)}><Plus size={18} /></IconButton>
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
                  <h3 className="text-center font-bold text-xl text-amber-800 mb-4">Personaliza tu experiencia</h3>
                  <Grid container spacing={3}>
                    {[
                      { title: "Botanas", data: options.snacks },
                      { title: "Bebidas", data: options.drinks },
                      { title: "Música", data: options.music },
                    ].map((category) => (
                      <Grid item xs={12} sm={6} md={4} key={category.title}>
                        <Typography className="mb-2 font-semibold text-amber-900 text-lg">{category.title}</Typography>
                        {(category.data || []).map((item) => {
                          if (category.title === "Música") {
                            const isSelected = selections.musicIds.includes(item.id);
                            return (
                              <Card key={item.id} onClick={() => handleMusicSelection(item.id)} className={`p-2 mb-3 border rounded-lg flex items-center relative cursor-pointer transition-all duration-200 ${isSelected ? 'bg-green-100 border-green-500 scale-105' : 'border-amber-300'}`} style={{ boxShadow: isSelected ? '0 0 10px rgba(16, 185, 129, 0.5)' : 'none' }}>
                                {isSelected && (<Box className="absolute top-1 right-1 bg-white rounded-full"><CheckCircle className="text-green-600" size={24} /></Box>)}
                                <Box className="flex-shrink-0 mr-3"><img src={bufferToDataUrl(item.image)} alt={item.name} className="w-16 h-16 object-contain rounded-md" /></Box>
                                <Box className="flex-grow min-w-0">
                                  <Typography className="font-medium truncate" title={item.name}>{item.name}</Typography>
                                  <Typography variant="body2" color="text.secondary">${item.price} MXN</Typography>
                                </Box>
                              </Card>
                            );
                          } else {
                            return (
                              <Card key={item.id} className="p-2 mb-3 border border-amber-300 rounded-lg flex items-center">
                                <Box className="flex-shrink-0 mr-3"><img src={bufferToDataUrl(item.image)} alt={item.name} className="w-16 h-16 object-contain rounded-md" /></Box>
                                <Box className="flex-grow flex flex-col justify-between min-w-0">
                                  <Box className="min-w-0">
                                    <Typography className="font-medium truncate" title={item.name}>{item.name}</Typography>
                                    <Typography variant="body2" color="text.secondary">${item.price} MXN</Typography>
                                  </Box>
                                  <Box className="flex items-center self-end">
                                    <IconButton onClick={() => handleQuantityChange(item, -1)} size="small"><Minus size={16} /></IconButton>
                                    <span className="font-bold mx-1 w-4 text-center">{selections.addons[item.id] || 0}</span>
                                    <IconButton onClick={() => handleQuantityChange(item, 1)} size="small"><Plus size={16} /></IconButton>
                                  </Box>
                                </Box>
                              </Card>
                            );
                          }
                        })}
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
                <CardActions className="justify-between px-4 pb-4">
                  <Button onClick={handleBack}>Atrás</Button>
                  <Button variant="contained" onClick={handleNext} style={{ backgroundColor: "#A96E4A" }}>Siguiente</Button>
                </CardActions>
              </Card>
            )}
             {steps[activeStep] === musicStep && (
              <Card className="rounded-2xl shadow-lg bg-transparent">
                <CardContent>
                  <Box className="text-center mb-6">
                    <Music className="mx-auto text-amber-600 h-12 w-12" />
                    <h3 className="text-center font-bold text-2xl text-amber-800 mt-2">
                      Horarios de la Música
                    </h3>
                    <p className="text-gray-600 mt-1">
                      Indica a qué hora te gustaría que inicie cada servicio de música.
                    </p>
                  </Box>

                  <Grid container spacing={4} alignItems="center">
                    {selections.musicIds.map(musicId => {
                      const musicItem = options.music.find(m => m.id === musicId);
                      if (!musicItem) return null;
                      return (
                        <Grid item xs={12} md={6} key={musicId}>
                          <Card className="p-3 border border-amber-200 rounded-lg">
                            <Typography className="font-semibold text-gray-800 mb-2">{musicItem.name}</Typography>
                            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
                              <TimePicker
                                label="Hora de inicio"
                                value={musicDetails.schedule[musicId] ? dayjs(musicDetails.schedule[musicId], 'HH:mm') : null}
                                onChange={(newValue) => handleMusicTimeChange(musicId, newValue)}
                                minTime={dayjs(formData.horaInicio)}
                                maxTime={dayjs(formData.horaFin)}
                                slotProps={{ textField: { fullWidth: true, variant: 'standard' } }}
                              />
                            </LocalizationProvider>
                          </Card>
                        </Grid>
                      );
                    })}
                  </Grid>

                  <Box mt={4}>
                    <TextField
                      label="Notas adicionales para la música"
                      multiline
                      rows={4}
                      fullWidth
                      variant="filled"
                      value={musicDetails.notes}
                      onChange={handleMusicNotesChange}
                      placeholder="Ej: 'Primero el DJ, luego mariachi a la hora del pastel...'"
                    />
                  </Box>
                </CardContent>
                <CardActions className="justify-between px-4 pb-4">
                  <Button onClick={handleBack}>Atrás</Button>
                  <Button variant="contained" onClick={handleNext} style={{ backgroundColor: "#A96E4A" }}>Siguiente</Button>
                </CardActions>
              </Card>
            )}
            {steps[activeStep] === summaryStep && (
              <Card className="shadow-lg rounded-2xl">
                <CardContent>
                  <Typography variant="h6" className="mb-4 text-amber-900">Resumen de tu reservación</Typography>
                  <ul className="list-disc ml-6 mb-1 text-gray-700">
                    <li><b>Cliente:</b> {formData.nombre} {formData.apellidos}</li>
                    <li><b>Teléfono:</b> {formData.telefono}</li>
                    <li><b>Fecha:</b> {dayjs(formData.fecha).format('DD/MM/YYYY')} {dayjs(formData.horaInicio).format('hh:mm A')}</li>
                  </ul>
                  
                  {selections.musicIds.length > 0 && musicDetails.notes && (
                    <Box mt={2} p={2} bgcolor="amber.50" borderRadius={1}>
                        <Typography variant="subtitle2" sx={{fontWeight: 'bold'}}>Notas de Música:</Typography>
                        <Typography variant="body2" sx={{whiteSpace: 'pre-wrap'}}>{musicDetails.notes}</Typography>
                    </Box>
                  )}
                  
                  <Typography className="text-lg font-bold text-green-700 text-right mt-4">Total: ${totalPrice.toFixed(2)} MXN</Typography>
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