import React, { useState, useEffect } from 'react';
import { useHotel } from '../../context/HotelContext';
import { MealPlan, DiscountType } from '../../types/hotel';
import { X, Trash2, Percent } from 'lucide-react';

export const ReservationEditModal: React.FC = () => {
  const {
    reservationToEdit,
    setReservationToEdit,
    isReservationEditModalOpen,
    setIsReservationEditModalOpen,
    updateReservationDetails,
    deleteReservation,
    isAdmin,
    hotelInfo,
  } = useHotel();

  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestCnicOrPassport, setGuestCnicOrPassport] = useState('');
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [nightlyRate, setNightlyRate] = useState<number>(28000);
  const [mealPlan, setMealPlan] = useState<MealPlan>('Desi & Continental Breakfast');
  const [paidAmount, setPaidAmount] = useState<number>(0);
  const [discountType, setDiscountType] = useState<DiscountType>('flat');
  const [discountValue, setDiscountValue] = useState<number>(0);
  const [discountReason, setDiscountReason] = useState('');

  useEffect(() => {
    if (reservationToEdit) {
      setGuestName(reservationToEdit.guestName);
      setGuestPhone(reservationToEdit.guestPhone);
      setGuestCnicOrPassport(reservationToEdit.guestCnicOrPassport);
      setCheckInDate(reservationToEdit.checkInDate);
      setCheckOutDate(reservationToEdit.checkOutDate);
      setNightlyRate(reservationToEdit.nightlyRate);
      setMealPlan(reservationToEdit.mealPlan);
      setPaidAmount(reservationToEdit.paidAmount);
      setDiscountType(reservationToEdit.discountType || 'flat');
      setDiscountValue(reservationToEdit.discountValue || 0);
      setDiscountReason(reservationToEdit.discountReason || '');
    }
  }, [reservationToEdit]);

  if (!isReservationEditModalOpen || !reservationToEdit) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const nightsCount = Math.max(1, Math.ceil(Math.max(0, checkOut.getTime() - checkIn.getTime()) / (1000 * 3600 * 24)));

    updateReservationDetails(reservationToEdit.id, {
      guestName,
      guestPhone,
      guestCnicOrPassport,
      checkInDate,
      checkOutDate,
      nightsCount,
      nightlyRate: Number(nightlyRate),
      mealPlan,
      paidAmount: Number(paidAmount),
      discountType,
      discountValue: Number(discountValue),
      discountReason: discountReason.trim() || undefined,
    });

    setIsReservationEditModalOpen(false);
    setReservationToEdit(null);
  };

  const handleDelete = () => {
    if (!isAdmin) {
      alert('Only Administrator can delete booking records.');
      return;
    }
    if (confirm(`Permanently delete booking ${reservationToEdit.bookingRef} for ${reservationToEdit.guestName}?`)) {
      deleteReservation(reservationToEdit.id);
      setIsReservationEditModalOpen(false);
      setReservationToEdit(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 my-8">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">
              Modify Booking {reservationToEdit.bookingRef}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Room #{reservationToEdit.roomNumber} {reservationToEdit.roomName ? `· ${reservationToEdit.roomName}` : ''} ({reservationToEdit.roomType})
            </p>
          </div>
          <button
            onClick={() => {
              setIsReservationEditModalOpen(false);
              setReservationToEdit(null);
            }}
            className="text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Guest Name
              </label>
              <input
                type="text"
                required
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
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
                className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              CNIC / Passport Number
            </label>
            <input
              type="text"
              value={guestCnicOrPassport}
              onChange={(e) => setGuestCnicOrPassport(e.target.value)}
              className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
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
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Nightly Rate ({hotelInfo.currency})
              </label>
              <input
                type="number"
                min="0"
                step="500"
                value={nightlyRate}
                onChange={(e) => setNightlyRate(Number(e.target.value))}
                className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Amount Paid ({hotelInfo.currency})
              </label>
              <input
                type="number"
                min="0"
                value={paidAmount}
                onChange={(e) => setPaidAmount(Number(e.target.value))}
                className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:outline-none"
              />
            </div>
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
              <option value="Room Only">Room Only</option>
              <option value="Desi & Continental Breakfast">Desi & Continental Breakfast</option>
              <option value="Half Board (Breakfast & Dinner Buffet)">Half Board (Breakfast & Dinner Buffet)</option>
              <option value="Full Board (All Meals & Balti High Tea)">Full Board (All Meals & Balti High Tea)</option>
            </select>
          </div>

          {/* Discount Control */}
          <div className="p-3 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/70 dark:border-emerald-900/50 space-y-2">
            <div className="flex items-center gap-1.5 font-semibold text-emerald-800 dark:text-emerald-300">
              <Percent className="w-3.5 h-3.5" />
              <span>Guest Discount Adjustment</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value as DiscountType)}
                className="p-2 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="percent">% Percent</option>
                <option value="flat">Flat ({hotelInfo.currency})</option>
              </select>
              <input
                type="number"
                min="0"
                value={discountValue}
                onChange={(e) => setDiscountValue(Math.max(0, Number(e.target.value)))}
                className="p-2 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
              />
              <input
                type="text"
                value={discountReason}
                onChange={(e) => setDiscountReason(e.target.value)}
                placeholder="Reason (e.g. VIP)"
                className="p-2 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            {isAdmin ? (
              <button
                type="button"
                onClick={handleDelete}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Booking</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsReservationEditModalOpen(false);
                  setReservationToEdit(null);
                }}
                className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-slate-900 dark:bg-amber-600 text-white font-semibold rounded-lg hover:bg-slate-800 dark:hover:bg-amber-500 shadow-sm"
              >
                Update Booking
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
