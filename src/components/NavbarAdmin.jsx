import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function NavbarAdmin() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); 
    navigate("/login"); 
  };

  return (
    <header className="bg-orange-200 backdrop-blur-md sticky top-0 z-50 transition-all duration-300" 
      style={{ backgroundColor: "#D2B074", border: "None" }}>
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          
          <h2 className="text-lg md:text-xl lg:text-2xl font-semibold text-gray-800 leading-tight">
              Bienvenido {" "}
              <span className="bg-gradient-to-r from-amber-900 to-orange-950 bg-clip-text text-transparent">
                {user?.name}
              </span>
          </h2>
          <button
            onClick={handleLogout}
            className="bg-red-600 rounded-xl text-white font-semibold px-6 py-2.5 hover:bg-red-500"
          >
            Cerrar Sesión
          </button>

        </div>
        
      </nav>
    </header>

  );
}
