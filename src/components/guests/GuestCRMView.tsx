import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext';
import { GuestProfile } from '../../types/hotel';
import { Search, Crown, Mail, Phone, Star } from 'lucide-react';

export const GuestCRMView: React.FC = () => {
  const { guests, reservations, setSelectedReservationForFolio, hotelInfo, formatPrice } = useHotel();
  const [searchQuery, setSearchQuery] = useState('');
  const [vipFilter, setVipFilter] = useState<string>('all');

  const filteredGuests = guests.filter((g) => {
    if (vipFilter !== 'all' && g.vipStatus !== vipFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        g.name.toLowerCase().includes(q) ||
        g.email.toLowerCase().includes(q) ||
        g.cnicOrPassport.toLowerCase().includes(q) ||
        g.cityOrCountry.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getVipBadge = (vip: GuestProfile['vipStatus']) => {
    switch (vip) {
      case 'Platinum VIP':
        return (
          <span className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
            <Crown className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> Platinum VIP
          </span>
        );
      case 'Gold':
        return (
          <span className="text-xs font-semibold text-amber-500 flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> Gold VIP
          </span>
        );
      case 'Silver':
        return <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">Silver</span>;
      default:
        return <span className="text-xs text-slate-400">Standard</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white font-display">
            Guest CRM & Loyalty Directory ({hotelInfo.currency})
          </h2>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            <span>{guests.length} Guest Profiles</span>
            <span aria-hidden="true">·</span>
            <span>CNIC & Passport verification</span>
            <span aria-hidden="true">·</span>
            <span>{hotelInfo.name}</span>
          </div>
        </div>
      </div>

      <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1 overflow-x-auto">
          {['all', 'Platinum VIP', 'Gold', 'Silver', 'Standard'].map((tier) => (
            <button
              key={tier}
              onClick={() => setVipFilter(tier)}
              className={`px-3 py-1.5 text-xs rounded-md font-medium whitespace-nowrap transition-colors ${
                vipFilter === tier
                  ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {tier === 'all' ? 'All Tiers' : tier}
            </button>
          ))}
        </div>

        <div className="relative min-w-[260px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, CNIC, city..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
          />
        </div>
      </div>

      {filteredGuests.length === 0 ? (
        <div className="p-8 text-center text-xs text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          No guest profiles recorded for {hotelInfo.name} yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredGuests.map((guest) => {
            const guestReservations = reservations.filter(
              (r) =>
                r.guestEmail.toLowerCase() === guest.email.toLowerCase() ||
                r.guestName.toLowerCase() === guest.name.toLowerCase()
            );

            return (
              <div
                key={guest.id}
                className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">
                        {guest.name}
                      </h3>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {guest.cityOrCountry} · ID: <span className="font-mono">{guest.cnicOrPassport}</span>
                      </div>
                    </div>
                    {getVipBadge(guest.vipStatus)}
                  </div>

                  <div className="mt-3.5 space-y-1.5 text-xs text-slate-600 dark:text-slate-300 pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate">{guest.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-mono">{guest.phone}</span>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                      <div className="text-[11px] text-slate-400">Total Stays</div>
                      <div className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                        {guest.totalStays} {guest.totalStays === 1 ? 'Stay' : 'Stays'}
                      </div>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                      <div className="text-[11px] text-slate-400">Lifetime Spend</div>
                      <div className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-xs truncate tabular-nums">
                        {formatPrice(guest.totalSpend)}
                      </div>
                    </div>
                  </div>

                  {guest.preferences && (
                    <div className="mt-3 p-2.5 rounded-lg bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 text-xs">
                      <span className="font-semibold text-amber-800 dark:text-amber-300">
                        Preferences:
                      </span>
                      <p className="text-amber-900/90 dark:text-amber-200/90 text-[11px] mt-0.5 leading-relaxed">
                        {guest.preferences}
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    Last Stay: <span className="font-mono">{guest.lastStayDate}</span>
                  </span>

                  {guestReservations.length > 0 && (
                    <button
                      onClick={() => setSelectedReservationForFolio(guestReservations[0])}
                      className="text-xs font-medium text-amber-600 dark:text-amber-400 hover:underline"
                    >
                      View Latest Folio
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
