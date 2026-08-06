import { useState, useEffect, useMemo, useContext } from 'react';
import { FileText, Languages, Clock, ShieldCheck, Sparkles, TrendingUp } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import AuthContext from '../context/AuthContext';
import DashboardLayout from '../components/layout/DashboardLayout';
import UploadCard from '../components/dashboard/UploadCard';
import RecentReportsCard from '../components/dashboard/RecentReportsCard';

const SEED_SAMPLE_REPORTS = [
  {
    _id: 'seed-1',
    originalFileName: 'Blood_Test_Report_CBC.pdf',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    translations: { English: true, Hindi: true, Marathi: true },
    targetLanguage: 'Hindi',
  },
  {
    _id: 'seed-2',
    originalFileName: 'Liver_Function_Test.pdf',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 9).toISOString(),
    translations: { English: true, Tamil: true },
    targetLanguage: 'Tamil',
  },
  {
    _id: 'seed-3',
    originalFileName: 'Lipid_Profile_Cholesterol.pdf',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 21).toISOString(),
    translations: { English: true, Hindi: true, Kannada: true },
    targetLanguage: 'Kannada',
  },
  {
    _id: 'seed-4',
    originalFileName: 'Thyroid_Profile_TSH_T3_T4.jpg',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45).toISOString(),
    translations: { English: true, Telugu: true },
    targetLanguage: 'Telugu',
  },
  {
    _id: 'seed-5',
    originalFileName: 'Vitamin_D_B12_Report.pdf',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 70).toISOString(),
    translations: { English: true, Hindi: true },
    targetLanguage: 'English',
  },
];

const MINUTES_SAVED_PER_REPORT = 3; // realistic avg: reading + looking up medical terms

function formatTimeSaved(totalMinutes) {
  if (totalMinutes <= 0) return '0 min';
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h} hr${h > 1 ? 's' : ''}`;
  return `${h}h ${m}m`;
}

function buildStats(reports) {
  const total = reports.length;
  const languageSet = new Set();
  reports.forEach((r) => {
    const translations = r.translations && typeof r.translations === 'object' ? r.translations : {};
    Object.keys(translations).forEach((lang) => translations[lang] && languageSet.add(lang));
    // also handle flat targetLanguage usage (if present on report itself)
    if (r.targetLanguage) languageSet.add(r.targetLanguage);
  });
  const languageCount = languageSet.size;
  const timeSavedMinutes = total * MINUTES_SAVED_PER_REPORT;

  return [
    {
      label: 'Reports Analyzed',
      value: total.toString(),
      icon: FileText,
      accent: 'from-indigo-500 to-sky-500',
      tag: total === 0 ? 'Upload your first report' : 'Lifetime total',
    },
    {
      label: 'Languages Used',
      value: languageCount === 0 ? '6 available' : `${languageCount}`,
      icon: Languages,
      accent: 'from-violet-500 to-fuchsia-500',
      tag:
        languageCount === 0
          ? 'Hindi · Marathi · Tamil + more'
          : Array.from(languageSet).slice(0, 3).join(' · ') + (languageCount > 3 ? ' +' : ''),
    },
    {
      label: 'Time Saved',
      value: formatTimeSaved(timeSavedMinutes),
      icon: Clock,
      accent: 'from-emerald-500 to-teal-500',
      tag: total === 0 ? 'Starts at 3 min/report' : 'vs. manual reading + lookup',
    },
    {
      label: 'Documents Stored',
      value: total.toString(),
      icon: ShieldCheck,
      accent: 'from-amber-500 to-rose-500',
      tag: 'End-to-end encrypted in cloud',
    },
  ];
}

const SkeletonStats = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
    {[0, 1, 2, 3].map((i) => (
      <div
        key={i}
        className="border-gradient rounded-[1.25rem] animate-fade-up"
        style={{ animationDelay: `${0.05 * i}s` }}
      >
        <div className="bg-white dark:bg-gray-900 rounded-[calc(1.25rem-1px)] p-5">
          <div className="flex items-start justify-between">
            <div className="h-11 w-11 rounded-2xl bg-gray-200 dark:bg-gray-800 animate-pulse" />
            <div className="h-3 w-8 rounded bg-gray-200 dark:bg-gray-800 animate-pulse" />
          </div>
          <div className="mt-5 space-y-2">
            <div className="h-8 w-16 rounded bg-gray-200 dark:bg-gray-800 animate-pulse" />
            <div className="h-4 w-28 rounded bg-gray-200 dark:bg-gray-800 animate-pulse" />
            <div className="h-3 w-36 rounded bg-gray-200 dark:bg-gray-800 animate-pulse" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

const Dashboard = () => {
  const { isDemo } = useContext(AuthContext);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let canceled = false;
    (async () => {
      // Demo mode: use seeded sample data (no API call needed)
      if (isDemo) {
        await new Promise((r) => setTimeout(r, 400)); // tiny perceived load delay
        if (!canceled) {
          setReports(SEED_SAMPLE_REPORTS);
          setLoading(false);
        }
        return;
      }

      try {
        const token = JSON.parse(localStorage.getItem('user'))?.token;
        if (!token) {
          if (!canceled) setLoading(false);
          return;
        }
        const res = await api.get('/api/reports', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!canceled) setReports(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error(error);
        toast.error('Failed to load dashboard stats.');
      } finally {
        if (!canceled) setLoading(false);
      }
    })();
    return () => {
      canceled = true;
    };
  }, [isDemo]);

  const stats = useMemo(() => buildStats(reports), [reports]);

  return (
    <DashboardLayout>
      <div className="mb-8 animate-fade-up">
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200/60 dark:border-indigo-500/20 bg-white/70 dark:bg-gray-900/60 backdrop-blur px-3 py-1.5 shadow-sm mb-4">
          <TrendingUp className="h-3.5 w-3.5 text-indigo-500" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">Dashboard</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-gray-900 dark:text-white">
          Good to see you <span className="text-gradient animate-aurora">welcome back</span>
        </h1>
        <p className="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-2xl">
          Here's your AI-powered health intelligence at a glance. Upload a report to get instant translations & explanations.
        </p>
      </div>

      {/* Stats grid */}
      {loading ? (
        <SkeletonStats />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className="border-gradient rounded-[1.25rem] card-lift animate-fade-up"
              style={{ animationDelay: `${0.05 * i}s` }}
            >
              <div className="relative bg-white dark:bg-gray-900 rounded-[calc(1.25rem-1px)] p-5 overflow-hidden">
                <div className={`pointer-events-none absolute -top-12 -right-12 h-32 w-32 rounded-full bg-gradient-to-br ${s.accent} opacity-20 blur-2xl`} />
                <div className="relative flex items-start justify-between">
                  <div className={`h-11 w-11 rounded-2xl bg-gradient-to-br ${s.accent} grid place-items-center shadow-lg`}>
                    <s.icon className="h-5 w-5 text-white" />
                  </div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    <Sparkles className="h-3 w-3" /> Live
                  </span>
                </div>
                <div className="relative mt-5">
                  <p className="text-3xl font-black tracking-tight text-gray-900 dark:text-white">{s.value}</p>
                  <p className="mt-1 text-sm font-semibold text-gray-700 dark:text-gray-200">{s.label}</p>
                  <p className="mt-0.5 text-[11px] text-gray-500 dark:text-gray-400">{s.tag}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="space-y-6 animate-fade-up" style={{ animationDelay: '0.25s' }}>
        <UploadCard />
        <RecentReportsCard />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;