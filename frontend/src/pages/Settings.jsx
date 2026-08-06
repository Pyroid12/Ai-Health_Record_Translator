import { useContext, useState } from 'react';
import {
  LogOut,
  User,
  Mail,
  UserCircle,
  Edit3,
  Save,
  X,
  Lock,
  Eye,
  EyeOff,
  Trash2,
  ShieldCheck,
  Calendar,
  Crown,
  Sparkles,
  Globe,
  KeyRound,
  ChevronDown,
} from 'lucide-react';
import toast from 'react-hot-toast';
import DashboardLayout from '../components/layout/DashboardLayout';
import AuthContext from '../context/AuthContext';

const Settings = () => {
  const { user, logout, isDemo, setUser } = useContext(AuthContext);

  // Profile edit state
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  const [profileSaving, setProfileSaving] = useState(false);

  // Password change state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);

  // Preferences state
  const [defaultLanguage, setDefaultLanguage] = useState('English');
  const [dateFormat, setDateFormat] = useState('MM/DD/YYYY');
  const [autoSummarize, setAutoSummarize] = useState(true);
  const [showSavePref, setShowSavePref] = useState(false);

  // Delete account confirm
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteText, setDeleteText] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);

  const profileDirty =
    profileForm.name !== (user?.name || '') || profileForm.email !== (user?.email || '');
  const passwordDirty =
    passwordForm.currentPassword ||
    passwordForm.newPassword ||
    passwordForm.confirmPassword;
  const prefDirty = showSavePref;

  const markPrefsDirty = () => setShowSavePref(true);

  const saveProfile = async () => {
    if (!profileForm.name.trim() || !profileForm.email.trim()) {
      toast.error('Name and email are required.');
      return;
    }
    setProfileSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    try {
      const updated = { ...(user || {}), name: profileForm.name, email: profileForm.email };
      localStorage.setItem('user', JSON.stringify(updated));
      setUser(updated);
      toast.success('Profile updated successfully!');
      setEditingProfile(false);
    } catch (e) {
      toast.error('Could not update profile. Please try again.');
    } finally {
      setProfileSaving(false);
    }
  };

  const cancelProfile = () => {
    setProfileForm({ name: user?.name || '', email: user?.email || '' });
    setEditingProfile(false);
  };

  const savePassword = async () => {
    if (isDemo) {
      toast.error('Cannot change password in demo mode. Please create an account.');
      return;
    }
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      toast.error('Please fill in all password fields.');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters.');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match.');
      return;
    }
    setPasswordSaving(true);
    await new Promise((r) => setTimeout(r, 700));
    setPasswordSaving(false);
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setShowCurrent(false);
    setShowNew(false);
    setShowConfirm(false);
    toast.success('Password changed successfully!');
  };

  const savePrefs = async () => {
    await new Promise((r) => setTimeout(r, 400));
    setShowSavePref(false);
    toast.success('Preferences saved!');
  };

  const handleDelete = async () => {
    if (deleteText !== 'DELETE') {
      toast.error('Please type DELETE to confirm.');
      return;
    }
    setDeleteLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setDeleteLoading(false);
    setDeleteOpen(false);
    setDeleteText('');
    toast.success('Account deleted. We are sorry to see you go.');
    logout();
  };

  const languages = ['English', 'Spanish', 'French', 'Mandarin', 'Arabic', 'Hindi', 'German', 'Japanese'];
  const dateFormats = ['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD'];

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-gray-900 dark:text-white">
              Account & Profile
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Manage your profile, security, and preferences.
            </p>
          </div>
          {isDemo && (
            <div className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-indigo-500/10 to-fuchsia-500/10 border border-indigo-200/40 dark:border-indigo-500/20 px-3 py-1.5 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
              <Sparkles className="h-3.5 w-3.5" /> Demo Mode
            </div>
          )}
        </div>

        <div className="space-y-6">
          {/* -------------- PROFILE HEADER CARD -------------- */}
          <div className="relative overflow-hidden border-gradient-strong rounded-3xl">
            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-br from-indigo-500/20 via-violet-500/20 to-fuchsia-500/20" />
            <div className="relative glass rounded-[calc(1.5rem-1px)] p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                <div className="relative shrink-0">
                  <div className="absolute -inset-1 bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 rounded-full blur-sm opacity-60" />
                  {user?.name ? (
                    <div className="relative h-20 w-20 rounded-full bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 grid place-items-center text-2xl font-black text-white shadow-xl">
                      {user.name
                        .split(' ')
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join('')}
                    </div>
                  ) : (
                    <div className="relative h-20 w-20 rounded-full bg-white/60 dark:bg-gray-800/60 border-2 border-white/40 dark:border-gray-700 grid place-items-center">
                      <UserCircle className="h-12 w-12 text-indigo-500" />
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                      {user?.name || 'Guest User'}
                    </p>
                    {isDemo ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 border border-amber-200/50 dark:border-amber-500/20 text-amber-700 dark:text-amber-400 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                        <Crown className="h-3 w-3" /> Demo
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-200/50 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                        <ShieldCheck className="h-3 w-3" /> Verified
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-gray-600 dark:text-gray-400">
                    <span className="inline-flex items-center gap-1.5">
                      <Mail className="h-4 w-4" /> {user?.email || 'demo@medtranslate.ai'}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="h-4 w-4" /> Member since {new Date().getFullYear()}
                    </span>
                  </div>
                </div>

                {!editingProfile && (
                  <button
                    onClick={() => setEditingProfile(true)}
                    className="inline-flex items-center gap-2 glass text-gray-900 dark:text-white text-sm font-semibold px-4 py-2.5 rounded-xl card-lift hover:bg-white/80 dark:hover:bg-gray-900/80 self-start sm:self-center"
                  >
                    <Edit3 className="h-4 w-4 text-indigo-500" />
                    Edit profile
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* -------------- EDIT PROFILE -------------- */}
          <div className="glass rounded-3xl p-6 sm:p-8">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <User className="h-5 w-5 text-indigo-500" />
                  Edit Profile
                </h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  Update your display name and email address.
                </p>
              </div>
              {editingProfile && profileDirty && (
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-500">
                  Unsaved changes
                </span>
              )}
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Full name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    disabled={!editingProfile}
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/60 backdrop-blur text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    disabled={!editingProfile || isDemo}
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/60 backdrop-blur text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                    placeholder="you@example.com"
                  />
                </div>
                {isDemo && editingProfile && (
                  <p className="text-[11px] text-amber-600 dark:text-amber-400">
                    Email locked in demo mode.
                  </p>
                )}
              </div>
            </div>

            {editingProfile && (
              <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6 pt-5 border-t border-gray-200/60 dark:border-gray-700/60">
                <button
                  onClick={cancelProfile}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <X className="h-4 w-4" /> Cancel
                </button>
                <button
                  onClick={saveProfile}
                  disabled={profileSaving || !profileDirty}
                  className="relative overflow-hidden btn-gradient text-white text-sm font-semibold px-5 py-2.5 rounded-xl inline-flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {profileSaving ? (
                    'Saving...'
                  ) : (
                    <>
                      <Save className="h-4 w-4" /> Save changes
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* -------------- CHANGE PASSWORD -------------- */}
          <div className="glass rounded-3xl p-6 sm:p-8">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <KeyRound className="h-5 w-5 text-fuchsia-500" />
                  Change Password
                </h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  Use a strong, unique password to keep your account secure.
                </p>
              </div>
              {passwordDirty && (
                <span className="text-[10px] font-bold uppercase tracking-wider text-fuchsia-500">
                  Unsaved
                </span>
              )}
            </div>

            {isDemo && (
              <div className="mb-5 rounded-xl bg-amber-500/10 border border-amber-200/50 dark:border-amber-500/20 px-4 py-3 text-sm text-amber-700 dark:text-amber-400 flex items-start gap-2">
                <ShieldCheck className="h-5 w-5 shrink-0 mt-0.5" />
                <span>Disabled in demo mode. Sign up for a real account to set a password.</span>
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-5">
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Current password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type={showCurrent ? 'text' : 'password'}
                    disabled={isDemo}
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/60 backdrop-blur text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/40 focus:border-fuchsia-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    tabIndex={-1}
                  >
                    {showCurrent ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  New password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type={showNew ? 'text' : 'password'}
                    disabled={isDemo}
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    placeholder="At least 6 characters"
                    className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/60 backdrop-blur text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/40 focus:border-fuchsia-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    tabIndex={-1}
                  >
                    {showNew ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Confirm new password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    disabled={isDemo}
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    placeholder="Re-type new password"
                    className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/60 backdrop-blur text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/40 focus:border-fuchsia-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    tabIndex={-1}
                  >
                    {showConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>

            {passwordDirty && !isDemo && (
              <div className="flex justify-end mt-6 pt-5 border-t border-gray-200/60 dark:border-gray-700/60">
                <button
                  onClick={savePassword}
                  disabled={passwordSaving}
                  className="relative overflow-hidden btn-gradient text-white text-sm font-semibold px-5 py-2.5 rounded-xl inline-flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {passwordSaving ? (
                    'Updating password...'
                  ) : (
                    <>
                      <KeyRound className="h-4 w-4" /> Update password
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* -------------- ACCOUNT PREFERENCES -------------- */}
          <div className="glass rounded-3xl p-6 sm:p-8">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Globe className="h-5 w-5 text-sky-500" />
                  Account Preferences
                </h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  Customize how your dashboard works for you.
                </p>
              </div>
              {prefDirty && (
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-500">
                  Unsaved
                </span>
              )}
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Default translation language
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  <select
                    value={defaultLanguage}
                    onChange={(e) => {
                      setDefaultLanguage(e.target.value);
                      markPrefsDirty();
                    }}
                    className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/60 backdrop-blur text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-500 transition-all appearance-none cursor-pointer"
                  >
                    {languages.map((l) => (
                      <option key={l}>{l}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Date format
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  <select
                    value={dateFormat}
                    onChange={(e) => {
                      setDateFormat(e.target.value);
                      markPrefsDirty();
                    }}
                    className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/60 backdrop-blur text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-500 transition-all appearance-none cursor-pointer"
                  >
                    {dateFormats.map((d) => (
                      <option key={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between p-4 rounded-xl bg-white/60 dark:bg-gray-800/50 border border-gray-200/60 dark:border-gray-700/60">
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  Auto-summarize on upload
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Immediately analyze new reports when you upload them.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setAutoSummarize(!autoSummarize);
                  markPrefsDirty();
                }}
                className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-all ${
                  autoSummarize
                    ? 'bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500'
                    : 'bg-gray-300 dark:bg-gray-700'
                }`}
                role="switch"
              >
                <span
                  className={`inline-block h-5 w-5 rounded-full bg-white shadow-md transition-transform ${
                    autoSummarize ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {prefDirty && (
              <div className="flex justify-end mt-6 pt-5 border-t border-gray-200/60 dark:border-gray-700/60">
                <button
                  onClick={savePrefs}
                  className="relative overflow-hidden btn-gradient text-white text-sm font-semibold px-5 py-2.5 rounded-xl inline-flex items-center justify-center gap-2"
                >
                  <Save className="h-4 w-4" /> Save preferences
                </button>
              </div>
            )}
          </div>

          {/* -------------- DANGER ZONE -------------- */}
          <div className="border border-red-200/60 dark:border-red-500/20 rounded-3xl bg-gradient-to-br from-red-500/5 via-transparent to-transparent overflow-hidden">
            <div className="p-6 sm:p-8">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-1">
                <ShieldCheck className="h-5 w-5 text-red-500" />
                Danger Zone
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                Secure account actions — these cannot be undone.
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-white/60 dark:bg-gray-800/50 border border-gray-200/60 dark:border-gray-700/60">
                  <div className="flex items-center gap-2 mb-1">
                    <LogOut className="h-4 w-4 text-amber-500" />
                    <p className="text-sm font-bold text-gray-900 dark:text-white">Sign out</p>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                    End your session on this device.
                  </p>
                  <button
                    onClick={() => {
                      toast.success('Signed out. See you soon!');
                      logout();
                    }}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-amber-700 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/15 transition-colors"
                  >
                    <LogOut className="h-4 w-4" /> Logout
                  </button>
                </div>

                <div className="p-5 rounded-2xl bg-white/60 dark:bg-gray-800/50 border border-gray-200/60 dark:border-gray-700/60">
                  <div className="flex items-center gap-2 mb-1">
                    <Trash2 className="h-4 w-4 text-red-500" />
                    <p className="text-sm font-bold text-gray-900 dark:text-white">Delete account</p>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                    Permanently delete your account and all reports.
                  </p>
                  <button
                    onClick={() => setDeleteOpen(true)}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-red-600 dark:text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/15 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" /> Delete account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* -------------- DELETE CONFIRM MODAL -------------- */}
        {deleteOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gray-950/50 backdrop-blur-sm animate-fade-up" />
            <div className="relative w-full max-w-md animate-fade-up">
              <div className="border-gradient-strong rounded-3xl">
                <div className="glass rounded-[calc(1.5rem-1px)] p-6 sm:p-8">
                  <div className="flex items-start gap-4 mb-5">
                    <div className="h-12 w-12 shrink-0 rounded-2xl bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-200/50 dark:border-red-500/20 grid place-items-center">
                      <Trash2 className="h-6 w-6 text-red-500" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        Delete your account?
                      </h3>
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        This will permanently erase your profile, all uploaded reports, and all translations. This action cannot be undone.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1.5 mb-5">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Type <span className="text-red-500">DELETE</span> to confirm
                    </label>
                    <input
                      value={deleteText}
                      onChange={(e) => setDeleteText(e.target.value)}
                      placeholder="Type DELETE"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/60 backdrop-blur text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-500 transition-all font-semibold tracking-widest"
                    />
                  </div>

                  <div className="flex flex-col-reverse sm:flex-row justify-end gap-3">
                    <button
                      onClick={() => {
                        setDeleteOpen(false);
                        setDeleteText('');
                      }}
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDelete}
                      disabled={deleteLoading || deleteText !== 'DELETE'}
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-red-500 hover:bg-red-600 disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow-lg shadow-red-500/30"
                    >
                      {deleteLoading ? (
                        'Deleting...'
                      ) : (
                        <>
                          <Trash2 className="h-4 w-4" /> Permanently delete
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Settings;