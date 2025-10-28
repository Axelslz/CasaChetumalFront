import React, { createContext, useState, useContext } from 'react';
import { createReservationRequest } from '../services/reservation.js'; // Asegúrate que esta ruta es correcta

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart debe ser usado dentro de un CartProvider");
  return context;
};

export const CartProvider = ({ children }) => {
  const [pendingReservation, setPendingReservation] = useState(null);

  const addReservationToCart = (reservationData) => {
    setPendingReservation(reservationData);
  };

  const clearCart = () => {
    setPendingReservation(null);
  };

  const processPaymentAndCreateReservation = async (paymentData) => {
    if (!pendingReservation || typeof pendingReservation.getBaseFormData !== 'function' || !pendingReservation.summary) {
      console.error("CartContext Error: Faltan datos en pendingReservation (getBaseFormData o summary).");
      throw new Error("No hay reservación pendiente válida en el carrito.");
    }

    try {
      // 1. Obtener FormData base
      const finalData = pendingReservation.getBaseFormData();

      // 2. Añadir/Sobrescribir datos del pago
      const fullName = `${paymentData.firstName} ${paymentData.lastName}`;
      finalData.set('clientName', fullName);
      finalData.set('paymentMethod', paymentData.method);

      if (paymentData.method === 'transfer' && paymentData.receipt) {
        if (!finalData.has('receipt')) {
           finalData.append('receipt', paymentData.receipt, paymentData.receipt.name);
        }
      } else {
        finalData.delete('receipt');
      }

      if (paymentData.method === 'cash' && paymentData.cashPaymentDateTime) {
         finalData.set('cashPaymentDateTime', paymentData.cashPaymentDateTime);
      } else {
         finalData.delete('cashPaymentDateTime');
      }

      if (pendingReservation.summary.addons && typeof pendingReservation.summary.addons === 'object') {
          finalData.set('addons', JSON.stringify(pendingReservation.summary.addons));
          console.log("Añadiendo addons al FormData:", pendingReservation.summary.addons); 
      } else {
          finalData.delete('addons');
          console.log("No se encontraron addons válidos para añadir."); 
      }

      console.log("FormData final a enviar:", Object.fromEntries(finalData.entries())); // Verifica que 'addons' esté aquí

      // 3. Llamar a la API
      const response = await createReservationRequest(finalData);

      // 4. Limpiar y retornar
      clearCart();
      return response;

    } catch (error) {
      console.error("Error al procesar la reservación en CartContext:", error);
      throw error;
    }
  };

  return (
    <CartContext.Provider
      value={{
        pendingReservation,
        addReservationToCart,
        clearCart,
        processPaymentAndCreateReservation,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};