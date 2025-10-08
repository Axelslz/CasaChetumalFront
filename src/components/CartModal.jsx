import React from "react";
import { useCart } from '../context/CartContext.jsx';

const CartModal = ({ isOpen, onClose, onProceedToPayment }) => {
  const { pendingReservation } = useCart();

  if (!isOpen) return null;

  const { summary, allOptions } = pendingReservation || {};
  const { packages = [], snacks = [], music = [] } = allOptions || {};

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-600">✖</button>
        <h2 className="text-2xl font-bold mb-4 text-amber-900">Resumen de Compras</h2>

        {!summary ? (
          <p className="text-gray-500">Tu carrito está vacío</p>
        ) : (
          <div>
            <div className="border-b pb-2 mb-4 space-y-1">
              <p><b>Cliente:</b> {summary.cliente}</p>
              <p><b>Fecha:</b> {summary.fecha} a las {summary.hora}</p>
            </div>
            
            <table className="min-w-full text-sm">
              <thead className="text-left text-gray-500">
                <tr>
                  <th className="pb-2 font-medium">Producto</th>
                  <th className="text-center pb-2 font-medium">Cant.</th>
                  <th className="text-right pb-2 font-medium">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="py-2">Renta del Salón</td>
                  <td className="text-center">1</td>
                  <td className="text-right">$3000.00</td>
                </tr>
                {summary.packageId && (() => {
                  const item = packages.find(p => p.id === summary.packageId);
                  return item ? (<tr key={item.id} className="border-t"><td className="py-1">{item.name}</td><td className="text-center">1</td><td className="text-right">${item.price}</td></tr>) : null;
                })()}
                {Object.entries(summary.snackIds).map(([id, qty]) => {
                  const item = snacks.find(s => s.id == id);
                  return item ? (<tr key={item.id} className="border-t"><td className="py-1">{item.name}</td><td className="text-center">{qty}</td><td className="text-right">${(item.price * qty).toFixed(2)}</td></tr>) : null;
                })}
                {summary.musicIds.map(id => {
                  const item = music.find(m => m.id === id);
                  return item ? (<tr key={item.id} className="border-t"><td className="py-1">{item.name}</td><td className="text-center">1</td><td className="text-right">${item.price}</td></tr>) : null;
                })}
              </tbody>
            </table>

            <div className="flex justify-between border-t mt-4 pt-2 text-lg">
              <span className="font-bold">Total a Pagar</span>
              <span className="font-bold">${summary.total.toFixed(2)}</span>
            </div>
          </div>
        )}

        <button 
          onClick={onProceedToPayment} 
          disabled={!pendingReservation}
          className="mt-6 w-full bg-amber-700 text-white py-2 rounded-lg text-lg font-semibold hover:bg-amber-800 disabled:bg-gray-400"
        >
          Pagar y Confirmar
        </button>
      </div>
    </div>
  );
};

export default CartModal;