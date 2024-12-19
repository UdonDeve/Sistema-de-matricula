import React, { useState, useEffect } from "react";
import { FaSun, FaMoon } from "react-icons/fa"; // Importar los íconos para sol y luna

const Header = ({ darkMode, setDarkMode }) => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    // Actualizar la hora cada segundo
    const interval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Formatear fecha y hora
  const formatDate = (date) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const formattedDate = date.toLocaleDateString("es-ES", options);
    const formattedTime = date.toLocaleTimeString("es-ES");
    return `${formattedDate} | ${formattedTime}`;
  };

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode); // Alternar entre modo oscuro y claro
  };

  return (
    <header
      className={`h-24 px-6 flex items-center justify-between border-b-4 border-blue-400 
      ${darkMode ? "bg-gradient-to-r from-red-800 to-red-600 text-black" : "bg-gradient-to-r from-gray-900 to-gray-700 text-white"}`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3">
        <img
          src="./src/assets/LiceoSchool.jfif"
          alt="Logo"
          className="w-16 h-16 rounded-full border-2 border-white shadow-lg"
        />
        <div className="hidden sm:flex flex-col">
          <h1 className="text-3xl font-bold tracking-wide">I.E. Nº 89004 LICEO SCHOOL</h1>
          <p className="text-sm italic font-light text-gray-300">"Formando Futuro con Excelencia y Compromiso"</p>
        </div>
      </div>

      {/* Fecha y hora (oculta en pantallas medianas y menores, visible en pantallas grandes y mayores) */}
      <div className="hidden md:flex items-center gap-4 text-lg font-medium">
        <span className="material-icons">Calendario_Hoy |</span>
        <span>{formatDate(currentDateTime)}</span>

        {/* Icono toggle de modo oscuro/claro */}
        <button
          onClick={toggleDarkMode}
          className="flex items-center justify-center p-2 rounded-full hover:bg-gray-500"
        >
          {darkMode ? (
            <FaSun className="text-2xl text-yellow-400" />
          ) : (
            <FaMoon className="text-2xl text-yellow-400" />
          )}
        </button>
      </div>

      {/* Icono toggle de modo oscuro (visible solo en pantallas medianas y menores) */}
      <button
        onClick={toggleDarkMode}
        className="md:hidden flex items-center justify-center p-2 rounded-full hover:bg-gray-500"
      >
        {darkMode ? (
          <FaSun className="text-2xl text-yellow-400" />
        ) : (
          <FaMoon className="text-2xl text-yellow-400" />
        )}
      </button>
    </header>
  );
};

export default Header;
