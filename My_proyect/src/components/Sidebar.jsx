import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaHome, FaUser, FaCog, FaSignOutAlt, FaBook, FaAngleDoubleRight, FaUserAltSlash } from "react-icons/fa";
import { GoXCircleFill } from "react-icons/go";
import AdvertenciaCierre from "./AdvertenciaCierre"; 
import { FaUserAstronaut } from "react-icons/fa6";
import { PiStudentBold } from "react-icons/pi";
import { MdGolfCourse } from "react-icons/md";
import { BiSolidSchool } from "react-icons/bi";

const Sidebar = ({ darkMode }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [showWarning, setShowWarning] = useState(false); 
  const location = useLocation(); 
  const navigate = useNavigate(); 

  const isActive = (path) => (location.pathname === path ? "bg-red-800" : "");

  const handleLogout = () => {
    localStorage.removeItem('userRole');  // Limpiar la información del usuario
    localStorage.removeItem('username');
    navigate('/'); 
  };

  const handleCancel = () => {
    setShowWarning(false); 
  };

  // Obtener la información del usuario desde localStorage
  const userRole = localStorage.getItem('userRole');
  const username = localStorage.getItem('username');

  return (
    <>
    <aside
      className={`relative flex flex-col h-full transition-all duration-300 ease-in-out 
        ${isOpen ? "w-64" : "w-20"} ${darkMode ? "bg-blue-800 text-black" : "bg-gray-800 text-white"}`}>
      <div className={`h-16 flex items-center justify-between ${darkMode ? "bg-blue-800" : "bg-gray-800"} px-4`}>
        {/* Si el usuario está logueado, mostrar la información del usuario */}
        {isOpen && userRole ? (
          <div className="flex flex-row items-center gap-1">
            <div className="w-12 h-12 rounded-full bg-gray-400 flex items-center justify-center">
              {userRole === 'admin' ? (
                <FaUser className="text-white text-3xl" />
              ) : (
                <FaUserAltSlash className="text-red-600 text-2xl" />
              )}
            </div>
            <span className="text-md text-white">{userRole === 'admin' ? 'Admin' : 'User'}</span> {/* Mostrar el rol */}
          </div>
        ) : (
          null
        )}

        {/* Centralizar el ícono de cerrar cuando el sidebar está colapsado */}
        <button 
          className={`text-gray-500 hover:text-black ${isOpen ? 'absolute right-4' : 'absolute left-1/2 transform -translate-x-1/2'}`} 
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <GoXCircleFill className="text-white bg-red-600 text-2xl h-5 w-5" /> : <FaAngleDoubleRight className="text-white bg-red-600 text-2xl h-5 w-5" />}
        </button>
      </div>

      {/* Navegación del Sidebar */}
      <nav className="flex-1 px-4 py-6 space-y-3">
        <Link to="/inicio" className={`flex items-center py-2 px-3 rounded ${isActive('/inicio')}`}>
          <FaHome className="text-center text-2xl text-yellow-600" /> {/* Fijar tamaño de ícono */}
          <span className={`transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 hidden"} ml-4`}>Inicio</span> {/* Añadido ml-4 */}
        </Link>
        <Link to="/usuarios" className={`flex items-center py-2 px-3 rounded ${isActive('/usuarios')}`}>
          <FaUser className="text-center text-2xl text-yellow-600" /> {/* Fijar tamaño de ícono */}
          <span className={`transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 hidden"} ml-4`}>Usuarios</span> {/* Añadido ml-4 */}
        </Link>
        <Link to="/matricula" className={`flex items-center py-2 px-3 rounded ${isActive('/matricula')}`}>
          <FaBook className="text-center text-2xl text-yellow-600" /> {/* Fijar tamaño de ícono */}
          <span className={`transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 hidden"} ml-4`}>Matrícula</span> {/* Añadido ml-4 */}
        </Link>
        <Link to="/Matriculados" className={`flex items-center py-2 px-3 rounded ${isActive('/Matriculados')}`}>
          <MdGolfCourse className="text-center text-2xl text-yellow-600" /> {/* Fijar tamaño de ícono */}
          <span className={`transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 hidden"} ml-4`}>Matriculados</span> {/* Añadido ml-4 */}
        </Link>
        <Link to="/Lista_Estudiantes" className={`flex items-center py-2 px-3 rounded ${isActive('/Lista_Estudiantes')}`}>
          <PiStudentBold className="text-center text-2xl text-yellow-600" /> {/* Fijar tamaño de ícono */}
          <span className={`transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 hidden"} ml-4`}>Lista Estudiantes</span> {/* Añadido ml-4 */}
        </Link>
        <Link to="/Lista_Apoderados" className={`flex items-center py-2 px-3 rounded ${isActive('/Lista_Apoderados')}`}>
          <FaUserAstronaut className="text-center text-2xl text-yellow-600" /> {/* Fijar tamaño de ícono */}
          <span className={`transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 hidden"} ml-4`}>Lista Apoderados</span> {/* Añadido ml-4 */}
        </Link>
        <Link to="/EstudiantesConApoderados" className={`flex items-center py-2 px-3 rounded ${isActive('/EstudiantesConApoderados')}`}>
          <FaUserAltSlash className="text-center text-2xl text-yellow-600" /> {/* Fijar tamaño de ícono */}
          <span className={`transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 hidden"} ml-4`}>Alumno y Apoderado</span> {/* Añadido ml-4 */}
        </Link>
        <Link to="/promover_grado" className={`flex items-center py-2 px-3 rounded ${isActive('/promover_grado')}`}>
          <BiSolidSchool className="text-center text-2xl text-yellow-600" /> {/* Fijar tamaño de ícono */}
          <span className={`transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 hidden"} ml-4`}>Promover Grado</span> {/* Añadido ml-4 */}
        </Link>
        <Link to="/reportes" className={`flex items-center py-2 px-3 rounded ${isActive('/reportes')}`}>
          <FaCog className="text-center text-2xl text-yellow-600" /> {/* Fijar tamaño de ícono */}
          <span className={`transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 hidden"} ml-4`}>Reportes</span> {/* Añadido ml-4 */}
        </Link>
      </nav>

      <div className="absolute bottom-0 w-full px-4 py-6">
        <button onClick={() => setShowWarning(true)} className={`flex items-center py-2 px-3 rounded ${isActive('/cerrar-sesion')}`}>
          <FaSignOutAlt className="mr-3 text-2xl text-yellow-600" /> {/* Fijar tamaño de ícono */}
          <span className={`transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 hidden"}`}>Cerrar sesión</span>
        </button>
      </div>
    </aside>


      {showWarning && <AdvertenciaCierre onClose={handleCancel} onLogout={handleLogout} />}
    </>
  );
};

export default Sidebar;
