import React, { useState } from 'react';
import { supabase } from '../services/SupabaseClient';

const Apoderados = () => {
  const [dni, setDni] = useState('');
  const [resultado, setResultado] = useState({
    numero: '',
    nombres: '',
    apellido: '',
    codigo_verificacion: '',
    sexo: 'No especificado',
    fecha_nacimiento: '',
    ubicacion: '',
  });
  const [error, setError] = useState('');
  const [estudianteId, setEstudianteId] = useState(null); // Para almacenar el ID del estudiante
  const [estudiante, setEstudiante] = useState(null); // Para almacenar los datos del estudiante

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
            sexo: data.data.sexo || 'No especificado',
            fecha_nacimiento: '',
            ubicacion: '',
          });
        } else {
          setError('No se encontraron datos para el DNI proporcionado.');
        }
      })
      .catch((error) => {
        console.error('Error al obtener los datos:', error);
        setError('Error al obtener los datos del API. Intente nuevamente.');
      });
  };

  // Función para obtener el estudiante por ID
  const obtenerEstudiantePorId = async () => {
    if (!estudianteId) {
      setError('Debe ingresar un ID de estudiante.');
      return;
    }

    const { data, error } = await supabase
      .from('estudiantes')
      .select('id, nombres, apellido, dni')
      .eq('id', estudianteId); // Buscar por ID

    if (error) {
      console.error('Error al obtener el estudiante:', error);
      setError('No se pudo obtener el estudiante. Intente nuevamente.');
    } else if (data && data.length > 0) {
      setEstudiante(data[0]); // Asignar los datos del estudiante encontrado
      setError(''); // Limpiar errores
    } else {
      setError('No se encontró un estudiante con este ID.');
      setEstudiante(null); // Limpiar los datos del estudiante
    }
  };

  const calcularEdad = (fechaNacimiento) => {
    const hoy = new Date();
    const fechaNac = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - fechaNac.getFullYear();
    const m = hoy.getMonth() - fechaNac.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < fechaNac.getDate())) {
      edad--;
    }
    return edad;
  };

  const confirmarRegistro = async () => {
    if (!resultado.fecha_nacimiento) {
      setError('La fecha de nacimiento es obligatoria.');
      return;
    }

    const edad = calcularEdad(resultado.fecha_nacimiento);
    if (edad < 18) {
      setError('El apoderado debe ser mayor de 18 años.');
      return;
    }

    if (!estudianteId) {
      setError('Debe ingresar el ID de un estudiante para asociar al apoderado.');
      return;
    }

    const { data, error } = await supabase
      .from('apoderados')
      .insert([{
        dni: resultado.numero,
        nombres: resultado.nombres,
        apellido: resultado.apellido,
        codigo_verificacion: resultado.codigo_verificacion,
        sexo: resultado.sexo,
        fecha_nacimiento: resultado.fecha_nacimiento,
        ubicacion: resultado.ubicacion,
        estudiante_id: estudianteId, // Asociar el apoderado con el estudiante
      }]);

    if (error) {
      console.error('Error al guardar en la base de datos:', error);
      alert('Ocurrió un error al guardar los datos. Por favor, inténtalo nuevamente.');
    } else {
      alert('Registro del apoderado guardado exitosamente.');
      setDni('');
      setResultado({
        numero: '',
        nombres: '',
        apellido: '',
        codigo_verificacion: '',
        sexo: 'No especificado',
        fecha_nacimiento: '',
        ubicacion: '',
      });
      setEstudianteId(null); // Restablecer el ID del estudiante
      setEstudiante(null); // Limpiar los datos del estudiante
      setError('');
    }
  };

  return (
    <div className="flex flex-col items-center w-full ">
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

        <div className="w-full grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-md shadow-inner">
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
          
          {/* Campo para ingresar el ID del estudiante */}
          <div className="flex flex-col col-span-2 mt-4">
            <label className="text-sm font-semibold text-gray-600">ID del Estudiante</label>
            <input
              type="number"
              value={estudianteId || ''}
              onChange={(e) => setEstudianteId(e.target.value)}
              className="p-2 border rounded-md text-gray-700"
              placeholder="Ingrese el ID del estudiante"
            />
            <button
              onClick={obtenerEstudiantePorId}
              className="w-full bg-blue-600 text-white py-2 rounded-md font-bold hover:bg-blue-700 transition mt-2"
            >
              Buscar Estudiante
            </button>
            {estudiante && (
              <div className="mt-4 p-2 border bg-gray-100 rounded-md">
                <strong>Estudiante:</strong>
                <p>{estudiante.nombres} {estudiante.apellido}</p>
                <p>DNI: {estudiante.dni}</p>
              </div>
            )}
          </div>
        </div>

        {error && <div className="text-red-600 text-sm">{error}</div>}
        <button
          onClick={confirmarRegistro}
          className="mt-4 w-full bg-green-600 text-white py-2 rounded-md font-bold hover:bg-green-700 transition"
        >
          CONFIRMAR
        </button>
      </div>
    </div>
  );
};

export default Apoderados;
