import { UploadCloud, FileText, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const UploadCard = () => {
  return (
    <div className="border-gradient-strong rounded-[1.5rem] card-lift">
      <div className="relative bg-white dark:bg-gray-900 rounded-[1.45rem] p-7 h-full flex flex-col justify-between overflow-hidden">
        {/* soft aurora */}
        <div className="pointer-events-none absolute -top-16 -right-16 h-56 w-56 rounded-full bg-gradient-to-br from-indigo-500/20 via-violet-500/20 to-fuchsia-500/20 blur-3xl animate-aurora" />

        <div className="relative">
          <div className="flex items-start justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 grid place-items-center shadow-lg shadow-indigo-500/30 animate-float">
                <UploadCloud className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-black tracking-tight text-gray-900 dark:text-white">New Translation</h2>
                <div className="inline-flex items-center gap-1.5 mt-0.5">
                  <Sparkles className="h-3.5 w-3.5 text-fuchsia-500" />
                  <span className="text-[11px] font-bold tracking-wide text-fuchsia-600 dark:text-fuchsia-400">AI-POWERED</span>
                </div>
              </div>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-6 max-w-lg">
            Upload a medical report — our AI instantly extracts text, decodes medical jargon, and translates everything into plain language you can understand.
          </p>
        </div>

        {/* Fancy dropzone */}
        <div className="relative rounded-2xl border-2 border-dashed border-indigo-200/80 dark:border-indigo-500/20 bg-gradient-to-br from-indigo-50/60 via-white to-fuchsia-50/40 dark:from-indigo-950/30 dark:via-gray-900 dark:to-fuchsia-950/20 p-8 text-center hover:border-indigo-400/60 dark:hover:border-indigo-500/40 transition-all duration-300 overflow-hidden">
          <div className="pointer-events-none absolute inset-0 animate-shimmer" />
          <div className="relative mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 grid place-items-center shadow-xl shadow-indigo-500/30 mb-4 animate-float">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h3 className="relative text-base font-bold text-gray-900 dark:text-white mb-1">Drop your report here</h3>
          <p className="relative text-xs text-gray-500 dark:text-gray-400 mb-5">PDF · JPG · PNG — up to 10MB · Secure & encrypted</p>
          <Link
            to="/dashboard/upload"
            className="relative inline-flex items-center gap-2 btn-gradient text-white font-semibold px-5 py-2.5 rounded-xl text-sm"
          >
            Browse Files
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UploadCard;
