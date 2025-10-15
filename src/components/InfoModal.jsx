import React from "react";
import { X } from "lucide-react";

const InfoModal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    // Fondo oscuro
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      {/* Contenedor del Modal */}
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Encabezado */}
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-xl font-bold text-gray-800">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Contenido con scroll */}
        <div className="p-6 max-h-[60vh] overflow-y-auto text-gray-700">
          {children}
        </div>
      </div>
    </div>
  );
};

export default InfoModal;