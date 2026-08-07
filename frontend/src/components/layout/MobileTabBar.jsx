import { Home, UploadCloud, FileText, Settings } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const MobileTabBar = () => {
  const location = useLocation();

  const tabs = [
    { name: 'Home', icon: Home, path: '/dashboard' },
    { name: 'Upload', icon: UploadCloud, path: '/dashboard/upload' },
    { name: 'History', icon: FileText, path: '/dashboard/history' },
    { name: 'Settings', icon: Settings, path: '/dashboard/settings' },
  ];

  return (
    <div className="relative mx-2 mb-2">
      {/* Soft aurora glow behind */}
      <div className="pointer-events-none absolute -inset-1 -z-10">
        <div className="absolute inset-0 rounded-[1.75rem] bg-gradient-to-r from-indigo-500/20 via-violet-500/20 to-fuchsia-500/20 blur-xl" />
      </div>

      {/* Glass pill bar with gradient border */}
      <div className="relative rounded-[1.75rem] p-[1.5px] bg-gradient-to-br from-white/80 via-indigo-200/60 to-fuchsia-200/60 dark:from-gray-800/90 dark:via-indigo-900/40 dark:to-fuchsia-900/40 shadow-xl shadow-indigo-500/10 dark:shadow-black/40 backdrop-blur-xl">
        <nav className="rounded-[1.65rem] glass px-2 py-2 grid grid-cols-4 items-stretch gap-1">
          {tabs.map((tab) => {
            // Active if path exactly matches, OR for history sub-routes (detail view)
            const isActive =
              location.pathname === tab.path ||
              (tab.path === '/dashboard/history' && location.pathname.startsWith('/dashboard/history/')) ||
              (tab.path === '/dashboard' && location.pathname === '/dashboard');

            return (
              <Link
                key={tab.path}
                to={tab.path}
                className={`relative flex flex-col items-center justify-center gap-1 rounded-2xl py-2 px-1 transition-all duration-200 group ${
                  isActive
                    ? 'text-indigo-700 dark:text-indigo-200'
                    : 'text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-300'
                }`}
              >
                {isActive && (
                  <span className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-violet-500/10 to-fuchsia-500/10 border border-indigo-200/50 dark:border-indigo-500/20" />
                )}
                <span
                  className={`relative h-9 w-9 rounded-xl grid place-items-center transition-all ${
                    isActive
                      ? 'bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 text-white shadow-lg shadow-indigo-500/40 scale-[1.06]'
                      : 'bg-gray-100/70 dark:bg-gray-800/60 text-gray-500 dark:text-gray-400 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-950 group-hover:text-indigo-600 dark:group-hover:text-indigo-300'
                  }`}
                >
                  <tab.icon className="h-[18px] w-[18px]" strokeWidth={2.2} />
                </span>
                <span
                  className={`relative text-[10px] font-bold tracking-wide ${
                    isActive ? '' : 'font-semibold'
                  }`}
                >
                  {tab.name}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default MobileTabBar;