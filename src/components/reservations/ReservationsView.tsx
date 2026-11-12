import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext';
import { Reservation, ReservationStatus } from '../../types/hotel';
import {
  Search,
  Filter,
  Plus,
  Receipt,
  Key,
  LogOut,
  XCircle,
  PlusCircle,
  CheckCircle2,
  Calendar,
  DollarSign
} from 'lucide-react';

export const ReservationsView: React.FC = () => {
  const {
    reservations,
    currentDate,
    checkInReservation,
    checkOutReservation,
    cancelReservation,
    setSelectedReservationForFolio,
    setIsNewReservationModalOpen,
    setIsAddChargeModalOpen,
    setReservationForCharge,
  } = useHotel();

  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredReservations = reservations.filter((res) => {
    // Status tab filter
    if (activeTab === 'checked_in' && res.status !== 'checked_in') return false;
    if (activeTab === 'confirmed' && res.status !== 'confirmed') return false;
    if (activeTab === 'checked_out' && res.status !== 'checked_out') return false;
    if (activeTab === 'cancelled' && res.status !== 'cancelled') return false;

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = res.guestName.toLowerCase().includes(q);
      const matchRoom = res.roomNumber.includes(q);
      const matchRef = res.bookingRef.toLowerCase().includes(q);
      const matchEmail = res.guestEmail.toLowerCase().includes(q);
      return matchName || matchRoom || matchRef || matchEmail;
    }

    return true;
  });

  const getStatusBadge = (status: ReservationStatus) => {
    switch (status) {
      case 'checked_in':
        return (
          <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
            In-House
          </span>
        );
      case 'confirmed':
        return (
          <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">
            Confirmed
          </span>
        );
      case 'checked_out':
        return (
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Departed
          </span>
        );
      case 'cancelled':
        return (
          <span className="text-xs font-semibold text-red-600 dark:text-red-400">
            Cancelled
          </span>
        );
    }
  };

  const getPaymentBadge = (status: 'paid' | 'partial' | 'pending') => {
    switch (status) {
      case 'paid':
        return (
          <span className="text-[11px] font-mono font-medium text-emerald-700 dark:text-emerald-400">
            Settled
          </span>
        );
      case 'partial':
        return (
          <span className="text-[11px] font-mono font-medium text-amber-700 dark:text-amber-400">
            Partial
          </span>
        );
      case 'pending':
        return (
          <span className="text-[11px] font-mono font-medium text-red-600 dark:text-red-400">
            Unpaid
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white font-display">
            Guest Reservations & Bookings Hub
          </h2>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            <span>{reservations.length} Total Bookings</span>
            <span aria-hidden="true">·</span>
            <span>Check-in / Check-out workflows</span>
            <span aria-hidden="true">·</span>
            <span>Itemized Folios</span>
          </div>
        </div>

        <button
          onClick={() => setIsNewReservationModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-amber-600 hover:bg-slate-800 dark:hover:bg-amber-500 rounded-lg shadow-sm transition-colors whitespace-nowrap self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Reservation</span>
        </button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Status Segmented Control */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: 'all', label: 'All Bookings', count: reservations.length },
            { id: 'checked_in', label: 'In-House', count: reservations.filter((r) => r.status === 'checked_in').length },
            { id: 'confirmed', label: 'Confirmed / Due', count: reservations.filter((r) => r.status === 'confirmed').length },
            { id: 'checked_out', label: 'Departed', count: reservations.filter((r) => r.status === 'checked_out').length },
            { id: 'cancelled', label: 'Cancelled', count: reservations.filter((r) => r.status === 'cancelled').length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 text-xs rounded-md font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                  activeTab === tab.id
                    ? 'bg-white/20 text-white dark:bg-slate-900/20 dark:text-slate-900'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Live Search Input */}
        <div className="relative min-w-[260px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search guest, room #, ref, email..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 dark:focus:ring-amber-500"
          />
        </div>
      </div>

      {/* Reservations Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300">
                <th className="p-3.5 font-semibold">Booking Ref</th>
                <th className="p-3.5 font-semibold">Guest</th>
                <th className="p-3.5 font-semibold">Room</th>
                <th className="p-3.5 font-semibold">Stay Dates</th>
                <th className="p-3.5 font-semibold text-center">Nights</th>
                <th className="p-3.5 font-semibold">Meal Plan</th>
                <th className="p-3.5 font-semibold text-right">Total Amount</th>
                <th className="p-3.5 font-semibold text-center">Payment</th>
                <th className="p-3.5 font-semibold">Status</th>
                <th className="p-3.5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredReservations.length === 0 ? (
                <tr>
                  <td colSpan={10} className="p-8 text-center text-slate-500 dark:text-slate-400">
                    No reservations matching current filter.
                  </td>
                </tr>
              ) : (
                filteredReservations.map((res) => {
                  return (
                    <tr
                      key={res.id}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="p-3.5 font-mono font-medium text-slate-900 dark:text-white whitespace-nowrap">
                        {res.bookingRef}
                      </td>

                      <td className="p-3.5">
                        <div className="font-semibold text-slate-900 dark:text-white">
                          {res.guestName}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[150px]">
                          {res.guestEmail}
                        </div>
                      </td>

                      <td className="p-3.5">
                        <div className="flex items-center gap-1.5 font-mono font-bold text-slate-900 dark:text-white">
                          <span>#{res.roomNumber}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[120px]">
                          {res.roomType}
                        </div>
                      </td>

                      <td className="p-3.5 font-mono text-[11px] text-slate-600 dark:text-slate-300 whitespace-nowrap">
                        <div>{res.checkInDate}</div>
                        <div className="text-slate-400 dark:text-slate-500">to {res.checkOutDate}</div>
                      </td>

                      <td className="p-3.5 text-center font-mono tabular-nums text-slate-700 dark:text-slate-300">
                        {res.nightsCount}
                      </td>

                      <td className="p-3.5 text-[11px] text-slate-600 dark:text-slate-300">
                        {res.mealPlan}
                      </td>

                      <td className="p-3.5 text-right font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                        ${res.totalAmount.toFixed(2)}
                      </td>

                      <td className="p-3.5 text-center">
                        {getPaymentBadge(res.paymentStatus)}
                      </td>

                      <td className="p-3.5">
                        {getStatusBadge(res.status)}
                      </td>

                      <td className="p-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Guest Folio invoice button */}
                          <button
                            onClick={() => setSelectedReservationForFolio(res)}
                            title="Print / View Folio"
                            className="p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
                          >
                            <Receipt className="w-3.5 h-3.5" />
                          </button>

                          {/* Add extra charge if active in-house */}
                          {res.status === 'checked_in' && (
                            <button
                              onClick={() => {
                                setReservationForCharge(res);
                                setIsAddChargeModalOpen(true);
                              }}
                              title="Post room service or amenity charge"
                              className="p-1.5 text-amber-600 hover:text-amber-800 dark:hover:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded transition-colors"
                            >
                              <PlusCircle className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* Check in button */}
                          {res.status === 'confirmed' && (
                            <button
                              onClick={() => checkInReservation(res.id)}
                              className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded transition-colors"
                            >
                              <Key className="w-3 h-3" />
                              <span>Check-In</span>
                            </button>
                          )}

                          {/* Check out button */}
                          {res.status === 'checked_in' && (
                            <button
                              onClick={() => {
                                if (confirm(`Check out ${res.guestName} from Room ${res.roomNumber}? Total balance: $${(res.totalAmount - res.paidAmount).toFixed(2)}`)) {
                                  checkOutReservation(res.id);
                                }
                              }}
                              className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 rounded transition-colors"
                            >
                              <LogOut className="w-3 h-3" />
                              <span>Check-Out</span>
                            </button>
                          )}

                          {/* Cancel button if confirmed */}
                          {res.status === 'confirmed' && (
                            <button
                              onClick={() => {
                                if (confirm(`Cancel reservation ${res.bookingRef} for ${res.guestName}?`)) {
                                  cancelReservation(res.id);
                                }
                              }}
                              title="Cancel Reservation"
                              className="p-1.5 text-slate-400 hover:text-red-600 rounded transition-colors"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
