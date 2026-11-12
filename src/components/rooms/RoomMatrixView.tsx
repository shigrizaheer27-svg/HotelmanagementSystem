import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext';
import { formatPKR } from '../../data/mockData';
import { Room, RoomStatus, HousekeepingStatus } from '../../types/hotel';
import {
  Bed,
  Users,
  Sparkles,
  Wrench,
  Check,
  Calendar,
  Grid,
  Filter,
  Plus,
  ArrowRight,
  Info,
  DollarSign,
  Edit2,
  Trash2,
  Shield
} from 'lucide-react';

export const RoomMatrixView: React.FC = () => {
  const {
    rooms,
    reservations,
    currentDate,
    setSelectedRoomForDetail,
    setIsNewReservationModalOpen,
    updateHousekeepingStatus,
    setQuickCheckInRoom,
    isAdmin,
    isManager,
    setIsRoomFormModalOpen,
    setRoomToEdit,
    deleteRoom,
  } = useHotel();

  const [floorFilter, setFloorFilter] = useState<number | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'tape_chart'>('grid');

  const filteredRooms = rooms.filter((room) => {
    if (floorFilter !== 'all' && room.floor !== floorFilter) return false;
    if (statusFilter === 'available' && room.status !== 'available') return false;
    if (statusFilter === 'occupied' && room.status !== 'occupied') return false;
    if (statusFilter === 'dirty' && room.housekeeping !== 'dirty' && room.housekeeping !== 'cleaning_in_progress') return false;
    if (statusFilter === 'maintenance' && room.status !== 'maintenance') return false;
    return true;
  });

  const tapeDates = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + (i - 1));
    return d.toISOString().split('T')[0];
  });

  const getStatusBadge = (status: RoomStatus, hk: HousekeepingStatus) => {
    if (status === 'maintenance') {
      return (
        <span className="text-xs font-semibold text-red-600 dark:text-red-400 flex items-center gap-1">
          <Wrench className="w-3.5 h-3.5" /> Maintenance
        </span>
      );
    }
    if (status === 'occupied') {
      return (
        <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1">
          <Users className="w-3.5 h-3.5" /> Occupied
        </span>
      );
    }
    if (hk === 'dirty') {
      return (
        <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5" /> Dirty / Turnover
        </span>
      );
    }
    if (hk === 'cleaning_in_progress') {
      return (
        <span className="text-xs font-semibold text-amber-500 dark:text-amber-400 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 animate-spin" /> In Progress
        </span>
      );
    }
    return (
      <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
        <Check className="w-3.5 h-3.5" /> Ready for Guest
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white font-display">
            Room Inventory & Rates Matrix (PKR)
          </h2>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            <span>{rooms.length} Suites</span>
            <span aria-hidden="true">·</span>
            <span>Mashakala Resort Shigar</span>
            <span aria-hidden="true">·</span>
            <span>{isAdmin ? 'Admin Edit & Delete Active' : 'Manager Operations'}</span>
          </div>
        </div>

        {/* View Mode Toggle & Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Room Grid</span>
            </button>
            <button
              onClick={() => setViewMode('tape_chart')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${
                viewMode === 'tape_chart'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Tape Chart</span>
            </button>
          </div>

          {/* ADMIN ACTION: Add Room */}
          {isAdmin && (
            <button
              onClick={() => {
                setRoomToEdit(null);
                setIsRoomFormModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-900 dark:text-white bg-amber-400 hover:bg-amber-300 dark:bg-amber-500 dark:hover:bg-amber-400 rounded-lg shadow-sm transition-colors whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Room (Admin)</span>
            </button>
          )}

          <button
            onClick={() => setIsNewReservationModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-lg shadow-sm transition-colors whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Book Room</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
        {/* Floor Filter Tabs */}
        <div className="flex items-center gap-1">
          <span className="text-xs text-slate-400 dark:text-slate-500 mr-1 hidden sm:inline">Floor:</span>
          {(['all', 1, 2, 3, 4] as const).map((floor) => (
            <button
              key={floor}
              onClick={() => setFloorFilter(floor)}
              className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
                floorFilter === floor
                  ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {floor === 'all' ? 'All Floors' : `Floor ${floor}`}
            </button>
          ))}
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 flex-wrap">
          <span className="text-xs text-slate-400 dark:text-slate-500 mr-1 hidden sm:inline">Status:</span>
          {[
            { id: 'all', label: 'All Units' },
            { id: 'available', label: 'Available' },
            { id: 'occupied', label: 'Occupied' },
            { id: 'dirty', label: 'Dirty / Turnover' },
            { id: 'maintenance', label: 'Maintenance' },
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setStatusFilter(st.id)}
              className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
                statusFilter === st.id
                  ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* View Mode 1: Room Grid */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredRooms.map((room) => {
            const isOccupied = room.status === 'occupied';
            const isDirty = room.housekeeping === 'dirty' || room.housekeeping === 'cleaning_in_progress';
            const isMaintenance = room.status === 'maintenance';

            return (
              <div
                key={room.id}
                className="group p-4.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xl font-bold text-slate-900 dark:text-white">
                          #{room.number}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
                          Fl {room.floor}
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                        {room.type}
                      </div>
                    </div>
                    {getStatusBadge(room.status, room.housekeeping)}
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-2.5 pb-2.5 border-b border-slate-100 dark:border-slate-800">
                    <span className="flex items-center gap-1">
                      <Bed className="w-3.5 h-3.5" />
                      <span>{room.bedType}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      <span>Max {room.maxCapacity}</span>
                    </span>
                    <span className="font-mono font-medium text-amber-600 dark:text-amber-400 ml-auto tabular-nums">
                      {formatPKR(room.ratePerNight)}/nt
                    </span>
                  </div>

                  {isOccupied && room.currentGuestName ? (
                    <div className="mt-3 p-2.5 rounded-lg bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50">
                      <div className="text-[11px] font-medium text-blue-600 dark:text-blue-400">
                        Current Guest:
                      </div>
                      <div className="text-xs font-bold text-blue-950 dark:text-blue-200 truncate">
                        {room.currentGuestName}
                      </div>
                    </div>
                  ) : isMaintenance ? (
                    <div className="mt-3 p-2.5 rounded-lg bg-red-50/70 dark:bg-red-950/40 border border-red-100 dark:border-red-900/50">
                      <div className="text-[11px] font-medium text-red-600 dark:text-red-400">
                        Out of Order:
                      </div>
                      <div className="text-xs text-red-900 dark:text-red-200 truncate">
                        {room.notes || 'Geyser / heating maintenance'}
                      </div>
                    </div>
                  ) : isDirty ? (
                    <div className="mt-3 p-2.5 rounded-lg bg-amber-50/70 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900/50">
                      <div className="text-[11px] font-medium text-amber-600 dark:text-amber-400">
                        Housekeeping Note:
                      </div>
                      <div className="text-xs text-amber-900 dark:text-amber-200 truncate">
                        {room.notes || 'Scheduled for room attendant turnover'}
                      </div>
                    </div>
                  ) : (
                    <div className="mt-3 text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {room.amenities.slice(0, 3).join(', ')}
                    </div>
                  )}
                </div>

                {/* Card Actions Bottom */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setSelectedRoomForDetail(room)}
                      className="text-xs text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-medium flex items-center gap-1 transition-colors"
                    >
                      <Info className="w-3.5 h-3.5" />
                      <span>Details</span>
                    </button>

                    {/* Admin Edit Room Action */}
                    {isAdmin && (
                      <button
                        onClick={() => {
                          setRoomToEdit(room);
                          setIsRoomFormModalOpen(true);
                        }}
                        title="Edit Room Rate / Specs (Admin)"
                        className="text-xs text-amber-600 hover:text-amber-700 dark:text-amber-400 font-medium flex items-center gap-0.5 transition-colors ml-1"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    {isDirty && (
                      <button
                        onClick={() => updateHousekeepingStatus(room.id, 'inspected')}
                        title="Mark Clean & Inspected"
                        className="px-2 py-1 text-[11px] font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 rounded hover:bg-emerald-100 transition-colors"
                      >
                        Clean
                      </button>
                    )}

                    {!isOccupied && !isMaintenance && (
                      <button
                        onClick={() => {
                          setQuickCheckInRoom(room);
                          setIsNewReservationModalOpen(true);
                        }}
                        className="px-2.5 py-1 text-xs font-semibold text-white bg-slate-900 dark:bg-amber-600 hover:bg-slate-800 dark:hover:bg-amber-500 rounded transition-colors"
                      >
                        Book
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* View Mode 2: Tape Chart / Gantt Timeline View */}
      {viewMode === 'tape_chart' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white font-display">
                7-Day Reservation Tape Chart · Mashakala Resort
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Visual room scheduling across dates ({tapeDates[0]} to {tapeDates[tapeDates.length - 1]})
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                <span className="w-3 h-3 rounded bg-blue-500" /> In-House
              </span>
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                <span className="w-3 h-3 rounded bg-amber-500" /> Confirmed
              </span>
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                <span className="w-3 h-3 rounded bg-slate-200 dark:bg-slate-700" /> Available
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800">
                  <th className="p-3 font-semibold text-slate-700 dark:text-slate-300 w-36 shrink-0 sticky left-0 bg-slate-50 dark:bg-slate-800">
                    Room / Rate
                  </th>
                  {tapeDates.map((date) => {
                    const isToday = date === currentDate;
                    return (
                      <th
                        key={date}
                        className={`p-3 text-center font-mono font-medium border-l border-slate-200 dark:border-slate-800 ${
                          isToday ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 font-bold' : 'text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        <div>{new Date(date).toLocaleDateString([], { weekday: 'short' })}</div>
                        <div className="text-[11px] opacity-75">{date.slice(5)}</div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredRooms.map((room) => {
                  return (
                    <tr key={room.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="p-3 font-medium text-slate-900 dark:text-white sticky left-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800">
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold">#{room.number}</span>
                          <span className="text-[10px] text-amber-600 dark:text-amber-400 font-mono">
                            {formatPKR(room.ratePerNight).split(' ')[1]}
                          </span>
                        </div>
                      </td>

                      {tapeDates.map((date) => {
                        const isToday = date === currentDate;
                        const activeRes = reservations.find(
                          (r) =>
                            r.roomId === room.id &&
                            r.status !== 'cancelled' &&
                            date >= r.checkInDate &&
                            date < r.checkOutDate
                        );

                        return (
                          <td
                            key={date}
                            className={`p-1.5 text-center border-l border-slate-200 dark:border-slate-800 ${
                              isToday ? 'bg-amber-50/30 dark:bg-amber-950/20' : ''
                            }`}
                          >
                            {activeRes ? (
                              <button
                                onClick={() => setSelectedRoomForDetail(room)}
                                className={`w-full py-2 px-1 rounded font-medium text-[10px] truncate block transition-opacity hover:opacity-90 ${
                                  activeRes.status === 'checked_in'
                                    ? 'bg-blue-600 text-white shadow-sm'
                                    : 'bg-amber-500 text-white shadow-sm'
                                }`}
                                title={`${activeRes.guestName} (${activeRes.bookingRef})`}
                              >
                                {activeRes.guestName.split(' ')[0]}
                              </button>
                            ) : room.status === 'maintenance' ? (
                              <div className="py-2 px-1 rounded bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-400 text-[10px] font-mono">
                                MAINT
                              </div>
                            ) : (
                              <div className="py-2 text-[10px] text-slate-300 dark:text-slate-600">
                                —
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
