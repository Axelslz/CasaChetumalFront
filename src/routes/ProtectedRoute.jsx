import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProtectedRoute() {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Cargando...</div>; 
  }

  if (!loading && (!isAuthenticated || user.role !== "admin")) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}