import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext';
import {
  Plus,
  Moon,
  Sun,
  RotateCcw,
  Sparkles,
  Calendar,
  Clock,
  Building2,
  Shield,
  UserCheck,
  LogIn,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { LoginModal } from '../modals/LoginModal';

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: (val: boolean | ((prev: boolean) => boolean)) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  darkMode,
  setDarkMode,
  activeTab,
  setActiveTab,
}) => {
  const {
    hotelInfo,
    currentDate,
    setIsNewReservationModalOpen,
    resetToDemoData,
    currentUser,
    switchRole,
    isAdmin,
    isManager,
    logout
  } = useHotel();

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 flex items-center justify-between gap-6 px-6 py-3.5 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors">
        {/* Zone 1: Brand wordmark & Property Title */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-amber-500/10 dark:bg-amber-400/10 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white font-display whitespace-nowrap">
              {hotelInfo.name}
            </span>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span>Shigar Valley</span>
              <span aria-hidden="true">·</span>
              <span>Gilgit-Baltistan</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono font-semibold text-amber-600 dark:text-amber-400">PKR Finance</span>
            </div>
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          <button
            onClick={() => setActiveTab('overview')}
            className={`hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'overview' ? 'text-amber-600 dark:text-amber-400 font-semibold' : ''
            }`}
          >
            Live Front Desk
          </button>
          <button
            onClick={() => setActiveTab('rooms')}
            className={`hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'rooms' ? 'text-amber-600 dark:text-amber-400 font-semibold' : ''
            }`}
          >
            Room Matrix
          </button>
          <button
            onClick={() => setActiveTab('reservations')}
            className={`hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'reservations' ? 'text-amber-600 dark:text-amber-400 font-semibold' : ''
            }`}
          >
            Reservations
          </button>
          <button
            onClick={() => setActiveTab('staff')}
            className={`hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'staff' ? 'text-amber-600 dark:text-amber-400 font-semibold' : ''
            }`}
          >
            Staff & Shifts
          </button>
          <button
            onClick={() => setActiveTab('housekeeping')}
            className={`hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'housekeeping' ? 'text-amber-600 dark:text-amber-400 font-semibold' : ''
            }`}
          >
            Housekeeping
          </button>
          <button
            onClick={() => setActiveTab('billing')}
            className={`hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'billing' ? 'text-amber-600 dark:text-amber-400 font-semibold' : ''
            }`}
          >
            PKR Billing
          </button>
        </nav>

        {/* Zone 3: Primary Actions, Auth & Utilities */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Active User Pill & Role Toggle */}
          {currentUser ? (
            <div className="flex items-center gap-1.5 p-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-2 px-2 py-1 hover:bg-white dark:hover:bg-slate-700 rounded transition-colors text-left"
                title="Manage Account / Switch Role"
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${
                  isAdmin ? 'bg-amber-600' : 'bg-blue-600'
                }`}>
                  {currentUser.avatarInitials}
                </div>
                <div className="hidden sm:block">
                  <div className="text-xs font-semibold text-slate-900 dark:text-white leading-none">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase mt-0.5">
                    {isAdmin ? 'Admin (Full)' : 'Manager'}
                  </div>
                </div>
              </button>

              {/* Fast Toggle Button between Admin and Manager */}
              <button
                onClick={() => switchRole(isAdmin ? 'manager' : 'admin')}
                title={`Switch to ${isAdmin ? 'Manager' : 'Admin'} Role`}
                className="px-2 py-1 text-[11px] font-semibold rounded bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-amber-600 shadow-xs transition-colors"
              >
                {isAdmin ? 'Role: Admin ▾' : 'Role: Manager ▾'}
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}

          {/* Reset Demo Data (Admin Only) */}
          {isAdmin && (
            <button
              onClick={() => {
                if (confirm('Administrator: Reset Mashakala Resort system to default demo reservations, rooms, and staff?')) {
                  resetToDemoData();
                }
              }}
              title="Reset System Data (Admin Only)"
              className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode((prev) => !prev)}
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Primary CTA */}
          <button
            onClick={() => setIsNewReservationModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-amber-600 dark:hover:bg-amber-500 rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>New Booking</span>
          </button>
        </div>
      </header>

      <LoginModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
};
