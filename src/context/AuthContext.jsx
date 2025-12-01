import { createContext, useContext, useState, useEffect } from "react";
import { loginAdmin , logoutAdmin } from "../services/api.js"; 

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    async function checkLogin() {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setIsAuthenticated(false);
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const res = await verifyTokenRequest();
        
        setUser(res.data);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Token inválido:", error);
        localStorage.removeItem('authToken'); 
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    }

    checkLogin();
  }, []); 


  const login = async (credentials) => {
    try {
      const res = await loginAdmin(credentials); 
      localStorage.setItem('authToken', res.data.token); 
      setUser(res.data.user); 
      setIsAuthenticated(true);
      return res.data;

    } catch (error) {
      console.error("Error en el login:", error.response.data.message);
      localStorage.removeItem('authToken');
      setUser(null);
      setIsAuthenticated(false);
      throw error; 
    }
  };

 const logout = async () => {
    try { 
      localStorage.removeItem('authToken');
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      localStorage.removeItem('authToken');
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading, 
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};