import apiClient from './api.js';

export const getReservationOptions = () => {
  return apiClient.get('/options');
};

/** 
 * @param {FormData} reservationData 
 */

export const createReservationRequest = (reservationData) => {

  return apiClient.post('/reservations', reservationData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
