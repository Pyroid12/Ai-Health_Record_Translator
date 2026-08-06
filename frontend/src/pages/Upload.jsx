import { useState, useContext } from 'react';
import api from '../api/axios';
import ReactMarkdown from 'react-markdown';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas-pro';
import toast from 'react-hot-toast';
import { UploadCloud, File, Download } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import AuthContext from '../context/AuthContext';
import NotificationContext from '../context/NotificationContext';

const Upload = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [extractedText, setExtractedText] = useState('');
  const [summary, setSummary] = useState('');
  const [reportId, setReportId] = useState(null);
  const [language, setLanguage] = useState('English');
  const [translating, setTranslating] = useState(false);
  const { user } = useContext(AuthContext);
  const { addNotification } = useContext(NotificationContext);

  const handleFileChange = (e) => {
    setExtractedText('');
    setSummary('');
    setReportId(null);
    setLanguage('English');
    const selectedFile = e.target.files[0];

    if (!selectedFile) return;

    // Validate size (10MB max)
    if (selectedFile.size > 10 * 1024 * 1024) {
      toast.error('File exceeds 10MB limit.');
      setFile(null);
      return;
    }

    // Validate type
    const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!validTypes.includes(selectedFile.type)) {
      toast.error('Invalid file type. Only JPG, PNG, or PDF allowed.');
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
      toast.error('Please select a file first.');
      return;
    }

    setLoading(true);
    setExtractedText('');
    setSummary('');
    setReportId(null);
    setLanguage('English');

    const formData = new FormData();
    formData.append('report', file);

    try {
      const token = JSON.parse(localStorage.getItem('user'))?.token;
      const res = await api.post('/api/reports/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success(res.data.message);
      if (res.data.report) {
        setReportId(res.data.report._id);
        if (res.data.report.ocrText) setExtractedText(res.data.report.ocrText);
        if (res.data.report.summary) setSummary(res.data.report.summary);
        addNotification({
          title: 'Report uploaded',
          message: file?.name ? `${file.name} processed successfully.` : 'Your report has been processed.',
          type: 'success',
        });
      }
      setFile(null);
      setPreview('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload file.');
    } finally {
      setLoading(false);
    }
  };

  const handleTranslate = async (e) => {
    const selectedLang = e.target.value;
    setLanguage(selectedLang);

    if (!reportId) return;

    setTranslating(true);
    try {
      const token = JSON.parse(localStorage.getItem('user'))?.token;
      const res = await api.post(
        `/api/reports/${reportId}/translate`,
        { targetLanguage: selectedLang },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSummary(res.data.translation);
      toast.success(`Translated to ${selectedLang}`);
      addNotification({
        title: 'Translation ready',
        message: `Report summary translated to ${selectedLang}.`,
        type: 'info',
      });
    } catch (error) {
      toast.error('Failed to translate summary.');
    } finally {
      setTranslating(false);
    }
  };

  const handleDownloadPDF = async () => {
    const element = document.getElementById('pdf-content');
    const header = document.getElementById('pdf-header');
    if (!element) return;

    // Force light theme for the capture, regardless of current dark mode setting,
    // so the exported PDF is always readable/printable.
    const wasDark = document.documentElement.classList.contains('dark');
    if (wasDark) document.documentElement.classList.remove('dark');

    try {
      if (header) header.classList.remove('hidden');
      const canvas = await html2canvas(element, { scale: 2, backgroundColor: '#ffffff' });
      if (header) header.classList.add('hidden');

      const imgData = canvas.toDataURL('image/png');

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 10, pdfWidth, pdfHeight);
      pdf.save(`Medical_Report_${language}.pdf`);
      toast.success('PDF downloaded successfully');
    } catch (error) {
      if (header) header.classList.add('hidden');
      console.error('PDF Generation Error:', error);
      toast.error('Failed to generate PDF.');
    } finally {
      if (wasDark) document.documentElement.classList.add('dark');
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Upload Medical Report</h1>

        <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-indigo-200 rounded-xl bg-indigo-50/50 hover:bg-indigo-50 transition-colors">
            {!file ? (
              <>
                <UploadCloud className="w-16 h-16 text-indigo-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Select a file to upload</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">PDF, JPG, or PNG up to 10MB</p>
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
                  <img src={preview} alt="Preview" className="h-48 object-contain mb-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700" />
                ) : (
                  <File className="w-16 h-16 text-indigo-500 mb-4" />
                )}
                <p className="text-sm font-medium text-gray-900 dark:text-white mb-6 break-all max-w-xs text-center">{file.name}</p>

                <div className="flex space-x-4">
                  <label className="cursor-pointer">
                    <span className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:bg-gray-50 dark:bg-gray-800 transition-colors">
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

        {summary && (
          <div className="mt-8 bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 relative">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b pb-4 gap-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">AI Summary & Explanation</h2>
              <div className="flex items-center space-x-3 w-full sm:w-auto">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">Language:</label>
                <select
                  value={language}
                  onChange={handleTranslate}
                  disabled={translating}
                  className="block w-32 pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Marathi">Marathi</option>
                  <option value="Tamil">Tamil</option>
                  <option value="Kannada">Kannada</option>
                  <option value="Telugu">Telugu</option>
                </select>
                {translating && (
                  <svg className="animate-spin h-5 w-5 text-indigo-600 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                <button
                  onClick={handleDownloadPDF}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors ml-auto sm:ml-4"
                >
                  <Download className="w-4 h-4 mr-2" />
                  PDF
                </button>
              </div>
            </div>

            {/* ID added for PDF generation capture */}
            <div id="pdf-content" className="bg-white dark:bg-gray-900 p-4">
              <div className="mb-6 text-center hidden" id="pdf-header">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">AI Health Record Translator</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Report Summary - {language}</p>
              </div>
              <div className={`prose prose-indigo dark:prose-invert max-w-none text-gray-800 dark:text-gray-200 transition-opacity ${translating ? 'opacity-50' : 'opacity-100'}`}>
                <ReactMarkdown>{summary}</ReactMarkdown>
              </div>
            </div>
          </div>
        )}

        {extractedText && (
          <div className="mt-8 bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Extracted Text (Raw OCR)</h2>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300 max-h-96 overflow-y-auto">
              {extractedText}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Upload;