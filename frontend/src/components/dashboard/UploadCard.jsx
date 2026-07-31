import { UploadCloud, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

const UploadCard = () => {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow duration-300 h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">New Translation</h2>
          <div className="p-2 bg-indigo-50 rounded-lg">
            <UploadCloud className="w-6 h-6 text-indigo-600" />
          </div>
        </div>
        <p className="text-gray-600 text-sm mb-6">
          Upload a medical report (PDF or Image) to extract text, simplify medical jargon, and translate to your preferred language.
        </p>
      </div>
      
      <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors duration-200">
        <FileText className="w-10 h-10 text-gray-400 mx-auto mb-3" />
        <h3 className="text-sm font-medium text-gray-900 mb-1">Drag and drop file here</h3>
        <p className="text-xs text-gray-500 mb-4">PDF, JPG, PNG up to 10MB</p>
        <Link 
          to="/dashboard/upload" 
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
        >
          Browse Files
        </Link>
      </div>
    </div>
  );
};

export default UploadCard;
