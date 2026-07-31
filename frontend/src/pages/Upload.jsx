import { useState, useContext } from 'react';
import axios from 'axios';
import { UploadCloud, File, AlertCircle, CheckCircle } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import AuthContext from '../context/AuthContext';

const Upload = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [extractedText, setExtractedText] = useState('');
  const { user } = useContext(AuthContext);

  const handleFileChange = (e) => {
    setMessage({ type: '', text: '' });
    setExtractedText('');
    const selectedFile = e.target.files[0];
    
    if (!selectedFile) return;

    // Validate size (10MB max)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'File exceeds 10MB limit.' });
      setFile(null);
      return;
    }

    // Validate type
    const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!validTypes.includes(selectedFile.type)) {
      setMessage({ type: 'error', text: 'Invalid file type. Only JPG, PNG, or PDF allowed.' });
      setFile(null);
      return;
    }

    setFile(selectedFile);
    
    // Preview if image
    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview('');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage({ type: 'error', text: 'Please select a file first.' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });
    setExtractedText('');

    const formData = new FormData();
    formData.append('report', file);

    try {
      const token = JSON.parse(localStorage.getItem('user'))?.token;
      const res = await axios.post('http://localhost:5000/api/reports/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage({ type: 'success', text: res.data.message });
      if (res.data.report && res.data.report.ocrText) {
        setExtractedText(res.data.report.ocrText);
      }
      setFile(null);
      setPreview('');
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to upload file.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Upload Medical Report</h1>

        {message.text && (
          <div
            className={`flex items-center p-4 mb-6 rounded-lg ${
              message.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
            }`}
          >
            {message.type === 'error' ? (
              <AlertCircle className="w-5 h-5 mr-2" />
            ) : (
              <CheckCircle className="w-5 h-5 mr-2" />
            )}
            {message.text}
          </div>
        )}

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-indigo-200 rounded-xl bg-indigo-50/50 hover:bg-indigo-50 transition-colors">
            {!file ? (
              <>
                <UploadCloud className="w-16 h-16 text-indigo-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a file to upload</h3>
                <p className="text-sm text-gray-500 mb-6">PDF, JPG, or PNG up to 10MB</p>
                <label className="cursor-pointer">
                  <span className="px-6 py-3 text-sm font-medium text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700 transition-colors">
                    Browse Files
                  </span>
                  <input type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" />
                </label>
              </>
            ) : (
              <div className="flex flex-col items-center w-full">
                {preview ? (
                  <img src={preview} alt="Preview" className="h-48 object-contain mb-4 rounded-lg shadow-sm border border-gray-200" />
                ) : (
                  <File className="w-16 h-16 text-indigo-500 mb-4" />
                )}
                <p className="text-sm font-medium text-gray-900 mb-6 break-all max-w-xs text-center">{file.name}</p>
                
                <div className="flex space-x-4">
                  <label className="cursor-pointer">
                    <span className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors">
                      Change File
                    </span>
                    <input type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" />
                  </label>
                  
                  <button
                    onClick={handleUpload}
                    disabled={loading}
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Uploading & Extracting...
                      </>
                    ) : (
                      'Upload File'
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {extractedText && (
          <div className="mt-8 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Extracted Text (OCR)</h2>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 whitespace-pre-wrap text-sm text-gray-700 max-h-96 overflow-y-auto">
              {extractedText}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Upload;
