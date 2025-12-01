import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import miLogo from "../assets/img/logo.png"; // <-- 1. AÑADE ESTA LÍNEA

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
          
          {/* --- 2. PEGA EL BLOQUE DEL LOGO AQUÍ --- */}
          <div className="flex items-center space-x-3">
            <div className="w-13 h-13 mr-1 bg-gradient-to-br from-amber-900 to-orange-950 rounded-full flex items-center justify-center">
              <img src={miLogo} alt="logo" className="w-full max-h-28 object-cover rounded-lg" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-900 to-orange-950 bg-clip-text text-transparent">
                Casa Chetumal
              </h1>
              {/* Cambié el subtítulo para que diga "Panel de Admin" */}
              <p className="text-sm text-gray-900">Panel de Admin</p>
            </div>
          </div>

          {/* --- 3. AGRUPA EL SALUDO Y EL BOTÓN A LA DERECHA --- */}
          <div className="flex items-center space-x-6">
            <h2 className="text-lg md:text-xl lg:text-2xl font-semibold text-gray-800 leading-tight hidden md:block">
                Bienvenido {" "}
                <span className="bg-gradient-to-r from-amber-900 to-orange-950 bg-clip-text text-transparent">
                  {user?.name || 'Admin'}
                </span>
            </h2>
            <button
              onClick={handleLogout}
              className="bg-red-600 rounded-xl text-white font-semibold px-6 py-2.5 hover:bg-red-500"
            >
              Cerrar Sesión
            </button>
          </div>

        </div>
        
      </nav>
    </header>

  );
}
