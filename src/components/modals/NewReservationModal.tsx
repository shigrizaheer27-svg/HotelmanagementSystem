import React, { useState, useEffect } from 'react';
import { useHotel } from '../../context/HotelContext';
import { MealPlan, PakistaniPaymentMethod, DiscountType } from '../../types/hotel';
import { X, Percent } from 'lucide-react';

export const NewReservationModal: React.FC = () => {
  const {
    rooms,
    hotelInfo,
    formatPrice,
    currentDate,
    createReservation,
    checkInReservation,
    isNewReservationModalOpen,
    setIsNewReservationModalOpen,
    quickCheckInRoom,
    setQuickCheckInRoom,
  } = useHotel();

  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestCnicOrPassport, setGuestCnicOrPassport] = useState('');
  const [cityOrCountry, setCityOrCountry] = useState('Islamabad, Pakistan');
  const [selectedRoomId, setSelectedRoomId] = useState('');
  const [checkInDate, setCheckInDate] = useState(currentDate);
  const [checkOutDate, setCheckOutDate] = useState(() => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  });
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [mealPlan, setMealPlan] = useState<MealPlan>('Desi & Continental Breakfast');
  const [paymentMethod, setPaymentMethod] = useState<PakistaniPaymentMethod>('Raast / Bank Transfer');
  const [depositPaid, setDepositPaid] = useState<number>(0);
  const [discountType, setDiscountType] = useState<DiscountType>('percent');
  const [discountValue, setDiscountValue] = useState<number>(0);
  const [discountReason, setDiscountReason] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [checkInImmediately, setCheckInImmediately] = useState(false);

  useEffect(() => {
    if (quickCheckInRoom) {
      setSelectedRoomId(quickCheckInRoom.id);
    } else if (rooms.length > 0 && (!selectedRoomId || !rooms.some((r) => r.id === selectedRoomId))) {
      const firstAvail = rooms.find((r) => r.status === 'available') || rooms[0];
      setSelectedRoomId(firstAvail?.id || '');
    }
  }, [quickCheckInRoom, rooms, isNewReservationModalOpen]);

  if (!isNewReservationModalOpen) return null;

  const selectedRoom = rooms.find((r) => r.id === selectedRoomId);

  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);
  const nightsCount = Math.max(1, Math.ceil(Math.max(0, checkOut.getTime() - checkIn.getTime()) / (1000 * 3600 * 24)));

  let mealRatePerNight = 0;
  if (mealPlan === 'Desi & Continental Breakfast') mealRatePerNight = 2500 * adults;
  if (mealPlan === 'Half Board (Breakfast & Dinner Buffet)') mealRatePerNight = 6500 * adults;
  if (mealPlan === 'Full Board (All Meals & Balti High Tea)') mealRatePerNight = 12000 * adults;

  const roomTotal = (selectedRoom ? selectedRoom.ratePerNight : 28000) * nightsCount;
  const mealPlanTotal = mealRatePerNight * nightsCount;
  const grossSubtotal = roomTotal + mealPlanTotal;

  let discountAmount = 0;
  if (discountValue > 0) {
    if (discountType === 'percent') {
      discountAmount = Math.round((grossSubtotal * Math.min(100, Math.max(0, discountValue))) / 100);
    } else {
      discountAmount = Math.min(grossSubtotal, Math.max(0, Math.round(discountValue)));
    }
  }
  const netSubtotal = Math.max(0, grossSubtotal - discountAmount);
  const taxAmount = Math.round(netSubtotal * hotelInfo.taxRate);
  const totalEstimated = netSubtotal + taxAmount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName || !selectedRoomId) return;

    const res = createReservation({
      guestName,
      guestEmail: guestEmail || `${guestName.toLowerCase().replace(/\s+/g, '.')}@guest.com`,
      guestPhone: guestPhone || '+92 300 0000000',
      guestCnicOrPassport: guestCnicOrPassport || `ID-${Math.floor(10000 + Math.random() * 90000)}`,
      cityOrCountry,
      roomId: selectedRoomId,
      checkInDate,
      checkOutDate,
      adults,
      children,
      mealPlan,
      paymentMethod,
      initialPayment: depositPaid,
      discountType,
      discountValue,
      discountReason: discountReason.trim() || undefined,
      specialRequests,
    });

    if (checkInImmediately) {
      checkInReservation(res.id);
    }

    setIsNewReservationModalOpen(false);
    setQuickCheckInRoom(null);
    setGuestName('');
    setGuestEmail('');
    setGuestPhone('');
    setGuestCnicOrPassport('');
    setDiscountValue(0);
    setDiscountReason('');
    setDepositPaid(0);
    setSpecialRequests('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 my-8 overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">
              New Guest Reservation ({hotelInfo.currency})
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {hotelInfo.name} · {hotelInfo.shortLocation}
            </p>
          </div>
          <button
            onClick={() => {
              setIsNewReservationModalOpen(false);
              setQuickCheckInRoom(null);
            }}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs max-h-[82vh] overflow-y-auto">
          <div className="space-y-3">
            <h4 className="font-semibold text-slate-900 dark:text-white pb-1 border-b border-slate-100 dark:border-slate-800">
              1. Guest Credentials & Identification
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="e.g. Zaheer Shigri"
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  CNIC / Passport Number *
                </label>
                <input
                  type="text"
                  required
                  value={guestCnicOrPassport}
                  onChange={(e) => setGuestCnicOrPassport(e.target.value)}
                  placeholder="e.g. 71101-1234567-1 or Passport"
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Mobile Number (WhatsApp)
                </label>
                <input
                  type="tel"
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  placeholder="+92 345 5901234"
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  City / Origin
                </label>
                <input
                  type="text"
                  value={cityOrCountry}
                  onChange={(e) => setCityOrCountry(e.target.value)}
                  placeholder="e.g. Islamabad, Lahore, Skardu, UK"
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-1">
            <h4 className="font-semibold text-slate-900 dark:text-white pb-1 border-b border-slate-100 dark:border-slate-800">
              2. Room Allocation, Dates & Meal Plan
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-3">
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Select Room Suite *
                </label>
                <select
                  value={selectedRoomId}
                  onChange={(e) => setSelectedRoomId(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none font-medium"
                >
                  {rooms.length === 0 ? (
                    <option value="">No rooms configured — add rooms first</option>
                  ) : (
                    rooms.map((r) => {
                      const isAvail = r.status === 'available';
                      return (
                        <option key={r.id} value={r.id}>
                          #{r.number} — {r.name} ({r.type} · {formatPrice(r.ratePerNight)}/nt) ·{' '}
                          {isAvail ? 'Available' : r.status.toUpperCase()}
                        </option>
                      );
                    })
                  )}
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Check-In Date
                </label>
                <input
                  type="date"
                  required
                  value={checkInDate}
                  onChange={(e) => setCheckInDate(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Check-Out Date
                </label>
                <input
                  type="date"
                  required
                  value={checkOutDate}
                  onChange={(e) => setCheckOutDate(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Dining Plan
                </label>
                <select
                  value={mealPlan}
                  onChange={(e) => setMealPlan(e.target.value as MealPlan)}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                >
                  <option value="Room Only">Room Only ({hotelInfo.currency} 0)</option>
                  <option value="Desi & Continental Breakfast">Breakfast (+2,500/guest)</option>
                  <option value="Half Board (Breakfast & Dinner Buffet)">Half Board (+6,500/guest)</option>
                  <option value="Full Board (All Meals & Balti High Tea)">Full Board (+12,000/guest)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Adults
                </label>
                <input
                  type="number"
                  min="1"
                  max="6"
                  value={adults}
                  onChange={(e) => setAdults(Number(e.target.value))}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Children
                </label>
                <input
                  type="number"
                  min="0"
                  max="4"
                  value={children}
                  onChange={(e) => setChildren(Number(e.target.value))}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Payment Channel
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                >
                  <option value="Raast / Bank Transfer">Raast / Bank Transfer</option>
                  <option value="EasyPaisa / JazzCash">EasyPaisa / JazzCash</option>
                  <option value="Credit / Debit Card">Credit / Debit Card</option>
                  <option value="Cash at Front Desk">Cash at Front Desk</option>
                  <option value="Corporate Account">Corporate Account</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Advance Paid ({hotelInfo.currency})
                </label>
                <input
                  type="number"
                  min="0"
                  step="500"
                  value={depositPaid}
                  onChange={(e) => setDepositPaid(Number(e.target.value))}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:outline-none"
                />
              </div>
            </div>

            {/* Guest Discount Controls */}
            <div className="p-3 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/70 dark:border-emerald-900/50 space-y-2">
              <div className="flex items-center gap-1.5 font-semibold text-emerald-800 dark:text-emerald-300">
                <Percent className="w-3.5 h-3.5" />
                <span>3. Courtesy / VIP / Seasonal Guest Discount (Optional)</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <select
                  value={discountType}
                  onChange={(e) => setDiscountType(e.target.value as DiscountType)}
                  className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                >
                  <option value="percent">Percentage (%)</option>
                  <option value="flat">Flat Amount ({hotelInfo.currency})</option>
                </select>
                <input
                  type="number"
                  min="0"
                  max={discountType === 'percent' ? 100 : grossSubtotal}
                  value={discountValue}
                  onChange={(e) => setDiscountValue(Math.max(0, Number(e.target.value)))}
                  placeholder={discountType === 'percent' ? 'e.g. 10 (%)' : `e.g. 5000 (${hotelInfo.currency})`}
                  className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:outline-none"
                />
                <input
                  type="text"
                  value={discountReason}
                  onChange={(e) => setDiscountReason(e.target.value)}
                  placeholder="Reason (e.g. VIP, Corporate, Off-season)"
                  className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Special Requests
              </label>
              <input
                type="text"
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                placeholder="e.g. Airport pickup, extra heater, river view..."
                className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
              />
            </div>
          </div>

          {/* Pricing Breakdown Card */}
          <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-1.5">
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
              <span>{nightsCount} Nights x {formatPrice(selectedRoom?.ratePerNight || 28000)} (Suite Lodging):</span>
              <span className="font-mono tabular-nums">{formatPrice(roomTotal)}</span>
            </div>
            {mealPlanTotal > 0 && (
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                <span>Meal Plan ({mealPlan}):</span>
                <span className="font-mono tabular-nums">{formatPrice(mealPlanTotal)}</span>
              </div>
            )}
            {discountAmount > 0 && (
              <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                <span>
                  Guest Discount ({discountType === 'percent' ? `${discountValue}%` : 'Flat'}
                  {discountReason ? ` · ${discountReason}` : ''}):
                </span>
                <span className="font-mono tabular-nums">-{formatPrice(discountAmount)}</span>
              </div>
            )}
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
              <span>{hotelInfo.taxLabel} ({Math.round(hotelInfo.taxRate * 100)}%):</span>
              <span className="font-mono tabular-nums">{formatPrice(taxAmount)}</span>
            </div>
            <div className="pt-1.5 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between font-bold text-slate-900 dark:text-white text-sm">
              <span>Total Estimated Folio:</span>
              <span className="font-mono tabular-nums text-base text-amber-600 dark:text-amber-400">
                {formatPrice(totalEstimated)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="checkInImmediately"
              checked={checkInImmediately}
              onChange={(e) => setCheckInImmediately(e.target.checked)}
              className="w-4 h-4 text-amber-600 rounded border-slate-300 focus:ring-amber-500"
            />
            <label htmlFor="checkInImmediately" className="text-slate-700 dark:text-slate-300 font-medium">
              Guest is present at front desk — Check-in immediately & hand over room keys
            </label>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setIsNewReservationModalOpen(false);
                setQuickCheckInRoom(null);
              }}
              className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={rooms.length === 0}
              className="px-5 py-2 bg-slate-900 dark:bg-amber-600 text-white font-semibold rounded-lg hover:bg-slate-800 dark:hover:bg-amber-500 shadow-sm disabled:opacity-50"
            >
              Confirm Booking & Issue Ref
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
