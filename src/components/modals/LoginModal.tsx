import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext';
import { PRESET_USERS } from '../../context/HotelContext';
import {
  Shield,
  UserCheck,
  Lock,
  Mail,
  Building2,
  CheckCircle2,
  KeyRound,
  X
} from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { login, currentUser, logout, switchRole, hotelInfo } = useHotel();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    const success = login(email, password);
    if (success) {
      setError('');
      onClose();
    } else {
      setError('Invalid credentials.');
    }
  };

  const handleQuickLogin = (role: 'admin' | 'manager') => {
    switchRole(role);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">
                Staff & Admin Portal
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {hotelInfo.name} · Role-Based Security
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

        {/* Current status if already logged in */}
        {currentUser && (
          <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
            <div>
              <div className="text-[11px] text-slate-400">Currently Authenticated As:</div>
              <div className="font-bold text-slate-900 dark:text-white mt-0.5">
                {currentUser.name}
              </div>
              <div className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold uppercase tracking-wider">
                Role: {currentUser.role.toUpperCase()} ({currentUser.designation})
              </div>
            </div>
            <button
              onClick={() => {
                logout();
              }}
              className="px-2.5 py-1 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded transition-colors"
            >
              Log Out
            </button>
          </div>
        )}

        {/* Quick 1-Click Role Switcher */}
        <div className="space-y-2">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Quick Fast-Switch Login
          </span>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => handleQuickLogin('admin')}
              className={`p-3 rounded-lg border text-left transition-all ${
                currentUser?.role === 'admin'
                  ? 'border-amber-500 bg-amber-500/10 dark:bg-amber-400/10 text-slate-900 dark:text-white ring-1 ring-amber-500'
                  : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-amber-700 dark:text-amber-400">
                  Administrator
                </span>
                <Shield className="w-3.5 h-3.5 text-amber-600" />
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                Full Control: Add, Edit, Delete rooms, staff, rates & folios.
              </p>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('manager')}
              className={`p-3 rounded-lg border text-left transition-all ${
                currentUser?.role === 'manager'
                  ? 'border-blue-500 bg-blue-500/10 dark:bg-blue-400/10 text-slate-900 dark:text-white ring-1 ring-blue-500'
                  : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-blue-700 dark:text-blue-400">
                  Duty Manager
                </span>
                <UserCheck className="w-3.5 h-3.5 text-blue-600" />
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                Managerial: Bookings, check-in, charges & tasks (no deletions).
              </p>
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="relative my-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-slate-800" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase">
            <span className="bg-white dark:bg-slate-900 px-2 text-slate-400">
              Or sign in with credentials
            </span>
          </div>
        </div>

        {/* Manual Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          {error && (
            <div className="p-2 rounded bg-red-50 dark:bg-red-950/40 text-red-600 text-xs">
              {error}
            </div>
          )}

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Work Email Address
            </label>
            <div className="relative">
              <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@mashakalaresort.pk"
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
              />
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
              className="px-5 py-2 bg-slate-900 dark:bg-amber-600 text-white font-semibold rounded-lg hover:bg-slate-800 dark:hover:bg-amber-500 shadow-sm"
            >
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
