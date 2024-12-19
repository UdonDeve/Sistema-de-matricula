import React, { useEffect, useState } from 'react';
import { supabase } from '../services/SupabaseClient';
import { FaTrash } from 'react-icons/fa'; // Icono de eliminar

const Lista_Estudiantes = () => {
  const [estudiantes, setEstudiantes] = useState([]);

  // Cargar estudiantes al montar el componente
  useEffect(() => {
    const fetchEstudiantes = async () => {
      const { data, error } = await supabase
        .from('estudiantes')  // Solo la tabla estudiantes
        .select('*');  // Seleccionamos todas las columnas de la tabla estudiantes

      if (error) {
        console.error("Error al obtener estudiantes:", error);
      } else {
        setEstudiantes(data);  // Guardamos los estudiantes obtenidos
      }
    };
    fetchEstudiantes();
  }, []);

  // Función para eliminar estudiante
  const eliminarEstudiante = async (id) => {
    const { error } = await supabase
      .from('estudiantes')
      .delete()
      .match({ id });

    if (error) {
      console.error("Error al eliminar estudiante:", error);
    } else {
      setEstudiantes(estudiantes.filter(estudiante => estudiante.id !== id));  // Eliminamos el estudiante de la lista
    }
  };

  return (
    <div className="p-4 bg-gray-400">
      <h1 className="text-2xl font-bold py-2 px-4 text-black">Registro de Estudiantes</h1>
      <div className="w-full bg-white shadow-md p-8 rounded-md mt-4">
        <button className="px-4 py-2 bg-red-600 text-lg font-semibold text-black border
         border-gray-800 rounded-md hover:bg-blue-600 mb-8">
          Lista de Estudiantes Registrados
        </button>

        <table className="min-w-full bg-blue-400 shadow-md rounded-md">
          <thead className="bg-blue-600">
            <tr>
              <th className="py-2 px-4 text-left">ID</th> {/* Agregamos la columna para mostrar el ID */}
              <th className="py-2 px-4 text-left">DNI</th>
              <th className="py-2 px-4 text-left">Nombres</th>
              <th className="py-2 px-4 text-left">Apellido</th>
              <th className="py-2 px-4 text-left">Sexo</th>
              <th className="py-2 px-4 text-left">Ubicación</th>
              <th className="py-2 px-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {estudiantes.length > 0 ? (
              estudiantes.map((estudiante) => (
                <tr key={estudiante.id} className="border-b">
                  <td className="py-2 px-4">{estudiante.id}</td> {/* Mostramos el ID aquí */}
                  <td className="py-2 px-4">{estudiante.dni}</td>
                  <td className="py-2 px-4">{estudiante.nombres} {estudiante.apellido}</td>
                  <td className="py-2 px-4">{estudiante.apellido}</td>
                  <td className="py-2 px-4">{estudiante.sexo}</td>
                  <td className="py-2 px-4">{estudiante.ubicacion}</td>
                  <td className="py-2 px-4 text-center">
                    <button
                      onClick={() => eliminarEstudiante(estudiante.id)}
                      className="p-2 bg-red-500 text-white rounded-md"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="py-2 px-4 text-center text-gray-600">No hay estudiantes registrados</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Lista_Estudiantes;
