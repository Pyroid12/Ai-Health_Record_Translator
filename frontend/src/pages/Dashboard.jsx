import DashboardLayout from '../components/layout/DashboardLayout';
import ProfileSection from '../components/dashboard/ProfileSection';
import UploadCard from '../components/dashboard/UploadCard';
import RecentReportsCard from '../components/dashboard/RecentReportsCard';

const Dashboard = () => {
  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Overview</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome back! Here's a summary of your medical translations.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column - Profile & Stats */}
        <div className="space-y-6 lg:col-span-1">
          <ProfileSection />
        </div>

        {/* Right Column - Actions & History */}
        <div className="space-y-6 lg:col-span-2">
          <UploadCard />
          <RecentReportsCard />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
