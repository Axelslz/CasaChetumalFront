import { useState, useEffect, useMemo } from "react"; // Añadir useMemo
import ReservationAlert from "./ReservationAlert.jsx";
import PaymentSuccessAlert from "./PaymentAlert.jsx";
import { useCart } from "../context/CartContext.jsx";
import { Smartphone, Banknote, Calendar, Clock } from "lucide-react"; // Añadir iconos
import dayjs from "dayjs";
// --- NUEVOS IMPORTS ---
import { Box, Grid, Typography } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import "dayjs/locale/es"; // Asegúrate de tener el locale
dayjs.locale("es");
// --- FIN NUEVOS IMPORTS ---

const PaymentMethod = ({ onBack, onSuccess }) => {
  const { pendingReservation, processPaymentAndCreateReservation } = useCart();
  
  const [selectedMethod, setSelectedMethod] = useState("");
  const [formData, setFormData] = useState({ firstName: "", lastName: "", receipt: null });
  const [isCashPaymentAllowed, setIsCashPaymentAllowed] = useState(true);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [showReservationSuccess, setShowReservationSuccess] = useState(false);

  // --- NUEVO ESTADO PARA PAGO EN EFECTIVO ---
  const [selectedPaymentDate, setSelectedPaymentDate] = useState(null);
  const [selectedPaymentTime, setSelectedPaymentTime] = useState(null);

  // --- LÓGICA DE FECHAS ---
  const eventDate = useMemo(() => {
    return pendingReservation?.summary?.fecha 
      ? dayjs(pendingReservation.summary.fecha, "DD/MM/YYYY") 
      : dayjs().add(10, 'day'); // Fallback
  }, [pendingReservation]);

  const maxPaymentDate = useMemo(() => eventDate.subtract(1, 'day'), [eventDate]);

  useEffect(() => {
    if (pendingReservation?.summary?.fecha) {
      const diffDays = eventDate.diff(dayjs(), 'day');
      if (diffDays <= 5) {
        setIsCashPaymentAllowed(false);
        setSelectedMethod('transfer');
      } else {
        setIsCashPaymentAllowed(true);
      }
    }
  }, [pendingReservation, eventDate]);

  // --- LÓGICA PARA EL CALENDARIO Y HORA ---
  const shouldDisableDate = (day) => {
    return day.day() === 0; // Deshabilita Domingos
  };

  let minPaymentTime = null;
  let maxPaymentTime = null;
  let isToday = false;

  if (selectedPaymentDate) {
    const dayOfWeek = selectedPaymentDate.day();
    isToday = selectedPaymentDate.isSame(dayjs(), 'day');

    if (dayOfWeek >= 1 && dayOfWeek <= 5) { // Lunes a Viernes
      minPaymentTime = dayjs().hour(9).minute(0);
      maxPaymentTime = dayjs().hour(16).minute(0); // 4:00 PM
    } else if (dayOfWeek === 6) { // Sábado
      minPaymentTime = dayjs().hour(9).minute(0);
      maxPaymentTime = dayjs().hour(13).minute(0); // 1:00 PM
    }

    if (isToday) {
      const now = dayjs();
      // Si la hora actual es después de la hora de inicio, la nueva hora de inicio es ahora
      if (now.isAfter(minPaymentTime)) {
        minPaymentTime = now;
      }
    }
  }
  // --- FIN LÓGICA DE FECHAS ---

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setFormData((prev) => ({ ...prev, receipt: file }));
  };

  // --- handleSubmit MODIFICADO ---
  const handleSubmit = async () => {
    if (!selectedMethod) return alert("Por favor selecciona un método de pago");
    if (!formData.firstName || !formData.lastName) return alert("Por favor completa todos los campos requeridos");

    let cashPaymentDateTimeISO = null;

    if (selectedMethod === "transfer" && !formData.receipt) {
      return alert("Por favor sube el comprobante de transferencia");
    }

    if (selectedMethod === "cash") {
      if (!selectedPaymentDate || !selectedPaymentTime) {
        return alert("Por favor selecciona un día y hora para tu pago en efectivo");
      }
      cashPaymentDateTimeISO = selectedPaymentDate
        .hour(selectedPaymentTime.hour())
        .minute(selectedPaymentTime.minute())
        .second(0)
        .toISOString();
    }

    try {
      // Pasamos *toda* la info de pago al contexto
      await processPaymentAndCreateReservation({
        method: selectedMethod,
        firstName: formData.firstName,
        lastName: formData.lastName,
        receipt: formData.receipt, // El objeto File
        cashPaymentDateTime: cashPaymentDateTimeISO, // El string ISO
      });
      
      setShowPaymentSuccess(true);
    } catch (error) {
      alert(`Error al confirmar el pago: ${error.response?.data?.message || 'Intente de nuevo.'}`);
    }
  };

  const handleSuccessClose = () => {
    setShowPaymentSuccess(false);
    setShowReservationSuccess(true);
  };
  
  const handleFinalClose = () => {
    setShowReservationSuccess(false);
    onSuccess();
  };
  
  const { summary, allOptions } = pendingReservation || {};
  const { packages = [], snacks = [], music = [], drinks = [], disposables = [] } = allOptions || {};
  const SALON_BASE_PRICE = 3250; // Ajustado al precio de tu backend

  // Lógica de addons mejorada para matchear IDs con prefijo
  const allAddons = [...snacks, ...drinks, ...disposables];

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 py-6 px-4">
        <div className="w-full max-w-4xl mx-auto">
          <button onClick={onBack} className="mb-4 text-amber-700 hover:text-amber-800 font-medium flex items-center gap-2">
            ← Volver al carrito
          </button>

          <div className="text-center mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-amber-800 mb-2">Método de Pago</h1>
            <p className="text-amber-600">Verifica tu pedido y selecciona una forma de pago</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Resumen de tu compra
            </h2>
            {summary ? (
              <>
                <div className="border-b pb-3 mb-3 text-sm">
                  <p><b>Cliente:</b> {summary.cliente}</p>
                  <p><b>Fecha del Evento:</b> {summary.fecha} a las {summary.hora}</p>
                </div>

                <table className="min-w-full text-sm my-4">
                  <thead className="text-left text-gray-500">
                    <tr>
                      <th className="pb-2 font-medium">Producto/Servicio</th>
                      <th className="text-center pb-2 font-medium">Cant.</th>
                      <th className="text-right pb-2 font-medium">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t">
                      <td className="py-2">Renta del Salón</td>
                      <td className="text-center">1</td>
                      <td className="text-right">${SALON_BASE_PRICE.toFixed(2)}</td>
                    </tr>
                    {summary.packageId && (() => {
                      const item = packages.find(p => p.id === summary.packageId);
                      const price = item ? parseFloat(item.price) : 0;
                      return item ? (<tr key={`pkg-${item.id}`} className="border-t"><td className="py-2">{item.name}</td><td className="text-center">1</td><td className="text-right">${price.toFixed(2)}</td></tr>) : null;
                    })()}
                    
                    {summary.addons && Object.entries(summary.addons).map(([key, qty]) => {
                      const id = key.split('_')[1]; // Maneja prefijos ej: "snack_1"
                      const item = allAddons.find(addon => addon.id == id);
                      const price = item ? parseFloat(item.price) : 0;
                      return item ? (
                        <tr key={`addon-${item.id}`} className="border-t">
                          <td className="py-2">{item.name}</td>
                          <td className="text-center">{qty}</td>
                          <td className="text-right">${(price * qty).toFixed(2)}</td>
                        </tr>
                      ) : null;
                    })}
                    
                    {summary.musicIds.map(id => {
                      const item = music.find(m => m.id === id);
                      const price = item ? parseFloat(item.price) : 0;
                      return item ? (<tr key={`music-${item.id}`} className="border-t"><td className="py-2">{item.name}</td><td className="text-center">1</td><td className="text-right">${price.toFixed(2)}</td></tr>) : null;
                    })}
                  </tbody>
                </table>

                <div className="flex justify-between items-center pt-3 border-t-2">
                  <span className="text-xl font-bold">Total a pagar:</span>
                  <span className="text-2xl font-bold text-amber-700">${summary.total?.toFixed(2)}</span>
                </div>
              </>
            ) : ( <p>No hay información de la compra. Por favor, vuelve a iniciar el proceso.</p> )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div onClick={() => setSelectedMethod("transfer")} className={`bg-white rounded-2xl shadow-xl p-6 cursor-pointer border-2 transition-all ${selectedMethod === "transfer" ? "border-amber-500 ring-4 ring-amber-200" : "border-transparent hover:border-amber-300"}`}>
              <div className="flex items-center mb-4">
                <Smartphone className="w-8 h-8 text-amber-600 mr-3" />
                <h3 className="text-lg font-bold text-gray-800">Transferencia Bancaria</h3>
              </div>
              <p className="text-sm text-gray-600">Pago inmediato con confirmación en 24-48 horas</p>
            </div>
            {isCashPaymentAllowed ? (
              <div onClick={() => setSelectedMethod("cash")} className={`bg-white rounded-2xl shadow-xl p-6 cursor-pointer border-2 transition-all ${selectedMethod === "cash" ? "border-amber-500 ring-4 ring-amber-200" : "border-transparent hover:border-amber-300"}`}>
                <div className="flex items-center mb-4">
                  <Banknote className="w-8 h-8 text-green-600 mr-3" />
                  <h3 className="text-lg font-bold text-gray-800">Pago en Efectivo</h3>
                </div>
                <p className="text-sm text-gray-600">Agenda una cita para pagar en el salón</p>
              </div>
            ) : (
              <div className="bg-gray-100 rounded-2xl shadow-inner p-6 border-2 border-dashed text-center text-gray-500 cursor-not-allowed">
                <Banknote className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <h3 className="text-lg font-bold">Pago en Efectivo no disponible</h3>
                <p className="text-sm mt-1">Solo para eventos con más de 5 días de anticipación.</p>
              </div>
            )}
          </div>

          {selectedMethod === "transfer" && (
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="p-4 md:p-6 bg-amber-50">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Información para transferencia</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-amber-500">
                  <h4 className="font-semibold text-gray-800 mb-3">Datos para transferencia:</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Banco:</span> BBVA Bancomer</p>
                    <p><span className="font-medium">Titular:</span>  Fernando Morales</p>
                    <p><span className="font-medium">Número de cuenta:</span> 4152314436497245</p>
                    
                  </div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex">
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800 mb-2">Instrucciones importantes:</h3>
                      <div className="text-xs text-blue-700 space-y-1">
                        <p>• Concepto: "Dia Evento - Nombre del que reservo"</p>
                        <p>• Sube foto clara del comprobante</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" placeholder="Nombre(s) completos *" value={formData.firstName} onChange={(e) => handleInputChange("firstName", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
                  <input type="text" placeholder="Apellidos *" value={formData.lastName} onChange={(e) => handleInputChange("lastName", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Comprobante de transferencia *</label>
                  <div className="w-full px-4 py-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <span className="text-amber-600 font-medium hover:text-amber-500">{formData.receipt ? formData.receipt.name : "Subir comprobante"}</span>
                      <input id="file-upload" type="file" className="sr-only" accept="image/*,application/pdf" onChange={handleFileChange} />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* --- NUEVO FORMULARIO DE PAGO EN EFECTIVO --- */}
          {selectedMethod === "cash" && (
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Agenda tu cita para pago en Efectivo</h3>
              <p className="text-sm text-gray-600 mb-4">
                Por favor, selecciona una fecha y hora para visitar el salón y realizar tu pago.
                <br />
                Horarios: <b>Lunes a Viernes (9am-4pm)</b> y <b>Sábados (9am-1pm)</b>. Domingos cerrado.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input type="text" placeholder="Nombre(s) completos *" value={formData.firstName} onChange={(e) => handleInputChange("firstName", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
                <input type="text" placeholder="Apellidos *" value={formData.lastName} onChange={(e) => handleInputChange("lastName", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
              </div>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={7}>
                  <Typography variant="h6" className="font-semibold text-gray-700 mb-2 flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-amber-600" />
                    1. Elige el día
                  </Typography>
                  <Box className="border rounded-lg overflow-hidden">
                    <StaticDatePicker
                      displayStaticWrapperAs="desktop"
                      value={selectedPaymentDate}
                      onChange={(newValue) => {
                        setSelectedPaymentDate(newValue);
                        setSelectedPaymentTime(null); // Resetea la hora
                      }}
                      minDate={dayjs()} // Desde hoy
                      maxDate={maxPaymentDate} // Hasta un día antes del evento
                      shouldDisableDate={shouldDisableDate} // Deshabilita domingos
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} md={5}>
                  <Typography variant="h6" className="font-semibold text-gray-700 mb-2 flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-amber-600" />
                    2. Elige la hora
                  </Typography>
                  <TimePicker
                    disabled={!selectedPaymentDate || (minPaymentTime && maxPaymentTime && minPaymentTime.isAfter(maxPaymentTime))}
                    value={selectedPaymentTime}
                    onChange={setSelectedPaymentTime}
                    minTime={minPaymentTime}
                    maxTime={maxPaymentTime}
                    minutesStep={15}
                    slotProps={{ 
                      textField: { 
                        fullWidth: true, 
                        helperText: !selectedPaymentDate ? "Selecciona una fecha primero" : "" 
                      } 
                    }}
                  />
                  {selectedPaymentDate && minPaymentTime && maxPaymentTime && minPaymentTime.isAfter(maxPaymentTime) && (
                    <Typography color="error" variant="caption" className="mt-2">
                      Ya no hay horas disponibles para este día. Por favor, elige otro día.
                    </Typography>
                  )}
                </Grid>
              </Grid>
            </div>
          )}

          {selectedMethod && (
            <div className="mt-6 flex justify-end">
              <button onClick={handleSubmit} className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-3 px-6 rounded-full shadow-lg transform hover:scale-105">
                Confirmar Pago
              </button>
            </div>
          )}
        </div>

        <PaymentSuccessAlert isOpen={showPaymentSuccess} onClose={handleSuccessClose} />
        <ReservationAlert isOpen={showReservationSuccess} onClose={handleFinalClose} cartData={{ items: [summary] }} />
      </div>
    </LocalizationProvider>
  );
};

export default PaymentMethod;