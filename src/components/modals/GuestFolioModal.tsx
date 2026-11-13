import React, { useState, useEffect } from 'react';
import { useHotel } from '../../context/HotelContext';
import { DiscountType } from '../../types/hotel';
import {
  X,
  Printer,
  PlusCircle,
  Building2,
  Percent,
} from 'lucide-react';

export const GuestFolioModal: React.FC = () => {
  const {
    selectedReservationForFolio,
    setSelectedReservationForFolio,
    hotelInfo,
    formatPrice,
    currentDate,
    setIsAddChargeModalOpen,
    setReservationForCharge,
    reservations,
    checkOutReservation,
    applyDiscountToReservation,
  } = useHotel();

  const [showDiscountForm, setShowDiscountForm] = useState(false);
  const [discountType, setDiscountType] = useState<DiscountType>('percent');
  const [discountValue, setDiscountValue] = useState<number>(0);
  const [discountReason, setDiscountReason] = useState('');

  const res = selectedReservationForFolio
    ? reservations.find((r) => r.id === selectedReservationForFolio.id) || selectedReservationForFolio
    : null;

  useEffect(() => {
    if (res) {
      setDiscountType(res.discountType || 'percent');
      setDiscountValue(res.discountValue || 0);
      setDiscountReason(res.discountReason || '');
      setShowDiscountForm(false);
    }
  }, [res?.id]);

  if (!res) return null;

  const grossSubtotal = res.roomTotal + res.mealPlanTotal + res.extrasTotal;
  const discountAmount = res.discountAmount || 0;
  const balanceDue = Math.max(0, res.totalAmount - res.paidAmount);
  const taxPct = Math.round(hotelInfo.taxRate * 100);

  const handleApplyDiscount = (e: React.FormEvent) => {
    e.preventDefault();
    applyDiscountToReservation(res.id, discountType, Number(discountValue) || 0, discountReason.trim());
    setShowDiscountForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 my-8 overflow-hidden flex flex-col">
        {/* Top Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Official Tax Invoice / Folio
            </span>
            <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
              {res.bookingRef}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {res.status !== 'cancelled' && (
              <button
                onClick={() => setShowDiscountForm((v) => !v)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 rounded-md hover:bg-emerald-100 transition-colors"
              >
                <Percent className="w-3.5 h-3.5" />
                <span>{discountAmount > 0 ? 'Edit Discount' : 'Give Discount'}</span>
              </button>
            )}

            {res.status === 'checked_in' && (
              <button
                onClick={() => {
                  setReservationForCharge(res);
                  setIsAddChargeModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 rounded-md hover:bg-amber-100 transition-colors"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Add Charge</span>
              </button>
            )}

            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Folio</span>
            </button>

            <button
              onClick={() => setSelectedReservationForFolio(null)}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Inline Discount Editor */}
        {showDiscountForm && (
          <form
            onSubmit={handleApplyDiscount}
            className="p-4 bg-emerald-50/70 dark:bg-emerald-950/30 border-b border-emerald-200 dark:border-emerald-900/50 flex flex-wrap items-end gap-3 text-xs print:hidden"
          >
            <div>
              <label className="block font-medium text-emerald-900 dark:text-emerald-200 mb-1">
                Discount Type
              </label>
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value as DiscountType)}
                className="p-2 rounded-lg border border-emerald-300 dark:border-emerald-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              >
                <option value="percent">Percentage (%)</option>
                <option value="flat">Flat ({hotelInfo.currency})</option>
              </select>
            </div>
            <div>
              <label className="block font-medium text-emerald-900 dark:text-emerald-200 mb-1">
                Value
              </label>
              <input
                type="number"
                min="0"
                max={discountType === 'percent' ? 100 : grossSubtotal}
                value={discountValue}
                onChange={(e) => setDiscountValue(Math.max(0, Number(e.target.value)))}
                className="w-28 p-2 rounded-lg border border-emerald-300 dark:border-emerald-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
              />
            </div>
            <div className="flex-1 min-w-[180px]">
              <label className="block font-medium text-emerald-900 dark:text-emerald-200 mb-1">
                Reason / Approval Note
              </label>
              <input
                type="text"
                value={discountReason}
                onChange={(e) => setDiscountReason(e.target.value)}
                placeholder="e.g. Returning Guest Courtesy"
                className="w-full p-2 rounded-lg border border-emerald-300 dark:border-emerald-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg"
              >
                Apply Discount
              </button>
              <button
                type="button"
                onClick={() => setShowDiscountForm(false)}
                className="px-3 py-2 text-slate-600 dark:text-slate-300 hover:bg-white/60 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Printable Folio Body */}
        <div className="p-8 space-y-6 text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900 text-xs">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-lg font-bold font-display tracking-tight text-slate-900 dark:text-white">
                    {hotelInfo.name}
                  </h2>
                  <p className="text-[11px] text-slate-500">{hotelInfo.tagline}</p>
                </div>
              </div>
              <div className="mt-3 text-[11px] text-slate-500 space-y-0.5">
                <div>{hotelInfo.address}</div>
                <div>Tel: {hotelInfo.phone} · Mobile: {hotelInfo.mobile}</div>
                <div>NTN / Tax ID: {hotelInfo.ntn} · {hotelInfo.registrationNo}</div>
              </div>
            </div>

            <div className="text-right sm:self-start">
              <div className="text-xs uppercase font-semibold text-slate-400">
                Guest Invoice ({hotelInfo.currency})
              </div>
              <div className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-0.5">
                {res.bookingRef}
              </div>
              <div className="text-[11px] text-slate-500 mt-1 font-mono">
                Date: {currentDate}
              </div>
              <div className="text-[11px] text-slate-500 font-mono">
                Room <span className="font-bold text-slate-800 dark:text-slate-200">#{res.roomNumber}</span>
                {res.roomName ? ` · ${res.roomName}` : ''} ({res.roomType})
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
            <div>
              <div className="text-[11px] text-slate-400">Guest Name</div>
              <div className="font-semibold text-slate-900 dark:text-white text-xs mt-0.5">
                {res.guestName}
              </div>
              <div className="text-[10px] text-slate-500">{res.cityOrCountry}</div>
            </div>

            <div>
              <div className="text-[11px] text-slate-400">CNIC / Passport</div>
              <div className="font-mono text-slate-700 dark:text-slate-300 text-xs mt-0.5">
                {res.guestCnicOrPassport}
              </div>
              <div className="text-[10px] text-slate-500 truncate">{res.guestPhone}</div>
            </div>

            <div>
              <div className="text-[11px] text-slate-400">Arrival / Check-In</div>
              <div className="font-mono text-slate-700 dark:text-slate-300 text-xs mt-0.5">
                {res.checkInDate}
              </div>
              <div className="text-[10px] text-slate-500">
                {res.checkedInAt || 'Confirmed Booking'}
              </div>
            </div>

            <div>
              <div className="text-[11px] text-slate-400">Departure / Check-Out</div>
              <div className="font-mono text-slate-700 dark:text-slate-300 text-xs mt-0.5">
                {res.checkOutDate}
              </div>
              <div className="text-[10px] text-slate-500">
                {res.checkedOutAt || `${res.nightsCount} Nights Stay`}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold">
                  <th className="py-2.5">Date</th>
                  <th className="py-2.5">Category</th>
                  <th className="py-2.5">Description</th>
                  <th className="py-2.5">Staff Reference</th>
                  <th className="py-2.5 text-right">Amount ({hotelInfo.currency})</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                <tr>
                  <td className="py-2.5 font-mono text-slate-500">{res.checkInDate}</td>
                  <td className="py-2.5 font-medium text-slate-700 dark:text-slate-300">Lodging</td>
                  <td className="py-2.5">
                    Room #{res.roomNumber} {res.roomName ? `(${res.roomName})` : ''} · {res.roomType} — {res.nightsCount} Nights @ {formatPrice(res.nightlyRate)}/night
                  </td>
                  <td className="py-2.5 text-slate-400">Front Desk PMS</td>
                  <td className="py-2.5 text-right font-mono font-medium tabular-nums">{formatPrice(res.roomTotal)}</td>
                </tr>

                {res.mealPlanTotal > 0 && (
                  <tr>
                    <td className="py-2.5 font-mono text-slate-500">{res.checkInDate}</td>
                    <td className="py-2.5 font-medium text-slate-700 dark:text-slate-300">Dining Plan</td>
                    <td className="py-2.5">
                      {res.mealPlan} ({res.adults} Guest{res.adults > 1 ? 's' : ''} x {res.nightsCount} Days)
                    </td>
                    <td className="py-2.5 text-slate-400">Kitchen Package</td>
                    <td className="py-2.5 text-right font-mono font-medium tabular-nums">{formatPrice(res.mealPlanTotal)}</td>
                  </tr>
                )}

                {res.extras.map((extra) => (
                  <tr key={extra.id}>
                    <td className="py-2.5 font-mono text-slate-500">{extra.date}</td>
                    <td className="py-2.5 font-medium text-amber-700 dark:text-amber-400">{extra.category}</td>
                    <td className="py-2.5">{extra.description}</td>
                    <td className="py-2.5 text-slate-400">{extra.addedBy}</td>
                    <td className="py-2.5 text-right font-mono font-medium tabular-nums">{formatPrice(extra.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Subtotal, Discount, Tax & Balance */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
            <div className="w-80 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Subtotal Charges:</span>
                <span className="font-mono tabular-nums">{formatPrice(grossSubtotal)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                  <span>
                    Less: Courtesy Discount
                    {res.discountType === 'percent' && res.discountValue ? ` (${res.discountValue}%)` : ''}
                    {res.discountReason ? ` · ${res.discountReason}` : ''}:
                  </span>
                  <span className="font-mono tabular-nums">-{formatPrice(discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>{hotelInfo.taxLabel} ({taxPct}%):</span>
                <span className="font-mono tabular-nums">{formatPrice(res.taxAmount)}</span>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-between font-bold text-slate-900 dark:text-white text-sm">
                <span>Total Invoice Folio:</span>
                <span className="font-mono tabular-nums">{formatPrice(res.totalAmount)}</span>
              </div>

              <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                <span>Payments Credited:</span>
                <span className="font-mono tabular-nums">-{formatPrice(res.paidAmount)}</span>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-between font-bold text-base">
                <span>Outstanding Balance:</span>
                <span className={`font-mono tabular-nums ${balanceDue > 0 ? 'text-red-600 dark:text-red-400' : 'text-slate-400'}`}>
                  {formatPrice(balanceDue)}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-8 text-[11px] text-slate-400">
            <div>
              <p>
                Thank you for choosing {hotelInfo.name}. Contact: {hotelInfo.email} · {hotelInfo.website}
              </p>
            </div>
            <div className="text-right">
              <div className="border-b border-slate-300 dark:border-slate-700 w-48 ml-auto pb-6" />
              <div className="mt-1">Guest Signature / Verification</div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Settlement Method:</span>
            <span className="text-xs font-semibold text-slate-900 dark:text-white">
              {res.paymentMethod}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {balanceDue > 0 && (
              <button
                onClick={() => {
                  checkOutReservation(res.id);
                  alert(`Balance of ${formatPrice(balanceDue)} settled successfully.`);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-sm transition-colors"
              >
                Settle Balance & Finalize
              </button>
            )}
            <button
              onClick={() => setSelectedReservationForFolio(null)}
              className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
