import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/SupabaseClient';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; 

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false); 

  useEffect(() => {
    const checkUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data.user) {
        navigate('/inicio'); 
      }
    };

    checkUser();
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .eq('password', password)
      .single();
  
    if (error || !data) {
      setError('Credenciales incorrectas');
    } else {
      // Almacenar el nombre de usuario y el rol en localStorage
      localStorage.setItem('userRole', data.role);
      localStorage.setItem('username', data.username);  // Almacenar el nombre de usuario
  
      if (data.role === 'admin') {
        navigate('/usuarios');
      } else {
        navigate('/inicio');
      }
    }
  };
  

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: "url('https://images.pexels.com/photos/1114690/pexels-photo-1114690.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')",
      }}
    >
      <div className="flex w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden backdrop-blur-sm bg-opacity-30">
        <div className="w-1/2 p-8 flex flex-col justify-center">
          <div className="flex justify-center mb-6">
            <img src="./public/Logo.webp" alt="Logo" className="w-20 h-20" />
          </div>
          <h2 className="text-2xl font-bold text-center mb-4">LICEO SCHOOL</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                placeholder="Username"
                required
              />
            </div>
            <div className="relative">
              <input
                type={passwordVisible ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                placeholder="Password"
                required
              />
              <button
                type="button"
                onClick={() => setPasswordVisible(!passwordVisible)}
                className="absolute right-3 top-3"
              >
                {passwordVisible ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </button>
            </div>
            <button
              type="submit"
              className="w-full py-3 text-lg font-semibold text-white bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-lg hover:bg-gradient-to-r hover:from-orange-600 hover:via-red-600 hover:to-pink-600 transition-all"
            >
              Log In
            </button>
          </form>
        </div>
  
        {/* Sección derecha (Texto informativo con fondo degradado) */}
        <div className="w-1/2 bg-gradient-to-r from-orange-500 to-pink-500 text-white p-8 flex items-center justify-center">
          <div>
            <h2 className="text-3xl font-bold mb-4">Somos más que solo una escuela</h2>
            <p className="text-lg">
            En Liceo School, creemos en la formación integral de nuestros estudiantes, 
            preparando no solo mentes, sino también corazones. Nuestra misión es ofrecer 
            una educación de calidad que fomente valores, conocimientos y habilidades 
            esenciales para enfrentar los desafíos del futuro.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
  
};

export default Login;
