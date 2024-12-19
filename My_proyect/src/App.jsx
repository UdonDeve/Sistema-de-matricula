import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Usuarios from "./pages/Usuarios";
import Inicio from "./pages/Inicio";
import Reportes from "./layout/Reportes";
import Matricula from "./pages/Matricula";
import Login from "./layout/Login";
import Matriculados from "./pages/Matriculados";
import Lista_Apoderados from "./pages/Lista_Apoderados";
import Promover_Grado from "./pages/Promover_Grado";
import EstudiantesConApoderados from "./pages/EstudiantesConApoderados";
import Lista_Estudiantes from "./pages/Lista_Estudiantes";

function App() {
  const [darkMode, setDarkMode] = useState(false); // Modo oscuro

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />

        {/* Rutas con el Sidebar y Header, pasando darkMode como prop */}
        <Route path="/inicio" element={
          <div className="flex h-screen">
            <Sidebar darkMode={darkMode} /> {/* Pasar darkMode */}
            <div className="flex flex-col flex-1">
              <Header darkMode={darkMode} setDarkMode={setDarkMode} />
              <main
                className={`flex-1 p-4 md:p-6 overflow-y-auto transition-all duration-300 ease-in-out 
                  ${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"}`}
              >
                <Inicio />
              </main>
            </div>
          </div>
        } />

        <Route path="/usuarios" element={
          <div className="flex h-screen">
            <Sidebar darkMode={darkMode} /> {/* Pasar darkMode */}
            <div className="flex flex-col flex-1">
              <Header darkMode={darkMode} setDarkMode={setDarkMode} />
              <main
                className={`flex-1 p-4 md:p-6 overflow-y-auto transition-all duration-300 ease-in-out 
                  ${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"}`}
              >
                <Usuarios />
              </main>
            </div>
          </div>
        } />

        <Route path="/matricula" element={
          <div className="flex h-screen">
            <Sidebar darkMode={darkMode} /> {/* Pasar darkMode */}
            <div className="flex flex-col flex-1">
              <Header darkMode={darkMode} setDarkMode={setDarkMode} />
              <main
                className={`flex-1 p-4 md:p-6 overflow-y-auto transition-all duration-300 ease-in-out 
                  ${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"}`}
              >
                <Matricula />
              </main>
            </div>
          </div>
        } />

        <Route path="/Lista_Estudiantes" element={
          <div className="flex h-screen">
            <Sidebar darkMode={darkMode} /> {/* Pasar darkMode */}
            <div className="flex flex-col flex-1">
              <Header darkMode={darkMode} setDarkMode={setDarkMode} />
              <main
                className={`flex-1 p-4 md:p-6 overflow-y-auto transition-all duration-300 ease-in-out 
                  ${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"}`}
              >
                <Lista_Estudiantes />
              </main>
            </div>
          </div>
        } />

        <Route path="/Lista_Apoderados" element={
          <div className="flex h-screen">
            <Sidebar darkMode={darkMode} /> {/* Pasar darkMode */}
            <div className="flex flex-col flex-1">
              <Header darkMode={darkMode} setDarkMode={setDarkMode} />
              <main
                className={`flex-1 p-4 md:p-6 overflow-y-auto transition-all duration-300 ease-in-out 
                  ${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"}`}
              >
                <Lista_Apoderados />
              </main>
            </div>
          </div>
        } />

        <Route path="/EstudiantesConApoderados" element={
          <div className="flex h-screen">
            <Sidebar darkMode={darkMode} /> {/* Pasar darkMode */}
            <div className="flex flex-col flex-1">
              <Header darkMode={darkMode} setDarkMode={setDarkMode} />
              <main
                className={`flex-1 p-4 md:p-6 overflow-y-auto transition-all duration-300 ease-in-out 
                  ${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"}`}
              >
                <EstudiantesConApoderados />
              </main>
            </div>
          </div>
        } />

        <Route path="/promover_grado" element={
          <div className="flex h-screen">
            <Sidebar darkMode={darkMode} /> {/* Pasar darkMode */}
            <div className="flex flex-col flex-1">
              <Header darkMode={darkMode} setDarkMode={setDarkMode} />
              <main
                className={`flex-1 p-4 md:p-6 overflow-y-auto transition-all duration-300 ease-in-out 
                  ${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"}`}
              >
                <Promover_Grado />
              </main>
            </div>
          </div>
        } />

        <Route path="/Matriculados" element={
          <div className="flex h-screen">
            <Sidebar darkMode={darkMode} /> {/* Pasar darkMode */}
            <div className="flex flex-col flex-1">
              <Header darkMode={darkMode} setDarkMode={setDarkMode} />
              <main
                className={`flex-1 p-4 md:p-6 overflow-y-auto transition-all duration-300 ease-in-out 
                  ${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"}`}
              >
                <Matriculados />
              </main>
            </div>
          </div>
        } />

        <Route path="/reportes" element={
          <div className="flex h-screen">
            <Sidebar darkMode={darkMode} /> {/* Pasar darkMode */}
            <div className="flex flex-col flex-1">
              <Header darkMode={darkMode} setDarkMode={setDarkMode} />
              <main
                className={`flex-1 p-4 md:p-6 overflow-y-auto transition-all duration-300 ease-in-out 
                  ${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"}`}
              >
                <Reportes />
              </main>
            </div>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;
