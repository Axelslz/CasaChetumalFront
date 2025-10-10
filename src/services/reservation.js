import apiClient from './api.js';

export const getReservationOptions = () => {
  return apiClient.get('/options');
};

/** * @param {FormData} reservationData 
 */
export const createReservationRequest = (reservationData) => {
  return apiClient.post('/reservations', reservationData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

/**
 * @param {object} selections 
 */
export const calculateTotalRequest = (selections) => {
  return apiClient.post('/reservations/calculate-total', selections);
};

export const getAllReservationsRequest = () => {
  return apiClient.get('/reservations');
};

/**
 * Actualiza el estado de una reservación específica.
 * @param {string} id 
 * @param {string} newStatus 
 */
export const updateReservationStatusRequest = (id, newStatus) => {
  return apiClient.put(`/reservations/${id}/status`, { status: newStatus });
};

export const getOccupiedDatesRequest = () => {
  return apiClient.get('/reservations/occupied-dates');
};