import { useContext, useState, useEffect } from 'react';
import AuthContext from '../../context/AuthContext';
import { Bell, UserCircle, Moon, Sun } from 'lucide-react';

const Navbar = ({ onProfileClick, onNotificationsClick, unreadCount = 0 }) => {
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
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={toggleDarkMode}
          className="relative group h-10 w-10 rounded-xl bg-white/70 dark:bg-gray-800/70 backdrop-blur border border-gray-200 dark:border-gray-700 grid place-items-center text-gray-500 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-300/60 dark:hover:border-indigo-500/30 hover:-translate-y-0.5 hover:shadow-md hover:shadow-indigo-500/10 transition-all"
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        <button
          type="button"
          onClick={onNotificationsClick}
          className="relative group h-10 w-10 rounded-xl bg-white/70 dark:bg-gray-800/70 backdrop-blur border border-gray-200 dark:border-gray-700 grid place-items-center text-gray-500 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-300/60 dark:hover:border-indigo-500/30 hover:-translate-y-0.5 hover:shadow-md hover:shadow-indigo-500/10 transition-all"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 inline-flex h-3 w-3 -translate-y-0.5 translate-x-0.5 items-center justify-center">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 ring-2 ring-white dark:ring-gray-900"></span>
            </span>
          )}
        </button>
        <div className="flex items-center pl-3 sm:pl-4 ml-1 border-l border-gray-200/80 dark:border-gray-800 gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-gray-900 dark:text-white">{user?.name || 'Guest'}</p>
            <p className="text-[11px] uppercase tracking-wider text-gray-500 dark:text-gray-400">Patient</p>
          </div>

          <button
            type="button"
            onClick={onProfileClick}
            className="relative flex-shrink-0 rounded-full p-[2px] bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 hover:shadow-lg hover:shadow-fuchsia-500/20 hover:-translate-y-0.5 transition-all"
          >
            <div className="w-9 h-9 overflow-hidden rounded-full bg-white dark:bg-gray-900 grid place-items-center">
              <UserCircle className="w-8 h-8 text-indigo-500 dark:text-indigo-400" />
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
