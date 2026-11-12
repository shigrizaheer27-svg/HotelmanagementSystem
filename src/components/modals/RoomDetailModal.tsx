import React from 'react';
import { useHotel } from '../../context/HotelContext';
import {
  X,
  Bed,
  Users,
  Sparkles,
  Wrench,
  Calendar,
  CheckCircle2,
  DollarSign,
  Receipt,
  LogOut,
  Plus
} from 'lucide-react';

export const RoomDetailModal: React.FC = () => {
  const {
    selectedRoomForDetail,
    setSelectedRoomForDetail,
    reservations,
    updateHousekeepingStatus,
    updateRoom,
    checkOutReservation,
    setSelectedReservationForFolio,
    setIsNewReservationModalOpen,
    setQuickCheckInRoom,
    setIsAddChargeModalOpen,
    setReservationForCharge,
  } = useHotel();

  if (!selectedRoomForDetail) return null;

  const room = selectedRoomForDetail;
  const isOccupied = room.status === 'occupied';
  const isMaintenance = room.status === 'maintenance';
  const isDirty = room.housekeeping === 'dirty' || room.housekeeping === 'cleaning_in_progress';

  // Find active reservation if occupied
  const currentRes = reservations.find(
    (r) => r.id === room.currentReservationId || (r.roomId === room.id && r.status === 'checked_in')
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 my-8 overflow-hidden">
        {/* Header with Photo Banner */}
        <div className="relative h-44 bg-slate-900">
          <img
            src="/src/assets/images/hotel_suite_interior_1794504249585.jpg"
            alt={room.type}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          <button
            onClick={() => setSelectedRoomForDetail(null)}
            className="absolute top-3 right-3 p-1 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between text-white">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-2xl font-bold font-display">
                  Room #{room.number}
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-white/20 font-mono">
                  Floor {room.floor}
                </span>
              </div>
              <div className="text-sm font-medium text-slate-200">{room.type}</div>
            </div>

            <div className="text-right">
              <div className="text-xl font-bold font-mono text-amber-400">
                ${room.ratePerNight}
              </div>
              <div className="text-[10px] text-slate-300">per night + tax</div>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 text-xs">
          {/* Key Specs */}
          <div className="grid grid-cols-3 gap-2.5 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center">
            <div>
              <div className="text-[10px] text-slate-400">Bedding</div>
              <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center justify-center gap-1 mt-0.5">
                <Bed className="w-3.5 h-3.5 text-amber-500" />
                <span>{room.bedType}</span>
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400">Capacity</div>
              <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center justify-center gap-1 mt-0.5">
                <Users className="w-3.5 h-3.5 text-blue-500" />
                <span>Up to {room.maxCapacity} Guests</span>
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400">Cleanliness</div>
              <div className="font-semibold text-slate-800 dark:text-slate-200 capitalize mt-0.5">
                {room.housekeeping.replace('_', ' ')}
              </div>
            </div>
          </div>

          {/* Occupancy Card if Occupied */}
          {isOccupied && currentRes ? (
            <div className="p-4 rounded-lg bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-blue-950 dark:text-blue-200 text-xs">
                  Currently Occupied
                </span>
                <span className="font-mono text-xs text-blue-700 dark:text-blue-300">
                  {currentRes.bookingRef}
                </span>
              </div>
              <div className="font-semibold text-slate-900 dark:text-white text-sm">
                {currentRes.guestName}
              </div>
              <div className="text-slate-600 dark:text-slate-300 text-[11px] space-y-0.5">
                <div>Stay: <span className="font-mono">{currentRes.checkInDate}</span> to <span className="font-mono">{currentRes.checkOutDate}</span> ({currentRes.nightsCount} nights)</div>
                <div>Folio Ledger: <span className="font-mono font-semibold">${currentRes.totalAmount.toFixed(2)}</span> (Paid: ${currentRes.paidAmount.toFixed(2)})</div>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={() => {
                    setSelectedRoomForDetail(null);
                    setSelectedReservationForFolio(currentRes);
                  }}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded font-medium flex items-center gap-1.5 transition-colors"
                >
                  <Receipt className="w-3.5 h-3.5" />
                  <span>View Folio</span>
                </button>
                <button
                  onClick={() => {
                    setReservationForCharge(currentRes);
                    setIsAddChargeModalOpen(true);
                  }}
                  className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 rounded font-medium transition-colors"
                >
                  + Add Charge
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Check out ${currentRes.guestName} now?`)) {
                      checkOutReservation(currentRes.id);
                      setSelectedRoomForDetail(null);
                    }
                  }}
                  className="px-3 py-1.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-slate-200 rounded font-medium ml-auto transition-colors"
                >
                  Check-Out
                </button>
              </div>
            </div>
          ) : !isOccupied && !isMaintenance ? (
            <div className="p-4 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 flex items-center justify-between">
              <div>
                <div className="font-bold text-emerald-950 dark:text-emerald-200 text-xs">
                  Available for Check-In
                </div>
                <div className="text-[11px] text-emerald-700 dark:text-emerald-400">
                  Ready to assign to incoming or walk-in guest
                </div>
              </div>
              <button
                onClick={() => {
                  setQuickCheckInRoom(room);
                  setSelectedRoomForDetail(null);
                  setIsNewReservationModalOpen(true);
                }}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Book Now</span>
              </button>
            </div>
          ) : null}

          {/* Amenities */}
          <div>
            <div className="font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
              Room Amenities & Features
            </div>
            <div className="flex flex-wrap gap-1.5">
              {room.amenities.map((item) => (
                <span
                  key={item}
                  className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px]"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Quick Housekeeping & Maintenance Controls */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <div className="font-semibold text-slate-800 dark:text-slate-200">
              Operations Controls
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => updateHousekeepingStatus(room.id, 'inspected')}
                className="px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded font-medium flex items-center gap-1 transition-colors"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Set Inspected & Clean</span>
              </button>

              <button
                onClick={() => updateHousekeepingStatus(room.id, 'dirty')}
                className="px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded font-medium flex items-center gap-1 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Set Needs Cleaning</span>
              </button>

              <button
                onClick={() =>
                  updateRoom(room.id, {
                    status: room.status === 'maintenance' ? 'available' : 'maintenance',
                    notes: room.status === 'maintenance' ? undefined : 'Placed in maintenance by manager',
                  })
                }
                className={`px-2.5 py-1.5 rounded font-medium flex items-center gap-1 transition-colors ${
                  room.status === 'maintenance'
                    ? 'bg-red-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200'
                }`}
              >
                <Wrench className="w-3.5 h-3.5 text-red-500" />
                <span>
                  {room.status === 'maintenance' ? 'Take Out of Maint.' : 'Put in Maintenance'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
