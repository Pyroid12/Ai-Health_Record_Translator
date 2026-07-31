import { FileText, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const RecentReportsCard = () => {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Recent Reports</h2>
        <Link to="/dashboard/reports" className="text-sm font-medium text-indigo-600 hover:text-indigo-500 flex items-center">
          View all
          <ArrowRight className="w-4 h-4 ml-1" />
        </Link>
      </div>

      <div className="flex flex-col items-center justify-center py-10 text-center">
        <div className="p-4 bg-gray-50 rounded-full mb-4">
          <FileText className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-sm font-medium text-gray-900">No reports found</h3>
        <p className="mt-1 text-sm text-gray-500">
          Get started by uploading a new medical report.
        </p>
        <div className="mt-6">
          <Link
            to="/dashboard/upload"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-indigo-700 bg-indigo-100 border border-transparent rounded-lg hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            Upload Report
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RecentReportsCard;
