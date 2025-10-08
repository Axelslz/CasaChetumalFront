import React, { useEffect } from "react";
import { CheckCircle, X, CreditCard } from "lucide-react";

const PaymentSuccessAlert = ({ isOpen, onClose }) => {
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
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 transform animate-scale-in">
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-t-3xl p-8 relative overflow-hidden text-center">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-10 rounded-full -translate-y-20 translate-x-20"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-10 rounded-full translate-y-16 -translate-x-16"></div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors p-2 hover:bg-white hover:bg-opacity-20 rounded-full"
          >
            <X size={24} />
          </button>

          <div className="relative z-10">
            <div className="bg-white bg-opacity-20 p-4 rounded-full inline-block mb-4 backdrop-blur">
              <CheckCircle size={60} className="text-white animate-bounce" />
            </div>
            <h2 className="text-white text-2xl font-bold">¡Pago Exitoso!</h2>
            <p className="text-green-100 text-lg mt-2">
              Tu transacción se completó correctamente
            </p>
          </div>
        </div>

        <div className="p-8">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-green-400 to-emerald-500 p-5 rounded-2xl shadow-xl transform hover:scale-110 transition-transform duration-300 cursor-pointer">
              <CreditCard size={50} className="text-white mb-2" />
              <div className="flex space-x-2">
                <div className="w-8 h-2 bg-white bg-opacity-70 rounded-full animate-pulse"></div>
                <div
                  className="w-8 h-2 bg-white bg-opacity-70 rounded-full animate-pulse"
                  style={{ animationDelay: "0.5s" }}
                ></div>
                <div
                  className="w-8 h-2 bg-white bg-opacity-70 rounded-full animate-pulse"
                  style={{ animationDelay: "1s" }}
                ></div>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl active:scale-95 text-lg"
          >
            Continuar
          </button>

          <button
            onClick={onClose}
            className="w-full mt-3 bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl active:scale-95 text-lg"
          >
            Cerrar
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

export default PaymentSuccessAlert;
