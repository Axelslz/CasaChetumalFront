import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
});

export const loginAdmin = (credentials) => apiClient.post('/login', credentials);
export const logoutAdmin = () => apiClient.post('/logout');

export default apiClient;