import React, { useState, useMemo } from 'react';
import { useHotel } from '../../context/HotelContext';
import {
  Shield,
  Building2,
  Plus,
  KeyRound,
  UserCheck,
  BedDouble,
  CalendarCheck,
  Eye,
  EyeOff,
  Trash2,
  ArrowUpRight,
  CheckCircle2,
  Edit2,
  X,
  Check,
  MapPin,
  Lock,
  UserPlus,
} from 'lucide-react';

interface MasterAdminPanelProps {
  setActiveTab: (tab: string) => void;
}

export const MasterAdminPanel: React.FC<MasterAdminPanelProps> = ({ setActiveTab }) => {
  const {
    properties,
    activePropertyId,
    switchProperty,
    addProperty,
    deleteProperty,
    systemUsers,
    addSystemUser,
    updateSystemUser,
    isMasterAdmin,
  } = useHotel();

  const suggestNextCode = useMemo(() => {
    let num = 101 + properties.length;
    while (properties.some((p) => p.hotelCode.toUpperCase() === `HTL-${num}`)) {
      num += 1;
    }
    return `HTL-${num}`;
  }, [properties]);

  const [hotelCode, setHotelCode] = useState(suggestNextCode);
  const [name, setName] = useState('');
  const [shortLocation, setShortLocation] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [currency, setCurrency] = useState('PKR');
  const [currencySymbol, setCurrencySymbol] = useState('Rs.');
  const [taxLabel, setTaxLabel] = useState('Provincial GST & Levy');
  const [taxRatePct, setTaxRatePct] = useState(13);
  const [seedStarterRooms, setSeedStarterRooms] = useState(true);

  const [adminName, setAdminName] = useState('');
  const [adminUsername, setAdminUsername] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(true);

  const [formError, setFormError] = useState('');
  const [createdBanner, setCreatedBanner] = useState<{
    hotelCode: string;
    hotelName: string;
    username: string;
    password: string;
  } | null>(null);

  const [revealedPasswords, setRevealedPasswords] = useState<Record<string, boolean>>({});
  const [editingAdminId, setEditingAdminId] = useState<string | null>(null);
  const [editUsername, setEditUsername] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editAdminName, setEditAdminName] = useState('');

  // Quick add admin modal/inline for a hotel missing an admin
  const [assigningPropId, setAssigningPropId] = useState<string | null>(null);
  const [quickAdminName, setQuickAdminName] = useState('');
  const [quickAdminUsername, setQuickAdminUsername] = useState('');
  const [quickAdminPassword, setQuickAdminPassword] = useState('');
  const [quickAdminError, setQuickAdminError] = useState('');

  if (!isMasterAdmin) {
    return (
      <div className="p-8 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-2">
        <Shield className="w-8 h-8 text-red-500 mx-auto" />
        <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">
          Master Administrator Access Required
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          This SaaS control panel is restricted to the platform Master Administrator.
        </p>
      </div>
    );
  }

  const currencyPresets = [
    { code: 'PKR', symbol: 'Rs.' },
    { code: 'USD', symbol: '$' },
    { code: 'EUR', symbol: '€' },
    { code: 'GBP', symbol: '£' },
    { code: 'AED', symbol: 'AED' },
    { code: 'SAR', symbol: 'SAR' },
  ];

  const totalRoomsPlatform = properties.reduce((sum, p) => sum + p.rooms.length, 0);
  const totalActiveBookingsPlatform = properties.reduce(
    (sum, p) => sum + p.reservations.filter((r) => r.status !== 'cancelled').length,
    0
  );
  const hotelAdminsCount = systemUsers.filter((u) => u.role === 'admin' && u.isActive).length;

  const handleCreateHotelAndAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setCreatedBanner(null);

    if (!hotelCode.trim() || !name.trim() || !shortLocation.trim()) {
      setFormError('Hotel ID, Hotel/Resort Name, and Location are required.');
      return;
    }
    if (!adminUsername.trim() || !adminPassword) {
      setFormError('Hotel Admin Username and Password are required.');
      return;
    }

    const res = addProperty({
      hotelCode: hotelCode.trim().toUpperCase(),
      name: name.trim(),
      tagline: 'Hospitality & Resort Operations',
      shortLocation: shortLocation.trim(),
      address: address.trim() || shortLocation.trim(),
      phone: phone.trim() || '+92 300 0000000',
      mobile: phone.trim() || '+92 300 0000000',
      email: `desk@${hotelCode.trim().toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
      website: `www.${hotelCode.trim().toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
      currency,
      currencySymbol,
      taxLabel: taxLabel.trim() || 'GST',
      taxRate: Math.max(0, Number(taxRatePct)) / 100,
      ntn: 'NTN-PENDING',
      registrationNo: 'REG-PENDING',
      seedStarterRooms,
      adminName: adminName.trim() || `${name.trim()} Admin`,
      adminUsername: adminUsername.trim(),
      adminEmail: adminEmail.trim(),
      adminPassword,
    });

    if (res.error || !res.property) {
      setFormError(res.error || 'Could not create hotel.');
      return;
    }

    setCreatedBanner({
      hotelCode: res.property.hotelCode,
      hotelName: res.property.hotelInfo.name,
      username: adminUsername.trim(),
      password: adminPassword,
    });

    const nextNum = 101 + properties.length + 1;
    setHotelCode(`HTL-${nextNum}`);
    setName('');
    setShortLocation('');
    setAddress('');
    setPhone('');
    setAdminName('');
    setAdminUsername('');
    setAdminEmail('');
    setAdminPassword('');
  };

  const handleQuickAssignAdmin = (propId: string, propCode: string, propName: string) => {
    setQuickAdminError('');
    if (!quickAdminUsername.trim() || !quickAdminPassword) {
      setQuickAdminError('Username and password are required.');
      return;
    }
    const res = addSystemUser({
      name: quickAdminName.trim() || `${propName} Admin`,
      username: quickAdminUsername.trim(),
      email: `${quickAdminUsername.trim().toLowerCase()}@${propCode.toLowerCase()}.pms`,
      password: quickAdminPassword,
      role: 'admin',
      designation: `Hotel Administrator (${propCode})`,
      assignedPropertyId: propId,
    });
    if (res.error) {
      setQuickAdminError(res.error);
      return;
    }
    setAssigningPropId(null);
    setQuickAdminName('');
    setQuickAdminUsername('');
    setQuickAdminPassword('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            <Shield className="w-4 h-4" />
            <span>Master Administrator Control Panel</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white font-display mt-0.5">
            Hotels, Resorts &amp; Hotel Admin Provisioning
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Create unique Hotel IDs and issue dedicated Admin username &amp; password credentials for each client property
          </p>
        </div>
      </div>

      {/* Platform KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Registered Hotels</span>
            <Building2 className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white mt-2">
            {properties.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Isolated property tenants</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Active Hotel Admins</span>
            <UserCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white mt-2">
            {hotelAdminsCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Scoped strictly to own hotel</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Platform Suites</span>
            <BedDouble className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white mt-2">
            {totalRoomsPlatform}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Across all client resorts</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Active Reservations</span>
            <CalendarCheck className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white mt-2">
            {totalActiveBookingsPlatform}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Platform-wide live folios</div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left: Create Hotel ID + Hotel Admin Credentials */}
        <div className="xl:col-span-5">
          <form
            onSubmit={handleCreateHotelAndAdmin}
            className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-4 text-xs"
          >
            <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white font-display flex items-center gap-2">
                <Plus className="w-4 h-4 text-amber-500" />
                <span>Register New Hotel &amp; Create Hotel Admin</span>
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Assign a unique Hotel ID and issue login credentials for the property&apos;s Admin
              </p>
            </div>

            {formError && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-300 font-medium">
                {formError}
              </div>
            )}

            {createdBanner && (
              <div className="p-3.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Hotel Created &amp; Admin Provisioned</span>
                </div>
                <div className="text-[11px] leading-relaxed">
                  Share these credentials with the Hotel Admin of <strong>{createdBanner.hotelName}</strong>:
                </div>
                <div className="p-2 rounded bg-white/80 dark:bg-slate-900/80 border border-emerald-200/70 dark:border-emerald-800/70 font-mono text-[11px] space-y-0.5">
                  <div>Hotel ID: <span className="font-bold">{createdBanner.hotelCode}</span></div>
                  <div>Username: <span className="font-bold">{createdBanner.username}</span></div>
                  <div>Password: <span className="font-bold">{createdBanner.password}</span></div>
                </div>
              </div>
            )}

            {/* Hotel Details */}
            <div className="space-y-3">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                1. Hotel / Resort Identity
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Hotel ID *
                  </label>
                  <input
                    type="text"
                    required
                    value={hotelCode}
                    onChange={(e) => setHotelCode(e.target.value.toUpperCase())}
                    placeholder="HTL-102"
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold uppercase focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Hotel / Resort Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Hunza Serenity Resort"
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    City / Valley *
                  </label>
                  <input
                    type="text"
                    required
                    value={shortLocation}
                    onChange={(e) => setShortLocation(e.target.value)}
                    placeholder="e.g. Karimabad, Hunza"
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Phone / WhatsApp
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+92 300 0000000"
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Full Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street, District, Region"
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Currency
                  </label>
                  <select
                    value={currency}
                    onChange={(e) => {
                      const preset = currencyPresets.find((c) => c.code === e.target.value);
                      setCurrency(e.target.value);
                      if (preset) setCurrencySymbol(preset.symbol);
                    }}
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:outline-none"
                  >
                    {currencyPresets.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.code}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Tax Label
                  </label>
                  <input
                    type="text"
                    value={taxLabel}
                    onChange={(e) => setTaxLabel(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Tax (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.5"
                    value={taxRatePct}
                    onChange={(e) => setTaxRatePct(Number(e.target.value))}
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Hotel Admin Credentials */}
            <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5" />
                <span>2. Hotel Admin Login Credentials (Scoped to This Hotel)</span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Admin Full Name
                  </label>
                  <input
                    type="text"
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                    placeholder="e.g. Karimullah Baig"
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Admin Email (Optional)
                  </label>
                  <input
                    type="email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    placeholder="admin@hotel.pk"
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Admin Username *
                  </label>
                  <input
                    type="text"
                    required
                    value={adminUsername}
                    onChange={(e) => setAdminUsername(e.target.value)}
                    placeholder="e.g. hunza_admin"
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Admin Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      required
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="Set strong password"
                      className="w-full p-2 pr-8 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword((p) => !p)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showNewPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="masterSeedRooms"
                checked={seedStarterRooms}
                onChange={(e) => setSeedStarterRooms(e.target.checked)}
                className="w-4 h-4 text-amber-600 rounded border-slate-300"
              />
              <label htmlFor="masterSeedRooms" className="text-slate-700 dark:text-slate-300">
                Initialize with 4 starter suites &amp; default room categories
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-amber-600 dark:hover:bg-amber-500 text-white font-semibold rounded-lg shadow-sm flex items-center justify-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Create Hotel ID &amp; Admin Account</span>
            </button>
          </form>
        </div>

        {/* Right: Directory of All Hotels & Their Admin Credentials */}
        <div className="xl:col-span-7 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
            <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white font-display">
                  Registered Hotels &amp; Assigned Hotel Admins ({properties.length})
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Each Hotel Admin can access and manage only their assigned hotel, rooms, and managers
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {properties.map((prop) => {
                const isActive = prop.id === activePropertyId;
                const hotelAdmins = systemUsers.filter(
                  (u) => u.role === 'admin' && u.assignedPropertyId === prop.id
                );
                const hotelManagersCount = systemUsers.filter(
                  (u) => u.role === 'manager' && u.assignedPropertyId === prop.id
                ).length;
                const occupiedRooms = prop.rooms.filter((r) => r.status === 'occupied').length;
                const activeBookings = prop.reservations.filter((r) => r.status !== 'cancelled').length;

                return (
                  <div
                    key={prop.id}
                    className={`p-4 rounded-xl border transition-all space-y-3 ${
                      isActive
                        ? 'border-amber-500 bg-amber-50/30 dark:bg-amber-950/15 ring-1 ring-amber-500/30'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30'
                    }`}
                  >
                    {/* Top row: Hotel ID, Name, Actions */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400">
                            {prop.hotelCode}
                          </span>
                          <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>
                          <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                            {prop.hotelInfo.name}
                          </h3>
                          {isActive && (
                            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                              · Active Workspace
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {prop.hotelInfo.shortLocation}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono">{prop.hotelInfo.currency}</span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono tabular-nums">
                            {prop.rooms.length} Rooms ({occupiedRooms} Occ.)
                          </span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono tabular-nums">{activeBookings} Bookings</span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono tabular-nums">{hotelManagersCount} Managers</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            switchProperty(prop.id);
                            setActiveTab('overview');
                          }}
                          className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-amber-600 dark:hover:bg-amber-500 rounded-lg transition-colors whitespace-nowrap"
                        >
                          <span>Open Hotel PMS</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>

                        {properties.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              if (
                                confirm(
                                  `Delete "${prop.hotelInfo.name}" (${prop.hotelCode}) and all its scoped admin/manager accounts?`
                                )
                              ) {
                                deleteProperty(prop.id);
                              }
                            }}
                            title="Delete Hotel"
                            className="p-1.5 text-slate-400 hover:text-red-600 rounded transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Assigned Hotel Admin(s) Credentials Block */}
                    <div className="pt-2.5 border-t border-slate-200/70 dark:border-slate-700/70 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                          <Lock className="w-3 h-3 text-amber-500" />
                          <span>Hotel Admin Credentials</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setAssigningPropId(assigningPropId === prop.id ? null : prop.id);
                            setQuickAdminError('');
                          }}
                          className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
                        >
                          <UserPlus className="w-3 h-3" />
                          <span>+ Add Hotel Admin</span>
                        </button>
                      </div>

                      {hotelAdmins.length === 0 ? (
                        <div className="text-xs text-slate-500 dark:text-slate-400 italic">
                          No Hotel Admin assigned yet. Click &quot;+ Add Hotel Admin&quot; to issue credentials.
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {hotelAdmins.map((admin) => {
                            const isRevealed = !!revealedPasswords[admin.id];
                            const isEditing = editingAdminId === admin.id;

                            return (
                              <div
                                key={admin.id}
                                className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
                              >
                                {isEditing ? (
                                  <div className="space-y-2">
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                      <input
                                        type="text"
                                        value={editAdminName}
                                        onChange={(e) => setEditAdminName(e.target.value)}
                                        placeholder="Admin Name"
                                        className="p-1.5 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                                      />
                                      <input
                                        type="text"
                                        value={editUsername}
                                        onChange={(e) => setEditUsername(e.target.value)}
                                        placeholder="Username"
                                        className="p-1.5 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                                      />
                                      <input
                                        type="text"
                                        value={editPassword}
                                        onChange={(e) => setEditPassword(e.target.value)}
                                        placeholder="Password"
                                        className="p-1.5 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                                      />
                                    </div>
                                    <div className="flex items-center justify-end gap-2">
                                      <button
                                        type="button"
                                        onClick={() =>
                                          updateSystemUser(admin.id, { isActive: !admin.isActive })
                                        }
                                        className="px-2.5 py-1 rounded border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                                      >
                                        {admin.isActive ? 'Deactivate' : 'Activate'}
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => setEditingAdminId(null)}
                                        className="px-2 py-1 text-slate-500 flex items-center gap-1"
                                      >
                                        <X className="w-3 h-3" /> Cancel
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          updateSystemUser(admin.id, {
                                            name: editAdminName.trim() || admin.name,
                                            username: editUsername.trim() || admin.username,
                                            password: editPassword || admin.password,
                                          });
                                          setEditingAdminId(null);
                                        }}
                                        className="px-2.5 py-1 rounded bg-slate-900 dark:bg-amber-600 text-white font-semibold flex items-center gap-1"
                                      >
                                        <Check className="w-3 h-3" /> Save
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                    <div className="min-w-0">
                                      <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                        <span>{admin.name}</span>
                                        <span
                                          className={`text-[10px] font-mono uppercase ${
                                            admin.isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'
                                          }`}
                                        >
                                          · {admin.isActive ? 'Active' : 'Suspended'}
                                        </span>
                                      </div>
                                      <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-2 mt-0.5">
                                        <span>User: <strong className="text-slate-800 dark:text-slate-200">{admin.username}</strong></span>
                                        <span aria-hidden="true">·</span>
                                        <span>
                                          Pass:{' '}
                                          <strong className="text-slate-800 dark:text-slate-200">
                                            {isRevealed ? admin.password : '••••••••'}
                                          </strong>
                                        </span>
                                        <span aria-hidden="true">·</span>
                                        <span className="truncate">{admin.email}</span>
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-1 shrink-0">
                                      <button
                                        type="button"
                                        onClick={() =>
                                          setRevealedPasswords((prev) => ({
                                            ...prev,
                                            [admin.id]: !prev[admin.id],
                                          }))
                                        }
                                        title={isRevealed ? 'Hide Password' : 'Show Password'}
                                        className="p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-white rounded"
                                      >
                                        {isRevealed ? (
                                          <EyeOff className="w-3.5 h-3.5" />
                                        ) : (
                                          <Eye className="w-3.5 h-3.5" />
                                        )}
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setEditingAdminId(admin.id);
                                          setEditAdminName(admin.name);
                                          setEditUsername(admin.username);
                                          setEditPassword(admin.password);
                                        }}
                                        title="Edit Credentials / Reset Password"
                                        className="p-1.5 text-slate-500 hover:text-amber-600 rounded"
                                      >
                                        <Edit2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {assigningPropId === prop.id && (
                        <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-800 space-y-2 text-xs">
                          <div className="font-semibold text-slate-800 dark:text-slate-200">
                            Issue Additional Hotel Admin for {prop.hotelCode}
                          </div>
                          {quickAdminError && (
                            <div className="text-red-600 dark:text-red-400 font-medium">{quickAdminError}</div>
                          )}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            <input
                              type="text"
                              value={quickAdminName}
                              onChange={(e) => setQuickAdminName(e.target.value)}
                              placeholder="Admin Full Name"
                              className="p-1.5 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                            />
                            <input
                              type="text"
                              value={quickAdminUsername}
                              onChange={(e) => setQuickAdminUsername(e.target.value)}
                              placeholder="Username *"
                              className="p-1.5 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                            />
                            <input
                              type="text"
                              value={quickAdminPassword}
                              onChange={(e) => setQuickAdminPassword(e.target.value)}
                              placeholder="Password *"
                              className="p-1.5 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                            />
                          </div>
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setAssigningPropId(null)}
                              className="px-2.5 py-1 text-slate-500"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                handleQuickAssignAdmin(prop.id, prop.hotelCode, prop.hotelInfo.name)
                              }
                              className="px-3 py-1 rounded bg-slate-900 dark:bg-amber-600 text-white font-semibold"
                            >
                              Issue Admin Account
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
