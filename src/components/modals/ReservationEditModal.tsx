import React, { useState, useEffect } from 'react';
import { useHotel } from '../../context/HotelContext';
import { Reservation, MealPlan } from '../../types/hotel';
import { X, Trash2, Calendar, DollarSign, Shield } from 'lucide-react';

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
    });

    setIsReservationEditModalOpen(false);
    setReservationToEdit(null);
  };

  const handleDelete = () => {
    if (!isAdmin) {
      alert('Only Administrator can delete booking records.');
      return;
    }
    if (confirm(`Permanently delete booking ${reservationToEdit.bookingRef} for ${reservationToEdit.guestName}? This will purge all associated financial ledger items.`)) {
      deleteReservation(reservationToEdit.id);
      setIsReservationEditModalOpen(false);
      setReservationToEdit(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">
                Modify Booking {reservationToEdit.bookingRef}
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400">
                ADMIN ACCESS
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Room #{reservationToEdit.roomNumber} ({reservationToEdit.roomType})
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
                Nightly Rate (PKR)
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
                Amount Paid to Date (PKR)
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
            ) : <div />}

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
