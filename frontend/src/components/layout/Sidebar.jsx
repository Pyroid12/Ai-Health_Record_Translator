import { Home, FileText, Settings, UploadCloud, Stethoscope } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', icon: Home, path: '/dashboard' },
    { name: 'Upload Report', icon: UploadCloud, path: '/dashboard/upload' },
    { name: 'History', icon: FileText, path: '/dashboard/history' },
    { name: 'Settings', icon: Settings, path: '/dashboard/settings' },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 flex flex-col w-64 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-r border-gray-100 dark:border-gray-800 z-50 transition-colors shadow-xl shadow-black/5 dark:shadow-black/20">
      {/* Brand with aurora glow behind */}
      <div className="relative h-20 flex items-center justify-center overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 h-24 w-64 rounded-full bg-gradient-to-r from-indigo-500/30 via-violet-500/30 to-fuchsia-500/30 blur-2xl animate-aurora" />
        </div>
        <div className="relative flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 grid place-items-center shadow-lg shadow-indigo-500/40">
            <Stethoscope className="h-5 w-5 text-white" />
          </div>
          <div className="leading-tight">
            <p className="text-base font-extrabold text-gradient-blue animate-aurora">MedTranslate AI</p>
            <p className="text-[10px] uppercase tracking-widest text-gray-400 dark:text-gray-500">Medical Intelligence</p>
          </div>
        </div>
      </div>

      <div className="flex-1 py-5 px-3 overflow-y-auto">
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`relative flex items-center px-4 py-3 text-sm font-semibold transition-all duration-200 rounded-xl group overflow-hidden ${isActive
                    ? 'text-indigo-700 dark:text-indigo-300'
                    : 'text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-300'
                  }`}
              >
                {isActive && (
                  <>
                    <span className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-violet-500/10 to-fuchsia-500/10 rounded-xl" />
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 rounded-r-full bg-gradient-to-b from-indigo-500 to-fuchsia-500 shadow-md" />
                  </>
                )}
                <span
                  className={`relative w-10 h-10 rounded-xl grid place-items-center transition-all mr-2 ${isActive
                      ? 'bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-500/30'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-950 group-hover:text-indigo-600 dark:group-hover:text-indigo-300'
                    }`}
                >
                  <item.icon className="w-5 h-5" />
                </span>
                <span className="relative">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer brand tag */}
      <div className="p-4 border-t border-gray-100/70 dark:border-gray-800/70">
        <div className="rounded-xl bg-gradient-to-br from-indigo-500/10 via-violet-500/10 to-fuchsia-500/10 p-4 border border-indigo-200/40 dark:border-indigo-500/10">
          <p className="text-xs font-bold text-indigo-700 dark:text-indigo-300 mb-1">✨ AI-Powered</p>
          <p className="text-[11px] leading-relaxed text-gray-600 dark:text-gray-400">
            Complex reports → plain language in seconds.
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
