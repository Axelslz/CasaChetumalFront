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

  const processPaymentAndCreateReservation = async (paymentData) => {
    
    if (!pendingReservation || !pendingReservation.dataToSend) {
      throw new Error("No hay reservación pendiente o dataToSend no existe.");
    }
    
    const finalData = pendingReservation.dataToSend; 
  
    const fullName = `${paymentData.firstName} ${paymentData.lastName}`;
    finalData.set('clientName', fullName); 
    
    finalData.append('paymentMethod', paymentData.method);
    
    if (paymentData.method === 'transfer' && paymentData.receipt) {
      finalData.append('receipt', paymentData.receipt, paymentData.receipt.name); 
    }
    
    if (paymentData.method === 'cash' && paymentData.cashPaymentDateTime) {
      finalData.append('cashPaymentDateTime', paymentData.cashPaymentDateTime); 
    }
    
    try {
      const response = await createReservationRequest(finalData); 
      
      clearCart();
      return response;
    } catch (error) {
      console.error("Error al procesar la reservación:", error);
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