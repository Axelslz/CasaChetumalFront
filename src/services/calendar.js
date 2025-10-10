import apiClient from './api.js';

/**
 * Obtiene los eventos (reservaciones) para un mes y año específicos.
 * @param {number} year - El año a consultar.
 * @param {number} month - El mes a consultar (formato 1-12).
 */
export const getEventsForMonthRequest = (year, month) => {
  // Pasamos el año y el mes como query params en la URL
  return apiClient.get(`/calendar/events?year=${year}&month=${month}`);
};