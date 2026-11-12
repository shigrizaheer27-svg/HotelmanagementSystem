import React from 'react';
import { useHotel } from '../../context/HotelContext';
import {
  Plus,
  Moon,
  Sun,
  RotateCcw,
  Sparkles,
  Calendar,
  Clock,
  Building2
} from 'lucide-react';

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
  const { hotelInfo, currentDate, setIsNewReservationModalOpen, resetToDemoData, stats } = useHotel();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-8 px-6 py-3.5 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors">
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
            <span>PMS Core</span>
            <span aria-hidden="true">·</span>
            <span>Coastal Resort & Spa</span>
          </div>
        </div>
      </div>

      {/* Zone 2: Navigation Links / System Bar */}
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
          Staff & Roster
        </button>
        <button
          onClick={() => setActiveTab('housekeeping')}
          className={`hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'housekeeping' ? 'text-amber-600 dark:text-amber-400 font-semibold' : ''
          }`}
        >
          Housekeeping
        </button>
      </nav>

      {/* Zone 3: Primary Actions & Utilities */}
      <div className="flex items-center gap-2.5 shrink-0">
        <div className="hidden sm:flex items-center gap-2 text-xs font-mono tabular-nums text-slate-500 dark:text-slate-400 px-2.5 py-1.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>{currentDate}</span>
          <span className="text-slate-300 dark:text-slate-600">|</span>
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>09:24 AM</span>
        </div>

        <button
          onClick={() => {
            if (confirm('Reset system to default demo reservations, rooms, and staff?')) {
              resetToDemoData();
            }
          }}
          title="Reset Demo Data"
          className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          onClick={() => setDarkMode((prev) => !prev)}
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>

        <button
          onClick={() => setIsNewReservationModalOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-amber-600 dark:hover:bg-amber-500 rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Reservation</span>
        </button>
      </div>
    </header>
  );
};
