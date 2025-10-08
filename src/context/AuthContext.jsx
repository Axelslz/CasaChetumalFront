import { createContext, useContext, useState } from "react";
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

  const login = async (credentials) => {
    try {
      const res = await loginAdmin(credentials); 
      setUser(res.data);
      setIsAuthenticated(true);
      return res.data;
    } catch (error) {
      console.error("Error en el login:", error.response.data.message);
      setUser(null);
      setIsAuthenticated(false);
      throw error; 
    }
  };

 const logout = async () => {
  try {
    await logoutAdmin(); 
    setUser(null);
    setIsAuthenticated(false);
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
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