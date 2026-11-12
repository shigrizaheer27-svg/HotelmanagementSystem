import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext';
import { formatPKR } from '../../data/mockData';
import {
  Receipt,
  CreditCard,
  PlusCircle,
  Eye,
  CheckCircle2,
  TrendingUp,
  Percent,
  Download,
  Building
} from 'lucide-react';

export const BillingOverview: React.FC = () => {
  const {
    reservations,
    setSelectedReservationForFolio,
    setIsAddChargeModalOpen,
    setReservationForCharge,
    stats,
    hotelInfo,
    isAdmin,
  } = useHotel();

  const [paymentFilter, setPaymentFilter] = useState<'all' | 'unpaid' | 'paid'>('all');

  const allExtras = reservations.flatMap((r) => (r.status !== 'cancelled' ? r.extras : []));
  const diningTotal = allExtras
    .filter((e) => e.category === 'Balti & Desi Dining' || e.category === 'Bonfire & Trout BBQ')
    .reduce((acc, curr) => acc + curr.amount, 0);
  const toursTotal = allExtras
    .filter((e) => e.category === 'Jeep Safari / Tour' || e.category === 'Skardu Airport Transfer')
    .reduce((acc, curr) => acc + curr.amount, 0);
  const totalRoomRevenue = reservations
    .filter((r) => r.status !== 'cancelled')
    .reduce((acc, curr) => acc + curr.roomTotal, 0);
  const totalTaxes = reservations
    .filter((r) => r.status !== 'cancelled')
    .reduce((acc, curr) => acc + curr.taxAmount, 0);
  const totalRevenue = reservations
    .filter((r) => r.status !== 'cancelled')
    .reduce((acc, curr) => acc + curr.totalAmount, 0);

  const filteredReservations = reservations.filter((r) => {
    if (r.status === 'cancelled') return false;
    if (paymentFilter === 'unpaid' && r.paymentStatus === 'paid') return false;
    if (paymentFilter === 'paid' && r.paymentStatus !== 'paid') return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white font-display">
          Finance, Guest Billing & Ledgers (PKR)
        </h2>
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          <span>Mashakala Resort Shigar</span>
          <span aria-hidden="true">·</span>
          <span>PKR currency ledgers</span>
          <span aria-hidden="true">·</span>
          <span>13% Provincial GST & GB Tourism Levy</span>
        </div>
      </div>

      {/* Revenue Department Cards in PKR */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Billed Rev</span>
          <div className="mt-1.5 text-xl font-bold font-mono text-slate-900 dark:text-white tabular-nums truncate">
            {formatPKR(totalRevenue)}
          </div>
          <div className="mt-1 text-[11px] text-slate-400 font-mono">All booking ledgers</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Room Lodging</span>
          <div className="mt-1.5 text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400 tabular-nums truncate">
            {formatPKR(totalRoomRevenue)}
          </div>
          <div className="mt-1 text-[11px] text-slate-400 font-mono">Base room nights</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Balti F&B / BBQ</span>
          <div className="mt-1.5 text-xl font-bold font-mono text-amber-500 tabular-nums truncate">
            {formatPKR(diningTotal)}
          </div>
          <div className="mt-1 text-[11px] text-slate-400 font-mono">Trout BBQ & Karahi</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Safaris & Transfers</span>
          <div className="mt-1.5 text-xl font-bold font-mono text-purple-600 dark:text-purple-400 tabular-nums truncate">
            {formatPKR(toursTotal)}
          </div>
          <div className="mt-1 text-[11px] text-slate-400 font-mono">4x4 Sarfaranga / KDU</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">GB Tourism Tax (13%)</span>
          <div className="mt-1.5 text-xl font-bold font-mono text-blue-600 dark:text-blue-400 tabular-nums truncate">
            {formatPKR(totalTaxes)}
          </div>
          <div className="mt-1 text-[11px] text-slate-400 font-mono">Provincial Levy</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setPaymentFilter('all')}
            className={`px-3 py-1.5 text-xs rounded-md font-medium transition-colors ${
              paymentFilter === 'all'
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            All Guest Ledgers ({reservations.filter((r) => r.status !== 'cancelled').length})
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

      {/* Guest Accounts & Billing Ledger Table in PKR */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300">
                <th className="p-3.5 font-semibold">Folio Ref</th>
                <th className="p-3.5 font-semibold">Guest Name</th>
                <th className="p-3.5 font-semibold">Room #</th>
                <th className="p-3.5 font-semibold text-right">Lodging Total</th>
                <th className="p-3.5 font-semibold text-right">F&B & Tours</th>
                <th className="p-3.5 font-semibold text-right">Tax (13%)</th>
                <th className="p-3.5 font-semibold text-right">Total Bill</th>
                <th className="p-3.5 font-semibold text-right">Paid Amount</th>
                <th className="p-3.5 font-semibold text-right">Balance Due</th>
                <th className="p-3.5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredReservations.map((res) => {
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
                      {formatPKR(res.roomTotal)}
                    </td>

                    <td className="p-3.5 text-right font-mono tabular-nums text-slate-700 dark:text-slate-300">
                      {formatPKR(res.extrasTotal)}
                    </td>

                    <td className="p-3.5 text-right font-mono tabular-nums text-slate-700 dark:text-slate-300">
                      {formatPKR(res.taxAmount)}
                    </td>

                    <td className="p-3.5 text-right font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                      {formatPKR(res.totalAmount)}
                    </td>

                    <td className="p-3.5 text-right font-mono text-emerald-600 dark:text-emerald-400 tabular-nums">
                      {formatPKR(res.paidAmount)}
                    </td>

                    <td className="p-3.5 text-right font-mono font-bold tabular-nums">
                      {balanceDue > 0 ? (
                        <span className="text-red-600 dark:text-red-400">
                          {formatPKR(balanceDue)}
                        </span>
                      ) : (
                        <span className="text-slate-400">Settled (PKR 0)</span>
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
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
