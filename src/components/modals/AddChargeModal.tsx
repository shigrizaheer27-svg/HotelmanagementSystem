import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext';
import { formatPKR } from '../../data/mockData';
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

  const [category, setCategory] = useState<ExtraCharge['category']>('Balti & Desi Dining');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<number>(6500);
  const [addedBy, setAddedBy] = useState('Front Desk Staff');

  if (!isAddChargeModalOpen || !reservationForCharge) return null;

  const res = reservationForCharge;

  const quickPresets = [
    { label: 'Fresh Shigar River Trout Barbecue Dinner (2p)', cat: 'Bonfire & Trout BBQ', amt: 8500 },
    { label: 'Traditional Balti Mutton Karahi & Roghani Naan', cat: 'Balti & Desi Dining', amt: 6800 },
    { label: '4x4 Prado Safari to Sarfaranga Cold Desert', cat: 'Jeep Safari / Tour', amt: 24000 },
    { label: 'Skardu Airport (KDU) Luxury Return Transfer', cat: 'Skardu Airport Transfer', amt: 12000 },
    { label: 'Organic Shigar Valley Dried Apricots & Walnuts Box', cat: 'Minibar & Dry Fruits', amt: 4500 },
    { label: 'Evening Garden Pine Wood Bonfire Setup', cat: 'Bonfire & Trout BBQ', amt: 5000 },
    { label: 'Extra Room Geyser & Heated Radiator Logs', cat: 'Laundry & Heating', amt: 3000 },
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
    setAmount(6500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">
              Post Room Charge (PKR)
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

        {/* Quick Presets for Mashakala Resort Shigar */}
        <div>
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            Shigar Resort Presets
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
                {p.label.split(' ')[0]} {formatPKR(p.amt)}
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
              <option value="Balti & Desi Dining">Balti & Desi Kitchen Dining</option>
              <option value="Bonfire & Trout BBQ">Bonfire & River Trout BBQ</option>
              <option value="Jeep Safari / Tour">4x4 Jeep Safari (Sarfaranga / Deosai)</option>
              <option value="Skardu Airport Transfer">Skardu Airport Transfer (KDU)</option>
              <option value="Minibar & Dry Fruits">Organic Dry Fruits & Minibar</option>
              <option value="Laundry & Heating">Laundry, Heating & Blankets</option>
              <option value="Other">Other Resort Incidentals</option>
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
              placeholder="e.g. Shigar River Trout Dinner for 2 Guests"
              className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Charge Amount (PKR) *
              </label>
              <input
                type="number"
                step="100"
                min="100"
                required
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Posted By
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
              Post Charge ({formatPKR(amount)})
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
