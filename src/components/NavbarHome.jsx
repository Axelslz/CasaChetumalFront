import React from "react";
import { Menu, X, ClipboardPlus, ShoppingCart } from "lucide-react";
import { useCart } from "../context/CartContext.jsx";
import miLogo from "../assets/img/logo.png";

const NavbarHome = ({
  isMobileMenuOpen,
  toggleMobileMenu,
  handleNavClick,
  handleReservationClick,
  handleCartClick,
}) => {
  const { pendingReservation } = useCart();
  return (
    <header className="bg-orange-200 backdrop-blur-md shadow-lg sticky top-0 z-50 transition-all duration-300">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-13 h-13 mr-1 bg-gradient-to-br from-amber-900 to-orange-950 rounded-full flex items-center justify-center">
              <img src={miLogo} alt="logo" className="w-full max-h-28 object-cover rounded-lg" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-900 to-orange-950 bg-clip-text text-transparent">
                Casa Chetumal
              </h1>
              <p className="text-sm text-gray-900">Eventos Especiales</p>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            
            <a
              href="#contacto"
              className="text-gray-950 hover:text-amber-950 transition-colors duration-300 font-medium"
              onClick={() => handleNavClick("#contacto")}
            >
              Contacto
            </a>
            <button
              className="bg-gradient-to-r from-amber-900 to-orange-900 text-white px-6 py-2 rounded-full hover:from-amber-950 hover:to-orange-950 transform hover:scale-105 transition-all duration-300 shadow-lg"
              onClick={handleReservationClick}
            >
              Reserva Ahora
            </button>
            <button
              onClick={handleCartClick}
              className="relative text-gray-950 hover:text-amber-950 transition-colors duration-300 p-2"
              aria-label="Carrito de compras"
            >
              <ShoppingCart size={24} />
              {pendingReservation && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  1
                </span>
              )}
            </button>
          </div>

          {/* Mobil Menu */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-900 hover:text-amber-950 transition-colors duration-300 p-2"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen
              ? "max-h-64 opacity-100 mt-4"
              : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          <div className="py-4 border-t border-amber-300">
            <div className="flex flex-col space-y-4">
              <a
                href="#contacto"
                className="text-gray-950 hover:text-amber-950 transition-colors duration-300 font-medium py-2 px-4 hover:bg-amber-100 rounded-lg"
                onClick={() => handleNavClick("#contacto")}
              >
                Contacto
              </a>
              <button
                className="bg-gradient-to-r from-amber-900 to-orange-900 text-white px-6 py-3 rounded-full hover:from-amber-950 hover:to-orange-950 transition-all duration-300 shadow-lg mx-4 font-medium"
                onClick={handleReservationClick}
              >
                <ClipboardPlus className="inline-block mr-2" size={16} />
                Reserva Ahora
              </button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default NavbarHome;
