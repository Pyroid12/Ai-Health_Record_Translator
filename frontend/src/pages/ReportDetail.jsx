import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { ArrowLeft, Download, FileText } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import AuthContext from '../context/AuthContext';

const ReportDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState('English');
  const [translating, setTranslating] = useState(false);
  const [displaySummary, setDisplaySummary] = useState('');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('user'))?.token;
        const res = await axios.get(`http://localhost:5000/api/reports/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReport(res.data);
        setDisplaySummary(res.data.summary);
      } catch (error) {
        console.error('Failed to fetch report details', error);
        navigate('/dashboard/history');
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [id, navigate]);

  const handleTranslate = async (e) => {
    const selectedLang = e.target.value;
    setLanguage(selectedLang);
    setTranslating(true);
    
    try {
      const token = JSON.parse(localStorage.getItem('user'))?.token;
      const res = await axios.post(
        `http://localhost:5000/api/reports/${id}/translate`,
        { targetLanguage: selectedLang },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDisplaySummary(res.data.translation);
    } catch (error) {
      console.error('Translation failed', error);
    } finally {
      setTranslating(false);
    }
  };

  const handleDownloadPDF = async () => {
    const element = document.getElementById('pdf-content');
    const header = document.getElementById('pdf-header');
    if (!element) return;
    
    try {
      if (header) header.classList.remove('hidden');
      const canvas = await html2canvas(element, { scale: 2 });
      if (header) header.classList.add('hidden');

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 10, pdfWidth, pdfHeight);
      pdf.save(`Medical_Report_${language}.pdf`);
    } catch (error) {
      if (header) header.classList.add('hidden');
      console.error('PDF Generation Error:', error);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!report) return null;

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/dashboard/history')}
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to History
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8 flex items-center justify-between">
          <div className="flex items-center">
            <div className="p-3 bg-indigo-50 rounded-lg mr-4">
              <FileText className="w-8 h-8 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{report.originalFileName}</h1>
              <p className="text-gray-500 text-sm">Uploaded on {new Date(report.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
          <a
            href={report.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium bg-indigo-50 px-4 py-2 rounded-lg"
          >
            View Original
          </a>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b pb-4 gap-4">
            <h2 className="text-xl font-bold text-gray-900">AI Summary & Explanation</h2>
            <div className="flex items-center space-x-3 w-full sm:w-auto">
              <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Language:</label>
              <select
                value={language}
                onChange={handleTranslate}
                disabled={translating}
                className="block w-32 pl-3 pr-10 py-2 text-base border-gray-300 bg-gray-50 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
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
          
          <div id="pdf-content" className="bg-white p-4">
            <div className="mb-6 text-center hidden" id="pdf-header">
              <h1 className="text-2xl font-bold text-gray-900">AI Health Record Translator</h1>
              <p className="text-sm text-gray-500">Report Summary - {language}</p>
            </div>
            <div className={`prose prose-indigo max-w-none text-gray-800 transition-opacity ${translating ? 'opacity-50' : 'opacity-100'}`}>
              <ReactMarkdown>{displaySummary}</ReactMarkdown>
            </div>
          </div>
        </div>

        {report.ocrText && (
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Extracted Text (Raw OCR)</h2>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 whitespace-pre-wrap text-sm text-gray-700 max-h-96 overflow-y-auto">
              {report.ocrText}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ReportDetail;
