import { createContext, useState, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post('/api/auth/login', {
        email,
        password,
      });
      setUser(res.data);
      localStorage.setItem('user', JSON.stringify(res.data));
      navigate('/dashboard');
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  // Demo / Guest mode: gets a real JWT from the backend for a shared demo account,
  // so protected routes (like upload) work exactly like a real login.
  const loginAsGuest = async () => {
    try {
      const res = await api.post('/api/auth/guest');
      setUser(res.data);
      localStorage.setItem('user', JSON.stringify(res.data));
      navigate('/dashboard');
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Could not enter demo mode.');
    }
  };

  const register = async (name, email, password, confirmPassword) => {
    try {
      const res = await api.post('/api/auth/register', {
        name,
        email,
        password,
        confirmPassword,
      });
      setUser(res.data);
      localStorage.setItem('user', JSON.stringify(res.data));
      navigate('/dashboard');
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/login');
  };

  const isDemo = Boolean(user?.isDemo);

  return (
    <AuthContext.Provider value={{ user, setUser, login, loginAsGuest, register, logout, loading, isDemo }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;