import React, { useState, useEffect } from "react";
import { supabase } from "../services/SupabaseClient";

const Promover_Grado = () => {
  const [estudianteId, setEstudianteId] = useState('');
  const [nombreGrado, setNombreGrado] = useState('');
  const [estudiante, setEstudiante] = useState(null);
  const [cursos, setCursos] = useState([]);
  const [mostrarCursos, setMostrarCursos] = useState(false); // Estado para mostrar u ocultar los cursos

  // Cargar cursos relacionados con el grado seleccionado
  useEffect(() => {
    if (nombreGrado && mostrarCursos) {  // Solo cargar los cursos si 'mostrarCursos' es true
      const fetchCursos = async () => {
        const { data, error } = await supabase
          .from('cursos')
          .select('id, nombre')
          .eq('grado_id', nombreGrado);

        if (error) {
          console.error('Error al obtener los cursos:', error);
        } else {
          setCursos(data);
        }
      };
      fetchCursos();
    }
  }, [nombreGrado, mostrarCursos]);

  // Buscar estudiante por ID
  const buscarEstudiante = async () => {
    if (estudianteId) {
      try {
        const { data, error } = await supabase
          .from('matriculas')
          .select(`
            id,
            estudiante_id,
            estudiantes(nombres, apellido),
            grados(nombre) as grado_actual
          `)
          .eq('estudiante_id', parseInt(estudianteId))
          .single();

        if (error) {
          console.error('Error al buscar el estudiante:', error);
          alert('Estudiante no encontrado o no está matriculado.');
        } else {
          setEstudiante(data);
          setNombreGrado(data.grado_actual);
        }
      } catch (err) {
        console.error('Error inesperado al buscar estudiante:', err);
        alert('Hubo un error al buscar el estudiante. Inténtalo nuevamente.');
      }
    } else {
      alert('Por favor ingrese un ID válido.');
    }
  };

  // Manejar la promoción del estudiante
  const manejarEnvio = async (e) => {
    e.preventDefault();

    if (!estudiante) {
      alert("Por favor, busque un estudiante primero.");
      return;
    }

    try {
      // Actualizar el grado del estudiante en la tabla matriculas
      const { data: matriculaData, error: matriculaError } = await supabase
        .from('matriculas')
        .update({ grado_id: nombreGrado })
        .eq('estudiante_id', estudiante.estudiante_id);

      if (matriculaError) {
        throw matriculaError;
      }

      // Insertar el registro de promoción en la tabla estudiantes_promovidos
      const { data, error } = await supabase
        .from('estudiantes_promovidos')
        .insert([{
          estudiante_id: estudiante.estudiante_id,
          grado: nombreGrado,
          curso_id: cursos[0]?.id, // Seleccionamos el primer curso de la lista
          fecha_matricula: new Date(),
        }]);

      if (error) {
        throw error;
      }

      alert("Estudiante promovido correctamente.");
      setEstudiante(null);
      setEstudianteId('');
      setNombreGrado('');
    } catch (error) {
      console.error("Error al promover al estudiante:", error);
      alert("Hubo un error al promover al estudiante. Inténtalo nuevamente.");
    }
  };

  return (
    <div className="p-4 bg-gray-400">
      <h1 className="text-2xl font-bold py-2 px-4 text-black">Promover de Grado y Curso</h1>
      <div className="flex items-center py-2 px-4">
        <p className="text-sm text-black">Complete la información del Estudiante</p>
      </div>
      <form onSubmit={manejarEnvio} className="bg-white p-4 rounded-md shadow-md mt-4">
        <div className="flex flex-col mb-4">
          <label className="text-sm font-semibold text-gray-600">ID del Estudiante</label>
          <input
            type="text"
            value={estudianteId}
            onChange={(e) => setEstudianteId(e.target.value)}
            className="p-2 border rounded-md text-gray-700"
            placeholder="Ingrese el ID del estudiante"
            required
          />
          <button
            type="button"
            onClick={buscarEstudiante}
            className="mt-2 w-full bg-blue-600 text-white py-2 rounded-md font-bold hover:bg-blue-700 transition"
          >
            Buscar Estudiante
          </button>
        </div>

        {estudiante && (
          <div className="mt-4">
            <p><strong>Estudiante Encontrado:</strong> {estudiante.estudiantes.nombres} {estudiante.estudiantes.apellido}</p>

            <div className="flex flex-col mb-4">
              <label className="text-sm font-semibold text-gray-600">Grado</label>
              <select
                value={nombreGrado}
                onChange={(e) => setNombreGrado(e.target.value)}
                className="p-2 border rounded-md text-gray-700"
              >
                <option value="">Seleccione un grado</option>
                {[1, 2, 3, 4, 5, 6].map((grado) => (
                  <option key={grado} value={grado}>
                    {grado}° Grado
                  </option>
                ))}
              </select>
            </div>

            {/* Botón para mostrar/ocultar cursos */}
            {nombreGrado && (
              <div className="mb-4">
                <button
                  type="button"
                  onClick={() => setMostrarCursos(!mostrarCursos)}
                  className="w-full bg-yellow-600 text-white py-2 rounded-md font-bold hover:bg-yellow-700 transition"
                >
                  {mostrarCursos ? 'Ocultar Cursos' : 'Mostrar Cursos'}
                </button>
              </div>
            )}

            {/* Mostrar los cursos como lista */}
            {mostrarCursos && cursos.length > 0 && (
              <div className="mb-4">
                <ul className="list-disc pl-5">
                  {cursos.map((curso) => (
                    <li key={curso.id} className="text-gray-700">{curso.nombre}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded-md font-bold hover:bg-green-700 transition"
        >
          Promover Estudiante
        </button>
      </form>
    </div>
  );
};

export default Promover_Grado;
