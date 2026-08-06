import { useState, useContext, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, User, Brain, Languages, FileCheck, Sparkles, ShieldCheck, Stethoscope, Zap, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';
import AuthContext from '../context/AuthContext';

function scorePassword(pw) {
  if (!pw) return 0;
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score; // 0 to 5
}

function strengthLabel(score) {
  if (score <= 1) return { label: 'Weak', className: 'bg-red-500', textColor: 'text-red-600 dark:text-red-400', pct: 20 };
  if (score === 2) return { label: 'Fair', className: 'bg-orange-500', textColor: 'text-orange-600 dark:text-orange-400', pct: 40 };
  if (score === 3) return { label: 'Good', className: 'bg-amber-400', textColor: 'text-amber-600 dark:text-amber-400', pct: 65 };
  if (score === 4) return { label: 'Strong', className: 'bg-emerald-500', textColor: 'text-emerald-600 dark:text-emerald-400', pct: 85 };
  return { label: 'Excellent!', className: 'bg-green-500', textColor: 'text-green-600 dark:text-green-400', pct: 100 };
}

const EMAIL_REGEX = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const { register } = useContext(AuthContext);

  const errors = useMemo(() => {
    const e = {};
    if (touched.name && formData.name.trim().length < 2) e.name = 'Name must be at least 2 characters.';
    if (touched.email && !EMAIL_REGEX.test(formData.email.trim())) e.email = 'Enter a valid email address.';
    if (touched.password) {
      if (formData.password.length < 8) e.password = 'Password must be at least 8 characters.';
      else if (!/(?=.*[A-Za-z])(?=.*\d)/.test(formData.password))
        e.password = 'Password must contain at least one letter and one number.';
    }
    if (touched.confirmPassword && formData.confirmPassword !== formData.password)
      e.confirmPassword = 'Passwords do not match.';
    return e;
  }, [formData, touched]);

  const isFormValid =
    formData.name.trim().length >= 2 &&
    EMAIL_REGEX.test(formData.email.trim()) &&
    formData.password.length >= 8 &&
    /(?=.*[A-Za-z])(?=.*\d)/.test(formData.password) &&
    formData.password === formData.confirmPassword;

  const pwScore = scorePassword(formData.password);
  const strength = strengthLabel(pwScore);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ name: true, email: true, password: true, confirmPassword: true });
    if (!isFormValid) {
      toast.error('Please fix the errors in the form.');
      return;
    }
    setLoading(true);
    try {
      await register(formData.name, formData.email, formData.password, formData.confirmPassword);
      toast.success('Account created successfully!');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleBlur = (e) => setTouched({ ...touched, [e.target.name]: true });

  const pwRuleList = [
    { label: 'At least 8 characters', pass: formData.password.length >= 8 },
    { label: 'At least one letter (A-z)', pass: /[A-Za-z]/.test(formData.password) },
    { label: 'At least one number (0-9)', pass: /\d/.test(formData.password) },
    { label: 'Matches confirm password', pass: !!formData.confirmPassword && formData.confirmPassword === formData.password },
  ];

  const perks = [
    { icon: Zap, label: 'Get started in 30 seconds', text: 'No credit card required' },
    { icon: Brain, label: 'Unlimited AI summaries', text: 'Analyze reports with zero limits' },
    { icon: Languages, label: 'Translate to 50+ languages', text: 'Native tongue clarity guaranteed' },
    { icon: ShieldCheck, label: 'HIPAA-level privacy', text: 'Your data is encrypted end-to-end' },
  ];

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gray-50 dark:bg-gray-950">
      {/* Animated aurora mesh background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -right-24 h-[28rem] w-[28rem] rounded-full bg-violet-400/30 blur-3xl animate-blob2 dark:bg-violet-500/20" />
        <div className="absolute top-10 -left-24 h-[32rem] w-[32rem] rounded-full bg-sky-400/25 blur-3xl animate-blob dark:bg-sky-500/20" />
        <div className="absolute -bottom-32 right-1/4 h-[28rem] w-[28rem] rounded-full bg-fuchsia-400/25 blur-3xl animate-blob2 dark:bg-fuchsia-500/20" />
      </div>

      <div className="relative min-h-screen grid lg:grid-cols-2">
        {/* Left Form */}
        <div className="flex items-center justify-center p-6 sm:p-10 lg:p-12 order-2 lg:order-1">
          <div className="w-full max-w-md animate-fade-up">
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
                    Create your account
                  </h2>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Already registered?{' '}
                    <Link to="/login" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 transition-colors">
                      Sign in →
                    </Link>
                  </p>
                </div>

                <form className="mt-8 space-y-4" onSubmit={handleSubmit} noValidate>
                  <div className="space-y-4">
                    {/* Name */}
                    <div>
                      <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300 mb-1.5 ml-0.5">
                        Full name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className={`h-5 w-5 ${errors.name ? 'text-red-400' : 'text-gray-400 dark:text-gray-500'}`} />
                        </div>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          required
                          onBlur={handleBlur}
                          className={`appearance-none rounded-xl relative block w-full pl-10 pr-3 py-3 border bg-white/70 dark:bg-gray-800/60 backdrop-blur placeholder-gray-500 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 sm:text-sm transition-all ${errors.name ? 'border-red-400 focus:ring-red-400/40 focus:border-red-400' : 'border-gray-200 dark:border-gray-700'}`}
                          placeholder="Jane Doe"
                          value={formData.name}
                          onChange={handleChange}
                        />
                      </div>
                      {errors.name && <p className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400 ml-0.5">{errors.name}</p>}
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300 mb-1.5 ml-0.5">
                        Email address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className={`h-5 w-5 ${errors.email ? 'text-red-400' : 'text-gray-400 dark:text-gray-500'}`} />
                        </div>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          onBlur={handleBlur}
                          className={`appearance-none rounded-xl relative block w-full pl-10 pr-3 py-3 border bg-white/70 dark:bg-gray-800/60 backdrop-blur placeholder-gray-500 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 sm:text-sm transition-all ${errors.email ? 'border-red-400 focus:ring-red-400/40 focus:border-red-400' : 'border-gray-200 dark:border-gray-700'}`}
                          placeholder="you@example.com"
                          value={formData.email}
                          onChange={handleChange}
                        />
                      </div>
                      {errors.email && <p className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400 ml-0.5">{errors.email}</p>}
                    </div>

                    {/* Password */}
                    <div>
                      <div className="flex items-end justify-between mb-1.5 ml-0.5">
                        <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                          Password
                        </label>
                        {formData.password && (
                          <span className={`text-[11px] font-bold uppercase tracking-wider ${strength.textColor}`}>
                            {strength.label}
                          </span>
                        )}
                      </div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className={`h-5 w-5 ${errors.password ? 'text-red-400' : 'text-gray-400 dark:text-gray-500'}`} />
                        </div>
                        <input
                          id="password"
                          name="password"
                          type="password"
                          required
                          onBlur={handleBlur}
                          className={`appearance-none rounded-xl relative block w-full pl-10 pr-3 py-3 border bg-white/70 dark:bg-gray-800/60 backdrop-blur placeholder-gray-500 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 sm:text-sm transition-all ${errors.password ? 'border-red-400 focus:ring-red-400/40 focus:border-red-400' : 'border-gray-200 dark:border-gray-700'}`}
                          placeholder="Create a strong password"
                          value={formData.password}
                          onChange={handleChange}
                        />
                      </div>
                      {/* Password strength bar */}
                      {formData.password && (
                        <div className="mt-2 flex items-center gap-1.5">
                          {[0, 1, 2, 3, 4].map((i) => (
                            <div
                              key={i}
                              className={`h-1.5 flex-1 rounded-full transition-all duration-200 ${i < pwScore ? strength.className : 'bg-gray-200 dark:bg-gray-700'}`}
                            />
                          ))}
                        </div>
                      )}
                      {/* Password rules */}
                      <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-1">
                        {pwRuleList.map((r) => (
                          <div key={r.label} className="flex items-center gap-1.5">
                            {r.pass ? (
                              <Check className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
                            ) : (
                              <X className="h-3.5 w-3.5 text-gray-300 dark:text-gray-600 flex-shrink-0" />
                            )}
                            <span className={`text-[11px] ${r.pass ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-gray-500 dark:text-gray-400'}`}>
                              {r.label}
                            </span>
                          </div>
                        ))}
                      </div>
                      {errors.password && <p className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400 ml-0.5">{errors.password}</p>}
                    </div>

                    {/* Confirm password */}
                    <div>
                      <label htmlFor="confirmPassword" className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300 mb-1.5 ml-0.5">
                        Confirm password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className={`h-5 w-5 ${errors.confirmPassword ? 'text-red-400' : 'text-gray-400 dark:text-gray-500'}`} />
                        </div>
                        <input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          required
                          onBlur={handleBlur}
                          className={`appearance-none rounded-xl relative block w-full pl-10 pr-3 py-3 border bg-white/70 dark:bg-gray-800/60 backdrop-blur placeholder-gray-500 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 sm:text-sm transition-all ${errors.confirmPassword ? 'border-red-400 focus:ring-red-400/40 focus:border-red-400' : 'border-gray-200 dark:border-gray-700'}`}
                          placeholder="Re-enter your password"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                        />
                      </div>
                      {errors.confirmPassword && <p className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400 ml-0.5">{errors.confirmPassword}</p>}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !isFormValid}
                    className="w-full btn-gradient text-white font-semibold py-3 rounded-xl disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Creating your account...' : 'Create Account Free'}
                  </button>
                </form>
              </div>
            </div>

            <p className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
              By creating an account you agree to our Terms of Service & Privacy Policy.
            </p>
          </div>
        </div>

        {/* Right Hero */}
        <div className="hidden lg:flex flex-col justify-between p-10 xl:p-16 relative order-1 lg:order-2">
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
            <div className="inline-flex items-center gap-2 rounded-full border border-fuchsia-200/60 dark:border-fuchsia-500/20 bg-white/60 dark:bg-gray-900/40 backdrop-blur px-4 py-1.5 shadow-sm">
              <Sparkles className="h-4 w-4 text-fuchsia-500" />
              <span className="text-xs font-semibold text-fuchsia-700 dark:text-fuchsia-300">Join 10,000+ patients already translating</span>
            </div>

            <h1 className="text-5xl xl:text-6xl font-black leading-[1.05] tracking-tight text-gray-900 dark:text-white">
              Your health data,{' '}
              <span className="text-gradient animate-aurora">finally understood.</span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-lg">
              Stop guessing what your lab reports mean. Get instant, plain-English explanations & translations — powered by world-class AI.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 max-w-lg">
              {perks.map((p) => (
                <div key={p.label} className="glass rounded-2xl p-4 card-lift">
                  <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-fuchsia-500/10 to-indigo-500/10 grid place-items-center mb-3">
                    <p.icon className="h-5 w-5 text-fuchsia-600 dark:text-fuchsia-400" />
                  </div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{p.label}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{p.text}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-gray-400 dark:text-gray-500 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            © {new Date().getFullYear()} MedTranslate AI · Made with care for patients worldwide 💙
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
