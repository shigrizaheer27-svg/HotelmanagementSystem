import React, { useState, useEffect, useRef } from 'react';
import { HotelProvider, useHotel } from './context/HotelContext';
import { LoginPage } from './components/auth/LoginPage';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { MasterAdminPanel } from './components/admin/MasterAdminPanel';
import { DashboardOverview } from './components/dashboard/DashboardOverview';
import { RoomMatrixView } from './components/rooms/RoomMatrixView';
import { ReservationsView } from './components/reservations/ReservationsView';
import { StaffManagementView } from './components/staff/StaffManagementView';
import { HousekeepingView } from './components/housekeeping/HousekeepingView';
import { GuestCRMView } from './components/guests/GuestCRMView';
import { BillingOverview } from './components/billing/BillingOverview';
import { ResortSettingsView } from './components/settings/ResortSettingsView';

import { NewReservationModal } from './components/modals/NewReservationModal';
import { GuestFolioModal } from './components/modals/GuestFolioModal';
import { RoomDetailModal } from './components/modals/RoomDetailModal';
import { AddChargeModal } from './components/modals/AddChargeModal';
import { NewStaffModal } from './components/modals/NewStaffModal';
import { ReportMaintenanceModal } from './components/modals/ReportMaintenanceModal';
import { RoomFormModal } from './components/modals/RoomFormModal';
import { ReservationEditModal } from './components/modals/ReservationEditModal';

const AppContent: React.FC = () => {
  const { currentUser, isMasterAdmin } = useHotel();
  const [activeTab, setActiveTab] = useState<string>('overview');
  const prevUserIdRef = useRef<string | null>(null);
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('mashakala_theme') === 'dark';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('mashakala_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('mashakala_theme', 'light');
    }
  }, [darkMode]);

  // Auto-route on login or role switch: Master Admin lands on Master Admin Panel; Hotel Admin/Manager land on Front Desk
  useEffect(() => {
    const nextUserId = currentUser?.id ?? null;
    if (nextUserId && nextUserId !== prevUserIdRef.current) {
      if (currentUser?.role === 'master_admin') {
        setActiveTab('master_admin');
      } else {
        setActiveTab('overview');
      }
    } else if (nextUserId && currentUser?.role !== 'master_admin' && activeTab === 'master_admin') {
      setActiveTab('overview');
    }
    prevUserIdRef.current = nextUserId;
  }, [currentUser, activeTab]);

  // Mandatory Login Page on page load or after sign-out
  if (!currentUser) {
    return <LoginPage darkMode={darkMode} setDarkMode={setDarkMode} />;
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col antialiased selection:bg-amber-500 selection:text-white transition-colors duration-150">
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <div className="flex-1 flex w-full max-w-[1600px] mx-auto">
        <div className="hidden md:block">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>

        <main className="flex-1 p-4 md:p-6 lg:p-8 min-w-0 overflow-x-hidden">
          {activeTab === 'master_admin' && isMasterAdmin && (
            <MasterAdminPanel setActiveTab={setActiveTab} />
          )}
          {activeTab === 'overview' && <DashboardOverview setActiveTab={setActiveTab} />}
          {activeTab === 'rooms' && <RoomMatrixView />}
          {activeTab === 'reservations' && <ReservationsView />}
          {activeTab === 'staff' && <StaffManagementView />}
          {activeTab === 'housekeeping' && <HousekeepingView />}
          {activeTab === 'guests' && <GuestCRMView />}
          {activeTab === 'billing' && <BillingOverview />}
          {activeTab === 'settings' && <ResortSettingsView setActiveTab={setActiveTab} />}
        </main>
      </div>

      <NewReservationModal />
      <GuestFolioModal />
      <RoomDetailModal />
      <AddChargeModal />
      <NewStaffModal />
      <ReportMaintenanceModal />
      <RoomFormModal />
      <ReservationEditModal />
    </div>
  );
};

export default function App() {
  return (
    <HotelProvider>
      <AppContent />
    </HotelProvider>
  );
}
