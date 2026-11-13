import React, { useState, useRef } from 'react';
import { useHotel } from '../../context/HotelContext';
import {
  Building2,
  Shield,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  MapPin,
  KeyRound,
} from 'lucide-react';

interface LoginPageProps {
  darkMode: boolean;
  setDarkMode: (val: boolean | ((prev: boolean) => boolean)) => void;
}

export const LoginPage: React.FC<LoginPageProps> = () => {
  const {
    properties,
    activePropertyId,
    systemUsers,
    login,
  } = useHotel();

  const [selectedPropId, setSelectedPropId] = useState<string>(activePropertyId || properties[0]?.id || '');
  const [identifier, setIdentifier] = useState('masteradmin');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const passwordInputRef = useRef<HTMLInputElement>(null);

  const selectedProperty = properties.find((p) => p.id === selectedPropId) || properties[0];
  const activeAccounts = systemUsers.filter((u) => u.isActive);

  const handleSelectAccount = (accountUsername: string, assignedProp?: string) => {
    setIdentifier(accountUsername);
    setPassword('');
    setError('');
    if (assignedProp && assignedProp !== 'all' && properties.some((p) => p.id === assignedProp)) {
      setSelectedPropId(assignedProp);
    }
    setTimeout(() => {
      passwordInputRef.current?.focus();
    }, 50);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!identifier.trim() || !password) {
      setError('Please enter both your username (or email) and password.');
      return;
    }
    const result = login(identifier, password, selectedPropId);
    if (!result.ok) {
      setError(result.error || 'Authentication failed.');
    }
  };

  const getRoleDisplay = (role: string) => {
    if (role === 'master_admin') return { label: 'Master Admin', color: 'text-purple-600 dark:text-purple-400' };
    if (role === 'admin') return { label: 'Hotel Admin', color: 'text-amber-600 dark:text-amber-400' };
    return { label: 'Manager', color: 'text-blue-600 dark:text-blue-400' };
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-5xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* Left Visual Hospitality Panel */}
        <div className="lg:col-span-5 relative bg-slate-900 text-white p-8 flex flex-col justify-between min-h-[280px] lg:min-h-[620px]">
          <img
            src="/src/assets/images/mashakala_resort_shigar_1794505830708.jpg"
            alt={selectedProperty?.hotelInfo.name || 'Resort Sanctuary'}
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-slate-950/40" />

          <div className="relative z-10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-amber-400">
                Multi-Hotel PMS SaaS
              </div>
              <div className="text-base font-bold font-display">
                Hospitality Service Suite
              </div>
            </div>
          </div>

          <div className="relative z-10 space-y-4 my-8">
            <div className="text-xs font-mono text-amber-300 flex items-center gap-2">
              <span className="font-bold">{selectedProperty?.hotelCode}</span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {selectedProperty?.hotelInfo.shortLocation}
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold font-display tracking-tight leading-tight">
              {selectedProperty?.hotelInfo.name}
            </h1>
            <p className="text-xs text-slate-300 leading-relaxed">
              Master Administrator provisions Hotel IDs and Hotel Admin credentials. Each Hotel Admin &amp; Manager accesses strictly their own assigned hotel workspace.
            </p>
          </div>

          <div className="relative z-10 pt-4 border-t border-white/15 grid grid-cols-2 gap-4 text-xs">
            <div>
              <div className="text-slate-400 text-[11px]">Registered Hotels</div>
              <div className="font-mono font-bold text-base text-white mt-0.5 tabular-nums">
                {properties.length} {properties.length === 1 ? 'Property' : 'Properties'}
              </div>
            </div>
            <div>
              <div className="text-slate-400 text-[11px]">Access Control</div>
              <div className="font-mono font-semibold text-xs text-amber-400 mt-1">
                3-Tier Hotel Isolation
              </div>
            </div>
          </div>
        </div>

        {/* Right Sign-In Form */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between space-y-6">
          <div className="space-y-5">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                <Shield className="w-4 h-4" />
                <span>Platform &amp; Hotel Property Login</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-display mt-1">
                Sign in with Username &amp; Password
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Sign in as Master Admin to manage all hotels, or use your Hotel Admin / Manager credentials for your assigned Hotel ID.
              </p>
            </div>

            {/* Registered Accounts Quick-Select */}
            <div className="space-y-2">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Select Account to Pre-Fill Username (Password Always Required)
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-44 overflow-y-auto pr-1">
                {activeAccounts.map((acc) => {
                  const isSelected =
                    identifier.trim().toLowerCase() === acc.username.toLowerCase() ||
                    identifier.trim().toLowerCase() === acc.email.toLowerCase();
                  const roleDisplay = getRoleDisplay(acc.role);
                  const assignedProp = properties.find((p) => p.id === acc.assignedPropertyId);
                  const scopeLabel =
                    acc.role === 'master_admin' || !acc.assignedPropertyId || acc.assignedPropertyId === 'all'
                      ? 'All Hotels (Platform)'
                      : assignedProp
                      ? `${assignedProp.hotelCode} · ${assignedProp.hotelInfo.name}`
                      : 'Assigned Hotel';

                  return (
                    <button
                      key={acc.id}
                      type="button"
                      onClick={() => handleSelectAccount(acc.username, acc.assignedPropertyId)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'border-amber-500 bg-amber-50/70 dark:bg-amber-950/20 ring-1 ring-amber-500'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/60 dark:bg-slate-800/40'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {acc.name}
                        </span>
                        <span className={`text-[10px] font-mono font-bold uppercase shrink-0 ${roleDisplay.color}`}>
                          {roleDisplay.label}
                        </span>
                      </div>
                      <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        @{acc.username} · {scopeLabel}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {error && (
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-300 font-medium">
                  {error}
                </div>
              )}

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Target Hotel / Resort Workspace
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <select
                    value={selectedPropId}
                    onChange={(e) => setSelectedPropId(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                  >
                    {properties.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.hotelCode} — {p.hotelInfo.name} ({p.hotelInfo.shortLocation} · {p.hotelInfo.currency})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    Username or Email *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="masteradmin or mashakala_admin"
                      className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    Account Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      ref={passwordInputRef}
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      className="w-full pl-9 pr-9 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-5 bg-slate-900 hover:bg-slate-800 dark:bg-amber-600 dark:hover:bg-amber-500 text-white font-semibold rounded-xl shadow-md flex items-center justify-center gap-2 transition-colors text-xs"
              >
                <KeyRound className="w-4 h-4" />
                <span>Authenticate &amp; Open Console</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Default credentials notice */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400">
            <div>
              Master Admin: <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">masteradmin</span> / <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">master123</span>
            </div>
            <div>
              Hotel Admin: <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">mashakala_admin</span> / <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">admin</span>
            </div>
            <div>
              Manager: <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">mashakala_manager</span> / <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">manager</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
