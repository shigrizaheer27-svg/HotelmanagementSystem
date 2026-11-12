import React from 'react';
import { useHotel } from '../../context/HotelContext';
import { formatPKR } from '../../data/mockData';
import {
  LayoutDashboard,
  BedDouble,
  CalendarCheck,
  Users2,
  Sparkles,
  Receipt,
  UserCheck,
  Shield,
  UserCheck2,
  Wrench,
  ChevronRight,
  ShieldAlert,
  ArrowUpRight
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { stats, hotelInfo, currentUser, isAdmin, isManager } = useHotel();

  const navItems = [
    {
      id: 'overview',
      label: 'Live Front Desk',
      subtext: 'Overview & Arrivals',
      icon: LayoutDashboard,
      badge: stats.todayArrivals.length > 0 ? `${stats.todayArrivals.length} Due` : undefined,
      badgeColor: 'text-amber-700 bg-amber-50 dark:bg-amber-950/60 dark:text-amber-300',
    },
    {
      id: 'rooms',
      label: 'Room Matrix & Rates',
      subtext: `${stats.totalRooms} Rooms · 4 Floors`,
      icon: BedDouble,
      badge: `${stats.occupiedRooms}/${stats.totalRooms}`,
      badgeColor: 'text-slate-600 bg-slate-100 dark:bg-slate-800 dark:text-slate-300 font-mono',
    },
    {
      id: 'reservations',
      label: 'Bookings & Folios',
      subtext: 'Check-In / Out Hub',
      icon: CalendarCheck,
      badge: stats.activeInHouse.length > 0 ? `${stats.activeInHouse.length} Active` : undefined,
      badgeColor: 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-300',
    },
    {
      id: 'staff',
      label: 'Staff & Roster',
      subtext: 'Shifts & Attendance',
      icon: Users2,
      badge: `${stats.onDutyStaffCount} On Duty`,
      badgeColor: 'text-blue-700 bg-blue-50 dark:bg-blue-950/60 dark:text-blue-300',
    },
    {
      id: 'housekeeping',
      label: 'Housekeeping & Maint.',
      subtext: 'Cleaning & Geysers',
      icon: Sparkles,
      badge: stats.pendingTasksCount > 0 ? `${stats.pendingTasksCount} Tasks` : undefined,
      badgeColor: 'text-purple-700 bg-purple-50 dark:bg-purple-950/60 dark:text-purple-300',
    },
    {
      id: 'guests',
      label: 'Guest Directory (CRM)',
      subtext: 'CNIC & VIP Profiles',
      icon: UserCheck,
    },
    {
      id: 'billing',
      label: 'PKR Finance & Ledgers',
      subtext: 'Revenue & Invoicing',
      icon: Receipt,
    },
  ];

  return (
    <aside className="w-64 shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-[calc(100vh-61px)] sticky top-[61px] select-none">
      {/* Current User Role Banner */}
      <div className="p-3.5 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-800/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isAdmin ? (
              <Shield className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            ) : (
              <UserCheck2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            )}
            <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              {isAdmin ? 'Admin Console' : 'Manager Access'}
            </span>
          </div>
          <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-semibold ${
            isAdmin ? 'bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300' : 'bg-blue-100 dark:bg-blue-950/70 text-blue-800 dark:text-blue-300'
          }`}>
            {isAdmin ? 'FULL ACCESS' : 'MANAGERIAL'}
          </span>
        </div>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
          {isAdmin ? 'Can Add, Edit, Delete rooms, staff, bookings & data.' : 'Operational access: bookings, folios & tasks.'}
        </p>
      </div>

      {/* Quick Occupancy Gauge Pill */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-800/80">
        <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
          <div className="flex items-center justify-between text-xs font-medium text-slate-600 dark:text-slate-300 mb-1.5">
            <span>Occupancy Rate</span>
            <span className="font-mono font-bold text-slate-900 dark:text-white tabular-nums">
              {stats.occupancyRate}%
            </span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                stats.occupancyRate > 80
                  ? 'bg-amber-500'
                  : stats.occupancyRate > 50
                  ? 'bg-emerald-500'
                  : 'bg-blue-500'
              }`}
              style={{ width: `${stats.occupancyRate}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-2 font-mono tabular-nums">
            <span>{stats.occupiedRooms} occupied</span>
            <span>{stats.availableRooms} free</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Menu */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-all ${
                isActive
                  ? 'bg-slate-900 text-white dark:bg-amber-600 dark:text-white shadow-sm'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? 'text-white' : 'text-slate-400 dark:text-slate-400'
                  }`}
                />
                <div className="truncate">
                  <div className="text-xs font-semibold leading-tight truncate">{item.label}</div>
                  <div
                    className={`text-[11px] leading-tight truncate ${
                      isActive ? 'text-slate-200 dark:text-amber-100' : 'text-slate-400 dark:text-slate-500'
                    }`}
                  >
                    {item.subtext}
                  </div>
                </div>
              </div>

              {item.badge && (
                <span
                  className={`ml-2 px-1.5 py-0.5 rounded text-[10px] font-medium shrink-0 ${
                    isActive ? 'bg-white/20 text-white' : item.badgeColor
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Urgent Maintenance Notice */}
      {stats.urgentMaintenanceCount > 0 && (
        <div className="p-3 mx-3 mb-2 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60">
          <div className="flex items-center gap-2 text-xs font-semibold text-red-800 dark:text-red-300">
            <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
            <span>Urgent Maintenance</span>
          </div>
          <p className="text-[11px] text-red-600 dark:text-red-400 mt-1">
            {stats.urgentMaintenanceCount} ticket (Geyser / Heating) requires attention.
          </p>
        </div>
      )}

      {/* Property & PKR Status in Footer */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
        <div className="flex items-center justify-between">
          <span className="font-medium text-slate-700 dark:text-slate-300">Resort Finance</span>
          <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">PKR (Rs.)</span>
        </div>
        <div className="mt-1 text-slate-400 dark:text-slate-500 text-[10px]">
          RevPAR: <span className="font-mono font-medium text-slate-600 dark:text-slate-300">{formatPKR(stats.revPAR)}</span>
        </div>
      </div>
    </aside>
  );
};
