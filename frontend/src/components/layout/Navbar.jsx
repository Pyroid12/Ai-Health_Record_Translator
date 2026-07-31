import { useContext, useState, useEffect } from 'react';
import AuthContext from '../../context/AuthContext';
import { Bell, UserCircle, Moon, Sun } from 'lucide-react';

const Navbar = () => {
  const { user } = useContext(AuthContext);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
      setDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
      setDarkMode(true);
    }
  };

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between px-6 py-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 shadow-sm transition-colors">
      <div className="flex items-center">
        {/* Mobile menu button could go here */}
      </div>
      <div className="flex items-center space-x-4">
        <button onClick={toggleDarkMode} className="p-2 text-gray-400 dark:text-gray-300 transition-colors bg-gray-50 dark:bg-gray-800 rounded-full hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-gray-700">
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        <button className="p-2 text-gray-400 dark:text-gray-300 transition-colors bg-gray-50 dark:bg-gray-800 rounded-full hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-gray-700">
          <Bell className="w-5 h-5" />
        </button>
        <div className="flex items-center pl-4 border-l border-gray-200 dark:border-gray-700 space-x-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Patient</p>
          </div>
          <div className="w-10 h-10 overflow-hidden bg-indigo-100 dark:bg-indigo-900 rounded-full flex-shrink-0">
            <UserCircle className="w-10 h-10 text-indigo-500 dark:text-indigo-400" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
