import React, { createContext, useContext, useState } from 'react';

// Crea el contexto
const EstudianteContext = createContext();

// Proveedor de contexto
export const EstudianteProvider = ({ children }) => {
  const [estudianteActual, setEstudianteActual] = useState(null); // Aquí se almacena el estudiante actual

  return (
    <EstudianteContext.Provider value={{ estudianteActual, setEstudianteActual }}>
      {children}
    </EstudianteContext.Provider>
  );
};

// Hook para usar el contexto
export const useEstudiante = () => {
  return useContext(EstudianteContext);
};




