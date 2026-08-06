import { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, X } from 'lucide-react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import ProfileDrawer from './ProfileDrawer';
import NotificationsPanel from './NotificationsPanel';
import NotificationContext from '../../context/NotificationContext';
import AuthContext from '../../context/AuthContext';

const DashboardLayout = ({ children }) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [demoBannerDismissed, setDemoBannerDismissed] = useState(false);
  const { notifications, unreadCount, markAllRead } = useContext(NotificationContext);
  const { isDemo, logout } = useContext(AuthContext);

  useEffect(() => {
    if (notificationsOpen) markAllRead();
  }, [notificationsOpen, markAllRead]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex transition-colors">
      {/* Sidebar for Desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 md:pl-64">
        {/* Demo Mode Banner */}
        {isDemo && !demoBannerDismissed && (
          <div className="relative z-30 border-b border-fuchsia-200/60 dark:border-fuchsia-500/20 bg-gradient-to-r from-indigo-500/10 via-fuchsia-500/10 to-pink-500/10 backdrop-blur">
            <div className="px-4 py-2.5 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 text-sm min-w-0">
                  <span className="hidden sm:inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 shadow-md shadow-fuchsia-500/30">
                    <Sparkles className="h-4 w-4 text-white" />
                  </span>
                  <p className="text-sm text-gray-700 dark:text-gray-200 min-w-0">
                    <span className="font-bold">Demo mode active</span>
                    <span className="hidden sm:inline"> — Sample reports are pre-loaded below. Data you upload here won't be persisted.</span>
                    <span className="sm:hidden"> — Data won't be saved.</span>
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link
                    to="/register"
                    className="hidden sm:inline-flex items-center px-3.5 py-1.5 rounded-lg text-xs font-bold text-white btn-gradient"
                  >
                    Create free account
                  </Link>
                  <button
                    type="button"
                    onClick={logout}
                    className="hidden xs:inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-800 transition-colors"
                  >
                    Exit demo
                  </button>
                  <button
                    type="button"
                    onClick={() => setDemoBannerDismissed(true)}
                    className="inline-flex items-center justify-center h-8 w-8 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-white/70 dark:hover:bg-gray-800 transition-colors"
                    aria-label="Dismiss demo banner"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <Navbar
          onProfileClick={() => setProfileOpen(true)}
          onNotificationsClick={() => setNotificationsOpen((v) => !v)}
          unreadCount={unreadCount}
        />
        <main className={`flex-1 pb-8 ${isDemo && demoBannerDismissed ? 'mt-6' : isDemo ? 'mt-4' : 'mt-6'}`}>
          <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>

      <ProfileDrawer open={profileOpen} onClose={() => setProfileOpen(false)} />
      <NotificationsPanel
        open={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        notifications={notifications}
      />
    </div>
  );
};

export default DashboardLayout;