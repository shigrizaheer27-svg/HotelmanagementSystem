import React, { useState, useRef } from 'react';
import { useHotel } from '../../context/HotelContext';
import {
  Shield,
  Lock,
  User,
  X,
  LogOut,
  Eye,
  EyeOff,
  KeyRound,
} from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const {
    currentUser,
    logout,
    hotelInfo,
    activeProperty,
    systemUsers,
    properties,
    isMasterAdmin,
    switchAccountWithPassword,
  } = useHotel();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const passwordRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Master Admin sees all accounts across hotels; Hotel Admin / Manager only see accounts scoped to their own hotel
  const visibleAccounts = systemUsers.filter((u) => {
    if (!u.isActive) return false;
    if (isMasterAdmin) return true;
    return u.assignedPropertyId === activeProperty.id;
  });

  const handleSelectTargetAccount = (targetUsername: string) => {
    setIdentifier(targetUsername);
    setPassword('');
    setError('');
    setTimeout(() => {
      passwordRef.current?.focus();
    }, 50);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!identifier.trim() || !password) {
      setError('Both username/email and password are required to switch roles.');
      return;
    }
    const res = switchAccountWithPassword(identifier, password);
    if (res.ok) {
      setPassword('');
      setError('');
      onClose();
    } else {
      setError(res.error || 'Invalid password. Role switch denied.');
    }
  };

  const getRoleDisplay = (role: string) => {
    if (role === 'master_admin') return { label: 'Master Admin', color: 'text-purple-600 dark:text-purple-400' };
    if (role === 'admin') return { label: 'Hotel Admin', color: 'text-amber-600 dark:text-amber-400' };
    return { label: 'Manager', color: 'text-blue-600 dark:text-blue-400' };
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">
                Password-Verified Role &amp; Account Switch
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {activeProperty.hotelCode} · {hotelInfo.name} · Password required to switch
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Active Session */}
        {currentUser && (
          <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
            <div>
              <div className="text-[11px] text-slate-400">Currently Signed In As:</div>
              <div className="font-bold text-slate-900 dark:text-white mt-0.5">
                {currentUser.name} <span className="font-mono font-normal text-slate-500">(@{currentUser.username})</span>
              </div>
              <div className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold uppercase tracking-wider">
                {getRoleDisplay(currentUser.role).label} · {currentUser.designation}
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                logout();
                onClose();
              }}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded transition-colors font-medium"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        )}

        {/* Select Target Account */}
        <div className="space-y-2">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            {isMasterAdmin
              ? '1. Choose Platform Account (Password Required Below)'
              : `1. Accounts in ${activeProperty.hotelCode} (or Enter Username Manually)`}
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-44 overflow-y-auto pr-0.5">
            {visibleAccounts.map((u) => {
              const isCurrent = currentUser?.id === u.id;
              const isSelected =
                identifier.trim().toLowerCase() === u.username.toLowerCase() ||
                identifier.trim().toLowerCase() === u.email.toLowerCase();
              const roleDisplay = getRoleDisplay(u.role);
              const assignedProp = properties.find((p) => p.id === u.assignedPropertyId);
              const propLabel =
                u.role === 'master_admin' || !u.assignedPropertyId || u.assignedPropertyId === 'all'
                  ? 'All Properties'
                  : assignedProp
                  ? `${assignedProp.hotelCode} · ${assignedProp.hotelInfo.name}`
                  : 'Assigned Hotel';

              return (
                <button
                  key={u.id}
                  type="button"
                  disabled={isCurrent}
                  onClick={() => handleSelectTargetAccount(u.username)}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    isCurrent
                      ? 'border-emerald-400 bg-emerald-50/40 dark:bg-emerald-950/20 opacity-80 cursor-default'
                      : isSelected
                      ? 'border-amber-500 bg-amber-500/10 ring-1 ring-amber-500'
                      : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                      {u.name}
                    </span>
                    <span className={`text-[10px] font-mono font-bold uppercase shrink-0 ${roleDisplay.color}`}>
                      {isCurrent ? 'ACTIVE' : roleDisplay.label}
                    </span>
                  </div>
                  <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                    @{u.username} · {propLabel}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Password Verification Form */}
        <form onSubmit={handleSubmit} className="space-y-3 text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
          {error && (
            <div className="p-2.5 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-300 font-medium">
              {error}
            </div>
          )}

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Target Username or Email *
            </label>
            <div className="relative">
              <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Select above or type username / email"
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Confirm Password for Target Role *
            </label>
            <div className="relative">
              <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                ref={passwordRef}
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter account password to switch"
                className="w-full pl-9 pr-9 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 bg-slate-900 dark:bg-amber-600 text-white font-semibold rounded-lg hover:bg-slate-800 dark:hover:bg-amber-500 shadow-sm"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Verify Password &amp; Switch</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
