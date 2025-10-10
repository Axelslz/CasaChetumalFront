import apiClient from './api.js';

export const getPaymentSummaryRequest = () => {
  return apiClient.get('/dashboard/payment-summary');
};

export const getAllPaidReservationsRequest = () => {
  return apiClient.get('/paid-reservations'); 
};

export const getFullDashboardStatsRequest = () => {
  return apiClient.get('/dashboard/full-stats');
};