import { useState } from "react"; // 1. Importamos useState
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); 

    try {
      const userCredentials = { email, password };
      
      await login(userCredentials);
     
      navigate("/admin/dashboard");

    } catch (err) {
      setError(err.response?.data?.message || "Error desconocido al iniciar sesión");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex flex-col items-center justify-center px-4">
      <header className="text-center mb-10">
        <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold text-gray-800 mb-6 leading-tight">
          Bienvenido a{" "}
          <span className="bg-gradient-to-r from-amber-900 to-orange-950 bg-clip-text text-transparent">
            Casa Chetumal
          </span>
        </h2>
      </header>

      <div className="bg-gradient-to-br from-amber-100 to-orange-100 shadow-xl rounded-3xl p-8 w-full max-w-md border-amber-200">
        <h1 className="text-3xl font-bold text-center text-amber-900 mb-4">
          Casa Chetumal
        </h1>
        <p className="text-center text-gray-700 mb-6">
          Inicia sesión para continuar
        </p>

        {/* 4. Mostramos el mensaje de error si existe */}
        {error && <p className="bg-red-500 text-white p-2 rounded-md text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-800 font-medium mb-1">
              Correo
            </label>
            <input
              type="email"
              placeholder="ejemplo@email.com"
              required
              className="w-full px-4 py-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-600 outline-none"
              // 5. Conectamos el input al estado
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-gray-800 font-medium mb-1">
              Contraseña
            </label>
            <input
              type="password"
              placeholder="••••••••"
              required
              className="w-full px-4 py-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-600 outline-none"
              // 5. Conectamos el input al estado
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between text-sm text-gray-600">
            <a href="#" className="hover:text-amber-800">
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          <button
            type="submit"
            className="w-full mt-6 bg-gradient-to-r from-amber-900 to-orange-900 text-white text-lg py-3 rounded-lg font-semibold hover:from-amber-950 hover:to-orange-950 transform hover:scale-105 transition-all duration-300 shadow-lg"
          >
            Iniciar sesión
          </button>
        </form>

        <p className="text-center text-gray-700 text-sm mt-6">
          © 2025 Casa Chetumal
        </p>
      </div>
    </div>
  );
}
