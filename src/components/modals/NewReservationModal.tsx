import React, { useState, useEffect } from 'react';
import { useHotel } from '../../context/HotelContext';
import { MealPlan, Room } from '../../types/hotel';
import { X, Calendar, DollarSign, Bed, Users, Shield, Check } from 'lucide-react';

export const NewReservationModal: React.FC = () => {
  const {
    rooms,
    hotelInfo,
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
  const [guestPassport, setGuestPassport] = useState('');
  const [nationality, setNationality] = useState('United States');
  const [selectedRoomId, setSelectedRoomId] = useState('');
  const [checkInDate, setCheckInDate] = useState(currentDate);
  const [checkOutDate, setCheckOutDate] = useState(() => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  });
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [mealPlan, setMealPlan] = useState<MealPlan>('Bed & Breakfast');
  const [paymentMethod, setPaymentMethod] = useState<'Credit Card' | 'Cash' | 'Bank Transfer' | 'Corporate Account'>('Credit Card');
  const [depositPaid, setDepositPaid] = useState<number>(0);
  const [specialRequests, setSpecialRequests] = useState('');
  const [checkInImmediately, setCheckInImmediately] = useState(false);

  // Set default room or quick check in room
  useEffect(() => {
    if (quickCheckInRoom) {
      setSelectedRoomId(quickCheckInRoom.id);
    } else if (rooms.length > 0 && !selectedRoomId) {
      const firstAvail = rooms.find((r) => r.status === 'available') || rooms[0];
      setSelectedRoomId(firstAvail.id);
    }
  }, [quickCheckInRoom, rooms]);

  if (!isNewReservationModalOpen) return null;

  const selectedRoom = rooms.find((r) => r.id === selectedRoomId);

  // Calculate pricing
  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);
  const nightsCount = Math.max(1, Math.ceil(Math.max(0, checkOut.getTime() - checkIn.getTime()) / (1000 * 3600 * 24)));

  let mealRatePerNight = 0;
  if (mealPlan === 'Bed & Breakfast') mealRatePerNight = 30 * adults;
  if (mealPlan === 'Half Board') mealRatePerNight = 70 * adults;
  if (mealPlan === 'All Inclusive') mealRatePerNight = 140 * adults;

  const roomTotal = (selectedRoom ? selectedRoom.ratePerNight : 240) * nightsCount;
  const mealPlanTotal = mealRatePerNight * nightsCount;
  const subtotal = roomTotal + mealPlanTotal;
  const taxAmount = Math.round(subtotal * hotelInfo.taxRate * 100) / 100;
  const totalEstimated = Math.round((subtotal + taxAmount) * 100) / 100;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName || !selectedRoomId) return;

    const res = createReservation({
      guestName,
      guestEmail: guestEmail || `${guestName.toLowerCase().replace(/\s+/g, '.')}@guest.com`,
      guestPhone: guestPhone || '+1 (555) 000-0000',
      guestPassport: guestPassport || `P${Math.floor(1000000 + Math.random() * 9000000)}`,
      nationality,
      roomId: selectedRoomId,
      checkInDate,
      checkOutDate,
      adults,
      children,
      mealPlan,
      paymentMethod,
      initialPayment: depositPaid,
      specialRequests,
    });

    if (checkInImmediately) {
      checkInReservation(res.id);
    }

    // Reset & Close
    setIsNewReservationModalOpen(false);
    setQuickCheckInRoom(null);
    setGuestName('');
    setGuestEmail('');
    setGuestPhone('');
    setSpecialRequests('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 my-8 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">
              Create New Guest Reservation
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {hotelInfo.name} · Real-time room allocation & billing setup
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Section 1: Guest Information */}
          <div className="space-y-3">
            <h4 className="font-semibold text-slate-900 dark:text-white pb-1 border-b border-slate-100 dark:border-slate-800">
              1. Guest Particulars
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
                  placeholder="e.g. Katherine Reynolds"
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  placeholder="katherine@example.com"
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  placeholder="+1 (555) 392-1092"
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Passport / ID Number
                </label>
                <input
                  type="text"
                  value={guestPassport}
                  onChange={(e) => setGuestPassport(e.target.value)}
                  placeholder="US9832011"
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Room & Stay Dates */}
          <div className="space-y-3 pt-2">
            <h4 className="font-semibold text-slate-900 dark:text-white pb-1 border-b border-slate-100 dark:border-slate-800">
              2. Suite Selection & Stay Dates
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-3">
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Assign Room Suite *
                </label>
                <select
                  value={selectedRoomId}
                  onChange={(e) => setSelectedRoomId(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                >
                  {rooms.map((r) => {
                    const isAvail = r.status === 'available';
                    return (
                      <option key={r.id} value={r.id}>
                        Room #{r.number} — {r.type} (${r.ratePerNight}/nt, {r.bedType}) · {isAvail ? 'Available' : `(${r.status.toUpperCase()})`}
                      </option>
                    );
                  })}
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
                  Meal Plan
                </label>
                <select
                  value={mealPlan}
                  onChange={(e) => setMealPlan(e.target.value as MealPlan)}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                >
                  <option value="Room Only">Room Only ($0)</option>
                  <option value="Bed & Breakfast">Bed & Breakfast (+$30/guest)</option>
                  <option value="Half Board">Half Board (+$70/guest)</option>
                  <option value="All Inclusive">All Inclusive (+$140/guest)</option>
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
                  Payment Method
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                >
                  <option value="Credit Card">Credit Card</option>
                  <option value="Cash">Cash</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Corporate Account">Corporate Account</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Deposit Paid ($)
                </label>
                <input
                  type="number"
                  min="0"
                  value={depositPaid}
                  onChange={(e) => setDepositPaid(Number(e.target.value))}
                  placeholder="0"
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Special Requests / VIP Amenities
              </label>
              <input
                type="text"
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                placeholder="e.g. Late check-in, feather-free pillows, airport transfer, champagne..."
                className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
              />
            </div>
          </div>

          {/* Pricing Breakdown Card */}
          <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-1.5">
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
              <span>{nightsCount} Nights x ${selectedRoom?.ratePerNight || 240} (Room Lodging):</span>
              <span className="font-mono tabular-nums">${roomTotal.toFixed(2)}</span>
            </div>
            {mealPlanTotal > 0 && (
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                <span>Meal Plan ({mealPlan}):</span>
                <span className="font-mono tabular-nums">${mealPlanTotal.toFixed(2)}</span>
              </div>
            )}
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
              <span>Occupancy & Resort Tax (10%):</span>
              <span className="font-mono tabular-nums">${taxAmount.toFixed(2)}</span>
            </div>
            <div className="pt-1.5 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between font-bold text-slate-900 dark:text-white text-sm">
              <span>Total Estimated Folio:</span>
              <span className="font-mono tabular-nums text-base">${totalEstimated.toFixed(2)}</span>
            </div>
          </div>

          {/* Quick Check-in Checkbox */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="checkInImmediately"
              checked={checkInImmediately}
              onChange={(e) => setCheckInImmediately(e.target.checked)}
              className="w-4 h-4 text-amber-600 rounded border-slate-300 focus:ring-amber-500"
            />
            <label htmlFor="checkInImmediately" className="text-slate-700 dark:text-slate-300 font-medium">
              Guest is already present at front desk — Check in immediately & mark room occupied
            </label>
          </div>

          {/* Buttons */}
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
              className="px-5 py-2 bg-slate-900 dark:bg-amber-600 text-white font-semibold rounded-lg hover:bg-slate-800 dark:hover:bg-amber-500 shadow-sm"
            >
              Confirm Reservation & Book Room
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
