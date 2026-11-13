import React, { useState, useEffect, useMemo } from 'react';
import { useHotel } from '../../context/HotelContext';
import { UserRole } from '../../types/hotel';
import {
  Building2,
  Shield,
  UserPlus,
  BedDouble,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  RotateCcw,
  Globe,
  CheckCircle2,
  KeyRound,
  MapPin,
  ArrowUpRight,
} from 'lucide-react';

interface ResortSettingsViewProps {
  setActiveTab?: (tab: string) => void;
}

export const ResortSettingsView: React.FC<ResortSettingsViewProps> = ({ setActiveTab }) => {
  const {
    properties,
    activePropertyId,
    activeProperty,
    switchProperty,
    addProperty,
    deleteProperty,
    hotelInfo,
    updateHotelInfo,
    resetHotelInfo,
    roomCategories,
    addRoomCategory,
    updateRoomCategory,
    deleteRoomCategory,
    rooms,
    systemUsers,
    addSystemUser,
    updateSystemUser,
    deleteSystemUser,
    currentUser,
    isMasterAdmin,
    isAdmin,
    formatPrice,
  } = useHotel();

  const [section, setSection] = useState<'properties' | 'resort' | 'managers' | 'categories'>(
    isMasterAdmin ? 'properties' : 'resort'
  );
  const [savedNotice, setSavedNotice] = useState('');
  const [errorNotice, setErrorNotice] = useState('');

  // Ensure non-master users never stay on 'properties' tab
  useEffect(() => {
    if (!isMasterAdmin && section === 'properties') {
      setSection('resort');
    }
  }, [isMasterAdmin, section]);

  const suggestNextCode = useMemo(() => {
    let num = 101 + properties.length;
    while (properties.some((p) => p.hotelCode.toUpperCase() === `HTL-${num}`)) {
      num += 1;
    }
    return `HTL-${num}`;
  }, [properties]);

  // --- New Hotel / Resort Form (Master Admin Only) ---
  const [propCode, setPropCode] = useState(suggestNextCode);
  const [propName, setPropName] = useState('');
  const [propTagline, setPropTagline] = useState('');
  const [propLocation, setPropLocation] = useState('');
  const [propAddress, setPropAddress] = useState('');
  const [propPhone, setPropPhone] = useState('');
  const [propEmail, setPropEmail] = useState('');
  const [propCurrency, setPropCurrency] = useState('PKR');
  const [propCurrencySymbol, setPropCurrencySymbol] = useState('Rs.');
  const [propTaxLabel, setPropTaxLabel] = useState('Provincial GST & Levy');
  const [propTaxRatePct, setPropTaxRatePct] = useState(13);
  const [propNtn, setPropNtn] = useState('');
  const [propReg, setPropReg] = useState('');
  const [propAdminUsername, setPropAdminUsername] = useState('');
  const [propAdminPassword, setPropAdminPassword] = useState('');
  const [seedStarterRooms, setSeedStarterRooms] = useState(true);

  // --- Resort Profile Form State ---
  const [formInfo, setFormInfo] = useState({
    ...hotelInfo,
    taxRatePct: Math.round((hotelInfo.taxRate || 0) * 1000) / 10,
  });

  useEffect(() => {
    setFormInfo({
      ...hotelInfo,
      taxRatePct: Math.round((hotelInfo.taxRate || 0) * 1000) / 10,
    });
  }, [hotelInfo]);

  // --- Add Manager / Admin Form State ---
  const [userName, setUserName] = useState('');
  const [userUsername, setUserUsername] = useState('');
  const [userDesignation, setUserDesignation] = useState('Front Desk Manager');
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [userRole, setUserRole] = useState<UserRole>('manager');
  const [userAssignedProp, setUserAssignedProp] = useState<string>(activePropertyId);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editUserPassword, setEditUserPassword] = useState('');
  const [editUserDesignation, setEditUserDesignation] = useState('');
  const [editUserRole, setEditUserRole] = useState<UserRole>('manager');
  const [editUserProp, setEditUserProp] = useState<string>(activePropertyId);

  useEffect(() => {
    setUserAssignedProp(activePropertyId);
  }, [activePropertyId]);

  // --- Room Category Form State ---
  const [catName, setCatName] = useState('');
  const [catRate, setCatRate] = useState<number>(25000);
  const [catDesc, setCatDesc] = useState('');
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [editCatName, setEditCatName] = useState('');
  const [editCatRate, setEditCatRate] = useState<number>(0);
  const [editCatDesc, setEditCatDesc] = useState('');

  const flashNotice = (msg: string) => {
    setErrorNotice('');
    setSavedNotice(msg);
    setTimeout(() => setSavedNotice(''), 3500);
  };

  const flashError = (msg: string) => {
    setSavedNotice('');
    setErrorNotice(msg);
    setTimeout(() => setErrorNotice(''), 4000);
  };

  // Scope visible user accounts strictly to active hotel for Hotel Admin / Manager
  const visibleUsers = useMemo(() => {
    if (isMasterAdmin) return systemUsers;
    return systemUsers.filter(
      (u) => u.role !== 'master_admin' && u.assignedPropertyId === activePropertyId
    );
  }, [systemUsers, isMasterAdmin, activePropertyId]);

  const currencyPresets = [
    { code: 'PKR', symbol: 'Rs.', label: 'Pakistani Rupee (PKR)' },
    { code: 'USD', symbol: '$', label: 'US Dollar (USD)' },
    { code: 'EUR', symbol: '€', label: 'Euro (EUR)' },
    { code: 'GBP', symbol: '£', label: 'British Pound (GBP)' },
    { code: 'AED', symbol: 'AED', label: 'UAE Dirham (AED)' },
    { code: 'SAR', symbol: 'SAR', label: 'Saudi Riyal (SAR)' },
  ];

  const handleAddPropertySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!propCode.trim() || !propName.trim() || !propLocation.trim()) return;
    const res = addProperty({
      hotelCode: propCode.trim().toUpperCase(),
      name: propName,
      tagline: propTagline || 'Luxury Hospitality & Resort Operations',
      shortLocation: propLocation,
      address: propAddress || propLocation,
      phone: propPhone || '+92 300 0000000',
      mobile: propPhone || '+92 300 0000000',
      email: propEmail || `desk@${propName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
      website: `www.${propName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
      currency: propCurrency,
      currencySymbol: propCurrencySymbol,
      taxLabel: propTaxLabel,
      taxRate: Math.max(0, Number(propTaxRatePct)) / 100,
      ntn: propNtn,
      registrationNo: propReg,
      seedStarterRooms,
      adminUsername: propAdminUsername.trim() || undefined,
      adminPassword: propAdminPassword || undefined,
    });
    if (res.error || !res.property) {
      flashError(res.error || 'Could not add property.');
      return;
    }
    setPropCode(`HTL-${101 + properties.length + 1}`);
    setPropName('');
    setPropTagline('');
    setPropLocation('');
    setPropAddress('');
    setPropPhone('');
    setPropEmail('');
    setPropNtn('');
    setPropReg('');
    setPropAdminUsername('');
    setPropAdminPassword('');
    flashNotice(`Registered "${res.property.hotelInfo.name}" (${res.property.hotelCode}).`);
  };

  const handleSaveResortInfo = (e: React.FormEvent) => {
    e.preventDefault();
    updateHotelInfo({
      name: formInfo.name.trim() || hotelInfo.name,
      tagline: formInfo.tagline.trim(),
      shortLocation: formInfo.shortLocation.trim(),
      address: formInfo.address.trim(),
      phone: formInfo.phone.trim(),
      mobile: formInfo.mobile.trim(),
      email: formInfo.email.trim(),
      website: formInfo.website.trim(),
      currency: formInfo.currency.trim() || 'PKR',
      currencySymbol: formInfo.currencySymbol.trim() || 'Rs.',
      taxLabel: formInfo.taxLabel.trim() || 'GST',
      taxRate: Math.max(0, Math.min(100, Number(formInfo.taxRatePct))) / 100,
      ntn: formInfo.ntn.trim(),
      registrationNo: formInfo.registrationNo.trim(),
    });
    flashNotice(`Updated details for "${formInfo.name}".`);
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !userUsername.trim() || !userPassword.trim()) {
      flashError('Full Name, Username, and Password are required.');
      return;
    }
    const targetRole: UserRole = isMasterAdmin ? userRole : 'manager';
    const targetProp =
      targetRole === 'master_admin'
        ? 'all'
        : isMasterAdmin
        ? userAssignedProp
        : activePropertyId;

    const res = addSystemUser({
      name: userName.trim(),
      username: userUsername.trim(),
      designation:
        userDesignation.trim() ||
        (targetRole === 'admin' ? 'Hotel Administrator' : 'Duty Manager'),
      email:
        userEmail.trim() ||
        `${userUsername.trim().toLowerCase()}@${activeProperty.hotelCode.toLowerCase()}.pms`,
      password: userPassword,
      phone: userPhone.trim(),
      role: targetRole,
      assignedPropertyId: targetProp,
    });

    if (res.error || !res.user) {
      flashError(res.error || 'Could not create user account.');
      return;
    }

    setUserName('');
    setUserUsername('');
    setUserEmail('');
    setUserPassword('');
    setUserPhone('');
    setUserDesignation('Front Desk Manager');
    setUserRole('manager');
    flashNotice(`Created account @${res.user.username} for ${res.user.name}.`);
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) return;
    addRoomCategory({
      name: catName.trim(),
      defaultRate: Math.max(0, Number(catRate)),
      description: catDesc.trim() || undefined,
    });
    flashNotice(`Added room category "${catName.trim()}".`);
    setCatName('');
    setCatDesc('');
  };

  const tabs = [
    ...(isMasterAdmin
      ? [{ id: 'properties', label: `Hotels & Resorts (${properties.length})`, icon: Globe }]
      : []),
    { id: 'resort', label: 'Hotel Profile & Tax', icon: Building2 },
    {
      id: 'managers',
      label: isMasterAdmin
        ? `Admins & Managers (${visibleUsers.length})`
        : `My Hotel Managers (${visibleUsers.length})`,
      icon: UserPlus,
    },
    { id: 'categories', label: `Room Categories (${roomCategories.length})`, icon: BedDouble },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white font-display">
            {isMasterAdmin ? 'Platform & Property Settings' : `${hotelInfo.name} · Hotel Settings`}
          </h2>
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            <span className="font-mono font-semibold text-amber-600 dark:text-amber-400">
              {activeProperty.hotelCode}
            </span>
            <span aria-hidden="true">·</span>
            <span>{hotelInfo.name}</span>
            <span aria-hidden="true">·</span>
            <span>
              {isMasterAdmin
                ? 'Master Admin Access'
                : isAdmin
                ? 'Hotel Admin (Scoped to This Hotel)'
                : 'Manager (View Only)'}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {isMasterAdmin && setActiveTab && (
            <button
              type="button"
              onClick={() => setActiveTab('master_admin')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-900 dark:bg-amber-600 text-white text-xs font-semibold hover:bg-slate-800 dark:hover:bg-amber-500 transition-colors"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Open Master Admin Panel</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          )}

          {savedNotice && (
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs font-medium text-emerald-700 dark:text-emerald-300">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{savedNotice}</span>
            </div>
          )}

          {errorNotice && (
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-xs font-medium text-red-700 dark:text-red-300">
              <span>{errorNotice}</span>
            </div>
          )}
        </div>
      </div>

      {/* Sub-navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = section === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSection(tab.id as any)}
              className={`pb-2 px-3 text-xs font-semibold transition-all border-b-2 -mb-2.5 flex items-center gap-2 whitespace-nowrap shrink-0 ${
                active
                  ? 'border-slate-900 text-slate-900 dark:border-amber-400 dark:text-amber-400'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* SECTION 1: MULTI-HOTEL WORKSPACES (MASTER ADMIN ONLY) */}
      {section === 'properties' && isMasterAdmin && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-4">
            <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white font-display">
                  Registered Client Hotels &amp; Resorts ({properties.length})
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Switch active workspace to audit or manage any client property independently
                </p>
              </div>

              <div className="space-y-3">
                {properties.map((prop) => {
                  const isActive = prop.id === activePropertyId;
                  const occupied = prop.rooms.filter((r) => r.status === 'occupied').length;
                  const activeBookings = prop.reservations.filter((r) => r.status !== 'cancelled').length;

                  return (
                    <div
                      key={prop.id}
                      className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                        isActive
                          ? 'border-amber-500 bg-amber-50/40 dark:bg-amber-950/20 ring-1 ring-amber-500/40'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400">
                            {prop.hotelCode}
                          </span>
                          <span className="text-slate-300 dark:text-slate-600">·</span>
                          <span className="text-sm font-bold text-slate-900 dark:text-white truncate">
                            {prop.hotelInfo.name}
                          </span>
                          {isActive && (
                            <span className="text-[10px] font-mono font-bold uppercase text-emerald-600 dark:text-emerald-400">
                              · Active
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
                            {prop.rooms.length} Rooms ({occupied} Occupied)
                          </span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono tabular-nums">{activeBookings} Bookings</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {!isActive ? (
                          <button
                            onClick={() => {
                              switchProperty(prop.id);
                              flashNotice(`Switched active workspace to "${prop.hotelInfo.name}".`);
                            }}
                            className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 dark:bg-amber-600 hover:bg-slate-800 dark:hover:bg-amber-500 rounded-lg transition-colors whitespace-nowrap"
                          >
                            Manage Hotel
                          </button>
                        ) : (
                          <button
                            onClick={() => setActiveTab?.('overview')}
                            className="px-3 py-1.5 text-xs font-medium text-amber-700 dark:text-amber-300 bg-amber-100/80 dark:bg-amber-950/50 rounded-lg hover:bg-amber-200/70 transition-colors whitespace-nowrap"
                          >
                            Open Desk →
                          </button>
                        )}

                        {properties.length > 1 && (
                          <button
                            onClick={() => {
                              if (
                                confirm(
                                  `Permanently remove "${prop.hotelInfo.name}" (${prop.hotelCode}) and all its property data?`
                                )
                              ) {
                                deleteProperty(prop.id);
                              }
                            }}
                            title="Delete Property"
                            className="p-1.5 text-slate-400 hover:text-red-600 rounded transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <form
              onSubmit={handleAddPropertySubmit}
              className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3.5 text-xs"
            >
              <div className="pb-2 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white font-display flex items-center gap-2">
                  <Plus className="w-4 h-4 text-amber-500" />
                  <span>Quick Register Hotel &amp; Admin</span>
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Create a Hotel ID and issue its Hotel Admin login credentials
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Hotel ID *
                  </label>
                  <input
                    type="text"
                    required
                    value={propCode}
                    onChange={(e) => setPropCode(e.target.value.toUpperCase())}
                    placeholder="HTL-102"
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold uppercase focus:outline-none"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Hotel / Resort Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={propName}
                    onChange={(e) => setPropName(e.target.value)}
                    placeholder="e.g. Hunza Serenity Resort"
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    City / Region *
                  </label>
                  <input
                    type="text"
                    required
                    value={propLocation}
                    onChange={(e) => setPropLocation(e.target.value)}
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
                    value={propPhone}
                    onChange={(e) => setPropPhone(e.target.value)}
                    placeholder="+92 300 0000000"
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Admin Username *
                  </label>
                  <input
                    type="text"
                    required
                    value={propAdminUsername}
                    onChange={(e) => setPropAdminUsername(e.target.value)}
                    placeholder="e.g. hunza_admin"
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Admin Password *
                  </label>
                  <input
                    type="text"
                    required
                    value={propAdminPassword}
                    onChange={(e) => setPropAdminPassword(e.target.value)}
                    placeholder="Set password"
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Currency
                  </label>
                  <select
                    value={propCurrency}
                    onChange={(e) => {
                      const preset = currencyPresets.find((c) => c.code === e.target.value);
                      setPropCurrency(e.target.value);
                      if (preset) setPropCurrencySymbol(preset.symbol);
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
                    value={propTaxLabel}
                    onChange={(e) => setPropTaxLabel(e.target.value)}
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
                    value={propTaxRatePct}
                    onChange={(e) => setPropTaxRatePct(Number(e.target.value))}
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="seedStarterRooms"
                  checked={seedStarterRooms}
                  onChange={(e) => setSeedStarterRooms(e.target.checked)}
                  className="w-4 h-4 text-amber-600 rounded border-slate-300"
                />
                <label htmlFor="seedStarterRooms" className="text-slate-700 dark:text-slate-300">
                  Include 4 starter suites &amp; default room categories
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-amber-600 dark:hover:bg-amber-500 text-white font-semibold rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Create Hotel ID &amp; Admin</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* SECTION 2: ACTIVE RESORT PROFILE & FINANCE */}
      {section === 'resort' && (
        <form
          onSubmit={handleSaveResortInfo}
          className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 space-y-6 text-xs"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white font-display">
                Hotel Profile, Address &amp; Invoice Tax Setup ({activeProperty.hotelCode})
              </h3>
              <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                Customize branding, address, currency, and tax rules for {hotelInfo.name}
              </p>
            </div>
            {isAdmin && (
              <button
                type="button"
                onClick={() => {
                  if (confirm('Reset active property details to default template?')) {
                    resetHotelInfo();
                    flashNotice('Property details reset to default.');
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg self-start"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restore Default</span>
              </button>
            )}
          </div>

          <fieldset disabled={!isAdmin} className="space-y-5 disabled:opacity-75">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Hotel / Resort Name *
                </label>
                <input
                  type="text"
                  required
                  value={formInfo.name}
                  onChange={(e) => setFormInfo({ ...formInfo, name: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Tagline / Subtitle
                </label>
                <input
                  type="text"
                  value={formInfo.tagline}
                  onChange={(e) => setFormInfo({ ...formInfo, tagline: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Short Location (Navbar &amp; Header)
                </label>
                <input
                  type="text"
                  value={formInfo.shortLocation}
                  onChange={(e) => setFormInfo({ ...formInfo, shortLocation: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Official Website
                </label>
                <input
                  type="text"
                  value={formInfo.website}
                  onChange={(e) => setFormInfo({ ...formInfo, website: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Full Street Address (Printed on Guest Invoices)
                </label>
                <input
                  type="text"
                  value={formInfo.address}
                  onChange={(e) => setFormInfo({ ...formInfo, address: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Landline Phone
                </label>
                <input
                  type="text"
                  value={formInfo.phone}
                  onChange={(e) => setFormInfo({ ...formInfo, phone: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Mobile / WhatsApp Desk
                </label>
                <input
                  type="text"
                  value={formInfo.mobile}
                  onChange={(e) => setFormInfo({ ...formInfo, mobile: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Reservations Email
                </label>
                <input
                  type="email"
                  value={formInfo.email}
                  onChange={(e) => setFormInfo({ ...formInfo, email: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  NTN / Tax Registration ID
                </label>
                <input
                  type="text"
                  value={formInfo.ntn}
                  onChange={(e) => setFormInfo({ ...formInfo, ntn: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Tourism / License Registration #
                </label>
                <input
                  type="text"
                  value={formInfo.registrationNo}
                  onChange={(e) => setFormInfo({ ...formInfo, registrationNo: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Currency Code &amp; Symbol
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={formInfo.currency}
                    onChange={(e) => {
                      const preset = currencyPresets.find((c) => c.code === e.target.value);
                      setFormInfo({
                        ...formInfo,
                        currency: e.target.value,
                        currencySymbol: preset ? preset.symbol : formInfo.currencySymbol,
                      });
                    }}
                    className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:outline-none"
                  >
                    {currencyPresets.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.code} — {c.symbol}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={formInfo.currency}
                    onChange={(e) => setFormInfo({ ...formInfo, currency: e.target.value.toUpperCase() })}
                    placeholder="Custom e.g. PKR"
                    className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Tax Label (Displayed on Folios)
                </label>
                <input
                  type="text"
                  value={formInfo.taxLabel}
                  onChange={(e) => setFormInfo({ ...formInfo, taxLabel: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Tax Percentage (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.5"
                  value={formInfo.taxRatePct}
                  onChange={(e) => setFormInfo({ ...formInfo, taxRatePct: Number(e.target.value) })}
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:outline-none"
                />
              </div>
            </div>

            {isAdmin && (
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-slate-900 dark:bg-amber-600 text-white font-semibold rounded-lg hover:bg-slate-800 dark:hover:bg-amber-500 shadow-sm transition-colors"
                >
                  Save Hotel Settings
                </button>
              </div>
            )}
          </fieldset>
        </form>
      )}

      {/* SECTION 3: MANAGERS & HOTEL ADMIN ACCOUNTS */}
      {section === 'managers' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Accounts List */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white font-display">
                {isMasterAdmin
                  ? `Platform Admins & Hotel Managers (${visibleUsers.length})`
                  : `${hotelInfo.name} · Managers & Hotel Admin (${visibleUsers.length})`}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isMasterAdmin
                  ? 'Manage Master Admin, Hotel Admins, and Hotel Managers across all registered hotels'
                  : `Create and manage Manager login credentials exclusively for ${activeProperty.hotelCode} (${hotelInfo.name})`}
              </p>
            </div>

            <div className="space-y-3">
              {visibleUsers.map((user) => {
                const isSelf = currentUser?.id === user.id;
                const isEditing = editingUserId === user.id;
                const canModifyThisUser =
                  isMasterAdmin ||
                  (isAdmin && user.role === 'manager' && user.assignedPropertyId === activePropertyId);
                const assignedProp = properties.find((p) => p.id === user.assignedPropertyId);
                const assignedHotelName =
                  user.role === 'master_admin' || !user.assignedPropertyId || user.assignedPropertyId === 'all'
                    ? 'All Registered Hotels'
                    : assignedProp
                    ? `${assignedProp.hotelCode} · ${assignedProp.hotelInfo.name}`
                    : 'Assigned Hotel';

                const roleLabel =
                  user.role === 'master_admin'
                    ? 'MASTER ADMIN'
                    : user.role === 'admin'
                    ? 'HOTEL ADMIN'
                    : 'MANAGER';

                const avatarColor =
                  user.role === 'master_admin'
                    ? 'bg-purple-600'
                    : user.role === 'admin'
                    ? 'bg-amber-600'
                    : 'bg-blue-600';

                return (
                  <div
                    key={user.id}
                    className={`p-4 rounded-xl border transition-colors ${
                      isSelf
                        ? 'border-amber-400 dark:border-amber-600 bg-amber-50/40 dark:bg-amber-950/20'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs text-white shrink-0 ${avatarColor}`}
                        >
                          {user.avatarInitials}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-slate-900 dark:text-white truncate">
                              {user.name}
                            </span>
                            {isSelf && (
                              <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                                · Current Session
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                            {user.designation} · {roleLabel} · {assignedHotelName}
                          </div>
                          <div className="text-[11px] font-mono text-slate-400 mt-0.5 truncate">
                            @{user.username} · {user.email} {user.phone ? `· ${user.phone}` : ''} ·{' '}
                            {!user.isActive ? 'INACTIVE' : 'Active'}
                          </div>
                        </div>
                      </div>

                      {canModifyThisUser && (
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => {
                              if (isEditing) {
                                setEditingUserId(null);
                              } else {
                                setEditingUserId(user.id);
                                setEditUserDesignation(user.designation);
                                setEditUserPassword(user.password);
                                setEditUserRole(user.role);
                                setEditUserProp(user.assignedPropertyId || activePropertyId);
                              }
                            }}
                            title="Edit Account"
                            className="p-1.5 text-slate-500 hover:text-amber-600 rounded transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          {!isSelf && user.role !== 'master_admin' && (
                            <button
                              onClick={() => {
                                if (confirm(`Delete account @${user.username} (${user.name})?`)) {
                                  deleteSystemUser(user.id);
                                }
                              }}
                              title="Delete Account"
                              className="p-1.5 text-slate-400 hover:text-red-600 rounded transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    {isEditing && canModifyThisUser && (
                      <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                        <input
                          type="text"
                          value={editUserDesignation}
                          onChange={(e) => setEditUserDesignation(e.target.value)}
                          placeholder="Designation"
                          className="p-2 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        />
                        <input
                          type="text"
                          value={editUserPassword}
                          onChange={(e) => setEditUserPassword(e.target.value)}
                          placeholder="New Password"
                          className="p-2 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                        />
                        {isMasterAdmin && (
                          <>
                            <select
                              value={editUserRole}
                              onChange={(e) => setEditUserRole(e.target.value as UserRole)}
                              className="p-2 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                            >
                              <option value="manager">Hotel Manager</option>
                              <option value="admin">Hotel Admin (Scoped to Hotel)</option>
                              <option value="master_admin">Master Admin (Platform)</option>
                            </select>
                            <select
                              value={editUserRole === 'master_admin' ? 'all' : editUserProp}
                              disabled={editUserRole === 'master_admin'}
                              onChange={(e) => setEditUserProp(e.target.value)}
                              className="p-2 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white disabled:opacity-60"
                            >
                              {editUserRole === 'master_admin' && (
                                <option value="all">All Hotels &amp; Resorts</option>
                              )}
                              {properties.map((p) => (
                                <option key={p.id} value={p.id}>
                                  {p.hotelCode} — {p.hotelInfo.name}
                                </option>
                              ))}
                            </select>
                          </>
                        )}
                        <div className="sm:col-span-2 flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => updateSystemUser(user.id, { isActive: !user.isActive })}
                            className="px-3 py-1.5 rounded border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                          >
                            {user.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              updateSystemUser(user.id, {
                                designation: editUserDesignation,
                                password: editUserPassword,
                                ...(isMasterAdmin
                                  ? {
                                      role: editUserRole,
                                      assignedPropertyId:
                                        editUserRole === 'master_admin' ? 'all' : editUserProp,
                                    }
                                  : {}),
                              });
                              setEditingUserId(null);
                              flashNotice(`Updated ${user.name}'s access credentials.`);
                            }}
                            className="px-3 py-1.5 rounded bg-slate-900 dark:bg-amber-600 text-white font-semibold"
                          >
                            Save Account
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Add New Manager / Admin Form */}
          <div className="lg:col-span-5">
            {isAdmin ? (
              <form
                onSubmit={handleAddUser}
                className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-3.5 text-xs"
              >
                <div className="pb-2 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white font-display flex items-center gap-2">
                    <UserPlus className="w-4 h-4 text-amber-500" />
                    <span>
                      {isMasterAdmin ? 'Add Hotel Admin or Manager' : `Add Manager for ${activeProperty.hotelCode}`}
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {isMasterAdmin
                      ? 'Create password-protected accounts assigned to a specific Hotel ID'
                      : `Create a Manager account strictly scoped to ${hotelInfo.name}`}
                  </p>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="e.g. Salman Karim"
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Login Username *
                    </label>
                    <input
                      type="text"
                      required
                      value={userUsername}
                      onChange={(e) => setUserUsername(e.target.value)}
                      placeholder="e.g. salman_mgr"
                      className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Password *
                    </label>
                    <input
                      type="password"
                      required
                      value={userPassword}
                      onChange={(e) => setUserPassword(e.target.value)}
                      placeholder="Set login password"
                      className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Access Role *
                    </label>
                    {isMasterAdmin ? (
                      <select
                        value={userRole}
                        onChange={(e) => setUserRole(e.target.value as UserRole)}
                        className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                      >
                        <option value="manager">Hotel Manager</option>
                        <option value="admin">Hotel Admin (Own Hotel)</option>
                      </select>
                    ) : (
                      <input
                        type="text"
                        disabled
                        value="Hotel Manager (Operations)"
                        className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400"
                      />
                    )}
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Designation
                    </label>
                    <input
                      type="text"
                      value={userDesignation}
                      onChange={(e) => setUserDesignation(e.target.value)}
                      placeholder="Night Manager"
                      className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>
                </div>

                {isMasterAdmin && (
                  <div>
                    <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Assigned Hotel / Resort *
                    </label>
                    <select
                      value={userAssignedProp}
                      onChange={(e) => setUserAssignedProp(e.target.value)}
                      className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                    >
                      {properties.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.hotelCode} — {p.hotelInfo.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Email (Optional)
                    </label>
                    <input
                      type="email"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      placeholder="manager@hotel.pk"
                      className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Phone (Optional)
                    </label>
                    <input
                      type="tel"
                      value={userPhone}
                      onChange={(e) => setUserPhone(e.target.value)}
                      placeholder="+92 300 ..."
                      className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-amber-600 dark:hover:bg-amber-500 text-white font-semibold rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition-colors"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>Create Account</span>
                </button>
              </form>
            ) : (
              <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
                Only Hotel Administrator or Master Administrator can create or modify Manager login credentials.
              </div>
            )}
          </div>
        </div>
      )}

      {/* SECTION 4: ROOM CATEGORIES */}
      {section === 'categories' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white font-display">
                Room Categories for {hotelInfo.name} ({roomCategories.length})
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Renaming a category automatically updates all rooms &amp; reservations assigned to it
              </p>
            </div>

            <div className="space-y-2.5">
              {roomCategories.map((cat) => {
                const roomCount = rooms.filter((r) => r.type === cat.name).length;
                const isEditing = editingCatId === cat.id;

                return (
                  <div
                    key={cat.id}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40"
                  >
                    {isEditing ? (
                      <div className="space-y-2.5 text-xs">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          <input
                            type="text"
                            value={editCatName}
                            onChange={(e) => setEditCatName(e.target.value)}
                            placeholder="Category Name"
                            className="p-2 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-semibold"
                          />
                          <input
                            type="number"
                            min="0"
                            step="500"
                            value={editCatRate}
                            onChange={(e) => setEditCatRate(Number(e.target.value))}
                            placeholder="Default Nightly Rate"
                            className="p-2 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                          />
                        </div>
                        <input
                          type="text"
                          value={editCatDesc}
                          onChange={(e) => setEditCatDesc(e.target.value)}
                          placeholder="Category description"
                          className="w-full p-2 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setEditingCatId(null)}
                            className="px-3 py-1 text-slate-500 hover:text-slate-800 flex items-center gap-1"
                          >
                            <X className="w-3.5 h-3.5" /> Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              updateRoomCategory(cat.id, {
                                name: editCatName.trim() || cat.name,
                                defaultRate: Number(editCatRate),
                                description: editCatDesc.trim(),
                              });
                              setEditingCatId(null);
                              flashNotice(`Updated category "${editCatName.trim() || cat.name}".`);
                            }}
                            className="px-3 py-1 bg-slate-900 dark:bg-amber-600 text-white font-semibold rounded flex items-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5" /> Save Category
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-slate-900 dark:text-white">
                              {cat.name}
                            </span>
                            <span className="text-xs font-mono text-amber-600 dark:text-amber-400 font-semibold">
                              · Default {formatPrice(cat.defaultRate)}/nt
                            </span>
                          </div>
                          {cat.description && (
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                              {cat.description}
                            </p>
                          )}
                          <div className="text-[11px] font-mono text-slate-400 mt-1">
                            {roomCount} {roomCount === 1 ? 'room' : 'rooms'} assigned
                          </div>
                        </div>

                        {isAdmin && (
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={() => {
                                setEditingCatId(cat.id);
                                setEditCatName(cat.name);
                                setEditCatRate(cat.defaultRate);
                                setEditCatDesc(cat.description || '');
                              }}
                              title="Edit Category"
                              className="p-1.5 text-slate-500 hover:text-amber-600 rounded transition-colors"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => deleteRoomCategory(cat.id)}
                              title="Delete Category"
                              className="p-1.5 text-slate-400 hover:text-red-600 rounded transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-5">
            {isAdmin ? (
              <form
                onSubmit={handleAddCategory}
                className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-3.5 text-xs"
              >
                <div className="pb-2 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white font-display flex items-center gap-2">
                    <Plus className="w-4 h-4 text-amber-500" />
                    <span>Add New Room Category</span>
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Define custom suite types &amp; baseline nightly rates in {hotelInfo.currency}
                  </p>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={catName}
                    onChange={(e) => setCatName(e.target.value)}
                    placeholder="e.g. Presidential Mountain Villa"
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Default Nightly Rate ({hotelInfo.currency}) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="500"
                    required
                    value={catRate}
                    onChange={(e) => setCatRate(Number(e.target.value))}
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Description (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={catDesc}
                    onChange={(e) => setCatDesc(e.target.value)}
                    placeholder="Key features, view, and inclusions..."
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-amber-600 dark:hover:bg-amber-500 text-white font-semibold rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Room Category</span>
                </button>
              </form>
            ) : (
              <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
                Only Hotel Administrator or Master Administrator can add or delete room categories.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
