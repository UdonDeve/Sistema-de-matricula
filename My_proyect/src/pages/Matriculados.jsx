import React, { useState, useEffect } from "react";
import { supabase } from "../services/SupabaseClient";
import { FaTrash } from 'react-icons/fa';

export const Matriculados = () => {
  const [estudiantesMatriculados, setEstudiantesMatriculados] = useState([]);
  const [gradoSeleccionado, setGradoSeleccionado] = useState('');

  // Cargar estudiantes matriculados al montar el componente
  useEffect(() => {
    const fetchEstudiantesMatriculados = async () => {
      let query = supabase
        .from('matriculas')
        .select(`
          estudiantes(id, dni, nombres, apellido, sexo, ubicacion),
          grados(nombre),
          fecha_matricula
        `)
        .order('fecha_matricula', { ascending: false });

      if (gradoSeleccionado) {
        query = query.eq('grado_id', gradoSeleccionado); // Filtrar por grado seleccionado
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error al obtener estudiantes matriculados:", error);
      } else {
        // Filtramos para obtener solo estudiantes únicos
        const estudiantesUnicos = [];
        const idsEstudiantes = new Set();

        // Recorremos los registros y aseguramos que solo aparezca un estudiante
        data.forEach((registro) => {
          const { estudiantes, grados, fecha_matricula } = registro;

          if (!idsEstudiantes.has(estudiantes.id)) {
            estudiantesUnicos.push({
              id: estudiantes.id,
              dni: estudiantes.dni,
              nombres: estudiantes.nombres,
              apellido: estudiantes.apellido,
              grado: grados.nombre,
              fecha_matricula: new Date(fecha_matricula).toLocaleDateString(),
            });
            idsEstudiantes.add(estudiantes.id); // Añadimos el ID al Set para evitar duplicados
          }
        });

        setEstudiantesMatriculados(estudiantesUnicos);  // Guardamos los estudiantes únicos obtenidos
      }
    };

    fetchEstudiantesMatriculados();
  }, [gradoSeleccionado]); // Dependencia para recargar los estudiantes cuando se cambie el grado

  // Función para eliminar estudiante de la base de datos
  const eliminarEstudiante = async (id) => {
    const { error } = await supabase
      .from('matriculas')
      .delete()
      .match({ id });

    if (error) {
      console.error("Error al eliminar estudiante:", error);
    } else {
      // Después de eliminarlo, refrescamos la lista de estudiantes matriculados
      fetchEstudiantesMatriculados();  // Recargamos los estudiantes matriculados desde la base de datos
    }
  };

  return (
    <div className="p-4 bg-gray-400">
      <h1 className="text-2xl font-bold py-2 px-4 text-black">Estudiantes Matriculados</h1>

      {/* Filtro por Grado */}
      <div className="mb-4 space-x-5">
        <label htmlFor="gradoSelect" className="text-sm font-semibold text-black">Filtrar por Grado</label>
        <select
          id="gradoSelect"
          value={gradoSeleccionado}
          onChange={(e) => setGradoSeleccionado(e.target.value)}
          className="p-2 border rounded-md text-gray-700 mt-2"
        >
          <option value="">Seleccione un grado</option>
          {[1, 2, 3, 4, 5, 6].map((grado) => (
            <option key={grado} value={grado}>
              {grado}° Grado
            </option>
          ))}
        </select>
      </div>

      <div className="w-full bg-white shadow-md p-8 rounded-md mt-4">
        <button className="px-4 py-2 bg-red-600 text-lg font-semibold text-black border
         border-gray-800 rounded-md hover:bg-blue-600 mb-8">
          Estudiantes Matriculados
        </button>

        <table className="min-w-full bg-blue-400 shadow-md rounded-md">
          <thead className="bg-blue-600">
            <tr>
              <th className="py-2 px-4 text-left">DNI</th>
              <th className="py-2 px-4 text-left">Nombre</th>
              <th className="py-2 px-4 text-left">Grado</th>
              <th className="py-2 px-4 text-left">Fecha de Matrícula</th>
              <th className="py-2 px-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {estudiantesMatriculados.length > 0 ? (
              estudiantesMatriculados.map((registro) => {
                return (
                  <tr key={registro.id} className="border-b">
                    <td className="py-2 px-4">{registro.dni}</td>
                    <td className="py-2 px-4">{registro.nombres} {registro.apellido}</td>
                    <td className="py-2 px-4">{registro.grado}</td>
                    <td className="py-2 px-4">{registro.fecha_matricula}</td>
                    <td className="py-2 px-4 text-center">
                      <button
                        onClick={() => eliminarEstudiante(registro.id)}
                        className="p-2 bg-red-500 text-white rounded-md"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="5" className="py-2 px-4 text-center text-gray-600">No hay estudiantes matriculados</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Matriculados;
