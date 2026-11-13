import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext';
import {
  Plus,
  Moon,
  Sun,
  RotateCcw,
  Building2,
  LogIn,
  LogOut,
  KeyRound,
  Settings,
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
    accessibleProperties,
    activePropertyId,
    activeProperty,
    switchProperty,
    hotelInfo,
    setIsNewReservationModalOpen,
    resetToDemoData,
    currentUser,
    isMasterAdmin,
    isAdmin,
    logout,
  } = useHotel();

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const mobileTabs = [
    ...(isMasterAdmin ? [{ id: 'master_admin', label: 'Master Admin' }] : []),
    { id: 'overview', label: 'Desk' },
    { id: 'rooms', label: 'Rooms' },
    { id: 'reservations', label: 'Bookings' },
    { id: 'staff', label: 'Staff' },
    { id: 'housekeeping', label: 'HK/Maint' },
    { id: 'guests', label: 'Guests' },
    { id: 'billing', label: 'Finance' },
    { id: 'settings', label: 'Settings' },
  ];

  const desktopNavItems = [
    ...(isMasterAdmin ? [{ id: 'master_admin', label: 'Master Admin' }] : []),
    { id: 'overview', label: 'Front Desk' },
    { id: 'rooms', label: 'Rooms' },
    { id: 'reservations', label: 'Reservations' },
    { id: 'staff', label: 'Staff' },
    { id: 'housekeeping', label: 'Housekeeping' },
    { id: 'billing', label: `${hotelInfo.currency} Finance` },
    { id: 'settings', label: isAdmin ? 'Hotel Settings' : 'Settings' },
  ];

  const roleBadgeText = isMasterAdmin ? 'Master Admin' : isAdmin ? 'Hotel Admin' : 'Manager';
  const avatarBgClass = isMasterAdmin
    ? 'bg-purple-600'
    : isAdmin
    ? 'bg-amber-600'
    : 'bg-blue-600';

  return (
    <>
      <header className="sticky top-0 z-30 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="flex items-center justify-between gap-4 px-4 sm:px-6 py-3">
          {/* Zone 1: Brand wordmark & Active Property Switcher (Master Admin only) */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 dark:bg-amber-400/10 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400 shrink-0">
                  {activeProperty.hotelCode}
                </span>
                <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>
                {isMasterAdmin && accessibleProperties.length > 1 ? (
                  <select
                    value={activePropertyId}
                    onChange={(e) => switchProperty(e.target.value)}
                    aria-label="Select Active Hotel or Resort"
                    className="text-sm sm:text-base font-bold tracking-tight text-slate-900 dark:text-white font-display bg-transparent border-0 p-0 pr-5 focus:outline-none cursor-pointer truncate max-w-[200px] sm:max-w-[260px]"
                  >
                    {accessibleProperties.map((p) => (
                      <option
                        key={p.id}
                        value={p.id}
                        className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                      >
                        {p.hotelInfo.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span className="text-sm sm:text-base font-bold tracking-tight text-slate-900 dark:text-white font-display truncate">
                    {hotelInfo.name}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 truncate">
                <span className="truncate">{hotelInfo.shortLocation}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono font-semibold text-amber-600 dark:text-amber-400 whitespace-nowrap">
                  {hotelInfo.currency} Finance
                </span>
              </div>
            </div>
          </div>

          {/* Zone 2: Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-5 text-xs font-medium text-slate-600 dark:text-slate-300">
            {desktopNavItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 ${
                  activeTab === item.id ? 'text-amber-600 dark:text-amber-400 font-semibold' : ''
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Zone 3: Primary Actions & Password-Verified Role Switch */}
          <div className="flex items-center gap-2 shrink-0">
            {currentUser ? (
              <div className="flex items-center gap-1.5 p-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="flex items-center gap-2 px-2 py-1 hover:bg-white dark:hover:bg-slate-700 rounded transition-colors text-left"
                  title="Switch Role / Account (Password Required)"
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0 ${avatarBgClass}`}
                  >
                    {currentUser.avatarInitials}
                  </div>
                  <div className="hidden sm:block">
                    <div className="text-xs font-semibold text-slate-900 dark:text-white leading-none">
                      {currentUser.name}
                    </div>
                    <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase mt-0.5">
                      {roleBadgeText}
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  title="Switch Role or Account (Password Required)"
                  className="flex items-center gap-1 px-2 py-1 text-[11px] font-semibold rounded bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-amber-600 shadow-xs transition-colors whitespace-nowrap shrink-0"
                >
                  <KeyRound className="w-3 h-3" />
                  <span className="hidden sm:inline">Switch Role</span>
                </button>

                <button
                  onClick={logout}
                  title="Sign Out to Login Screen"
                  className="p-1 text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 rounded transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
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

            {isAdmin && (
              <button
                onClick={() => setActiveTab('settings')}
                title="Hotel Settings & Managers"
                className="p-2 text-slate-500 hover:text-amber-600 dark:text-slate-400 dark:hover:text-amber-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors hidden sm:inline-flex"
              >
                <Settings className="w-4 h-4" />
              </button>
            )}

            {isMasterAdmin && (
              <button
                onClick={() => {
                  if (confirm('Master Admin: Reset all properties, rooms, and accounts to default demo data?')) {
                    resetToDemoData();
                  }
                }}
                title="Reset Platform Demo Data (Master Admin Only)"
                className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors hidden md:inline-flex"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={() => setDarkMode((prev) => !prev)}
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setIsNewReservationModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-amber-600 dark:hover:bg-amber-500 rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Booking</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="md:hidden flex items-center gap-1 px-4 pb-2.5 overflow-x-auto border-t border-slate-100 dark:border-slate-800/80 pt-2">
          {mobileTabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-2.5 py-1 text-xs rounded-md font-medium whitespace-nowrap shrink-0 transition-colors ${
                activeTab === t.id
                  ? 'bg-slate-900 text-white dark:bg-amber-600 dark:text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </header>

      <LoginModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
};
