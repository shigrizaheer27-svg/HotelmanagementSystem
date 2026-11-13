import React from 'react';
import { useHotel } from '../../context/HotelContext';
import {
  Bed,
  Users,
  LogIn,
  LogOut,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Plus,
  Key,
  Receipt,
  Banknote,
  Settings,
  Percent,
  Building2,
} from 'lucide-react';

interface DashboardOverviewProps {
  setActiveTab: (tab: string) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({ setActiveTab }) => {
  const {
    hotelInfo,
    formatPrice,
    rooms,
    currentDate,
    stats,
    checkInReservation,
    checkOutReservation,
    setSelectedRoomForDetail,
    setSelectedReservationForFolio,
    setIsNewReservationModalOpen,
    setIsAddChargeModalOpen,
    setReservationForCharge,
    isAdmin,
    accessibleProperties,
  } = useHotel();

  const floors = Array.from(new Set(rooms.map((r) => r.floor))).sort((a, b) => a - b);
  const totalRooms = Math.max(1, stats.totalRooms);
  const occupiedPct = Math.round((stats.occupiedRooms / totalRooms) * 100);
  const availablePct = Math.round((stats.availableRooms / totalRooms) * 100);
  const dirtyPct = Math.round((stats.dirtyRooms / totalRooms) * 100);

  return (
    <div className="space-y-6">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-900 text-white min-h-[200px] flex flex-col justify-end p-6 shadow-sm">
        <img
          src="/src/assets/images/mashakala_resort_shigar_1794505830708.jpg"
          alt={`${hotelInfo.name} Exterior`}
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/65 to-slate-950/20" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-amber-400 mb-1">
              <span>{hotelInfo.tagline}</span>
              <span aria-hidden="true">·</span>
              <span>{hotelInfo.shortLocation}</span>
              <span aria-hidden="true">·</span>
              <span className="font-semibold">{isAdmin ? 'Master Admin Console' : 'Manager Operations'}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight font-display text-white">
              {hotelInfo.name}
            </h1>
            <p className="text-xs text-slate-300 max-w-2xl mt-1">
              Live operations for <span className="font-mono text-white font-medium">{currentDate}</span> · Managing {rooms.length} {rooms.length === 1 ? 'suite' : 'suites'} in {hotelInfo.currency}
              {accessibleProperties.length > 1 ? ` · ${accessibleProperties.length} properties connected` : ''}.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {isAdmin && (
              <button
                onClick={() => setActiveTab('settings')}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-colors whitespace-nowrap"
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Hotels & Admin</span>
              </button>
            )}
            <button
              onClick={() => setActiveTab('rooms')}
              className="px-3.5 py-2 text-xs font-medium text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-colors whitespace-nowrap"
            >
              Room Matrix
            </button>
            <button
              onClick={() => setIsNewReservationModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors whitespace-nowrap shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>New Reservation</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <button
          onClick={() => setIsNewReservationModalOpen(true)}
          className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-500 text-left transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400">
              Create Booking
            </span>
            <Plus className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            Assign suite, meal plan & guest discount
          </p>
        </button>

        <button
          onClick={() => setActiveTab('rooms')}
          className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 text-left transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
              Room Matrix & Rates
            </span>
            <Bed className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            Edit room names, categories & availability
          </p>
        </button>

        <button
          onClick={() => setActiveTab('billing')}
          className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-500 text-left transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
              Folios & Discounts
            </span>
            <Percent className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            Print {hotelInfo.currency} invoices & apply concessions
          </p>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-400 dark:hover:border-purple-500 text-left transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400">
              {isAdmin ? 'Hotels & Managers' : 'Property Info'}
            </span>
            <Settings className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            {isAdmin ? 'Add hotels, managers & room categories' : 'View resort details & tax rate'}
          </p>
        </button>
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
            Across {stats.occupiedRooms} suites
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
            <span>Daily Room Rev</span>
            <Banknote className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-lg font-bold font-mono text-slate-900 dark:text-white tabular-nums truncate">
            {formatPrice(stats.todayRevenue)}
          </div>
          <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 font-mono truncate">
            ADR: {formatPrice(stats.adr)}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
            <span>Discounts Given</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400 tabular-nums truncate">
            {formatPrice(stats.totalDiscountsGiven)}
          </div>
          <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
            {stats.pendingTasksCount} HK tasks open
          </div>
        </div>
      </div>

      {/* Main Split: Arrivals / In-House Queue + Room Status Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-6">
          {/* Today's Expected Arrivals */}
          <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white font-display">
                  Today's Expected Arrivals ({stats.todayArrivals.length})
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Guests arriving at {hotelInfo.name} on {currentDate}
                </p>
              </div>
              <button
                onClick={() => setActiveTab('reservations')}
                className="text-xs font-medium text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
              >
                <span>All reservations</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {stats.todayArrivals.length === 0 ? (
              <div className="p-8 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <p className="text-xs font-medium text-slate-600 dark:text-slate-300">
                  All expected arrivals for today are settled or checked in.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {stats.todayArrivals.map((res) => {
                  const isCheckedIn = res.status === 'checked_in';

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
                          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            <span>{res.roomName || res.roomType}</span>
                            <span aria-hidden="true">·</span>
                            <span>{res.nightsCount} nights</span>
                            <span aria-hidden="true">·</span>
                            <span className="font-mono text-amber-600 dark:text-amber-400 tabular-nums">
                              {formatPrice(res.totalAmount)}
                            </span>
                            {(res.discountAmount || 0) > 0 && (
                              <>
                                <span aria-hidden="true">·</span>
                                <span className="font-mono text-emerald-600 dark:text-emerald-400">
                                  -{formatPrice(res.discountAmount!)} disc
                                </span>
                              </>
                            )}
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
                          className="px-2.5 py-1.5 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors flex items-center gap-1"
                        >
                          <Receipt className="w-3.5 h-3.5" />
                          <span>Folio</span>
                        </button>

                        {isCheckedIn ? (
                          <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1 px-2">
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

          {/* Currently In-House Guests */}
          <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white font-display">
                  Currently In-House ({stats.activeInHouse.length})
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Active suites with live billing in {hotelInfo.currency}
                </p>
              </div>
            </div>

            {stats.activeInHouse.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-500 dark:text-slate-400">
                No guests currently checked in at {hotelInfo.name}.
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {stats.activeInHouse.slice(0, 5).map((res) => (
                  <div key={res.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="font-mono font-bold text-slate-900 dark:text-white w-9 shrink-0">
                        #{res.roomNumber}
                      </span>
                      <div className="min-w-0">
                        <div className="font-semibold text-slate-900 dark:text-white truncate">
                          {res.guestName} {res.roomName ? `· ${res.roomName}` : ''}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          Out: <span className="font-mono">{res.checkOutDate}</span> · Folio:{' '}
                          <span className="font-mono font-medium tabular-nums">{formatPrice(res.totalAmount)}</span>
                          {(res.discountAmount || 0) > 0 && (
                            <span className="text-emerald-600 dark:text-emerald-400 font-mono">
                              {' '}· -{formatPrice(res.discountAmount!)}
                            </span>
                          )}
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
                          if (confirm(`Check out guest ${res.guestName} from Room ${res.roomNumber}?`)) {
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
            )}
          </div>
        </div>

        {/* Right Column: Visual Room Map & Status Breakdown */}
        <div className="lg:col-span-5 space-y-6">
          {/* Status Distribution Card */}
          <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white font-display">
                Room Inventory & Revenue Mix
              </h3>
              <span className="text-[11px] font-mono text-slate-400">
                {stats.totalRooms} Suites Total
              </span>
            </div>

            <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex">
              <div style={{ width: `${occupiedPct}%` }} className="bg-blue-500 h-full" title="Occupied" />
              <div style={{ width: `${availablePct}%` }} className="bg-emerald-500 h-full" title="Available" />
              <div style={{ width: `${dirtyPct}%` }} className="bg-amber-500 h-full" title="Cleaning" />
            </div>

            <div className="grid grid-cols-3 gap-2 pt-1 text-xs">
              <div>
                <div className="text-[11px] text-slate-400">Occupied</div>
                <div className="font-mono font-bold text-blue-600 dark:text-blue-400 tabular-nums">
                  {stats.occupiedRooms} ({occupiedPct}%)
                </div>
              </div>
              <div>
                <div className="text-[11px] text-slate-400">Ready / Free</div>
                <div className="font-mono font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                  {stats.availableRooms} ({availablePct}%)
                </div>
              </div>
              <div>
                <div className="text-[11px] text-slate-400">Collected Rev</div>
                <div className="font-mono font-bold text-slate-900 dark:text-white tabular-nums truncate">
                  {formatPrice(stats.totalActiveRevenue)}
                </div>
              </div>
            </div>
          </div>

          {/* Visual Room Map */}
          <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white font-display">
                  Property Room Map
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Click any room for details, rates, or status
                </p>
              </div>
              <button
                onClick={() => setActiveTab('rooms')}
                className="text-xs font-medium text-amber-600 dark:text-amber-400 hover:underline"
              >
                Expand View
              </button>
            </div>

            {floors.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500 dark:text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
                No rooms created yet for {hotelInfo.name}. Open Room Matrix to add rooms.
              </div>
            ) : (
              <div className="space-y-3">
                {floors.map((floor) => {
                  const floorRooms = rooms.filter((r) => r.floor === floor);
                  return (
                    <div key={floor} className="space-y-1.5">
                      <div className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">
                        Floor {floor} · {floorRooms.length} {floorRooms.length === 1 ? 'room' : 'rooms'}
                      </div>
                      <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-4 xl:grid-cols-5 gap-2">
                        {floorRooms.map((room) => {
                          let bgStyle =
                            'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300';
                          if (room.status === 'occupied') {
                            bgStyle =
                              'bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-300';
                          } else if (room.status === 'maintenance') {
                            bgStyle =
                              'bg-red-50 dark:bg-red-950/60 border-red-200 dark:border-red-800 text-red-900 dark:text-red-300';
                          } else if (room.housekeeping === 'dirty' || room.housekeeping === 'cleaning_in_progress') {
                            bgStyle =
                              'bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-300';
                          }

                          return (
                            <button
                              key={room.id}
                              onClick={() => setSelectedRoomForDetail(room)}
                              title={`${room.name} (${room.type})`}
                              className={`p-2 rounded-lg border text-center transition-all hover:scale-105 active:scale-95 ${bgStyle}`}
                            >
                              <div className="font-mono font-bold text-xs">{room.number}</div>
                              <div className="text-[10px] truncate opacity-85">
                                {room.name.split(' ')[0]}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
