import { useContext } from 'react';
import AuthContext from '../../context/AuthContext';
import { Mail, Calendar, Activity } from 'lucide-react';

const ProfileSection = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="overflow-hidden bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="h-24 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
      <div className="px-6 pb-6 relative">
        <div className="relative flex justify-center -mt-12">
          <div className="flex items-center justify-center w-24 h-24 bg-white dark:bg-gray-800 rounded-full border-4 border-white dark:border-gray-900 shadow-md">
            <span className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
              {user?.name?.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>
        <div className="mt-4 text-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{user?.name}</h2>
          <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">Patient Profile</p>
        </div>
        <div className="mt-6 space-y-3">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Mail className="w-4 h-4 mr-3 text-gray-400 dark:text-gray-500" />
            {user?.email}
          </div>
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Calendar className="w-4 h-4 mr-3 text-gray-400 dark:text-gray-500" />
            Joined {new Date().toLocaleDateString()}
          </div>
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Activity className="w-4 h-4 mr-3 text-gray-400 dark:text-gray-500" />
            0 Reports Analyzed
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;
