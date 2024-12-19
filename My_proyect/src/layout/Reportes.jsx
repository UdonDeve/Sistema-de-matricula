import React, { useState, useEffect } from 'react';
import { supabase } from '../services/SupabaseClient';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';  // Importar el plugin de autoTable
import * as XLSX from 'xlsx';

export const Reportes = () => {
  const [estudiantesMatriculados, setEstudiantesMatriculados] = useState([]);
  const [gradoSeleccionado, setGradoSeleccionado] = useState('');

  // Obtener los estudiantes matriculados con el filtro por grado
  useEffect(() => {
    const fetchEstudiantesMatriculados = async () => {
      let query = supabase
        .from('matriculas')
        .select(`
          estudiantes(id, nombres, apellido),
          grados(nombre),
          fecha_matricula
        `)
        .order('fecha_matricula', { ascending: false });

      if (gradoSeleccionado) {
        query = query.eq('grado_id', gradoSeleccionado); // Filtrar por grado seleccionado
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error al obtener estudiantes matriculados:', error);
      } else {
        // Filtrar estudiantes únicos
        const estudiantesUnicos = Array.from(new Set(data.map(a => a.estudiantes.id)))
          .map(id => data.find(a => a.estudiantes.id === id));

        setEstudiantesMatriculados(estudiantesUnicos);
      }
    };

    fetchEstudiantesMatriculados();
  }, [gradoSeleccionado]); // Ejecutar cada vez que cambie el grado seleccionado

  // Función para exportar a PDF
  const exportarPDF = () => {
    const doc = new jsPDF();

    // Definir las columnas de la tabla en el PDF
    const headers = [['ID', 'Nombre', 'Grado', 'Fecha de Matricula']];
    const data = estudiantesMatriculados.map((registro) => [
      registro.estudiantes.id,
      `${registro.estudiantes.nombres} ${registro.estudiantes.apellido}`,
      `${registro.grados.nombre}° Grado`,
      new Date(registro.fecha_matricula).toLocaleDateString(),
    ]);

    // Usar autoTable para generar la tabla en el PDF
    doc.autoTable({
      head: headers,
      body: data,
      startY: 20, // Para darle un margen superior
      theme: 'striped',
    });

    // Guardar el PDF con el nombre especificado
    doc.save('reporte_estudiantes_matriculados.pdf');
  };

  // Función para exportar a Excel
  const exportarExcel = () => {
    const ws = XLSX.utils.json_to_sheet(estudiantesMatriculados.map((registro) => ({
      ID: registro.estudiantes.id,
      Nombre: `${registro.estudiantes.nombres} ${registro.estudiantes.apellido}`,
      Grado: `${registro.grados.nombre}° Grado`,
      FechaMatricula: new Date(registro.fecha_matricula).toLocaleDateString(),
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Estudiantes');
    XLSX.writeFile(wb, 'reporte_estudiantes_matriculados.xlsx');
  };

  return (
    <div className="p-4 bg-gray-400">
      <h1 className="text-2xl font-bold py-2 px-4 text-black">Reportes</h1>
      <div className="flex items-center py-2 px-4">
        <p className="text-sm text-black">Reporte de Estudiantes</p>
      </div>

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

      {/* Vista previa de la tabla */}
      <div className="w-full bg-white shadow-md p-8 rounded-md mt-4">
        <button className="px-4 py-2 bg-red-600 text-lg font-semibold text-black border 
          border-gray-800 rounded-md hover:bg-blue-600 mb-8">
          Generar Reporte de Estudiantes Matriculados
        </button>

        <table className="min-w-full bg-blue-400 shadow-md rounded-md">
          <thead className="bg-blue-600">
            <tr>
              <th className="py-2 px-4 text-left">ID</th>
              <th className="py-2 px-4 text-left">Nombre</th>
              <th className="py-2 px-4 text-left">Grado</th>
              <th className="py-2 px-4 text-left">Fecha de Matricula</th>
            </tr>
          </thead>
          <tbody>
            {estudiantesMatriculados.length > 0 ? (
              estudiantesMatriculados.map((registro) => {
                const { estudiantes, grados, fecha_matricula } = registro;
                return (
                  <tr key={estudiantes.id}>
                    <td className="py-2 px-4">{estudiantes.id}</td>
                    <td className="py-2 px-4">{estudiantes.nombres} {estudiantes.apellido}</td>
                    <td className="py-2 px-4">{grados.nombre}</td>
                    <td className="py-2 px-4">{new Date(fecha_matricula).toLocaleDateString()}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="4" className="py-2 px-4 text-center">No hay estudiantes matriculados</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Botones para exportar */}
      <div className="mt-4 flex space-x-4">
        <button onClick={exportarPDF} className="p-2 bg-yellow-600 text-white rounded-md">
          Exportar a PDF
        </button>
        <button onClick={exportarExcel} className="p-2 bg-green-600 text-white rounded-md">
          Exportar a Excel
        </button>
      </div>
    </div>
  );
};

export default Reportes;
