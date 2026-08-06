import ProfileSection from '../dashboard/ProfileSection';
import { X } from 'lucide-react';

const ProfileDrawer = ({ open, onClose }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full max-w-sm overflow-y-auto bg-gray-50 dark:bg-gray-950 p-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Profile</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <ProfileSection />
      </div>
    </div>
  );
};

export default ProfileDrawer;