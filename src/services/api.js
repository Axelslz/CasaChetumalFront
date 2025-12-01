import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://casachetumalback.onrender.com/api",
  withCredentials: false 
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config; 
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const loginAdmin = (credentials) => apiClient.post('/login', credentials);
export const logoutAdmin = () => apiClient.post('/logout');
export const verifyTokenRequest = () => { return apiClient.get('/auth/verify'); };

export default apiClient;