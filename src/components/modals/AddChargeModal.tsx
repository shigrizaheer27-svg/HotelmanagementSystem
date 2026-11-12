import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext';
import { ExtraCharge } from '../../types/hotel';
import { X, DollarSign, Utensils, Sparkles, Wine, Shirt, Car, Tag } from 'lucide-react';

export const AddChargeModal: React.FC = () => {
  const {
    isAddChargeModalOpen,
    setIsAddChargeModalOpen,
    reservationForCharge,
    setReservationForCharge,
    addExtraCharge,
  } = useHotel();

  const [category, setCategory] = useState<ExtraCharge['category']>('Room Service');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<number>(45.00);
  const [addedBy, setAddedBy] = useState('Front Desk Staff');

  if (!isAddChargeModalOpen || !reservationForCharge) return null;

  const res = reservationForCharge;

  const quickPresets = [
    { label: 'Artisan Breakfast Room Service', cat: 'Room Service', amt: 38 },
    { label: 'Kobe Wagyu Burger & Truffle Fries', cat: 'Room Service', amt: 48 },
    { label: 'Dom Pérignon Vintage Champagne', cat: 'Mini Bar', amt: 290 },
    { label: 'San Pellegrino & Evian Restock', cat: 'Mini Bar', amt: 24 },
    { label: 'Swedish Relaxation Massage (60 min)', cat: 'Spa & Wellness', amt: 160 },
    { label: 'Same-Day Silk Suit Pressing', cat: 'Laundry', amt: 45 },
    { label: 'Private Airport Chauffeur Transfer', cat: 'Airport Transfer', amt: 95 },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || amount <= 0) return;

    addExtraCharge(res.id, {
      description,
      category,
      amount: Number(amount),
      addedBy,
    });

    setIsAddChargeModalOpen(false);
    setReservationForCharge(null);
    setDescription('');
    setAmount(45);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">
              Post Incidentals / Room Charge
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Room #{res.roomNumber} · {res.guestName}
            </p>
          </div>
          <button
            onClick={() => {
              setIsAddChargeModalOpen(false);
              setReservationForCharge(null);
            }}
            className="text-slate-400 hover:text-slate-600 text-lg leading-none"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Presets */}
        <div>
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            Quick Presets
          </span>
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {quickPresets.slice(0, 4).map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => {
                  setDescription(p.label);
                  setCategory(p.cat as any);
                  setAmount(p.amt);
                }}
                className="px-2 py-1 text-[11px] rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
              >
                {p.label.split(' ')[0]} ${p.amt}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
            >
              <option value="Room Service">Room Service / F&B</option>
              <option value="Mini Bar">Mini Bar</option>
              <option value="Spa & Wellness">Spa & Wellness</option>
              <option value="Laundry">Laundry & Dry Cleaning</option>
              <option value="Airport Transfer">Airport Transfer</option>
              <option value="Other">Other Ancillary</option>
            </select>
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Item Description *
            </label>
            <input
              type="text"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. In-Suite Champagne Service"
              className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Charge Amount ($) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0.5"
                required
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Billed By Staff
              </label>
              <input
                type="text"
                value={addedBy}
                onChange={(e) => setAddedBy(e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setIsAddChargeModalOpen(false);
                setReservationForCharge(null);
              }}
              className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-slate-900 dark:bg-amber-600 text-white font-semibold rounded-lg hover:bg-slate-800 dark:hover:bg-amber-500 shadow-sm"
            >
              Post Charge to Folio
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
