import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext';
import { Receipt } from 'lucide-react';

export const BillingOverview: React.FC = () => {
  const {
    reservations,
    setSelectedReservationForFolio,
    setIsAddChargeModalOpen,
    setReservationForCharge,
    stats,
    hotelInfo,
    formatPrice,
  } = useHotel();

  const [paymentFilter, setPaymentFilter] = useState<'all' | 'unpaid' | 'paid'>('all');

  const activeBookings = reservations.filter((r) => r.status !== 'cancelled');
  const totalRoomRevenue = activeBookings.reduce((acc, curr) => acc + curr.roomTotal, 0);
  const totalExtras = activeBookings.reduce((acc, curr) => acc + curr.extrasTotal, 0);
  const totalTaxes = activeBookings.reduce((acc, curr) => acc + curr.taxAmount, 0);
  const totalRevenue = activeBookings.reduce((acc, curr) => acc + curr.totalAmount, 0);
  const taxPct = Math.round(hotelInfo.taxRate * 100);

  const filteredReservations = activeBookings.filter((r) => {
    if (paymentFilter === 'unpaid' && r.paymentStatus === 'paid') return false;
    if (paymentFilter === 'paid' && r.paymentStatus !== 'paid') return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white font-display">
          Finance, Guest Billing & Discounts ({hotelInfo.currency})
        </h2>
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          <span>{hotelInfo.name}</span>
          <span aria-hidden="true">·</span>
          <span>{hotelInfo.currency} currency ledgers</span>
          <span aria-hidden="true">·</span>
          <span>{taxPct}% {hotelInfo.taxLabel}</span>
        </div>
      </div>

      {/* Revenue & Discount Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Billed Rev</span>
          <div className="mt-1.5 text-xl font-bold font-mono text-slate-900 dark:text-white tabular-nums truncate">
            {formatPrice(totalRevenue)}
          </div>
          <div className="mt-1 text-[11px] text-slate-400 font-mono">Net after discounts</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Room Lodging</span>
          <div className="mt-1.5 text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400 tabular-nums truncate">
            {formatPrice(totalRoomRevenue)}
          </div>
          <div className="mt-1 text-[11px] text-slate-400 font-mono">Base room nights</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Dining & Tours</span>
          <div className="mt-1.5 text-xl font-bold font-mono text-amber-500 tabular-nums truncate">
            {formatPrice(totalExtras)}
          </div>
          <div className="mt-1 text-[11px] text-slate-400 font-mono">F&B & excursions</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Discounts Given</span>
          <div className="mt-1.5 text-xl font-bold font-mono text-purple-600 dark:text-purple-400 tabular-nums truncate">
            {formatPrice(stats.totalDiscountsGiven)}
          </div>
          <div className="mt-1 text-[11px] text-slate-400 font-mono">Courtesy & VIP</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {hotelInfo.taxLabel} ({taxPct}%)
          </span>
          <div className="mt-1.5 text-xl font-bold font-mono text-blue-600 dark:text-blue-400 tabular-nums truncate">
            {formatPrice(totalTaxes)}
          </div>
          <div className="mt-1 text-[11px] text-slate-400 font-mono">Collected tax</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-1 flex-wrap">
          <button
            onClick={() => setPaymentFilter('all')}
            className={`px-3 py-1.5 text-xs rounded-md font-medium transition-colors ${
              paymentFilter === 'all'
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            All Guest Ledgers ({activeBookings.length})
          </button>
          <button
            onClick={() => setPaymentFilter('unpaid')}
            className={`px-3 py-1.5 text-xs rounded-md font-medium transition-colors ${
              paymentFilter === 'unpaid'
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Pending / Partial Balance
          </button>
          <button
            onClick={() => setPaymentFilter('paid')}
            className={`px-3 py-1.5 text-xs rounded-md font-medium transition-colors ${
              paymentFilter === 'paid'
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Settled in Full
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300">
                <th className="p-3.5 font-semibold">Folio Ref</th>
                <th className="p-3.5 font-semibold">Guest Name</th>
                <th className="p-3.5 font-semibold">Room #</th>
                <th className="p-3.5 font-semibold text-right">Lodging</th>
                <th className="p-3.5 font-semibold text-right">Extras</th>
                <th className="p-3.5 font-semibold text-right">Discount</th>
                <th className="p-3.5 font-semibold text-right">Tax ({taxPct}%)</th>
                <th className="p-3.5 font-semibold text-right">Total Bill</th>
                <th className="p-3.5 font-semibold text-right">Paid</th>
                <th className="p-3.5 font-semibold text-right">Balance</th>
                <th className="p-3.5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredReservations.length === 0 ? (
                <tr>
                  <td colSpan={11} className="p-8 text-center text-slate-500 dark:text-slate-400">
                    No active guest ledgers for this property yet.
                  </td>
                </tr>
              ) : (
                filteredReservations.map((res) => {
                  const balanceDue = Math.max(0, res.totalAmount - res.paidAmount);

                  return (
                    <tr
                      key={res.id}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="p-3.5 font-mono font-bold text-slate-900 dark:text-white">
                        {res.bookingRef}
                      </td>
                      <td className="p-3.5 font-semibold text-slate-900 dark:text-white">
                        {res.guestName}
                      </td>
                      <td className="p-3.5 font-mono text-slate-700 dark:text-slate-300">
                        #{res.roomNumber}
                      </td>
                      <td className="p-3.5 text-right font-mono tabular-nums text-slate-700 dark:text-slate-300">
                        {formatPrice(res.roomTotal)}
                      </td>
                      <td className="p-3.5 text-right font-mono tabular-nums text-slate-700 dark:text-slate-300">
                        {formatPrice(res.extrasTotal)}
                      </td>
                      <td className="p-3.5 text-right font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
                        {(res.discountAmount || 0) > 0 ? `-${formatPrice(res.discountAmount!)}` : '—'}
                      </td>
                      <td className="p-3.5 text-right font-mono tabular-nums text-slate-700 dark:text-slate-300">
                        {formatPrice(res.taxAmount)}
                      </td>
                      <td className="p-3.5 text-right font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                        {formatPrice(res.totalAmount)}
                      </td>
                      <td className="p-3.5 text-right font-mono text-emerald-600 dark:text-emerald-400 tabular-nums">
                        {formatPrice(res.paidAmount)}
                      </td>
                      <td className="p-3.5 text-right font-mono font-bold tabular-nums">
                        {balanceDue > 0 ? (
                          <span className="text-red-600 dark:text-red-400">{formatPrice(balanceDue)}</span>
                        ) : (
                          <span className="text-slate-400">Settled</span>
                        )}
                      </td>
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {res.status === 'checked_in' && (
                            <button
                              onClick={() => {
                                setReservationForCharge(res);
                                setIsAddChargeModalOpen(true);
                              }}
                              className="px-2 py-1 text-xs text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded transition-colors"
                            >
                              + Charge
                            </button>
                          )}
                          <button
                            onClick={() => setSelectedReservationForFolio(res)}
                            className="px-2.5 py-1 text-xs font-semibold text-white bg-slate-900 dark:bg-amber-600 hover:bg-slate-800 rounded transition-colors flex items-center gap-1"
                          >
                            <Receipt className="w-3.5 h-3.5" />
                            <span>Folio</span>
                          </button>
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
