import { useContext } from 'react';
import AuthContext from '../../context/AuthContext';
import { Bell, UserCircle } from 'lucide-react';

const Navbar = () => {
  const { user } = useContext(AuthContext);

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="flex items-center">
        {/* Mobile menu button could go here */}
      </div>
      <div className="flex items-center space-x-4">
        <button className="p-2 text-gray-400 transition-colors bg-gray-50 rounded-full hover:text-indigo-600 hover:bg-indigo-50">
          <Bell className="w-5 h-5" />
        </button>
        <div className="flex items-center pl-4 border-l border-gray-200 space-x-3">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">{user?.name}</p>
            <p className="text-xs text-gray-500">Patient</p>
          </div>
          <div className="w-10 h-10 overflow-hidden bg-indigo-100 rounded-full">
            <UserCircle className="w-10 h-10 text-indigo-500" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
