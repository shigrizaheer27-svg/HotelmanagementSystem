import React from 'react';
import { useHotel } from '../../context/HotelContext';
import {
  Bed,
  Users,
  LogIn,
  LogOut,
  DollarSign,
  TrendingUp,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  Key,
  Receipt,
  Eye
} from 'lucide-react';

interface DashboardOverviewProps {
  setActiveTab: (tab: string) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({ setActiveTab }) => {
  const {
    hotelInfo,
    rooms,
    reservations,
    currentDate,
    stats,
    checkInReservation,
    checkOutReservation,
    setSelectedRoomForDetail,
    setSelectedReservationForFolio,
    setIsNewReservationModalOpen,
    setIsAddChargeModalOpen,
    setReservationForCharge,
  } = useHotel();

  // Group rooms by floor
  const floors = [1, 2, 3, 4];

  return (
    <div className="space-y-6">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-900 text-white min-h-[170px] flex flex-col justify-end p-6">
        <img
          src="/src/assets/images/hotel_facade_exterior_1794504248900.jpg"
          alt="AuraStay Palace Exterior"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/60 to-transparent" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-amber-400 mb-1">
              <span>{hotelInfo.tagline}</span>
              <span aria-hidden="true">·</span>
              <span>Front Desk Operations</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight font-display text-white">
              {hotelInfo.name}
            </h1>
            <p className="text-sm text-slate-300 max-w-xl mt-1">
              Live operational briefing for <span className="font-mono text-white font-medium">{currentDate}</span>. Managing 20 suites across 4 wings.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('rooms')}
              className="px-4 py-2 text-xs font-medium text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-colors whitespace-nowrap"
            >
              View Tape Chart
            </button>
            <button
              onClick={() => setIsNewReservationModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>Walk-in Check-In</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary KPI Grid (6 metrics) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
            <span>Occupancy</span>
            <Bed className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
            {stats.occupancyRate}%
          </div>
          <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
            {stats.occupiedRooms} of {stats.totalRooms} rooms
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
            <span>Today Arrivals</span>
            <LogIn className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
            {stats.todayArrivals.length}
          </div>
          <div className="mt-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-mono">
            {stats.todayArrivals.filter((r) => r.status === 'checked_in').length} checked in
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
            <span>Departures</span>
            <LogOut className="w-4 h-4 text-blue-500" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
            {stats.todayDepartures.length}
          </div>
          <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
            {stats.todayDepartures.filter((r) => r.status === 'checked_out').length} completed
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
            <span>In-House Guests</span>
            <Users className="w-4 h-4 text-purple-500" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
            {stats.activeInHouse.reduce((acc, curr) => acc + curr.adults + curr.children, 0)}
          </div>
          <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
            Across {stats.occupiedRooms} active rooms
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
            <span>Daily Room Rev</span>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
            ${stats.todayRevenue.toLocaleString()}
          </div>
          <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
            ADR: ${stats.adr}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
            <span>Cleaning / Maint</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
            {stats.dirtyRooms} / {stats.maintenanceRooms}
          </div>
          <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
            {stats.pendingTasksCount} tasks pending
          </div>
        </div>
      </div>

      {/* Main Split: Today's Arrival / In-House Action Queue + Interactive Room Floor Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Today's Arrivals & Operations (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Today's Expected Arrivals */}
          <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white font-display">
                  Today's Expected Arrivals
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Guests arriving on {currentDate} requiring check-in & keycard assignment
                </p>
              </div>
              <button
                onClick={() => setActiveTab('reservations')}
                className="text-xs font-medium text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
              >
                <span>View all bookings</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {stats.todayArrivals.length === 0 ? (
              <div className="p-8 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <p className="text-xs font-medium text-slate-600 dark:text-slate-300">
                  All expected arrivals for today have been checked in!
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {stats.todayArrivals.map((res) => {
                  const isCheckedIn = res.status === 'checked_in';
                  const room = rooms.find((r) => r.id === res.roomId);

                  return (
                    <div
                      key={res.id}
                      className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                          {res.roomNumber}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                              {res.guestName}
                            </span>
                            <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
                              {res.bookingRef}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            <span>{res.roomType}</span>
                            <span aria-hidden="true">·</span>
                            <span>{res.nightsCount} nights</span>
                            <span aria-hidden="true">·</span>
                            <span>{res.mealPlan}</span>
                          </div>
                          {res.specialRequests && (
                            <p className="text-[11px] text-amber-700 dark:text-amber-300/90 italic mt-1 truncate">
                              Req: {res.specialRequests}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        <button
                          onClick={() => setSelectedReservationForFolio(res)}
                          title="View Guest Folio"
                          className="px-2.5 py-1.5 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors flex items-center gap-1"
                        >
                          <Receipt className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Folio</span>
                        </button>

                        {isCheckedIn ? (
                          <span className="px-2.5 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 rounded-md flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>In-House</span>
                          </span>
                        ) : (
                          <button
                            onClick={() => checkInReservation(res.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-md transition-colors shadow-sm"
                          >
                            <Key className="w-3.5 h-3.5" />
                            <span>Check-In</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Active In-House Guests with Quick Folio & Extra Charge Actions */}
          <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white font-display">
                  Currently In-House ({stats.activeInHouse.length})
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Occupied suites with ongoing billing and front desk service
                </p>
              </div>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {stats.activeInHouse.slice(0, 5).map((res) => (
                <div key={res.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="font-mono font-bold text-slate-900 dark:text-white w-8 shrink-0">
                      #{res.roomNumber}
                    </span>
                    <div className="min-w-0">
                      <div className="font-semibold text-slate-900 dark:text-white truncate">
                        {res.guestName}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        Departing: <span className="font-mono">{res.checkOutDate}</span> · Folio: <span className="font-mono font-medium">${res.totalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        setReservationForCharge(res);
                        setIsAddChargeModalOpen(true);
                      }}
                      className="px-2 py-1 text-xs text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/50 rounded transition-colors"
                    >
                      + Charge
                    </button>
                    <button
                      onClick={() => setSelectedReservationForFolio(res)}
                      className="px-2 py-1 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
                    >
                      Folio
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Check out guest ${res.guestName} from Room ${res.roomNumber}? This will mark room dirty for housekeeping.`)) {
                          checkOutReservation(res.id);
                        }
                      }}
                      className="px-2.5 py-1 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 rounded transition-colors"
                    >
                      Check-Out
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {stats.activeInHouse.length > 5 && (
              <button
                onClick={() => setActiveTab('reservations')}
                className="w-full mt-3 py-2 text-center text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border-t border-slate-100 dark:border-slate-800 transition-colors"
              >
                View all {stats.activeInHouse.length} in-house guests →
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Visual Room Map & Quick Room Statuses (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Interactive Room Grid / Mini Map */}
          <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white font-display">
                  Property Room Status Map
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Click any room to view guest or trigger actions
                </p>
              </div>
              <button
                onClick={() => setActiveTab('rooms')}
                className="text-xs font-medium text-amber-600 dark:text-amber-400 hover:underline"
              >
                Expand View
              </button>
            </div>

            {/* Status Legend */}
            <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 py-2 border-y border-slate-100 dark:border-slate-800 mb-3">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Available ({stats.availableRooms})
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Occupied ({stats.occupiedRooms})
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Dirty/Cleaning ({stats.dirtyRooms})
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Maintenance ({stats.maintenanceRooms})
              </span>
            </div>

            {/* Floors Stack */}
            <div className="space-y-3">
              {floors.map((floor) => {
                const floorRooms = rooms.filter((r) => r.floor === floor);
                return (
                  <div key={floor} className="space-y-1.5">
                    <div className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">
                      Floor {floor} {floor === 4 ? '· Penthouse' : floor === 3 ? '· Executive Club' : floor === 2 ? '· Deluxe Wing' : '· Garden Level'}
                    </div>
                    <div className="grid grid-cols-5 gap-2">
                      {floorRooms.map((room) => {
                        let bgStyle = 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300';
                        if (room.status === 'occupied') {
                          bgStyle = 'bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-300';
                        } else if (room.status === 'maintenance') {
                          bgStyle = 'bg-red-50 dark:bg-red-950/60 border-red-200 dark:border-red-800 text-red-900 dark:text-red-300';
                        } else if (room.housekeeping === 'dirty' || room.housekeeping === 'cleaning_in_progress') {
                          bgStyle = 'bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-300';
                        } else {
                          bgStyle = 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300';
                        }

                        return (
                          <button
                            key={room.id}
                            onClick={() => setSelectedRoomForDetail(room)}
                            className={`p-2 rounded-lg border text-center transition-all hover:scale-105 active:scale-95 ${bgStyle}`}
                          >
                            <div className="font-mono font-bold text-xs">{room.number}</div>
                            <div className="text-[10px] truncate opacity-75">
                              {room.status === 'occupied' ? 'Occupied' : room.housekeeping === 'dirty' ? 'Dirty' : 'Ready'}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Property Amenities & Photo Showcase Card */}
          <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="relative h-36">
              <img
                src="/src/assets/images/hotel_suite_interior_1794504249585.jpg"
                alt="Penthouse Interior"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-4">
                <div className="text-white">
                  <div className="text-xs font-semibold">Executive & Presidential Wing</div>
                  <div className="text-[11px] text-slate-300">High occupancy rate today (80%)</div>
                </div>
              </div>
            </div>
            <div className="p-4 space-y-2 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-center justify-between">
                <span>Staff On Duty:</span>
                <span className="font-mono font-semibold text-slate-900 dark:text-white">
                  {stats.onDutyStaffCount} Active
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Average Daily Rate (ADR):</span>
                <span className="font-mono font-semibold text-slate-900 dark:text-white">
                  ${stats.adr}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>RevPAR:</span>
                <span className="font-mono font-semibold text-slate-900 dark:text-white">
                  ${stats.revPAR}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
