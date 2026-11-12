import React, { useState, useEffect } from 'react';
import { HotelProvider } from './context/HotelContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { DashboardOverview } from './components/dashboard/DashboardOverview';
import { RoomMatrixView } from './components/rooms/RoomMatrixView';
import { ReservationsView } from './components/reservations/ReservationsView';
import { StaffManagementView } from './components/staff/StaffManagementView';
import { HousekeepingView } from './components/housekeeping/HousekeepingView';
import { GuestCRMView } from './components/guests/GuestCRMView';
import { BillingOverview } from './components/billing/BillingOverview';

import { NewReservationModal } from './components/modals/NewReservationModal';
import { GuestFolioModal } from './components/modals/GuestFolioModal';
import { RoomDetailModal } from './components/modals/RoomDetailModal';
import { AddChargeModal } from './components/modals/AddChargeModal';
import { NewStaffModal } from './components/modals/NewStaffModal';
import { ReportMaintenanceModal } from './components/modals/ReportMaintenanceModal';
import { RoomFormModal } from './components/modals/RoomFormModal';
import { ReservationEditModal } from './components/modals/ReservationEditModal';

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('overview');
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

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col antialiased selection:bg-amber-500 selection:text-white transition-colors duration-150">
      {/* Top Bar with Brand wordmark, navigation, and Auth / Role switcher */}
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <div className="flex-1 flex w-full max-w-[1600px] mx-auto">
        {/* Workspace 260px PMS Sidebar */}
        <div className="hidden md:block">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>

        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 min-w-0 overflow-x-hidden">
          {activeTab === 'overview' && <DashboardOverview setActiveTab={setActiveTab} />}
          {activeTab === 'rooms' && <RoomMatrixView />}
          {activeTab === 'reservations' && <ReservationsView />}
          {activeTab === 'staff' && <StaffManagementView />}
          {activeTab === 'housekeeping' && <HousekeepingView />}
          {activeTab === 'guests' && <GuestCRMView />}
          {activeTab === 'billing' && <BillingOverview />}
        </main>
      </div>

      {/* Global PMS & Admin Modals */}
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
