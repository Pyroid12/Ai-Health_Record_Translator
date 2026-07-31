import { useContext } from 'react';
import { Home, FileText, Settings, LogOut, UploadCloud } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

const Sidebar = () => {
  const { logout } = useContext(AuthContext);
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', icon: Home, path: '/dashboard' },
    { name: 'History', icon: FileText, path: '/dashboard/history' },
    { name: 'Upload', icon: UploadCloud, path: '/dashboard/upload' },
    { name: 'Settings', icon: Settings, path: '/dashboard/settings' },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 flex flex-col w-64 bg-white border-r shadow-sm border-gray-100 z-50">
      <div className="flex items-center justify-center h-16 border-b border-gray-100">
        <h1 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
          MedTranslate AI
        </h1>
      </div>
      <div className="flex-1 py-6 overflow-y-auto">
        <nav className="px-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center px-4 py-3 text-sm font-medium transition-all duration-200 rounded-lg group ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-indigo-600'
                }`}
              >
                <item.icon
                  className={`w-5 h-5 mr-3 ${
                    isActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-indigo-600'
                  }`}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="p-4 border-t border-gray-100">
        <button
          onClick={logout}
          className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white transition-colors bg-red-500 rounded-lg hover:bg-red-600"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
