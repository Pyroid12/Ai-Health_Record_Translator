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

  // Demo / Guest mode: fake user (no backend call) so interviewers don't need to register.
  const loginAsGuest = () => {
    try {
      // Generate a short-lived fake demo JWT (valid 30 min) so API middleware still accepts it locally.
      const demoUser = {
        _id: 'demo-user-local-000000000000',
        name: 'Demo User',
        email: 'demo@medtranslate.ai',
        isDemo: true,
        // Simple demo token: not verified by backend — that's fine for a UI demo.
        token: 'demo-token-' + Math.random().toString(36).slice(2),
      };
      setUser(demoUser);
      localStorage.setItem('user', JSON.stringify(demoUser));
      navigate('/dashboard');
    } catch (error) {
      throw new Error(error.message || 'Could not enter demo mode.');
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
