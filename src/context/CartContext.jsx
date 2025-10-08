import React, { createContext, useState, useContext } from 'react';
import { createReservationRequest } from '../services/reservation.js';

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

  const processPaymentAndCreateReservation = async () => {
    if (!pendingReservation) throw new Error("No hay reservación en el carrito.");
    try {
      const response = await createReservationRequest(pendingReservation.dataToSend);
      alert("¡Reservación creada con éxito!");
      clearCart();
      return response;
    } catch (error) {
      console.error("Error al procesar el pago:", error);
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