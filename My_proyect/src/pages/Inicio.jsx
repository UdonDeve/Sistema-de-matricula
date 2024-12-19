import React, { useState, useEffect } from "react";
import { supabase } from "../services/SupabaseClient";
import { Bar, Doughnut } from 'react-chartjs-2'; 
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend, ArcElement, DoughnutController, ArcElement as DoughnutArcElement } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels'; 

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend, ArcElement, DoughnutController, ChartDataLabels);

const Inicio = () => {
  const [estudiantesMatriculados, setEstudiantesMatriculados] = useState([]);
  const [apoderados, setApoderados] = useState([]);  
  const [estudiantes, setEstudiantes] = useState([]); 
  const [selectedData, setSelectedData] = useState('year');
  const [yearData, setYearData] = useState([]);
  const [monthData, setMonthData] = useState([]);
  const [selectedDoughnutDataEstudiantes, setSelectedDoughnutDataEstudiantes] = useState('estudiantes'); // Estado para elegir entre Estudiantes o Apoderados para cada gráfico

  useEffect(() => {
    const fetchEstudiantesMatriculados = async () => {
      const { data, error } = await supabase
        .from('matriculas')
        .select('estudiantes(id), fecha_matricula')
        .order('fecha_matricula', { ascending: false });

      if (error) {
        console.error("Error al obtener estudiantes matriculados:", error);
      } else {
        setEstudiantesMatriculados(data);
        generateChartData(data);
      }
    };
    
    const fetchApoderados = async () => {
      const { data, error } = await supabase
        .from('apoderados')
        .select('sexo');
      
      if (error) {
        console.error("Error al obtener apoderados:", error);
      } else {
        setApoderados(data);
      }
    };
    
    const fetchEstudiantes = async () => {
      const { data, error } = await supabase
        .from('estudiantes')
        .select('sexo');

      if (error) {
        console.error("Error al obtener estudiantes:", error);
      } else {
        setEstudiantes(data);
      }
    };
    
    fetchEstudiantesMatriculados();
    fetchApoderados();
    fetchEstudiantes();
  }, []);
  
  const generateChartData = (data) => {
    // Filtramos para obtener los estudiantes únicos
    const uniqueStudents = new Set(data.map(item => item.estudiantes.id)); // Usamos un Set para garantizar unicidad
    
    const yearlyData = [0, 0, 0, 0, 0, 0, 0];
    const monthlyData = new Array(12).fill(0); 
  
    // Filtrar los datos para contar solo los estudiantes únicos
    data.forEach(item => {
      const studentId = item.estudiantes.id;
      if (!uniqueStudents.has(studentId)) return; // Si ya se cuenta este estudiante, lo saltamos
      uniqueStudents.delete(studentId); // Eliminamos al estudiante del Set para que no se cuente más de una vez
      
      const fecha = new Date(item.fecha_matricula);
      const year = fecha.getFullYear();
      const month = fecha.getMonth(); 
  
      if (year === 2024) yearlyData[0]++;
      if (year === 2025) yearlyData[1]++;
      if (year === 2026) yearlyData[2]++;
      if (year === 2027) yearlyData[3]++;
      if (year === 2028) yearlyData[4]++;
      if (year === 2029) yearlyData[5]++;
      if (year === 2030) yearlyData[6]++;
  
      monthlyData[month]++;
    });
  
    setYearData(yearlyData);
    setMonthData(monthlyData);
  };
  

  // Calcular número de estudiantes únicos
  const estudiantesUnicos = new Set(estudiantesMatriculados.map(item => item.estudiantes.id)); // Usamos un Set para garantizar unicidad
  const totalStudents = estudiantesUnicos.size; // Ahora totalStudents no tendrá duplicados

  const masculinoApoderados = apoderados.filter(a => a.sexo === 'Masculino').length;
  const femeninoApoderados = apoderados.filter(a => a.sexo === 'Femenino').length;
  
  const masculinoEstudiantes = estudiantes.filter(e => e.sexo === 'Masculino').length;
  const femeninoEstudiantes = estudiantes.filter(e => e.sexo === 'Femenino').length;

  const yearChartData = {
    labels: ['2024', '2025', '2026', '2027', '2028', '2029', '2030'],
    datasets: [
      {
        label: 'Matrícula Anual',
        data: yearData,
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 1,
      },
    ],
  };

  const monthChartData = {
    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
    datasets: [
      {
        label: 'Matrícula Mensual',
        data: monthData,
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 1,
      },
    ],
  };

  const doughnutDataEstudiantes = {
    labels: ['Masculino', 'Femenino'],
    datasets: [
      {
        data: [masculinoEstudiantes, femeninoEstudiantes],
        backgroundColor: ['rgba(99, 102, 241, 0.5)', 'rgba(255, 99, 132, 0.5)'],
        borderColor: ['rgba(99, 102, 241, 1)', 'rgba(255, 99, 132, 1)'],
        borderWidth: 1,
      },
    ],
  };

  const doughnutDataApoderados = {
    labels: ['Masculino', 'Femenino'],
    datasets: [
      {
        data: [masculinoApoderados, femeninoApoderados],
        backgroundColor: ['rgba(34, 197, 94, 0.5)', 'rgba(255, 159, 64, 0.5)'],
        borderColor: ['rgba(34, 197, 94, 1)', 'rgba(255, 159, 64, 1)'],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.label}: ${context.raw}`;
          },
        },
      },
      datalabels: {
        display: true,
        color: '#000',
        font: {
          weight: 'bold',
          size: 15,
        },
      },
    },
  };

  const enrolledStudents = apoderados.length;
  const enrollmentPercentage = totalStudents > 0 ? ((totalStudents / estudiantes.length) * 100).toFixed(2) : 0;

  return (
    <div className="p-4 bg-gray-400 flex flex-col h-full max-h-screen overflow-hidden">
  <div className="flex-1 overflow-auto">
    <h1 className="text-xl font-bold py-2 px-4 text-black">Resumen de Matrícula</h1>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
      <div className="bg-green-600 p-6 rounded-lg shadow-lg border border-gray-500">
        <h2 className="text-xl font-bold mb-4">Alumnos Matriculados</h2>
        <p className="text-3xl font-semibold">{totalStudents}</p>
      </div>

      <div className="bg-yellow-400 p-6 rounded-lg shadow-lg border border-gray-500">
        <h2 className="text-xl font-bold mb-4">Apoderados</h2>
        <p className="text-3xl font-semibold">{enrolledStudents}</p>
      </div>

      <div className="bg-blue-600 p-6 rounded-lg shadow-lg border border-gray-500">
        <h2 className="text-xl font-bold mb-4">Porcentaje de Matrícula</h2>
        <p className="text-3xl font-semibold">{enrollmentPercentage}%</p>
      </div>
    </div>

    <div className="flex flex-col lg:flex-row gap-6">
      <div className="flex-1 bg-white p-6 rounded-lg shadow-lg">
        <div className="shadow-sm mb-4">
          <h2 className="text-3xl font-semibold text-center mb-4 bg-red-600 rounded-md p-2">
            Gráficos de Matrícula
          </h2>
        </div>

        {/* Botones Centrados */}
        <div className="flex justify-start gap-4 mt-4 mb-4">
          <button
            onClick={() => setSelectedData('year')}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
            Matrícula Anual
          </button>
          <button
            onClick={() => setSelectedData('month')}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
            Matrícula Mensual
          </button>
        </div>

        {/* Contenedor Alineado */}
        <div className="flex flex-col lg:flex-row items-start gap-6 mt-4">
          {/* Gráfico de Barras */}
          <div className="flex-1 h-80">
            <Bar data={selectedData === 'year' ? yearChartData : monthChartData} options={options} />
          </div>

          {/* Gráficos de Donas */}
      <div className="flex flex-col lg:flex-row items-center gap-6">
        {/* Gráfico de Estudiantes */}
        <div className="flex flex-col items-center">
          <button
            className="px-4 py-2 h-10 bg-blue-500 text-white rounded-md hover:bg-blue-600 mb-2">
            Estudiantes
          </button>
          <div className="h-80">
            <Doughnut
              data={doughnutDataEstudiantes} // Aquí siempre se muestra el gráfico de Estudiantes
              options={options}
            />
          </div>
        </div>

        {/* Gráfico de Apoderados */}
        <div className="flex flex-col items-center">
          <button
            className="px-4 py-2 h-10 bg-green-500 text-white rounded-md hover:bg-green-600 mb-2">
            Apoderados
          </button>
          <div className="h-80">
            <Doughnut
              data={doughnutDataApoderados} // Aquí siempre se muestra el gráfico de Apoderados
              options={options}
            />
          </div>
        </div>
      </div>

        </div>
      </div>
    </div>
  </div>
</div>
  );
};

export default Inicio;
