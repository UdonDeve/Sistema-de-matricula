import React, { useState, useEffect } from 'react';
import { supabase } from '../services/SupabaseClient';

const EstudiantesConApoderados = () => {
  const [estudiantesConApoderados, setEstudiantesConApoderados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Obtener estudiantes con apoderados
  useEffect(() => {
    const fetchEstudiantesConApoderados = async () => {
      try {
        const { data, error } = await supabase
          .from('estudiantes')
          .select(`
            id,
            dni,
            nombres,
            apellido,
            apoderados (
              dni,
              nombres,
              apellido
            )
          `);

        if (error) throw error;

        setEstudiantesConApoderados(data);
        setLoading(false);
      } catch (error) {
        setError('Error al cargar los estudiantes con apoderados');
        setLoading(false);
      }
    };

    fetchEstudiantesConApoderados();
  }, []);

  if (loading) {
    return <div className="text-center py-4">Cargando...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-600">{error}</div>;
  }

  return (
    <div className="p-4 bg-gray-400">
      <h1 className="text-2xl font-bold py-2 px-4">Estudiantes con Apoderados</h1>

      <div className="w-full bg-white shadow-md p-8 rounded-md mt-4">
        <button className="px-4 py-2 bg-red-600 text-lg font-semibold text-black border 
          border-gray-800 rounded-md hover:bg-blue-600 mb-8">
          Estudiantes con Apoderados Registrados
        </button>

        <table className="min-w-full bg-blue-400 shadow-md rounded-md">
          <thead className="bg-blue-600">
            <tr>
              <th className="py-2 px-4 text-left">DNI Estudiante</th>
              <th className="py-2 px-4 text-left">Nombre Estudiante</th>
              <th className="py-2 px-4 text-left">Apellido Estudiante</th>
              <th className="py-2 px-4 text-left">DNI Apoderado</th>
              <th className="py-2 px-4 text-left">Nombre Apoderado</th>
              <th className="py-2 px-4 text-left">Apellido Apoderado</th>
            </tr>
          </thead>
          <tbody>
            {estudiantesConApoderados.map((estudiante) => (
              <tr key={estudiante.id}>
                <td className="py-2 px-4 border-b">{estudiante.dni}</td>
                <td className="py-2 px-4 border-b">{estudiante.nombres}</td>
                <td className="py-2 px-4 border-b">{estudiante.apellido}</td>

                {/* Verificamos si apoderados es un array o un objeto */}
                {Array.isArray(estudiante.apoderados) ? (
                  estudiante.apoderados.map((apoderado, index) => (
                    <React.Fragment key={index}>
                      <td className="py-2 px-4 border-b">{apoderado.dni}</td>
                      <td className="py-2 px-4 border-b">{apoderado.nombres}</td>
                      <td className="py-2 px-4 border-b">{apoderado.apellido}</td>
                    </React.Fragment>
                  ))
                ) : (
                  <>
                    <td className="py-2 px-4 border-b">{estudiante.apoderados?.dni}</td>
                    <td className="py-2 px-4 border-b">{estudiante.apoderados?.nombres}</td>
                    <td className="py-2 px-4 border-b">{estudiante.apoderados?.apellido}</td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EstudiantesConApoderados;
