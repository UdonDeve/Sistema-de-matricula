// Cruds.jsx
import React from 'react';
import { FaPlus, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';

const Cruds = ({ onAdd, onEdit, onDelete }) => {
  return (
    <div className="flex flex-col space-y-4">
      {/* Botón para agregar */}
      <button
        onClick={onAdd}
        className="p-2 bg-blue-500 text-white rounded flex items-center justify-center"
      >
        <FaPlus className="h-8 mr-2" />
        Agregar
      </button>

      {/* Botón para modificar */}
      <button
        onClick={onEdit}
        className="p-2 bg-yellow-500 text-white rounded flex items-center justify-center"
      >
        <FaEdit className="h-8 mr-2" />
        Modificar
      </button>

      {/* Botón para eliminar */}
      <button
        onClick={onDelete}
        className="p-2 bg-red-500 text-white rounded flex items-center justify-center"
      >
        <FaTrash className="h-8 mr-2" />
        Eliminar
      </button>

      {/* Botón para cancelar */}
      <button
        onClick={() => console.log("Cancelar acción")}
        className="p-2 bg-gray-500 text-white rounded flex items-center justify-center"
      >
        <FaTimes className="h-8 mr-2" />
        Cancelar
      </button>
    </div>
  );
};

export default Cruds;
