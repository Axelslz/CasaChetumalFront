import { useState, useEffect } from "react";
import ReservationAlert from "./ReservationAlert.jsx";
import PaymentSuccessAlert from "./PaymentAlert.jsx";
import { useCart } from "../context/CartContext.jsx";
import { Smartphone, Banknote } from "lucide-react";
import dayjs from "dayjs";

const PaymentMethod = ({ onBack, onSuccess }) => {
  const { pendingReservation, processPaymentAndCreateReservation } = useCart();
  
  const [selectedMethod, setSelectedMethod] = useState("");
  const [formData, setFormData] = useState({ firstName: "", lastName: "", receipt: null });
  const [isCashPaymentAllowed, setIsCashPaymentAllowed] = useState(true);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [showReservationSuccess, setShowReservationSuccess] = useState(false);

  useEffect(() => {
    if (pendingReservation?.summary?.fecha) {
      const eventDate = dayjs(pendingReservation.summary.fecha, "DD/MM/YYYY");
      const diffDays = eventDate.diff(dayjs(), 'day');
      if (diffDays <= 5) {
        setIsCashPaymentAllowed(false);
        setSelectedMethod('transfer');
      } else {
        setIsCashPaymentAllowed(true);
      }
    }
  }, [pendingReservation]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setFormData((prev) => ({ ...prev, receipt: file }));
  };

  const handleSubmit = async () => {
    if (!selectedMethod) return alert("Por favor selecciona un método de pago");
    if (!formData.firstName || !formData.lastName) return alert("Por favor completa todos los campos requeridos");
    if (selectedMethod === "transfer" && !formData.receipt) return alert("Por favor sube el comprobante de transferencia");

    try {
      await processPaymentAndCreateReservation();
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
  const { packages = [], snacks = [], music = [], drinks = [] } = allOptions || {};
  const SALON_BASE_PRICE = 3000;

  const allAddons = [...snacks, ...drinks];

  return (
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
                    return item ? (<tr key={`pkg-${item.id}`} className="border-t"><td className="py-2">{item.name}</td><td className="text-center">1</td><td className="text-right">${item.price}</td></tr>) : null;
                  })()}
                 
                  {summary.addons && Object.entries(summary.addons).map(([id, qty]) => {
                    const item = allAddons.find(addon => addon.id == id);
                    return item ? (
                      <tr key={`addon-${item.id}`} className="border-t">
                        <td className="py-2">{item.name}</td>
                        <td className="text-center">{qty}</td>
                        <td className="text-right">${(item.price * qty).toFixed(2)}</td>
                      </tr>
                    ) : null;
                  })}
                  
                  {summary.musicIds.map(id => {
                    const item = music.find(m => m.id === id);
                    return item ? (<tr key={`music-${item.id}`} className="border-t"><td className="py-2">{item.name}</td><td className="text-center">1</td><td className="text-right">${item.price}</td></tr>) : null;
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
              <p className="text-sm text-gray-600">Paga el día del evento</p>
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
                    <p><span className="font-medium">Titular:</span> Uri Jair Gallegos Gonzales</p>
                    <p><span className="font-medium">Número de cuenta:</span> 0123456789012345</p>
                    <p><span className="font-medium">CLABE:</span> 012180001234567890</p>
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
                    <input id="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedMethod === "cash" && (
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Pago en Efectivo</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="Nombre(s) completos *" value={formData.firstName} onChange={(e) => handleInputChange("firstName", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
              <input type="text" placeholder="Apellidos *" value={formData.lastName} onChange={(e) => handleInputChange("lastName", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
            </div>
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
  );
};

export default PaymentMethod;