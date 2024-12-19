import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa'; // Icono de advertencia

const AdvertenciaCierre = ({ onClose, onLogout }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        {/* Ícono animado de advertencia */}
        <div className="flex justify-center mb-2">
          <FaExclamationTriangle className="text-6xl animate-pulse text-red-600" />
        </div>
        <p className="mb-6 text-gray-700 flex flex-col">
          ¿Estás seguro de cerrar sesión?
          <span>
            Siga trabajando vago
          </span>
        </p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={onLogout}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Aceptar
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdvertenciaCierre;
