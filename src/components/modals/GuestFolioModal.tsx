import React from 'react';
import { useHotel } from '../../context/HotelContext';
import {
  X,
  Printer,
  DollarSign,
  PlusCircle,
  Building2,
  Calendar,
  CreditCard,
  CheckCircle2
} from 'lucide-react';

export const GuestFolioModal: React.FC = () => {
  const {
    selectedReservationForFolio,
    setSelectedReservationForFolio,
    hotelInfo,
    currentDate,
    setIsAddChargeModalOpen,
    setReservationForCharge,
    reservations,
    checkOutReservation,
  } = useHotel();

  if (!selectedReservationForFolio) return null;

  // Grab freshest state
  const res = reservations.find((r) => r.id === selectedReservationForFolio.id) || selectedReservationForFolio;
  const balanceDue = Math.max(0, res.totalAmount - res.paidAmount);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 my-8 overflow-hidden flex flex-col">
        {/* Top Control Bar (Hidden during printing) */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Official Guest Folio
            </span>
            <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
              {res.bookingRef}
            </span>
          </div>

          <div className="flex items-center gap-2">
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
              onClick={handlePrint}
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

        {/* Printable Folio Document Body */}
        <div className="p-8 space-y-6 text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900 text-xs">
          {/* Hotel Header Lockup */}
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
                <div>Tel: {hotelInfo.phone} · {hotelInfo.email}</div>
                <div>VAT / Tax ID: US-CA-8490219</div>
              </div>
            </div>

            <div className="text-right sm:self-start">
              <div className="text-xs uppercase font-semibold text-slate-400">Statement of Account</div>
              <div className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-0.5">
                {res.bookingRef}
              </div>
              <div className="text-[11px] text-slate-500 mt-1 font-mono">
                Date: {currentDate}
              </div>
              <div className="text-[11px] text-slate-500 font-mono">
                Room: <span className="font-bold text-slate-800 dark:text-slate-200">#{res.roomNumber}</span> ({res.roomType})
              </div>
            </div>
          </div>

          {/* Guest Particulars Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
            <div>
              <div className="text-[11px] text-slate-400">Guest Name</div>
              <div className="font-semibold text-slate-900 dark:text-white text-xs mt-0.5">
                {res.guestName}
              </div>
              <div className="text-[10px] text-slate-500">{res.nationality}</div>
            </div>

            <div>
              <div className="text-[11px] text-slate-400">Passport / ID</div>
              <div className="font-mono text-slate-700 dark:text-slate-300 text-xs mt-0.5">
                {res.guestPassport}
              </div>
              <div className="text-[10px] text-slate-500 truncate">{res.guestEmail}</div>
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

          {/* Itemized Line Items Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold">
                  <th className="py-2.5">Date</th>
                  <th className="py-2.5">Category</th>
                  <th className="py-2.5">Description</th>
                  <th className="py-2.5">Staff Reference</th>
                  <th className="py-2.5 text-right">Amount (USD)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {/* Room Lodging */}
                <tr>
                  <td className="py-2.5 font-mono text-slate-500">{res.checkInDate}</td>
                  <td className="py-2.5 font-medium text-slate-700 dark:text-slate-300">Lodging</td>
                  <td className="py-2.5">
                    Suite #{res.roomNumber} ({res.roomType}) — {res.nightsCount} Nights @ ${res.nightlyRate}/night
                  </td>
                  <td className="py-2.5 text-slate-400">Front Desk PMS</td>
                  <td className="py-2.5 text-right font-mono font-medium">${res.roomTotal.toFixed(2)}</td>
                </tr>

                {/* Meal Plan */}
                {res.mealPlanTotal > 0 && (
                  <tr>
                    <td className="py-2.5 font-mono text-slate-500">{res.checkInDate}</td>
                    <td className="py-2.5 font-medium text-slate-700 dark:text-slate-300">Dining Plan</td>
                    <td className="py-2.5">
                      {res.mealPlan} ({res.adults} Guest{res.adults > 1 ? 's' : ''} x {res.nightsCount} Days)
                    </td>
                    <td className="py-2.5 text-slate-400">F&B Package</td>
                    <td className="py-2.5 text-right font-mono font-medium">${res.mealPlanTotal.toFixed(2)}</td>
                  </tr>
                )}

                {/* Extra Charges */}
                {res.extras.map((extra) => (
                  <tr key={extra.id}>
                    <td className="py-2.5 font-mono text-slate-500">{extra.date}</td>
                    <td className="py-2.5 font-medium text-amber-700 dark:text-amber-400">{extra.category}</td>
                    <td className="py-2.5">{extra.description}</td>
                    <td className="py-2.5 text-slate-400">{extra.addedBy}</td>
                    <td className="py-2.5 text-right font-mono font-medium">${extra.amount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Subtotal & Balance Summary */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
            <div className="w-72 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Subtotal Charges:</span>
                <span className="font-mono tabular-nums">
                  ${(res.roomTotal + res.mealPlanTotal + res.extrasTotal).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Occupancy Tax (10%):</span>
                <span className="font-mono tabular-nums">${res.taxAmount.toFixed(2)}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-between font-bold text-slate-900 dark:text-white text-sm">
                <span>Total Invoice Folio:</span>
                <span className="font-mono tabular-nums">${res.totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                <span>Payments Credited:</span>
                <span className="font-mono tabular-nums">-${res.paidAmount.toFixed(2)}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-between font-bold text-base">
                <span>Outstanding Balance:</span>
                <span className={`font-mono tabular-nums ${balanceDue > 0 ? 'text-red-600 dark:text-red-400' : 'text-slate-400'}`}>
                  ${balanceDue.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Guest Sign-off & Policy Notes */}
          <div className="pt-8 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-8 text-[11px] text-slate-400">
            <div>
              <p>
                Thank you for choosing {hotelInfo.name}. All incidental charges are billed to the registered card on file.
              </p>
            </div>
            <div className="text-right">
              <div className="border-b border-slate-300 dark:border-slate-700 w-48 ml-auto pb-6" />
              <div className="mt-1">Guest Signature / Authorization</div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Method:</span>
            <span className="text-xs font-semibold text-slate-900 dark:text-white">
              {res.paymentMethod}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {balanceDue > 0 && (
              <button
                onClick={() => {
                  checkOutReservation(res.id);
                  alert(`Balance of $${balanceDue.toFixed(2)} settled via ${res.paymentMethod}.`);
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
