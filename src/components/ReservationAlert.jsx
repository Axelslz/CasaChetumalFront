import React, { useEffect } from "react";
import { X, CheckCircle } from "lucide-react";

const ReservationAlert = ({ isOpen, onClose, cartData }) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000); // 4 segundos

      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl transform animate-scale-in relative">
        <div className="text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <CheckCircle className="text-white" size={40} />
          </div>

          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            ¡Reservación Exitosa!
          </h3>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-amber-200">
            <p className="text-gray-700 text-lg leading-relaxed">
              Tu reservación en{" "}
              <span className="font-semibold text-amber-800">
                Casa Chetumal
              </span>{" "}
              se realizó de manera exitosa para el día{" "}
              <span className="font-bold text-orange-800">
                {cartData.items[0]?.fecha}
              </span>{" "}
              a las{" "}
              <span className="font-bold text-orange-800">
                {cartData.items[0]?.hora}
              </span>
              .<br /> 
              ¡Te esperamos!
            </p>
          </div>

          <button
            onClick={onClose}
            className="bg-gradient-to-r from-amber-900 to-orange-900 text-white px-6 py-3 rounded-full font-semibold hover:from-amber-950 hover:to-orange-950 transform hover:scale-105 transition-all duration-300 shadow-lg"
          >
            Continuar
          </button>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors duration-200"
          >
            <X size={24} />
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .animate-scale-in {
          animation: scale-in 0.4s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ReservationAlert;
