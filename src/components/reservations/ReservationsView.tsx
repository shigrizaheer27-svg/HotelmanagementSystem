import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext';
import { ReservationStatus } from '../../types/hotel';
import {
  Search,
  Plus,
  Receipt,
  Key,
  LogOut,
  XCircle,
  PlusCircle,
  Edit2,
  Trash2,
} from 'lucide-react';

export const ReservationsView: React.FC = () => {
  const {
    hotelInfo,
    formatPrice,
    reservations,
    checkInReservation,
    checkOutReservation,
    cancelReservation,
    setSelectedReservationForFolio,
    setIsNewReservationModalOpen,
    setIsAddChargeModalOpen,
    setReservationForCharge,
    isAdmin,
    setReservationToEdit,
    setIsReservationEditModalOpen,
    deleteReservation,
  } = useHotel();

  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredReservations = reservations.filter((res) => {
    if (activeTab === 'checked_in' && res.status !== 'checked_in') return false;
    if (activeTab === 'confirmed' && res.status !== 'confirmed') return false;
    if (activeTab === 'checked_out' && res.status !== 'checked_out') return false;
    if (activeTab === 'cancelled' && res.status !== 'cancelled') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        res.guestName.toLowerCase().includes(q) ||
        res.roomNumber.includes(q) ||
        (res.roomName || '').toLowerCase().includes(q) ||
        res.bookingRef.toLowerCase().includes(q) ||
        res.guestEmail.toLowerCase().includes(q) ||
        res.guestCnicOrPassport.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getStatusBadge = (status: ReservationStatus) => {
    switch (status) {
      case 'checked_in':
        return <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">In-House</span>;
      case 'confirmed':
        return <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">Confirmed</span>;
      case 'checked_out':
        return <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Departed</span>;
      case 'cancelled':
        return <span className="text-xs font-semibold text-red-600 dark:text-red-400">Cancelled</span>;
    }
  };

  const getPaymentBadge = (status: 'paid' | 'partial' | 'pending') => {
    switch (status) {
      case 'paid':
        return <span className="text-[11px] font-mono font-medium text-emerald-700 dark:text-emerald-400">Settled</span>;
      case 'partial':
        return <span className="text-[11px] font-mono font-medium text-amber-700 dark:text-amber-400">Partial</span>;
      case 'pending':
        return <span className="text-[11px] font-mono font-medium text-red-600 dark:text-red-400">Unpaid</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white font-display">
            Guest Reservations & Discounts ({hotelInfo.currency})
          </h2>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            <span>{reservations.length} Bookings</span>
            <span aria-hidden="true">·</span>
            <span>{hotelInfo.name}</span>
            <span aria-hidden="true">·</span>
            <span>{isAdmin ? 'Admin Full Access' : 'Manager Operations'}</span>
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

      <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: 'all', label: 'All Bookings', count: reservations.length },
            { id: 'checked_in', label: 'In-House', count: reservations.filter((r) => r.status === 'checked_in').length },
            { id: 'confirmed', label: 'Confirmed', count: reservations.filter((r) => r.status === 'confirmed').length },
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
              <span className="font-mono text-[10px] opacity-75">({tab.count})</span>
            </button>
          ))}
        </div>

        <div className="relative min-w-[260px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search name, ID, room, ref..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300">
                <th className="p-3.5 font-semibold">Ref</th>
                <th className="p-3.5 font-semibold">Guest & ID</th>
                <th className="p-3.5 font-semibold">Room</th>
                <th className="p-3.5 font-semibold">Stay Dates</th>
                <th className="p-3.5 font-semibold text-center">Nights</th>
                <th className="p-3.5 font-semibold">Payment</th>
                <th className="p-3.5 font-semibold text-right">Total ({hotelInfo.currency})</th>
                <th className="p-3.5 font-semibold text-center">Status</th>
                <th className="p-3.5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredReservations.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-slate-500 dark:text-slate-400">
                    No bookings found matching current filter.
                  </td>
                </tr>
              ) : (
                filteredReservations.map((res) => (
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
                      <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                        {res.guestCnicOrPassport} · {res.cityOrCountry}
                      </div>
                    </td>

                    <td className="p-3.5">
                      <div className="font-mono font-bold text-slate-900 dark:text-white">
                        #{res.roomNumber} {res.roomName ? `· ${res.roomName}` : ''}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate max-w-[140px]">
                        {res.roomType}
                      </div>
                    </td>

                    <td className="p-3.5 font-mono text-[11px] text-slate-600 dark:text-slate-300 whitespace-nowrap">
                      <div>{res.checkInDate}</div>
                      <div className="text-slate-400">to {res.checkOutDate}</div>
                    </td>

                    <td className="p-3.5 text-center font-mono tabular-nums text-slate-700 dark:text-slate-300">
                      {res.nightsCount}
                    </td>

                    <td className="p-3.5 text-[11px] text-slate-600 dark:text-slate-300">
                      <div>{res.paymentMethod}</div>
                      <div>{getPaymentBadge(res.paymentStatus)}</div>
                    </td>

                    <td className="p-3.5 text-right font-mono tabular-nums">
                      <div className="font-bold text-slate-900 dark:text-white">
                        {formatPrice(res.totalAmount)}
                      </div>
                      {(res.discountAmount || 0) > 0 && (
                        <div
                          className="text-[10px] text-emerald-600 dark:text-emerald-400"
                          title={res.discountReason || 'Guest Discount'}
                        >
                          -{formatPrice(res.discountAmount!)} disc
                        </div>
                      )}
                    </td>

                    <td className="p-3.5 text-center">
                      {getStatusBadge(res.status)}
                    </td>

                    <td className="p-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedReservationForFolio(res)}
                          title="View / Print Folio & Discount"
                          className="p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
                        >
                          <Receipt className="w-3.5 h-3.5" />
                        </button>

                        {res.status === 'checked_in' && (
                          <button
                            onClick={() => {
                              setReservationForCharge(res);
                              setIsAddChargeModalOpen(true);
                            }}
                            title="Add Charge"
                            className="p-1.5 text-amber-600 hover:text-amber-800 dark:hover:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded transition-colors"
                          >
                            <PlusCircle className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {res.status === 'confirmed' && (
                          <button
                            onClick={() => checkInReservation(res.id)}
                            className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded transition-colors"
                          >
                            <Key className="w-3 h-3" />
                            <span>Check-In</span>
                          </button>
                        )}

                        {res.status === 'checked_in' && (
                          <button
                            onClick={() => {
                              if (confirm(`Check out ${res.guestName} from Room ${res.roomNumber}?`)) {
                                checkOutReservation(res.id);
                              }
                            }}
                            className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 rounded transition-colors"
                          >
                            <LogOut className="w-3 h-3" />
                            <span>Check-Out</span>
                          </button>
                        )}

                        {isAdmin && (
                          <button
                            onClick={() => {
                              setReservationToEdit(res);
                              setIsReservationEditModalOpen(true);
                            }}
                            title="Edit Booking Rates / Discount / Dates"
                            className="p-1.5 text-amber-600 hover:text-amber-800 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {isAdmin && (
                          <button
                            onClick={() => {
                              if (confirm(`Administrator: Permanently delete booking ${res.bookingRef}?`)) {
                                deleteReservation(res.id);
                              }
                            }}
                            title="Delete Booking"
                            className="p-1.5 text-slate-400 hover:text-red-600 rounded transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {!isAdmin && res.status === 'confirmed' && (
                          <button
                            onClick={() => {
                              if (confirm(`Cancel reservation ${res.bookingRef}?`)) {
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
