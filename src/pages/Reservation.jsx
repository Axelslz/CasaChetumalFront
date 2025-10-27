import React, { useState, useEffect, useMemo } from "react";
import {
  Box, Button, Stepper, Step, StepLabel, TextField, Typography, Card,
  CardContent, CardActions, Grid, IconButton, Popover, useMediaQuery, useTheme,
  Modal 
} from "@mui/material";
import { X, Plus, Minus, CheckCircle, Music, Package as PackageIcon } from "lucide-react";
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
const packageDetailStep = "Detalles del Paquete";
const musicStep = "Detalles de Música";
const summaryStep = "Resumen";

const alertModalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 'auto',
  maxWidth: '90%',
  minWidth: 320,
  bgcolor: 'background.paper',
  border: '2px solid #A96E4A',
  borderRadius: '16px',
  boxShadow: 24,
  p: 4,
  textAlign: 'center'
};

const AlertModal = ({ isOpen, onClose, message }) => {
  if (!isOpen) return null;

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="alert-modal-title"
      aria-describedby="alert-modal-description"
    >
      <Box sx={alertModalStyle}>
        <Typography id="alert-modal-title" variant="h6" component="h2" className="font-bold text-amber-900">
          Aviso
        </Typography>
        <Typography id="alert-modal-description" sx={{ mt: 2 }} className="text-gray-700">
          {message}
        </Typography>
        <Button onClick={onClose} variant="contained" sx={{ mt: 3, backgroundColor: "#A96E4A", '&:hover': { backgroundColor: '#8e5a3c' } }}>
          Entendido
        </Button>
      </Box>
    </Modal>
  );
};

const AddonCard = ({ item, itemType, onQuantityChange, quantity }) => (
  <Card className="p-2 mb-3 border border-amber-300 rounded-lg flex items-center">
    <Box className="flex-shrink-0 mr-3">
      <img
        src={item.image || 'https://via.placeholder.com/150?text=No+Imagen'}
        alt={item.name}
        className="w-16 h-16 object-contain rounded-md"
      />
    </Box>
    <Box className="flex-grow flex flex-col justify-between min-w-0">
      <Box className="min-w-0">
        <Typography className="font-medium truncate" title={item.name}>{item.name}</Typography>
        
        {item.description && (
          <Typography 
            variant="caption" 
            color="text.secondary" 
            className="truncate block"
            title={item.description}
          >
            {item.description}
          </Typography>
        )}

        <Typography variant="body2" color="text.secondary">${item.price} MXN</Typography>
      </Box>
      <Box className="flex items-center self-end">
        {/* Pasa itemType a la función */}
        <IconButton onClick={() => onQuantityChange(item, -1, itemType)} size="small" disabled={quantity === 0}>
          <Minus size={16} />
        </IconButton>
        <span className="font-bold mx-1 w-4 text-center">{quantity}</span>
        {/* Pasa itemType a la función */}
        <IconButton onClick={() => onQuantityChange(item, 1, itemType)} size="small">
          <Plus size={16} />
        </IconButton>
      </Box>
    </Box>
  </Card>
);

const ReservationModal = ({ isOpen, onClose, openCartModal, isAdmin = false, onReservationCreated }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { addReservationToCart } = useCart();
  const [activeStep, setActiveStep] = useState(0);

  const [options, setOptions] = useState({ packages: [], snacks: [], music: [], drinks: [], disposables: [] });

  const [occupiedDates, setOccupiedDates] = useState([]);
  const [formData, setFormData] = useState({
    nombre: "", apellidos: "", telefono: "", ine: null, fecha: null, horaInicio: null, horaFin: null,
  });

  const [selections, setSelections] = useState({
    packageId: null,
    addons: {}, 
    musicIds: [],
  });

  const [packageSnackSelections, setPackageSnackSelections] = useState({});
  const [packageDrinkSelections, setPackageDrinkSelections] = useState({});

  const [disposableQuantities, setDisposableQuantities] = useState({
    vasos: 0,
    cucharas: 0,
    tenedores: 0,
    charolas: 0
  });

  const [musicDetails, setMusicDetails] = useState({ schedule: {}, notes: "" });
  const [totalPrice, setTotalPrice] = useState(3000);
  const [anchorEl, setAnchorEl] = useState(null);

  const handlePopoverOpen = (event) => setAnchorEl(event.currentTarget);
  const handlePopoverClose = () => setAnchorEl(null);
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const [alertModalMessage, setAlertModalMessage] = useState("");
  const [alertAction, setAlertAction] = useState(null); 

  const handleAlertModalClose = () => {
    setAlertModalOpen(false); 

    if (alertAction === 'addToCartSuccess') {
      onClose(); 
      openCartModal(); 
    } else if (alertAction === 'adminCreateSuccess') {
      onClose(); 
      if (onReservationCreated) onReservationCreated();
    }
    
    setAlertAction(null); 
  };
  
  const showAlert = (message, action = null) => {
    setAlertModalMessage(message);
    setAlertAction(action); 
    setAlertModalOpen(true);
  };

  const currentPackage = useMemo(() => {
    return options.packages.find(p => p.id === selections.packageId);
  }, [selections.packageId, options.packages]);

  const steps = React.useMemo(() => {
    const currentSteps = [...baseSteps];
    if (currentPackage) {
      currentSteps.splice(2, 0, packageDetailStep);
    }
    if (selections.musicIds.length > 0) {
      currentSteps.push(musicStep);
    }
    currentSteps.push(summaryStep);
    return currentSteps;
  }, [selections.packageId, selections.musicIds, currentPackage]);

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
            disposables: optionsRes.data.disposables || [],
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
    if (options.snacks.length === 0) {
      return;
    }
    const handler = setTimeout(async () => {
      try {
        const addonsToSend = {};
        for (const key in selections.addons) {
          const parts = key.split('_');
          if (parts.length === 2) { 
            const id = parts[1];
            addonsToSend[id] = selections.addons[key];
          }
        }
        const response = await calculateTotalRequest({
          ...selections,
          addons: addonsToSend 
        });
        setTotalPrice(response.data.total);
      } catch (error) {
        console.error("Error al calcular el total desde el backend:", error);
      }
    }, 500);
    return () => clearTimeout(handler);
  }, [selections, options]); 

  useEffect(() => {
    if (currentPackage) {
      const min = currentPackage.minDesechables || 0;
      setDisposableQuantities({
          vasos: min,
          cucharas: min,
          tenedores: min,
          charolas: min
      });
      setPackageSnackSelections({});
      setPackageDrinkSelections({});
    } else {
      setDisposableQuantities({ vasos: 0, cucharas: 0, tenedores: 0, charolas: 0 });
      setPackageSnackSelections({});
      setPackageDrinkSelections({});
    }
  }, [currentPackage]);


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

  const handleQuantityChange = (item, delta, itemType /* 'snack', 'drink', 'disposable' o undefined si es paquete */) => {
    if (!itemType) { 
      const newPackageId = selections.packageId === item.id && delta < 0 ? null : item.id;
      setSelections(prev => ({ ...prev, packageId: newPackageId }));
    } else {
      const prefix = itemType + '_';
      const prefixedId = prefix + item.id;

      setSelections(prev => {
        const currentQty = prev.addons[prefixedId] || 0;
        const newQty = Math.max(0, currentQty + delta);
        const newAddons = { ...prev.addons };
        if (newQty === 0) {
          delete newAddons[prefixedId];
        } else {
          newAddons[prefixedId] = newQty;
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
    setMusicDetails(prev => ({ ...prev, schedule: { ...prev.schedule, [musicId]: time ? dayjs(time).format('HH:mm') : null } }));
  };
  const handleMusicNotesChange = (e) => setMusicDetails(prev => ({ ...prev, notes: e.target.value }));


  const handlePackageQuantityChange = (itemId, delta, type) => {
    const isSnack = type === 'snack';
    const selectionsState = isSnack ? packageSnackSelections : packageDrinkSelections;
    const setSelectionsState = isSnack ? setPackageSnackSelections : setPackageDrinkSelections;
    const limit = isSnack ? currentPackage.numBotanas : currentPackage.numRefrescos;

    const currentTotalQty = Object.values(selectionsState).reduce((sum, qty) => sum + qty, 0);
    const currentItemQty = selectionsState[itemId] || 0;

    if (delta > 0 && currentTotalQty >= limit) {
      showAlert(`Solo puedes seleccionar un total de ${limit} ${isSnack ? 'botanas' : 'refrescos'}.`);
      return;
    }

    const newItemQty = Math.max(0, currentItemQty + delta);
    const newSelections = { ...selectionsState };

    if (newItemQty === 0) {
      delete newSelections[itemId];
    } else {
      newSelections[itemId] = newItemQty;
    }

    setSelectionsState(newSelections);
  };

  const handleDisposableQuantityChange = (item, value) => {
    const max = currentPackage.maxDesechables || 0;
    if (value === '') {
      setDisposableQuantities(prev => ({ ...prev, [item]: '' }));
      return;
    }
    const numValue = parseInt(value, 10);
    if (isNaN(numValue)) return;
    if (numValue > max) {
      setDisposableQuantities(prev => ({ ...prev, [item]: max }));
      return;
    }
    setDisposableQuantities(prev => ({ ...prev, [item]: numValue }));
  };

  const handleDisposableBlur = (item) => {
    const min = currentPackage.minDesechables || 0;
    const value = disposableQuantities[item];
    if (value === '' || value < min) {
      setDisposableQuantities(prev => ({ ...prev, [item]: min }));
    }
  };


  const handleAddToCart = async () => {
    const { nombre, apellidos, telefono, fecha, ine } = formData;
    if (!nombre || !apellidos || !telefono || !fecha) {
      showAlert("Por favor, completa los campos requeridos del primer paso.");
      return;
    }

    if (currentPackage && currentPackage.maxDesechables > 0) {
      const min = currentPackage.minDesechables;
      const max = currentPackage.maxDesechables;
      for (const item in disposableQuantities) {
        const qty = disposableQuantities[item];
        if (qty < min || qty > max) {
          showAlert(`La cantidad de ${item} debe estar entre ${min} y ${max}.`);
          setActiveStep(steps.indexOf(packageDetailStep));
          return;
        }
      }
    }

    const dataToSend = new FormData();
    dataToSend.append('clientName', `${nombre} ${apellidos}`);
    dataToSend.append('clientPhone', telefono);
    dataToSend.append('eventDate', dayjs(fecha).format('YYYY-MM-DD'));
    dataToSend.append('eventTime', dayjs(fecha).format('HH:mm'));
    if (ine) dataToSend.append('idPhoto', ine);
    dataToSend.append('totalPrice', totalPrice);
    dataToSend.append('paymentMethod', 'transfer');
    if (selections.packageId) dataToSend.append('packageId', selections.packageId);

    const snackAddonIds = [];
    for (const key in selections.addons) {
      const [type, id] = key.split('_');
      if (type === 'snack' && id !== undefined && selections.addons[key] > 0) {
        snackAddonIds.push(id);
      }
    }
    snackAddonIds.forEach(id => dataToSend.append('snackIds[]', id));

    selections.musicIds.forEach(id => dataToSend.append('musicIds[]', id));
    if (selections.musicIds.length > 0) {
      dataToSend.append('musicSchedule', JSON.stringify(musicDetails.schedule));
      dataToSend.append('musicNotes', musicDetails.notes);
    }

    dataToSend.append('packageSnackSelections', JSON.stringify(packageSnackSelections));
    dataToSend.append('packageDrinkSelections', JSON.stringify(packageDrinkSelections));
    dataToSend.append('includedDisposableQuantities', JSON.stringify(disposableQuantities));


    if (isAdmin) {
      try {
        await createReservationRequest(dataToSend);
        showAlert("¡Reservación creada con éxito!", "adminCreateSuccess");
      } catch (error) {
        console.error("Error al crear la reservación desde admin:", error);
        showAlert("Hubo un error al crear la reservación.");
      }
    } else {
      const reservationSummary = {
        cliente: `${nombre} ${apellidos}`,
        fecha: dayjs(fecha).format('DD/MM/YYYY'),
        hora: dayjs(formData.horaInicio).format('hh:mm A'),
        total: totalPrice,
        packageId: selections.packageId,
        addons: selections.addons, 
        musicIds: selections.musicIds,
        musicDetails: selections.musicIds.length > 0 ? musicDetails : null,
        packageSnackSelections,
        packageDrinkSelections,
        disposableQuantities
      };

      addReservationToCart({
        createReservation: () => dataToSend,
        summary: reservationSummary,
        allOptions: options
      });

      showAlert("¡Reservación añadida al carrito!", "addToCartSuccess");
    
    }
  };

  const PackageSelectionForm = ({ title, items, selections, limit, onChange }) => {
    const totalSelected = Object.values(selections).reduce((sum, qty) => sum + qty, 0);

    return (
      <Box mb={4}>
        <Typography variant="h6" className="font-semibold text-amber-900 mb-2">
          {title} (Selecciona un total de {limit})
        </Typography>
        <Typography variant="body2" color="textSecondary" className="mb-3">
          Seleccionados: {totalSelected} / {limit}
        </Typography>
        <Grid container spacing={2}>
          {items.map((item) => {
            const currentQty = selections[item.id] || 0;
            return (
              <Grid item xs={12} sm={6} key={item.id}>
                <Card variant="outlined" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1.5, height: '100%' }}>
                  <Typography sx={{ flexGrow: 1, fontWeight: 500 }}>
                    {item.name}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', flexShrink: 0, ml: 1 }}>
                    <IconButton
                      onClick={() => onChange(item.id, -1)}
                      size="small"
                      disabled={currentQty === 0}
                      aria-label={`Quitar ${item.name}`}
                    >
                      <Minus size={16} />
                    </IconButton>
                    <Typography sx={{ mx: 1, minWidth: '20px', textAlign: 'center', fontWeight: 'bold' }}>
                      {currentQty}
                    </Typography>
                    <IconButton
                      onClick={() => onChange(item.id, 1)}
                      size="small"
                      disabled={totalSelected >= limit}
                      aria-label={`Añadir ${item.name}`}
                    >
                      <Plus size={16} />
                    </IconButton>
                  </Box>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    );
  };

  const DisposableQuantityForm = ({ min, max, quantities, onChange, onBlur }) => {
    const items = [
      { key: 'vasos', label: 'Vasos' },
      { key: 'cucharas', label: 'Cucharas' },
      { key: 'tenedores', label: 'Tenedores' },
      { key: 'charolas', label: 'Charolas' }
    ];

    return (
      <Box>
        <Typography variant="h6" className="font-semibold text-amber-900 mb-2">
          Desechables Incluidos
        </Typography>
        <Typography variant="body2" color="textSecondary" className="mb-3">
          Ingresa una cantidad entre <b>{min}</b> y <b>{max}</b> para cada item.
        </Typography>
        <Grid container spacing={2}>
          {items.map(item => (
            <Grid item xs={12} sm={6} key={item.key}>
              <TextField
                label={item.label}
                type="number"
                value={quantities[item.key]}
                onChange={(e) => onChange(item.key, e.target.value)}
                onBlur={() => onBlur(item.key)}
                inputProps={{ min, max, step: 1 }}
                fullWidth
                variant="outlined"
                error={quantities[item.key] !== '' && (quantities[item.key] < min || quantities[item.key] > max)}
                helperText={(quantities[item.key] !== '' && (quantities[item.key] < min || quantities[item.key] > max)) ? `Debe estar entre ${min} y ${max}` : ''}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
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
                  {steps[activeStep] === "Datos de reservación" && `Ingresa tus datos y selecciona fecha y hora (horario admitido: 8:00 AM a 4:00 PM).`}
                  {steps[activeStep] === "Paquetes" && "Puedes elegir un paquete o pasar al siguiente paso para personalizar."}
                  {steps[activeStep] === packageDetailStep && "Elige los items incluidos en tu paquete."}
                  {steps[activeStep] === "Personalización" && "¡Ármate con lo que necesites para tu evento!"}
                  {steps[activeStep] === musicStep && "Indica los horarios para tu música."}
                  {steps[activeStep] === summaryStep && "Revisa tu selección final antes de añadir al carrito."}
                </h3>
                {steps[activeStep] === "Datos de reservación" && (<p className="text-xs text-blue-700 mt-1">La renta del salon tiene un costo de $3,250 (mobiliario y manteleria para 40 personas)</p>)}
                {steps[activeStep] === "Datos de reservación" && (<p className="text-xs text-blue-700 mt-1">De la manera más amable se le solicita <b>asistir con 30 minutos de anticipación</b>, para la entrega del salón</p>)}
              </div>
            </div>
          </div>
          <Popover id={id} open={open} anchorEl={anchorEl} onClose={handlePopoverClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} transformOrigin={{ vertical: 'top', horizontal: 'center' }}>
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
            {/* --- PASO 0: DATOS DE RESERVACIÓN --- */}
            {steps[activeStep] === "Datos de reservación" && (
              <Card className="shadow-lg rounded-2xl">
                {/* ... (Contenido del formulario de datos sin cambios) ... */}
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
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Box component="span" sx={{ width: 15, height: 15, borderRadius: '50%', bgcolor: '#A96E4A' }} /><Typography variant="caption">Ocupado</Typography></Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Box component="span" sx={{ width: 15, height: 15, borderRadius: '50%', bgcolor: '#9E9E9E' }} /><Typography variant="caption">Pendiente</Typography></Box>
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

            {/* --- PASO 1: PAQUETES --- */}
            {steps[activeStep] === "Paquetes" && (
              <Card className="shadow-lg rounded-2xl bg-transparent">
                 <CardContent>
                  <Typography className="text-center font-bold text-xl text-amber-900 mb-4">Paquetes Predeterminados</Typography>
                  <Grid container spacing={4} justifyContent="center">
                    {options.packages.map((item) => (
                     
                      <Grid item xs={12} sm={6} md={3} key={item.id}>
                        <Card className="p-3 shadow-md border border-gray-200 rounded-xl h-full flex flex-col text-center">
                          <img src={item.image || 'https://via.placeholder.com/150?text=No+Imagen'} alt={item.name} className="w-full h-40 object-contain rounded-lg mb-2" />
                          <CardContent className="flex-grow p-1">
                            <Typography className="font-bold text-gray-800 text-lg">{item.name}</Typography>
                           
                            {item.description && (
                              <Typography 
                                variant="body2" 
                                color="text.secondary" 
                                className="my-1 truncate block"
                                title={item.description}
                              >
                                {item.description}
                              </Typography>
                            )}

                            <Typography className="text-green-700 font-semibold mt-1 text-lg">${item.price} MXN</Typography>
                          </CardContent>
                          <CardActions className="justify-center p-0">
                            <IconButton onClick={() => handleQuantityChange(item, -1)}><Minus size={18} /></IconButton> {/* Llamada original sin tipo */}
                            <span className="font-bold text-xl mx-3">{selections.packageId === item.id ? 1 : 0}</span>
                            <IconButton onClick={() => handleQuantityChange(item, 1)}><Plus size={18} /></IconButton> {/* Llamada original sin tipo */}
                          </CardActions>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
                <CardActions className="justify-between px-4 pb-4"><Button onClick={handleBack}>Atrás</Button><Button variant="contained" onClick={handleNext} style={{ backgroundColor: "#A96E4A" }}>Siguiente</Button></CardActions>
              </Card>
            )}

            {/* --- PASO 2: DETALLES DEL PAQUETE --- */}
            {steps[activeStep] === packageDetailStep && (
              <Card className="rounded-2xl shadow-lg bg-transparent">
                <CardContent>
                  <Box className="text-center mb-6">
                    <PackageIcon className="mx-auto text-amber-600 h-12 w-12" />
                    <h3 className="text-center font-bold text-2xl text-amber-800 mt-2">
                      Detalles de tu Paquete: {currentPackage?.name}
                    </h3>
                  </Box>

                  {currentPackage && currentPackage.numBotanas > 0 && (
                    <PackageSelectionForm
                      title="Botanas Incluidas"
                      items={options.snacks}
                      selections={packageSnackSelections}
                      limit={currentPackage.numBotanas}
                      onChange={(id, delta) => handlePackageQuantityChange(id, delta, 'snack')}
                    />
                  )}

                  {currentPackage && currentPackage.numRefrescos > 0 && (
                    <PackageSelectionForm
                      title="Refrescos Incluidos"
                      items={options.drinks}
                      selections={packageDrinkSelections}
                      limit={currentPackage.numRefrescos}
                      onChange={(id, delta) => handlePackageQuantityChange(id, delta, 'drink')}
                    />
                  )}

                  {currentPackage && currentPackage.maxDesechables > 0 && (
                    <DisposableQuantityForm
                      min={currentPackage.minDesechables}
                      max={currentPackage.maxDesechables}
                      quantities={disposableQuantities}
                      onChange={handleDisposableQuantityChange}
                      onBlur={handleDisposableBlur}
                    />
                  )}

                </CardContent>
                <CardActions className="justify-between px-4 pb-4">
                  <Button onClick={handleBack}>Atrás</Button>
                  <Button variant="contained" onClick={handleNext} style={{ backgroundColor: "#A96E4A" }}>Siguiente</Button>
                </CardActions>
              </Card>
            )}

            {/* --- PASO 3: PERSONALIZACIÓN --- */}
            {steps[activeStep] === "Personalización" && (
              <Card className="rounded-2xl shadow-lg bg-transparent">
                <CardContent>
                  <h3 className="text-center font-bold text-xl text-amber-800 mb-4">Personaliza tu experiencia (Extras)</h3>

                  <Grid container spacing={3}>

                    {/* --- COLUMNA 1: BOTANAS --- */}
                    <Grid item xs={12} sm={6} md={4}>
                      <Typography className="mb-2 font-semibold text-amber-900 text-lg">Botanas</Typography>
                      {(options.snacks || []).map((item) => (
                        <AddonCard
                          key={item.id}
                          item={item}
                          itemType="snack" 
                          quantity={selections.addons[`snack_${item.id}`] || 0} 
                          onQuantityChange={handleQuantityChange}
                        />
                      ))}
                    </Grid>

                    {/* --- COLUMNA 2: BEBIDAS y DESECHABLES --- */}
                    <Grid item xs={12} sm={6} md={4}>
                      {/* BEBIDAS */}
                      <Typography className="mb-2 font-semibold text-amber-900 text-lg">Bebidas</Typography>
                      {(options.drinks || []).map((item) => (
                        <AddonCard
                          key={item.id}
                          item={item}
                          itemType="drink" // <-- Pasa el tipo
                          quantity={selections.addons[`drink_${item.id}`] || 0} 
                          onQuantityChange={handleQuantityChange}
                        />
                      ))}

                      {/* DESECHABLES (Debajo de bebidas) */}
                      <Typography className="mb-2 mt-6 font-semibold text-amber-900 text-lg">Desechables</Typography>
                      {(options.disposables || []).map((item) => (
                        <AddonCard
                          key={item.id}
                          item={item}
                          itemType="disposable" // <-- Pasa el tipo
                          quantity={selections.addons[`disposable_${item.id}`] || 0} 
                          onQuantityChange={handleQuantityChange}
                        />
                      ))}
                    </Grid>

                    {/* --- COLUMNA 3: MÚSICA --- */}
                    <Grid item xs={12} sm={12} md={4}> {/* Mantiene sm=12 */}
                      <Typography className="mb-2 font-semibold text-amber-900 text-lg">Música</Typography>
                      {(options.music || []).map((item) => {
                        const isSelected = selections.musicIds.includes(item.id);
                        return (
                          <Card key={item.id} onClick={() => handleMusicSelection(item.id)} className={`p-2 mb-3 border rounded-lg flex items-center relative cursor-pointer transition-all duration-200 ${isSelected ? 'bg-green-100 border-green-500 scale-105' : 'border-amber-300'}`} style={{ boxShadow: isSelected ? '0 0 10px rgba(16, 185, 129, 0.5)' : 'none' }}>
                            {isSelected && (<Box className="absolute top-1 right-1 bg-white rounded-full"><CheckCircle className="text-green-600" size={24} /></Box>)}
                            <Box className="flex-shrink-0 mr-3"><img src={item.image || 'https://via.placeholder.com/150?text=No+Imagen'} alt={item.name} className="w-16 h-16 object-contain rounded-md" /></Box>
                            
                            <Box className="flex-grow min-w-0">
                              <Typography className="font-medium truncate" title={item.name}>{item.name}</Typography>
                              
                              {item.description && (
                                <Typography 
                                  variant="caption" 
                                  color="text.secondary" 
                                  className="truncate block"
                                  title={item.description}
                                >
                                  {item.description}
                                </Typography>
                              )}

                              <Typography variant="body2" color="text.secondary">${item.price} MXN</Typography>
                            </Box>
                          </Card>
                        );
                      })}
                    </Grid>

                  </Grid>
                </CardContent>
                <CardActions className="justify-between px-4 pb-4">
                  <Button onClick={handleBack}>Atrás</Button>
                  <Button variant="contained" onClick={handleNext} style={{ backgroundColor: "#A96E4A" }}>Siguiente</Button>
                </CardActions>
              </Card>
            )}

            {/* --- PASO DE MÚSICA --- */}
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

            {/* --- PASO FINAL: RESUMEN --- */}
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
                  <Button variant="contained" color="success" onClick={handleAddToCart}> {isAdmin ? "Crear Reservación" : "Confirmar y Enviar al Carrito"}</Button>
                </CardActions>
              </Card>
            )}
          </Box>
        </Box>
      </div>
      
      {/* --- Renderizar el modal de alerta --- */}
      <AlertModal 
        isOpen={alertModalOpen} 
        onClose={handleAlertModalClose} 
        message={alertModalMessage} 
      />
    </div>
  );
};

export default ReservationModal;