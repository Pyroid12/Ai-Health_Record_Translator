import { useContext, useEffect, useRef } from 'react';
import { X, CheckCheck, FileText, Sparkles, AlertCircle, Bell } from 'lucide-react';
import NotificationContext from '../../context/NotificationContext';

const iconMap = {
  success: FileText,
  info: Sparkles,
  error: AlertCircle,
};

const colorMap = {
  success: 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/40',
  info: 'text-indigo-600 bg-indigo-100 dark:text-indigo-400 dark:bg-indigo-900/40',
  error: 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/40',
};

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const s = Math.floor(diff / 1000);
  if (s < 60) return 'Just now';
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

const NotificationsPanel = ({ open, onClose, notifications = [] }) => {
  const { clearAll, markAllRead } = useContext(NotificationContext);
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) onClose();
    };
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed top-4 right-4 z-50 w-full sm:max-w-md">
      <div
        ref={panelRef}
        className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-base font-bold text-gray-900 dark:text-white">Notifications</h2>
            {notifications.length > 0 && (
              <span className="ml-1 rounded-full bg-indigo-100 dark:bg-indigo-900/50 px-2 py-0.5 text-xs font-medium text-indigo-700 dark:text-indigo-300">
                {notifications.length}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {notifications.length > 0 && (
              <button
                type="button"
                onClick={markAllRead}
                className="rounded-lg px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                <CheckCheck className="h-4 w-4" />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 px-6 text-center">
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/40">
                <Bell className="h-7 w-7 text-indigo-500 dark:text-indigo-400" />
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">No notifications yet</p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Activity like uploads &amp; translations will appear here.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100 dark:divide-gray-800">
              {notifications.map((n) => {
                const Icon = iconMap[n.type] || Sparkles;
                return (
                  <li key={n.id} className="flex gap-3 px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${colorMap[n.type] || colorMap.info}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">{n.title}</p>
                        {!n.read && <span className="h-2 w-2 flex-shrink-0 rounded-full bg-red-500" />}
                      </div>
                      <p className="mt-0.5 text-sm text-gray-600 dark:text-gray-300">{n.message}</p>
                      <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">{timeAgo(n.createdAt)}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {notifications.length > 0 && (
          <div className="px-5 py-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/60">
            <button
              type="button"
              onClick={clearAll}
              className="w-full rounded-lg px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Clear all notifications
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPanel;