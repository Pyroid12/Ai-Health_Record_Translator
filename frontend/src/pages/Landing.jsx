import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Brain, Languages, FileCheck, Sparkles, ShieldCheck, Stethoscope, Zap, LogIn, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import AuthContext from '../context/AuthContext';

const Landing = () => {
  const [guestLoading, setGuestLoading] = useState(false);
  const { loginAsGuest } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleGuestLogin = async () => {
    setGuestLoading(true);
    try {
      loginAsGuest();
      toast.success('Welcome to Demo Mode! Sample reports are pre-loaded.');
      setTimeout(() => navigate('/dashboard'), 300);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setGuestLoading(false);
    }
  };

  const features = [
    { icon: Brain, label: 'AI-Powered Analysis', text: 'Decode complex medical jargon instantly' },
    { icon: Languages, label: 'Multi-language Support', text: 'Translate reports into your native tongue' },
    { icon: FileCheck, label: 'Instant Summary', text: 'Structured, easy-to-read insights' },
    { icon: ShieldCheck, label: 'Private & Secure', text: 'Your records never leave your control' },
  ];

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gray-50 dark:bg-gray-950">
      {/* Animated aurora mesh background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-24 h-[28rem] w-[28rem] rounded-full bg-indigo-400/30 blur-3xl animate-blob dark:bg-indigo-500/20" />
        <div className="absolute top-20 -right-24 h-[32rem] w-[32rem] rounded-full bg-fuchsia-400/25 blur-3xl animate-blob2 dark:bg-fuchsia-500/20" />
        <div className="absolute -bottom-32 left-1/3 h-[28rem] w-[28rem] rounded-full bg-sky-400/25 blur-3xl animate-blob dark:bg-sky-500/20" />
      </div>

      <div className="relative min-h-screen grid lg:grid-cols-2">
        {/* Left Hero */}
        <div className="hidden lg:flex flex-col justify-between p-10 xl:p-16 relative">
          <div className="flex items-center gap-3 animate-fade-up">
            <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 grid place-items-center shadow-lg shadow-indigo-500/30">
              <Stethoscope className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-xl font-extrabold tracking-tight text-gray-900 dark:text-white">MedTranslate <span className="text-gradient">AI</span></p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Medical Intelligence Platform</p>
            </div>
          </div>

          <div className="space-y-8 my-auto animate-fade-up" style={{ animationDelay: '0.1s' }}>
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200/60 dark:border-indigo-500/20 bg-white/60 dark:bg-gray-900/40 backdrop-blur px-4 py-1.5 shadow-sm">
              <Sparkles className="h-4 w-4 text-indigo-500" />
              <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-300">Powered by Advanced AI Models</span>
            </div>

            <h1 className="text-5xl xl:text-6xl font-black leading-[1.05] tracking-tight text-gray-900 dark:text-white">
              Your medical reports,{' '}
              <span className="text-gradient animate-aurora">finally readable.</span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-lg">
              Upload any lab result, prescription, or hospital report. Our AI extracts, simplifies, and translates it into plain language you actually understand.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 max-w-lg">
              {features.map((f) => (
                <div key={f.label} className="glass rounded-2xl p-4 card-lift">
                  <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500/10 to-fuchsia-500/10 grid place-items-center mb-3">
                    <f.icon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{f.label}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{f.text}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-gray-400 dark:text-gray-500 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            © {new Date().getFullYear()} MedTranslate AI · Your health data, always private
          </p>
        </div>

        {/* Right Form */}
        <div className="flex items-center justify-center p-6 sm:p-10 lg:p-12">
          <div className="w-full max-w-md animate-fade-up" style={{ animationDelay: '0.15s' }}>
            {/* Mobile logo */}
            <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
              <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 grid place-items-center shadow-lg shadow-indigo-500/30">
                <Stethoscope className="h-6 w-6 text-white" />
              </div>
              <p className="text-2xl font-extrabold text-gray-900 dark:text-white">MedTranslate <span className="text-gradient">AI</span></p>
            </div>

            <div className="border-gradient-strong rounded-[1.5rem]">
              <div className="glass rounded-[1.45rem] p-8 sm:p-10">
                <div className="text-center">
                  <h2 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white">
                    Welcome
                  </h2>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Get started in seconds — choose how you'd like to continue.
                  </p>
                </div>

                {/* Guest Login (Most Prominent) */}
                <div className="mt-7">
                  <button
                    type="button"
                    onClick={handleGuestLogin}
                    disabled={guestLoading}
                    className="w-full relative overflow-hidden btn-gradient text-white font-semibold py-3 rounded-xl disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <span className="absolute inset-0 animate-shimmer" />
                    <span className="relative inline-flex items-center gap-2">
                      <Zap className="h-5 w-5" />
                      {guestLoading ? 'Entering Demo Mode...' : 'Continue as Guest (Try Demo)'}
                    </span>
                  </button>
                  <p className="mt-2 text-center text-[11px] text-gray-500 dark:text-gray-400">
                    No signup required · Sample reports are pre-loaded so you can try everything instantly.
                  </p>
                </div>

                <div className="flex items-center my-6">
                  <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
                  <span className="mx-4 text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                    Or use an account
                  </span>
                  <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
                </div>

                {/* Sign in + Register buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    to="/login"
                    className="glass text-gray-900 dark:text-white font-semibold py-3 rounded-xl inline-flex items-center justify-center gap-2 card-lift hover:bg-white/80 dark:hover:bg-gray-900/80 group"
                  >
                    <LogIn className="h-5 w-5 text-indigo-500 transition-transform group-hover:scale-110" />
                    Sign in
                  </Link>
                  <Link
                    to="/register"
                    className="glass text-gray-900 dark:text-white font-semibold py-3 rounded-xl inline-flex items-center justify-center gap-2 card-lift hover:bg-white/80 dark:hover:bg-gray-900/80 group"
                  >
                    <UserPlus className="h-5 w-5 text-fuchsia-500 transition-transform group-hover:scale-110" />
                    Register
                  </Link>
                </div>
              </div>
            </div>

            <p className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
              By continuing, you agree to our Terms of Service & Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;