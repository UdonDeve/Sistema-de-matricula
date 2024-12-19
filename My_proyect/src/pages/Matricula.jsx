import React, { useState, useEffect } from 'react';
import { supabase } from '../services/SupabaseClient';
import Apoderados from './Apoderados';

const Matricula = () => {
  const [dni, setDni] = useState('');
  const [nombreGrado, setNombreGrado] = useState('');
  const [cursos, setCursos] = useState([]);
  const [resultado, setResultado] = useState({
    numero: '',
    nombres: '',
    apellido: '',
    codigo_verificacion: '',
    sexo: '',
    fecha_nacimiento: '',
    ubicacion: '',
  });

  const [mostrarCursos, setMostrarCursos] = useState(false);

  const calcularFechasLimites = () => {
    const fechaHoy = new Date();
    const fechaLimiteInferior = new Date(fechaHoy);
    fechaLimiteInferior.setFullYear(fechaHoy.getFullYear() - 13);
    const fechaLimiteSuperior = new Date(fechaHoy);
    fechaLimiteSuperior.setFullYear(fechaHoy.getFullYear() - 5);

    return {
      min: fechaLimiteInferior.toISOString().split('T')[0],
      max: fechaLimiteSuperior.toISOString().split('T')[0],
    };
  };

  const traerDatos = () => {
    fetch(`https://apiperu.dev/api/dni/${dni}?api_token=a5b9e40faa6796dfe78ce8e2da150a3b5998b44d2e8e88ddeae3b25ffe4122d3`)
      .then((response) => response.json())
      .then((data) => {
        if (data.data) {
          setResultado({
            numero: data.data.numero,
            nombres: data.data.nombres,
            apellido: `${data.data.apellido_paterno} ${data.data.apellido_materno}`,
            codigo_verificacion: data.data.codigo_verificacion,
            sexo: '',
            fecha_nacimiento: '',
            ubicacion: '',
          });
        } else {
          alert('No se encontraron datos para el DNI proporcionado.');
        }
      })
      .catch((error) => {
        console.error('Error al obtener los datos:', error);
        alert('Hubo un error al obtener los datos del DNI. Por favor, intenta nuevamente.');
      });
  };

  const cargarCursosPorGrado = async (gradoId) => {
    if (!gradoId) return;

    try {
      const { data: cursosData, error } = await supabase
        .from('cursos')
        .select('*')
        .eq('grado_id', gradoId);
      if (error) {
        throw error;
      }
      setCursos(cursosData);
    } catch (error) {
      console.error('Error al cargar los cursos:', error);
    }
  };

  const confirmarRegistro = async () => {
    if (!resultado.numero || !resultado.nombres || !resultado.apellido || !resultado.codigo_verificacion || !resultado.sexo || !resultado.fecha_nacimiento || !resultado.ubicacion) {
      alert('Por favor, complete todos los campos obligatorios.');
      return;
    }

    try {
      const { data: estudianteData, error: estudianteError } = await supabase
        .from('estudiantes')
        .select('id')
        .eq('dni', resultado.numero)
        .single();

      if (estudianteError && estudianteError.code !== 'PGRST116') {
        throw estudianteError;
      }

      let estudianteId;
      if (estudianteData) {
        estudianteId = estudianteData.id;
      } else {
        const { error: estudiantesError, data: nuevoEstudiante } = await supabase
          .from('estudiantes')
          .insert([{
            dni: resultado.numero,
            nombres: resultado.nombres,
            apellido: resultado.apellido,
            codigo_verificacion: resultado.codigo_verificacion,
            sexo: resultado.sexo,
            fecha_nacimiento: resultado.fecha_nacimiento,
            ubicacion: resultado.ubicacion,
          }])
          .select('id')
          .single();

        if (estudiantesError) {
          throw estudiantesError;
        }

        estudianteId = nuevoEstudiante.id;
      }

      const matriculaData = cursos.map(curso => ({
        estudiante_id: estudianteId,
        grado_id: nombreGrado,
        curso_id: curso.id,
        fecha_matricula: new Date(),
      }));

      const { error: matriculaError } = await supabase
        .from('matriculas')
        .insert(matriculaData);

      if (matriculaError) {
        throw matriculaError;
      }

      alert('Registro confirmado y guardado en la base de datos');
      setDni('');
      setResultado({
        numero: '',
        nombres: '',
        apellido: '',
        codigo_verificacion: '',
        sexo: '',
        fecha_nacimiento: '',
        ubicacion: '',
      });

    } catch (error) {
      console.error('Error al guardar en la base de datos:', error);
      alert(`Ocurrió un error al guardar los datos: ${error.message}`);
    }
  };

  const { min, max } = calcularFechasLimites();

  return (
    <div className="p-4 bg-gray-400">
      <h1 className="text-2xl font-bold py-2 px-4 text-black">Registro de Estudiantes y Apoderados</h1>
      <div className="flex items-center py-2 px-4">
        <p className="text-sm text-black">Formulario de Registro</p>
      </div>
      <div className="flex flex-col md:flex-row space-y-8 md:space-y-0 md:space-x-8">
        <div className="flex flex-col items-center w-full bg-white shadow-md p-4 rounded-md">
          <div className="w-full flex flex-col mb-4">
            <input
              className="w-full p-2 border rounded-md mb-2 text-gray-700"
              placeholder="Número de DNI"
              type="number"
              value={dni}
              onChange={(e) => setDni(e.target.value)}
            />
            <button
              onClick={traerDatos}
              className="w-full bg-blue-600 text-white py-2 rounded-md font-bold hover:bg-blue-700 transition"
            >
              BUSCAR
            </button>
          </div>
          <div className="w-full grid grid-cols-2 sm:grid-cols-1 gap-4 bg-gray-50 p-4 rounded-md shadow-inner">
            {/* Campos de estudiante */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-600">DNI</label>
              <input readOnly value={resultado.numero} className="p-2 border rounded-md text-gray-700" />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-600">Nombre</label>
              <input readOnly value={resultado.nombres} className="p-2 border rounded-md text-gray-700" />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-600">Apellido</label>
              <input readOnly value={resultado.apellido} className="p-2 border rounded-md text-gray-700" />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-600">CUI</label>
              <input readOnly value={resultado.codigo_verificacion} className="p-2 border rounded-md text-gray-700" />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-600">Sexo</label>
              <select
                value={resultado.sexo}
                onChange={(e) => setResultado({ ...resultado, sexo: e.target.value })}
                className="p-2 border rounded-md text-gray-700"
              >
                <option value="">Seleccione</option>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-600">Fecha de Nacimiento</label>
              <input
                type="date"
                value={resultado.fecha_nacimiento}
                onChange={(e) => setResultado({ ...resultado, fecha_nacimiento: e.target.value })}
                min={min}
                max={max}
                className="p-2 border rounded-md text-gray-700"
              />
            </div>
            <div className="flex flex-col col-span-2">
              <label className="text-sm font-semibold text-gray-600">Ubicación</label>
              <input
                value={resultado.ubicacion}
                onChange={(e) => setResultado({ ...resultado, ubicacion: e.target.value })}
                className="p-2 border rounded-md text-gray-700"
                placeholder="ejem Av-Los pinos nr° 10"
              />
            </div>
          </div>

          {/* Contenedor para grado y cursos lado a lado */}
          <div className="flex flex-row gap-4 mb-4 w-full">
            <div className="flex flex-col w-1/2">
              <label className="text-sm font-semibold text-gray-600">Grado</label>
              <select
                value={nombreGrado}
                onChange={(e) => {
                  const gradoId = e.target.value;
                  setNombreGrado(gradoId);
                  cargarCursosPorGrado(gradoId);
                }}
                className="p-2 border rounded-md text-gray-700"
              >
                <option value="">Seleccione el grado</option>
                <option value="1">1° Grado</option>
                <option value="2">2° Grado</option>
                <option value="3">3° Grado</option>
                <option value="4">4° Grado</option>
                <option value="5">5° Grado</option>
                <option value="6">6° Grado</option>
              </select>
            </div>

            {/* Botón para mostrar cursos */}
            <div className="flex flex-col w-1/2 relative"> {/* relative para posicionar cursos justo abajo */}
              <label className="text-sm font-semibold text-gray-600">Cursos</label>
              <button
                onClick={() => setMostrarCursos(!mostrarCursos)} // Toggle visibility of cursos
                className="w-full bg-blue-600 text-white py-2 rounded-md font-bold hover:bg-blue-700 transition"
              >
                {mostrarCursos ? 'Ocultar Cursos' : 'Mostrar Cursos'}
              </button>

              {/* Ventanita con cursos (flotante justo debajo del botón) */}
              {mostrarCursos && cursos.length > 0 && (
  <div className="absolute bottom-full left-0 w-full max-w-xs bg-white p-4 rounded-md shadow-lg z-10">
    <ul>
      {cursos.map(curso => (
        <li key={curso.id} className="text-gray-700 py-2">{curso.nombre}</li>
      ))}
    </ul>
  </div>
)}

            </div>
          </div>

          <button
            onClick={confirmarRegistro}
            className="w-full bg-green-600 text-white py-2 rounded-md font-bold hover:bg-green-700 transition"
          >
            CONFIRMAR REGISTRO
          </button>
        </div>
        <Apoderados></Apoderados>
      </div>
    </div>
  );
};

export default Matricula;
