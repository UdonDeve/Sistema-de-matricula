import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/SupabaseClient';
import { FaEdit, FaTrash, FaEye, FaEyeSlash, FaUser } from 'react-icons/fa';
import { MdSupervisorAccount } from 'react-icons/md';

const Usuarios = () => {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [newUserData, setNewUserData] = useState({
    username: '',
    password: '',
    role: 'user',
  });
  const [editUserData, setEditUserData] = useState(null); 
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Verificamos el rol al cargar el componente
  useEffect(() => {
    const userRole = localStorage.getItem('userRole');

    if (userRole !== 'admin') {
      navigate('/inicio');
    } else {
      const fetchUsuarios = async () => {
        const { data, error } = await supabase.from('users').select('*');
        if (error) {
          console.error('Error al obtener usuarios:', error);
        } else {
          if (data && data.length > 0) {
            setUsuarios(data);
          } else {
            setUsuarios([]);
          }
        }
      };
      fetchUsuarios();
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCreateOrUpdateUser = async (e) => {
    e.preventDefault();

    if (!newUserData.username || !newUserData.password) {
      setError('Por favor, completa todos los campos');
      return;
    }

    if (editUserData) {
      const { username, password, role } = newUserData;
      const { error } = await supabase
        .from('users')
        .update({ username, password, role })
        .eq('id', editUserData.id);

      if (error) {
        setError('Error al actualizar el usuario: ' + error.message);
        setSuccess('');
      } else {
        setSuccess('Usuario actualizado correctamente');
        setUsuarios((prevUsuarios) =>
          prevUsuarios.map((usuario) =>
            usuario.id === editUserData.id ? { ...usuario, ...newUserData } : usuario
          )
        );
        setEditUserData(null);
        setNewUserData({ username: '', password: '', role: 'user' });
      }
    } else {
      // Si estamos creando un nuevo usuario
      const { data, error } = await supabase
        .from('users')
        .insert([{ username: newUserData.username, password: newUserData.password, role: newUserData.role,
        }]);

      if (error) {
        setError('Error al crear el usuario: ' + error.message);
        setSuccess('');
      } else {
        setSuccess('Usuario creado correctamente');
        setNewUserData({
          username: '',
          password: '',
          role: 'user',
        });
        if (data && data.length > 0) {
          setUsuarios((prevUsuarios) => [...prevUsuarios, data[0]]);
        }
      }
    }
  };

  const handleDeleteUser = async (id) => {
    const { error } = await supabase.from('users').delete().eq('id', id);

    if (error) {
      setError('Error al eliminar el usuario: ' + error.message);
      setSuccess('');
    } else {
      setSuccess('Usuario eliminado correctamente');
      setUsuarios((prevUsuarios) => prevUsuarios.filter((usuario) => usuario.id !== id)
      );
    }
  };

  const handleEditUser = (usuario) => {
    setEditUserData(usuario);
    setNewUserData({ username: usuario.username,  password: usuario.password,  role: usuario.role,
    });
  };
  const togglePasswordVisibility = () => {  setShowPassword(!showPassword); };

  return (
    <div className="p-4 bg-gray-300">
      <h1 className="text-2xl font-bold py-2 px-4 text-black">Gestionar Usuarios</h1>
      <div className="flex items-center py-2 px-4">
        <p className="text-sm text-black">Lista de Estudiantes</p>
      </div>

      {/* Formulario para crear o editar un usuario */}
      <form onSubmit={handleCreateOrUpdateUser} className="bg-white p-6 rounded-md shadow-md mt-6">
        <h2 className="text-lg font-semibold mb-4">{editUserData ? 'Editar Usuario' : 'Crear Nuevo Usuario'}</h2>
        <div className="flex flex-col mb-4">
          <label className="text-sm font-medium text-gray-600" htmlFor="username">
            Nombre de usuario
          </label>
          <div className="flex items-center">
            <input
              type="text"
              id="username"
              name="username"
              value={newUserData.username}
              onChange={handleInputChange}
              className="p-2 border border-gray-400 rounded w-full"
              required />
              <FaUser className="ml-2 text-blue-600" />
          </div>
        </div>
        <div className="flex flex-col mb-4">
          <label className="text-sm font-medium text-gray-600" htmlFor="password">
            Contraseña
          </label>
          <div className="flex items-center">
            <input
              type={showPassword ? "text" : "password"}  // Cambia el tipo de input según el estado
              id="password"
              name="password"
              value={newUserData.password}
              onChange={handleInputChange}
              className="p-2 border border-gray-400 rounded w-full"
              required />
            <button type="button" onClick={togglePasswordVisibility} className="ml-2">
              {showPassword ? <FaEyeSlash className="text-blue-600" /> : <FaEye className="text-gray-600" />}
            </button>
          </div>
        </div>
        <div className="flex flex-col mb-4">
      <label className="text-sm font-medium text-gray-600" htmlFor="role">
        Rol
      </label>
      <div className="flex items-center space-x-2">
        <select
          id="role"
          name="role"
          value={newUserData.role}
          onChange={handleInputChange}
          className="p-2 border border-gray-400 rounded flex-1"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <MdSupervisorAccount className="text-blue-600" size={20} /> {/* Ícono de usuario */}
      </div>
    </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" >
          {editUserData ? 'Actualizar Usuario' : 'Crear Usuario'}
        </button>
      </form>

      {/* Lista de usuarios */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold text-gray-700">Usuarios</h2>
        <ul className="space-y-4">
          {usuarios.map((usuario) => (
            <li
              key={usuario.id}
              className="bg-white p-4 rounded-md shadow-md flex justify-between items-center">
              <div>
                <FaUser className="inline mr-2 text-gray-600" />
                <p className="font-semibold text-gray-800">{usuario.username}</p>
                <p className="text-sm text-gray-600">{usuario.role}</p>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => handleEditUser(usuario)}
                  className="bg-blue-200 text-blue-700 hover:bg-blue-400 rounded-md p-2 w-10 h-10 flex justify-center items-center">
                  <FaEdit size={20} />
                </button>
                <button
                  onClick={() => handleDeleteUser(usuario.id)}
                  className="bg-red-200 text-red-700 hover:bg-red-400 rounded-md p-2 w-10 h-10 flex justify-center items-center">
                  <FaTrash size={20} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {error && <div className="text-red-500">{error}</div>}
      {success && <div className="text-green-500">{success}</div>}
    </div>
  );
};

export default Usuarios;
