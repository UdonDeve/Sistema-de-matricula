import React, { useEffect, useState } from 'react';
import { supabase } from '../services/SupabaseClient';
import { FaTrash } from 'react-icons/fa'; // Icono de eliminar

const Lista_Apoderados = () => {
  const [apoderados, setApoderados] = useState([]);

  // Cargar apoderados al montar el componente
  useEffect(() => {
    const fetchApoderados = async () => {
      const { data, error } = await supabase
        .from('apoderados')  // Tabla de apoderados
        .select('*');  // Seleccionamos todas las columnas de la tabla apoderados

      if (error) {
        console.error("Error al obtener apoderados:", error);
      } else {
        setApoderados(data);  // Guardamos los apoderados obtenidos
      }
    };
    fetchApoderados();
  }, []);

  // Función para eliminar apoderado
  const eliminarApoderado = async (id) => {
    const { error } = await supabase
      .from('apoderados')
      .delete()
      .match({ id });

    if (error) {
      console.error("Error al eliminar apoderado:", error);
    } else {
      setApoderados(apoderados.filter(apoderado => apoderado.id !== id));  // Eliminamos el apoderado de la lista
    }
  };

  return (
    <div className="p-4 bg-gray-400">
      <h1 className="text-2xl font-bold py-2 px-4 text-black">Registro de Apoderados</h1>
      <div className="w-full bg-white shadow-md p-8 rounded-md mt-4">
        <button className="px-4 py-2 bg-red-600 text-lg font-semibold text-black border
         border-gray-800 rounded-md hover:bg-blue-600 mb-8">
          Lista de Apoderados Registrados
        </button>

        <table className="min-w-full bg-blue-400 shadow-md rounded-md">
          <thead className="bg-blue-600">
            <tr>
              <th className="py-2 px-4 text-left">DNI</th>
              <th className="py-2 px-4 text-left">Nombres</th>
              <th className="py-2 px-4 text-left">Apellido</th>
              <th className="py-2 px-4 text-left">Sexo</th>
              <th className="py-2 px-4 text-left">Ubicación</th>
              <th className="py-2 px-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {apoderados.length > 0 ? (
              apoderados.map((apoderado, index) => (
                <tr key={index} className="border-b">
                  <td className="py-2 px-4">{apoderado.dni}</td>
                  <td className="py-2 px-4">{apoderado.nombres} {apoderado.apellido}</td>
                  <td className="py-2 px-4">{apoderado.apellido}</td>
                  <td className="py-2 px-4">{apoderado.sexo}</td>
                  <td className="py-2 px-4">{apoderado.ubicacion}</td>
                  <td className="py-2 px-4 text-center">
                    <button
                      onClick={() => eliminarApoderado(apoderado.id)}
                      className="p-2 bg-red-500 text-white rounded-md"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="py-2 px-4 text-center text-gray-600">No hay apoderados registrados</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Lista_Apoderados;
