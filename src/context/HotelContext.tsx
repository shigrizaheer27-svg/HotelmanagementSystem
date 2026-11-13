import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  Room,
  Reservation,
  StaffMember,
  HousekeepingTask,
  MaintenanceRequest,
  GuestProfile,
  HousekeepingStatus,
  ExtraCharge,
  MealPlan,
  AuthUser,
  PakistaniPaymentMethod,
  HotelInfo,
  RoomCategory,
  SystemUser,
  DiscountType,
  PropertyWorkspace,
} from '../types/hotel';
import {
  INITIAL_ROOMS,
  INITIAL_RESERVATIONS,
  INITIAL_STAFF,
  INITIAL_HOUSEKEEPING_TASKS,
  INITIAL_MAINTENANCE,
  INITIAL_GUESTS,
  DEFAULT_HOTEL_INFO,
  INITIAL_ROOM_CATEGORIES,
  INITIAL_SYSTEM_USERS,
  formatCurrency,
} from '../data/mockData';

export interface NewReservationInput {
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  guestCnicOrPassport: string;
  cityOrCountry: string;
  roomId: string;
  checkInDate: string;
  checkOutDate: string;
  adults: number;
  children: number;
  mealPlan: MealPlan;
  paymentMethod: PakistaniPaymentMethod;
  initialPayment: number;
  discountType?: DiscountType;
  discountValue?: number;
  discountReason?: string;
  specialRequests?: string;
}

export interface NewPropertyInput {
  hotelCode: string;
  name: string;
  tagline: string;
  shortLocation: string;
  address: string;
  phone: string;
  mobile: string;
  email: string;
  website: string;
  currency: string;
  currencySymbol: string;
  taxLabel: string;
  taxRate: number;
  ntn: string;
  registrationNo: string;
  seedStarterRooms: boolean;
  adminName?: string;
  adminUsername?: string;
  adminEmail?: string;
  adminPassword?: string;
}

interface HotelContextType {
  // Multi-property service provider management
  properties: PropertyWorkspace[];
  accessibleProperties: PropertyWorkspace[];
  activePropertyId: string;
  activeProperty: PropertyWorkspace;
  switchProperty: (propertyId: string) => void;
  addProperty: (input: NewPropertyInput) => { property: PropertyWorkspace | null; error?: string };
  deleteProperty: (propertyId: string) => void;

  hotelInfo: HotelInfo;
  updateHotelInfo: (updates: Partial<HotelInfo>) => void;
  resetHotelInfo: () => void;
  formatPrice: (amount: number) => string;

  roomCategories: RoomCategory[];
  addRoomCategory: (cat: Omit<RoomCategory, 'id'>) => RoomCategory;
  updateRoomCategory: (catId: string, updates: Partial<RoomCategory>) => void;
  deleteRoomCategory: (catId: string) => void;

  systemUsers: SystemUser[];
  addSystemUser: (
    user: Omit<SystemUser, 'id' | 'avatarInitials' | 'createdAt' | 'isActive'>
  ) => { user: SystemUser | null; error?: string };
  updateSystemUser: (userId: string, updates: Partial<SystemUser>) => void;
  deleteSystemUser: (userId: string) => void;

  rooms: Room[];
  reservations: Reservation[];
  staff: StaffMember[];
  housekeepingTasks: HousekeepingTask[];
  maintenanceRequests: MaintenanceRequest[];
  guests: GuestProfile[];
  currentDate: string;

  // Auth & Password-Protected Role Switching
  currentUser: AuthUser | null;
  login: (identifier: string, pass: string, preferredPropertyId?: string) => { ok: boolean; error?: string };
  switchAccountWithPassword: (identifier: string, pass: string) => { ok: boolean; error?: string };
  logout: () => void;
  isMasterAdmin: boolean;
  isAdmin: boolean;
  isManager: boolean;

  // UI selection states & modals
  selectedRoomForDetail: Room | null;
  setSelectedRoomForDetail: (room: Room | null) => void;
  selectedReservationForFolio: Reservation | null;
  setSelectedReservationForFolio: (reservation: Reservation | null) => void;
  isNewReservationModalOpen: boolean;
  setIsNewReservationModalOpen: (open: boolean) => void;
  isNewStaffModalOpen: boolean;
  setIsNewStaffModalOpen: (open: boolean) => void;
  isReportMaintenanceModalOpen: boolean;
  setIsReportMaintenanceModalOpen: (open: boolean) => void;
  isAddChargeModalOpen: boolean;
  setIsAddChargeModalOpen: (open: boolean) => void;
  reservationForCharge: Reservation | null;
  setReservationForCharge: (res: Reservation | null) => void;
  quickCheckInRoom: Room | null;
  setQuickCheckInRoom: (room: Room | null) => void;

  // Room Management (Admin)
  isRoomFormModalOpen: boolean;
  setIsRoomFormModalOpen: (open: boolean) => void;
  roomToEdit: Room | null;
  setRoomToEdit: (room: Room | null) => void;
  addRoom: (roomData: Omit<Room, 'id'>) => void;
  editRoom: (roomId: string, updates: Partial<Room>) => void;
  deleteRoom: (roomId: string) => void;

  // Reservation Editing & Discounts
  reservationToEdit: Reservation | null;
  setReservationToEdit: (res: Reservation | null) => void;
  isReservationEditModalOpen: boolean;
  setIsReservationEditModalOpen: (open: boolean) => void;
  updateReservationDetails: (reservationId: string, updates: Partial<Reservation>) => void;
  applyDiscountToReservation: (
    reservationId: string,
    discountType: DiscountType,
    discountValue: number,
    discountReason?: string
  ) => void;
  deleteReservation: (reservationId: string) => void;

  // Staff Deletion (Admin)
  deleteStaffMember: (staffId: string) => void;

  // Standard PMS Actions
  checkInReservation: (reservationId: string) => void;
  checkOutReservation: (reservationId: string, paymentMethod?: string) => void;
  cancelReservation: (reservationId: string) => void;
  createReservation: (data: NewReservationInput) => Reservation;
  addExtraCharge: (reservationId: string, charge: Omit<ExtraCharge, 'id' | 'date'>) => void;
  updateRoom: (roomId: string, updates: Partial<Room>) => void;
  updateHousekeepingStatus: (roomId: string, status: HousekeepingStatus) => void;
  createHousekeepingTask: (task: Omit<HousekeepingTask, 'id'>) => void;
  updateHousekeepingTask: (taskId: string, updates: Partial<HousekeepingTask>) => void;
  createMaintenanceRequest: (req: Omit<MaintenanceRequest, 'id' | 'reportedAt'>) => void;
  resolveMaintenanceRequest: (reqId: string, notes?: string) => void;
  addStaffMember: (member: Omit<StaffMember, 'id'>) => void;
  updateStaffMember: (staffId: string, updates: Partial<StaffMember>) => void;
  toggleStaffDuty: (staffId: string) => void;
  addOrUpdateGuest: (guest: Omit<GuestProfile, 'id'>) => GuestProfile;
  resetToDemoData: () => void;

  // Computed metrics for active property
  stats: {
    totalRooms: number;
    occupiedRooms: number;
    availableRooms: number;
    dirtyRooms: number;
    maintenanceRooms: number;
    occupancyRate: number;
    todayArrivals: Reservation[];
    todayDepartures: Reservation[];
    activeInHouse: Reservation[];
    todayRevenue: number;
    totalActiveRevenue: number;
    totalDiscountsGiven: number;
    onDutyStaffCount: number;
    pendingTasksCount: number;
    urgentMaintenanceCount: number;
    revPAR: number;
    adr: number;
  };
}

const STORAGE_KEYS = {
  PROPERTIES: 'mashakala_pms_properties_v5',
  ACTIVE_PROPERTY_ID: 'mashakala_pms_active_property_v5',
  SYSTEM_USERS: 'mashakala_pms_system_users_v5',
};

const createDefaultMashakalaProperty = (): PropertyWorkspace => ({
  id: 'prop-mashakala',
  hotelCode: 'HTL-101',
  createdAt: '2024-01-01',
  hotelInfo: DEFAULT_HOTEL_INFO,
  roomCategories: INITIAL_ROOM_CATEGORIES,
  rooms: INITIAL_ROOMS,
  reservations: INITIAL_RESERVATIONS,
  staff: INITIAL_STAFF,
  housekeepingTasks: INITIAL_HOUSEKEEPING_TASKS,
  maintenanceRequests: INITIAL_MAINTENANCE,
  guests: INITIAL_GUESTS,
});

const HotelContext = createContext<HotelContextType | undefined>(undefined);

const computeReservationTotals = (
  roomTotal: number,
  mealPlanTotal: number,
  extrasTotal: number,
  discountType: DiscountType = 'flat',
  discountValue: number = 0,
  taxRate: number
) => {
  const grossSubtotal = roomTotal + mealPlanTotal + extrasTotal;
  let discountAmount = 0;
  if (discountValue > 0) {
    if (discountType === 'percent') {
      const clampedPct = Math.min(100, Math.max(0, discountValue));
      discountAmount = Math.round((grossSubtotal * clampedPct) / 100);
    } else {
      discountAmount = Math.min(grossSubtotal, Math.max(0, Math.round(discountValue)));
    }
  }
  const netSubtotal = Math.max(0, grossSubtotal - discountAmount);
  const taxAmount = Math.round(netSubtotal * taxRate);
  const totalAmount = netSubtotal + taxAmount;
  return { discountAmount, taxAmount, totalAmount };
};

export const HotelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const currentDate = '2026-11-12';

  const [properties, setProperties] = useState<PropertyWorkspace[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROPERTIES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((p: PropertyWorkspace, idx: number) => ({
            ...p,
            hotelCode: p.hotelCode || `HTL-${101 + idx}`,
          }));
        }
      }
      return [createDefaultMashakalaProperty()];
    } catch {
      return [createDefaultMashakalaProperty()];
    }
  });

  const [activePropertyId, setActivePropertyId] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.ACTIVE_PROPERTY_ID) || 'prop-mashakala';
    } catch {
      return 'prop-mashakala';
    }
  });

  const [systemUsers, setSystemUsers] = useState<SystemUser[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SYSTEM_USERS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return INITIAL_SYSTEM_USERS;
    } catch {
      return INITIAL_SYSTEM_USERS;
    }
  });

  // Always start unauthenticated on page load so Login Page opens automatically
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  // UI modal states
  const [selectedRoomForDetail, setSelectedRoomForDetail] = useState<Room | null>(null);
  const [selectedReservationForFolio, setSelectedReservationForFolio] = useState<Reservation | null>(null);
  const [isNewReservationModalOpen, setIsNewReservationModalOpen] = useState(false);
  const [isNewStaffModalOpen, setIsNewStaffModalOpen] = useState(false);
  const [isReportMaintenanceModalOpen, setIsReportMaintenanceModalOpen] = useState(false);
  const [isAddChargeModalOpen, setIsAddChargeModalOpen] = useState(false);
  const [reservationForCharge, setReservationForCharge] = useState<Reservation | null>(null);
  const [quickCheckInRoom, setQuickCheckInRoom] = useState<Room | null>(null);
  const [isRoomFormModalOpen, setIsRoomFormModalOpen] = useState(false);
  const [roomToEdit, setRoomToEdit] = useState<Room | null>(null);
  const [reservationToEdit, setReservationToEdit] = useState<Reservation | null>(null);
  const [isReservationEditModalOpen, setIsReservationEditModalOpen] = useState(false);

  const activeProperty = useMemo(
    () => properties.find((p) => p.id === activePropertyId) || properties[0],
    [properties, activePropertyId]
  );

  const hotelInfo = activeProperty.hotelInfo;
  const roomCategories = activeProperty.roomCategories;
  const rooms = activeProperty.rooms;
  const reservations = activeProperty.reservations;
  const staff = activeProperty.staff;
  const housekeepingTasks = activeProperty.housekeepingTasks;
  const maintenanceRequests = activeProperty.maintenanceRequests;
  const guests = activeProperty.guests;

  const isMasterAdmin = currentUser?.role === 'master_admin';
  const isAdmin = currentUser?.role === 'admin' || isMasterAdmin;
  const isManager = currentUser?.role === 'manager' || isAdmin;

  // Strictly scope accessible properties: Master Admin sees all; Hotel Admin & Manager see ONLY their hotel
  const accessibleProperties = useMemo(() => {
    if (!currentUser) return properties;
    if (currentUser.role === 'master_admin') return properties;
    if (currentUser.assignedPropertyId && currentUser.assignedPropertyId !== 'all') {
      const matched = properties.filter((p) => p.id === currentUser.assignedPropertyId);
      if (matched.length > 0) return matched;
    }
    return [properties[0]];
  }, [properties, currentUser]);

  const updateActiveProperty = (updater: (prop: PropertyWorkspace) => PropertyWorkspace) => {
    setProperties((prev) =>
      prev.map((prop) => (prop.id === activeProperty.id ? updater(prop) : prop))
    );
  };

  useEffect(() => {
    document.title = currentUser
      ? `${hotelInfo.name} (${activeProperty.hotelCode}) - PMS`
      : `Hospitality Cloud PMS · Sign In`;
  }, [hotelInfo.name, activeProperty.hotelCode, currentUser]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.PROPERTIES, JSON.stringify(properties)); } catch {}
  }, [properties]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.ACTIVE_PROPERTY_ID, activePropertyId); } catch {}
  }, [activePropertyId]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.SYSTEM_USERS, JSON.stringify(systemUsers)); } catch {}
  }, [systemUsers]);

  useEffect(() => {
    if (selectedRoomForDetail) {
      const updated = rooms.find((r) => r.id === selectedRoomForDetail.id);
      if (updated) setSelectedRoomForDetail(updated);
      else setSelectedRoomForDetail(null);
    }
  }, [rooms]);

  useEffect(() => {
    if (selectedReservationForFolio) {
      const updated = reservations.find((r) => r.id === selectedReservationForFolio.id);
      if (updated) setSelectedReservationForFolio(updated);
      else setSelectedReservationForFolio(null);
    }
  }, [reservations]);

  const formatPrice = (amount: number) => formatCurrency(amount, hotelInfo);

  const clearOpenEntityModals = () => {
    setSelectedRoomForDetail(null);
    setSelectedReservationForFolio(null);
    setReservationForCharge(null);
    setQuickCheckInRoom(null);
    setRoomToEdit(null);
    setReservationToEdit(null);
  };

  // Multi-Property Management (Master Admin only)
  const switchProperty = (propertyId: string) => {
    const target = properties.find((p) => p.id === propertyId);
    if (!target) return;
    if (
      currentUser &&
      currentUser.role !== 'master_admin' &&
      currentUser.assignedPropertyId &&
      currentUser.assignedPropertyId !== propertyId
    ) {
      alert('Access Denied: You can only manage your assigned hotel property.');
      return;
    }
    clearOpenEntityModals();
    setActivePropertyId(propertyId);
  };

  const addProperty = (
    input: NewPropertyInput
  ): { property: PropertyWorkspace | null; error?: string } => {
    if (!isMasterAdmin) {
      return { property: null, error: 'Only Master Administrator can create new hotels and resorts.' };
    }

    const cleanCode = input.hotelCode.trim().toUpperCase();
    if (!cleanCode) {
      return { property: null, error: 'Hotel ID / Code is required.' };
    }
    if (properties.some((p) => p.hotelCode.toUpperCase() === cleanCode)) {
      return { property: null, error: `Hotel ID "${cleanCode}" already exists.` };
    }

    // Validate Hotel Admin credentials if provided
    const adminUsername = (input.adminUsername || '').trim();
    const adminPassword = input.adminPassword || '';
    const adminEmail =
      (input.adminEmail || '').trim() ||
      (adminUsername ? `${adminUsername.toLowerCase().replace(/[^a-z0-9]/g, '')}@${cleanCode.toLowerCase()}.pms` : '');

    if (adminUsername) {
      if (!adminPassword) {
        return { property: null, error: 'Please set a password for the Hotel Admin account.' };
      }
      const dupUser = systemUsers.some(
        (u) =>
          u.username.toLowerCase() === adminUsername.toLowerCase() ||
          (adminEmail && u.email.toLowerCase() === adminEmail.toLowerCase())
      );
      if (dupUser) {
        return { property: null, error: `Username or email "${adminUsername}" is already registered.` };
      }
    }

    const propId = `prop-${Date.now()}`;
    const starterCategories: RoomCategory[] = [
      {
        id: `cat-${Date.now()}-1`,
        name: 'Standard Deluxe',
        defaultRate: input.currency === 'PKR' ? 18000 : 120,
        description: 'Well-appointed deluxe room with modern amenities and climate control.',
      },
      {
        id: `cat-${Date.now()}-2`,
        name: 'Executive Suite',
        defaultRate: input.currency === 'PKR' ? 35000 : 220,
        description: 'Spacious suite with separate lounge, workspace, and premium view.',
      },
      {
        id: `cat-${Date.now()}-3`,
        name: 'Presidential / Royal Villa',
        defaultRate: input.currency === 'PKR' ? 75000 : 480,
        description: 'Signature luxury accommodation with private terrace and concierge access.',
      },
    ];

    const starterRooms: Room[] = input.seedStarterRooms
      ? [
          {
            id: `room-${Date.now()}-101`,
            number: '101',
            name: 'Signature Deluxe 101',
            floor: 1,
            type: starterCategories[0].name,
            status: 'available',
            housekeeping: 'inspected',
            ratePerNight: starterCategories[0].defaultRate,
            bedType: 'King',
            maxCapacity: 2,
            amenities: ['High-Speed Wi-Fi', 'Climate Control', 'Smart TV', 'Coffee & Tea Station'],
          },
          {
            id: `room-${Date.now()}-102`,
            number: '102',
            name: 'Garden Twin Deluxe',
            floor: 1,
            type: starterCategories[0].name,
            status: 'available',
            housekeeping: 'inspected',
            ratePerNight: starterCategories[0].defaultRate,
            bedType: 'Twin Doubles',
            maxCapacity: 3,
            amenities: ['High-Speed Wi-Fi', 'Climate Control', 'Smart TV', 'Garden Balcony'],
          },
          {
            id: `room-${Date.now()}-201`,
            number: '201',
            name: 'Panoramic Executive Suite',
            floor: 2,
            type: starterCategories[1].name,
            status: 'available',
            housekeeping: 'inspected',
            ratePerNight: starterCategories[1].defaultRate,
            bedType: 'King',
            maxCapacity: 3,
            amenities: ['Living Lounge', 'Panorama Terrace', 'Mini Bar', 'High-Speed Wi-Fi'],
          },
          {
            id: `room-${Date.now()}-301`,
            number: '301',
            name: 'Grand Royal Villa',
            floor: 3,
            type: starterCategories[2].name,
            status: 'available',
            housekeeping: 'inspected',
            ratePerNight: starterCategories[2].defaultRate,
            bedType: 'Royal Master King',
            maxCapacity: 4,
            amenities: ['Private Lounge', 'Dedicated Concierge', 'Soaking Tub', 'Panoramic Deck'],
          },
        ]
      : [];

    const newProp: PropertyWorkspace = {
      id: propId,
      hotelCode: cleanCode,
      createdAt: currentDate,
      hotelInfo: {
        name: input.name.trim(),
        tagline: input.tagline.trim() || 'Hospitality & Resort Operations',
        shortLocation: input.shortLocation.trim() || 'Main City Center',
        address: input.address.trim() || input.shortLocation.trim(),
        phone: input.phone.trim() || '+92 000 0000000',
        mobile: input.mobile.trim() || input.phone.trim() || '+92 300 0000000',
        email: input.email.trim() || `desk@${cleanCode.toLowerCase()}.com`,
        website: input.website.trim() || `www.${cleanCode.toLowerCase()}.com`,
        currency: input.currency || 'PKR',
        currencySymbol: input.currencySymbol || 'Rs.',
        taxLabel: input.taxLabel.trim() || 'Hotel GST & Levy',
        taxRate: Number.isFinite(input.taxRate) ? input.taxRate : 0.13,
        ntn: input.ntn.trim() || 'NTN-PENDING',
        registrationNo: input.registrationNo.trim() || 'REG-PENDING',
      },
      roomCategories: starterCategories,
      rooms: starterRooms,
      reservations: [],
      staff: [],
      housekeepingTasks: [],
      maintenanceRequests: [],
      guests: [],
    };

    setProperties((prev) => [...prev, newProp]);

    if (adminUsername && adminPassword) {
      const displayName = (input.adminName || `${input.name.trim()} Admin`).trim();
      const initials = displayName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

      const newHotelAdmin: SystemUser = {
        id: `user-${Date.now()}`,
        name: displayName,
        username: adminUsername,
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
        designation: `Hotel Administrator (${cleanCode})`,
        avatarInitials: initials || 'HA',
        phone: input.phone.trim(),
        createdAt: currentDate,
        isActive: true,
        assignedPropertyId: propId,
      };
      setSystemUsers((prev) => [...prev, newHotelAdmin]);
    }

    return { property: newProp };
  };

  const deleteProperty = (propertyId: string) => {
    if (!isMasterAdmin) {
      alert('Access Denied: Only Master Administrator can remove hotels.');
      return;
    }
    if (properties.length <= 1) {
      alert('At least one hotel or resort property must remain in the system.');
      return;
    }
    const remaining = properties.filter((p) => p.id !== propertyId);
    setProperties(remaining);
    // Also remove users exclusively assigned to that deleted hotel
    setSystemUsers((prev) => prev.filter((u) => u.assignedPropertyId !== propertyId));
    if (activePropertyId === propertyId && remaining.length > 0) {
      clearOpenEntityModals();
      setActivePropertyId(remaining[0].id);
    }
  };

  // Hotel Info Management
  const updateHotelInfo = (updates: Partial<HotelInfo>) => {
    if (!isAdmin) {
      alert('Access Denied: Only Administrator can update hotel identity and tax settings.');
      return;
    }
    updateActiveProperty((prop) => ({
      ...prop,
      hotelInfo: { ...prop.hotelInfo, ...updates },
    }));
  };

  const resetHotelInfo = () => {
    if (!isAdmin) return;
    updateActiveProperty((prop) => ({
      ...prop,
      hotelInfo: DEFAULT_HOTEL_INFO,
    }));
  };

  // Room Category Management
  const addRoomCategory = (cat: Omit<RoomCategory, 'id'>): RoomCategory => {
    const newCat: RoomCategory = {
      ...cat,
      id: `cat-${Date.now()}`,
    };
    updateActiveProperty((prop) => ({
      ...prop,
      roomCategories: [...prop.roomCategories, newCat],
    }));
    return newCat;
  };

  const updateRoomCategory = (catId: string, updates: Partial<RoomCategory>) => {
    if (!isAdmin) {
      alert('Access Denied: Only Administrator can edit room categories.');
      return;
    }
    const oldCat = roomCategories.find((c) => c.id === catId);
    updateActiveProperty((prop) => ({
      ...prop,
      roomCategories: prop.roomCategories.map((c) => (c.id === catId ? { ...c, ...updates } : c)),
      rooms:
        oldCat && updates.name && updates.name !== oldCat.name
          ? prop.rooms.map((r) => (r.type === oldCat.name ? { ...r, type: updates.name! } : r))
          : prop.rooms,
      reservations:
        oldCat && updates.name && updates.name !== oldCat.name
          ? prop.reservations.map((res) =>
              res.roomType === oldCat.name ? { ...res, roomType: updates.name! } : res
            )
          : prop.reservations,
    }));
  };

  const deleteRoomCategory = (catId: string) => {
    if (!isAdmin) {
      alert('Access Denied: Only Administrator can delete room categories.');
      return;
    }
    const cat = roomCategories.find((c) => c.id === catId);
    if (!cat) return;
    const inUse = rooms.some((r) => r.type === cat.name);
    if (inUse) {
      alert(`Cannot delete category "${cat.name}" while rooms are assigned to it. Reassign those rooms first.`);
      return;
    }
    updateActiveProperty((prop) => ({
      ...prop,
      roomCategories: prop.roomCategories.filter((c) => c.id !== catId),
    }));
  };

  // Password-verified authentication (supports Username OR Email)
  const authenticateAndSetUser = (matched: SystemUser, preferredPropertyId?: string) => {
    const authUser: AuthUser = {
      id: matched.id,
      name: matched.name,
      username: matched.username,
      email: matched.email,
      role: matched.role,
      designation: matched.designation,
      avatarInitials: matched.avatarInitials,
      assignedPropertyId: matched.assignedPropertyId || 'all',
    };
    setCurrentUser(authUser);
    clearOpenEntityModals();

    if (matched.role !== 'master_admin' && matched.assignedPropertyId && matched.assignedPropertyId !== 'all') {
      const assignedExists = properties.some((p) => p.id === matched.assignedPropertyId);
      if (assignedExists) {
        setActivePropertyId(matched.assignedPropertyId);
        return;
      }
    }
    if (preferredPropertyId && properties.some((p) => p.id === preferredPropertyId)) {
      setActivePropertyId(preferredPropertyId);
    }
  };

  const findUserByIdentifier = (identifier: string) => {
    const clean = identifier.trim().toLowerCase();
    return systemUsers.find(
      (u) =>
        u.id === identifier ||
        u.username.toLowerCase() === clean ||
        u.email.toLowerCase() === clean
    );
  };

  const login = (
    identifier: string,
    pass: string,
    preferredPropertyId?: string
  ): { ok: boolean; error?: string } => {
    const userRecord = findUserByIdentifier(identifier);
    if (!userRecord) {
      return { ok: false, error: 'No account found with that username or email.' };
    }
    if (!userRecord.isActive) {
      return { ok: false, error: 'This account has been deactivated by Master Admin.' };
    }
    if (userRecord.password !== pass) {
      return { ok: false, error: 'Incorrect password. Authentication required.' };
    }

    // Verify hotel isolation if a specific hotel was selected on login
    if (
      userRecord.role !== 'master_admin' &&
      preferredPropertyId &&
      userRecord.assignedPropertyId &&
      userRecord.assignedPropertyId !== 'all' &&
      userRecord.assignedPropertyId !== preferredPropertyId
    ) {
      const assignedProp = properties.find((p) => p.id === userRecord.assignedPropertyId);
      return {
        ok: false,
        error: `Access Restricted: This account belongs strictly to ${
          assignedProp ? `${assignedProp.hotelInfo.name} (${assignedProp.hotelCode})` : 'another hotel'
        }.`,
      };
    }

    authenticateAndSetUser(userRecord, preferredPropertyId);
    return { ok: true };
  };

  const switchAccountWithPassword = (
    identifier: string,
    pass: string
  ): { ok: boolean; error?: string } => {
    const target = findUserByIdentifier(identifier);
    if (!target) {
      return { ok: false, error: 'Target account not found.' };
    }
    if (!target.isActive) {
      return { ok: false, error: 'Target account is inactive.' };
    }
    if (!pass || target.password !== pass) {
      return { ok: false, error: 'Invalid password for target role/account.' };
    }
    authenticateAndSetUser(target);
    return { ok: true };
  };

  const logout = () => {
    clearOpenEntityModals();
    setCurrentUser(null);
  };

  const addSystemUser = (
    user: Omit<SystemUser, 'id' | 'avatarInitials' | 'createdAt' | 'isActive'>
  ): { user: SystemUser | null; error?: string } => {
    if (!isAdmin) {
      return { user: null, error: 'Access Denied: Only Administrator can add user accounts.' };
    }
    if (!isMasterAdmin && user.role !== 'manager') {
      return { user: null, error: 'Hotel Admin can only create Manager accounts for their own hotel.' };
    }

    const cleanUsername = user.username.trim();
    const cleanEmail = user.email.trim();
    const exists = systemUsers.some(
      (u) =>
        u.username.toLowerCase() === cleanUsername.toLowerCase() ||
        (cleanEmail && u.email.toLowerCase() === cleanEmail.toLowerCase())
    );
    if (exists) {
      return { user: null, error: 'An account with this username or email already exists.' };
    }

    const initials = user.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    const assignedProp =
      user.role === 'master_admin'
        ? 'all'
        : isMasterAdmin
        ? user.assignedPropertyId || activeProperty.id
        : activeProperty.id; // Hotel Admin locked strictly to their own hotel

    const newUser: SystemUser = {
      ...user,
      username: cleanUsername,
      email: cleanEmail || `${cleanUsername.toLowerCase()}@${activeProperty.hotelCode.toLowerCase()}.pms`,
      id: `user-${Date.now()}`,
      avatarInitials: initials || 'MG',
      createdAt: currentDate,
      isActive: true,
      assignedPropertyId: assignedProp,
    };
    setSystemUsers((prev) => [...prev, newUser]);
    return { user: newUser };
  };

  const updateSystemUser = (userId: string, updates: Partial<SystemUser>) => {
    if (!isAdmin) {
      alert('Access Denied: Only Administrator can modify accounts.');
      return;
    }
    const target = systemUsers.find((u) => u.id === userId);
    if (!target) return;

    if (!isMasterAdmin) {
      if (target.role !== 'manager' || target.assignedPropertyId !== activeProperty.id) {
        alert('Access Denied: Hotel Admin can only modify Managers within their own hotel.');
        return;
      }
    }

    setSystemUsers((prev) =>
      prev.map((u) => {
        if (u.id !== userId) return u;
        const nextName = updates.name ?? u.name;
        const initials = nextName
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2);
        return { ...u, ...updates, avatarInitials: initials || u.avatarInitials };
      })
    );
    if (currentUser?.id === userId) {
      setCurrentUser((prev) => (prev ? { ...prev, ...updates } : prev));
    }
  };

  const deleteSystemUser = (userId: string) => {
    if (!isAdmin) {
      alert('Access Denied: Only Administrator can delete user accounts.');
      return;
    }
    if (currentUser?.id === userId) {
      alert('You cannot delete the currently signed-in account.');
      return;
    }
    const target = systemUsers.find((u) => u.id === userId);
    if (!target) return;
    if (target.role === 'master_admin') {
      alert('Master Administrator account cannot be deleted.');
      return;
    }
    if (!isMasterAdmin && (target.role !== 'manager' || target.assignedPropertyId !== activeProperty.id)) {
      alert('Access Denied: Hotel Admin can only remove Managers within their own hotel.');
      return;
    }
    setSystemUsers((prev) => prev.filter((u) => u.id !== userId));
  };

  // Room Operations
  const addRoom = (roomData: Omit<Room, 'id'>) => {
    if (!isAdmin) {
      alert('Access Denied: Only Administrator can add new rooms to inventory.');
      return;
    }
    const newRoom: Room = {
      ...roomData,
      id: `room-${Date.now()}`,
    };
    updateActiveProperty((prop) => ({
      ...prop,
      rooms: [...prop.rooms, newRoom],
    }));
  };

  const editRoom = (roomId: string, updates: Partial<Room>) => {
    if (!isAdmin && !isManager) return;
    updateActiveProperty((prop) => ({
      ...prop,
      rooms: prop.rooms.map((r) => (r.id === roomId ? { ...r, ...updates } : r)),
      reservations:
        updates.name !== undefined || updates.type !== undefined || updates.number !== undefined
          ? prop.reservations.map((res) =>
              res.roomId === roomId
                ? {
                    ...res,
                    roomName: updates.name ?? res.roomName,
                    roomType: updates.type ?? res.roomType,
                    roomNumber: updates.number ?? res.roomNumber,
                  }
                : res
            )
          : prop.reservations,
    }));
  };

  const deleteRoom = (roomId: string) => {
    if (!isAdmin) {
      alert('Access Denied: Only Administrator has permission to delete room inventory.');
      return;
    }
    const room = rooms.find((r) => r.id === roomId);
    if (room?.status === 'occupied') {
      alert(`Cannot delete Room #${room.number} because it is currently occupied by an active guest.`);
      return;
    }
    updateActiveProperty((prop) => ({
      ...prop,
      rooms: prop.rooms.filter((r) => r.id !== roomId),
    }));
    if (selectedRoomForDetail?.id === roomId) {
      setSelectedRoomForDetail(null);
    }
  };

  const deleteStaffMember = (staffId: string) => {
    if (!isAdmin) {
      alert('Access Denied: Only Administrator can terminate or remove staff profiles.');
      return;
    }
    updateActiveProperty((prop) => ({
      ...prop,
      staff: prop.staff.filter((s) => s.id !== staffId),
    }));
  };

  const deleteReservation = (reservationId: string) => {
    if (!isAdmin) {
      alert('Access Denied: Only Administrator can permanently purge booking records.');
      return;
    }
    const res = reservations.find((r) => r.id === reservationId);
    updateActiveProperty((prop) => ({
      ...prop,
      rooms: res
        ? prop.rooms.map((r) =>
            r.id === res.roomId && r.currentReservationId === res.id
              ? {
                  ...r,
                  status: 'available',
                  currentGuestId: undefined,
                  currentGuestName: undefined,
                  currentReservationId: undefined,
                }
              : r
          )
        : prop.rooms,
      reservations: prop.reservations.filter((r) => r.id !== reservationId),
    }));
    if (selectedReservationForFolio?.id === reservationId) {
      setSelectedReservationForFolio(null);
    }
  };

  const updateReservationDetails = (reservationId: string, updates: Partial<Reservation>) => {
    if (!isAdmin && !isManager) return;
    updateActiveProperty((prop) => ({
      ...prop,
      reservations: prop.reservations.map((r) => {
        if (r.id !== reservationId) return r;
        const updated = { ...r, ...updates };

        const nightlyRate = updates.nightlyRate ?? r.nightlyRate;
        const nightsCount = updates.nightsCount ?? r.nightsCount;
        const plan = updates.mealPlan ?? r.mealPlan;
        const roomTotal = nightlyRate * nightsCount;

        let mealPlanDailyRate = 0;
        if (plan === 'Desi & Continental Breakfast') mealPlanDailyRate = 2500 * updated.adults;
        if (plan === 'Half Board (Breakfast & Dinner Buffet)') mealPlanDailyRate = 6500 * updated.adults;
        if (plan === 'Full Board (All Meals & Balti High Tea)') mealPlanDailyRate = 12000 * updated.adults;

        const mealPlanTotal = mealPlanDailyRate * nightsCount;
        const dType = updates.discountType ?? r.discountType ?? 'flat';
        const dValue = updates.discountValue ?? r.discountValue ?? 0;

        const { discountAmount, taxAmount, totalAmount } = computeReservationTotals(
          roomTotal,
          mealPlanTotal,
          r.extrasTotal,
          dType,
          dValue,
          prop.hotelInfo.taxRate
        );

        updated.roomTotal = roomTotal;
        updated.mealPlanTotal = mealPlanTotal;
        updated.discountType = dType;
        updated.discountValue = dValue;
        updated.discountAmount = discountAmount;
        updated.taxAmount = taxAmount;
        updated.totalAmount = totalAmount;
        updated.paymentStatus =
          updated.paidAmount >= totalAmount ? 'paid' : updated.paidAmount > 0 ? 'partial' : 'pending';

        return updated;
      }),
    }));
  };

  const applyDiscountToReservation = (
    reservationId: string,
    discountType: DiscountType,
    discountValue: number,
    discountReason?: string
  ) => {
    updateActiveProperty((prop) => ({
      ...prop,
      reservations: prop.reservations.map((r) => {
        if (r.id !== reservationId) return r;
        const { discountAmount, taxAmount, totalAmount } = computeReservationTotals(
          r.roomTotal,
          r.mealPlanTotal,
          r.extrasTotal,
          discountType,
          discountValue,
          prop.hotelInfo.taxRate
        );
        const paymentStatus =
          r.paidAmount >= totalAmount ? 'paid' : r.paidAmount > 0 ? 'partial' : 'pending';

        return {
          ...r,
          discountType,
          discountValue,
          discountAmount,
          discountReason: discountReason || undefined,
          taxAmount,
          totalAmount,
          paymentStatus,
        };
      }),
    }));
  };

  const checkInReservation = (reservationId: string) => {
    const res = reservations.find((r) => r.id === reservationId);
    if (!res) return;
    const nowStr = `${currentDate} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    updateActiveProperty((prop) => {
      const existingGuest = prop.guests.find(
        (g) => g.email.toLowerCase() === res.guestEmail.toLowerCase()
      );
      const nextGuests = existingGuest
        ? prop.guests.map((g) =>
            g.id === existingGuest.id
              ? { ...g, totalStays: g.totalStays + 1, lastStayDate: currentDate }
              : g
          )
        : [
            ...prop.guests,
            {
              id: `guest-${Date.now()}`,
              name: res.guestName,
              email: res.guestEmail,
              phone: res.guestPhone,
              cnicOrPassport: res.guestCnicOrPassport,
              cityOrCountry: res.cityOrCountry,
              vipStatus: 'Standard' as const,
              totalStays: 1,
              totalSpend: res.totalAmount,
              preferences: res.specialRequests || 'Standard guest requirements',
              lastStayDate: currentDate,
            },
          ];

      return {
        ...prop,
        reservations: prop.reservations.map((item) =>
          item.id === reservationId ? { ...item, status: 'checked_in', checkedInAt: nowStr } : item
        ),
        rooms: prop.rooms.map((r) =>
          r.id === res.roomId
            ? {
                ...r,
                status: 'occupied',
                currentGuestId: res.id,
                currentGuestName: res.guestName,
                currentReservationId: res.id,
              }
            : r
        ),
        guests: nextGuests,
      };
    });
  };

  const checkOutReservation = (reservationId: string, paymentMethod?: string) => {
    const res = reservations.find((r) => r.id === reservationId);
    if (!res) return;
    const nowStr = `${currentDate} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    const newTask: HousekeepingTask = {
      id: `task-${Date.now()}`,
      roomId: res.roomId,
      roomNumber: res.roomNumber,
      taskType: 'Full Turnover',
      priority: 'high',
      status: 'pending',
      notes: `Departure turnover for ${res.guestName}. Sanitize suite, refresh bed linens, and restock amenities.`,
      scheduledTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    updateActiveProperty((prop) => ({
      ...prop,
      reservations: prop.reservations.map((item) =>
        item.id === reservationId
          ? {
              ...item,
              status: 'checked_out',
              checkedOutAt: nowStr,
              paidAmount: item.totalAmount,
              paymentStatus: 'paid',
              paymentMethod: (paymentMethod as any) || item.paymentMethod,
            }
          : item
      ),
      rooms: prop.rooms.map((r) =>
        r.id === res.roomId
          ? {
              ...r,
              status: 'available',
              housekeeping: 'dirty',
              currentGuestId: undefined,
              currentGuestName: undefined,
              currentReservationId: undefined,
              notes: `Prior guest departed at ${nowStr}`,
            }
          : r
      ),
      housekeepingTasks: [newTask, ...prop.housekeepingTasks],
    }));
  };

  const cancelReservation = (reservationId: string) => {
    const res = reservations.find((r) => r.id === reservationId);
    if (!res) return;

    updateActiveProperty((prop) => ({
      ...prop,
      reservations: prop.reservations.map((item) =>
        item.id === reservationId ? { ...item, status: 'cancelled' } : item
      ),
      rooms: prop.rooms.map((r) =>
        r.id === res.roomId && r.currentReservationId === res.id
          ? {
              ...r,
              status: 'available',
              currentGuestId: undefined,
              currentGuestName: undefined,
              currentReservationId: undefined,
            }
          : r
      ),
    }));
  };

  const createReservation = (data: NewReservationInput): Reservation => {
    const room = rooms.find((r) => r.id === data.roomId);
    if (!room) throw new Error('Room not found');

    const checkIn = new Date(data.checkInDate);
    const checkOut = new Date(data.checkOutDate);
    const timeDiff = Math.max(1, checkOut.getTime() - checkIn.getTime());
    const nightsCount = Math.max(1, Math.ceil(timeDiff / (1000 * 3600 * 24)));

    let mealRatePerNight = 0;
    if (data.mealPlan === 'Desi & Continental Breakfast') mealRatePerNight = 2500 * data.adults;
    if (data.mealPlan === 'Half Board (Breakfast & Dinner Buffet)') mealRatePerNight = 6500 * data.adults;
    if (data.mealPlan === 'Full Board (All Meals & Balti High Tea)') mealRatePerNight = 12000 * data.adults;

    const roomTotal = room.ratePerNight * nightsCount;
    const mealPlanTotal = mealRatePerNight * nightsCount;
    const extrasTotal = 0;

    const dType = data.discountType || 'flat';
    const dValue = data.discountValue || 0;
    const { discountAmount, taxAmount, totalAmount } = computeReservationTotals(
      roomTotal,
      mealPlanTotal,
      extrasTotal,
      dType,
      dValue,
      hotelInfo.taxRate
    );

    const initialPaid = Math.min(data.initialPayment, totalAmount);
    let paymentStatus: 'paid' | 'partial' | 'pending' = 'pending';
    if (initialPaid >= totalAmount) paymentStatus = 'paid';
    else if (initialPaid > 0) paymentStatus = 'partial';

    const prefix =
      hotelInfo.name
        .replace(/[^A-Za-z]/g, '')
        .slice(0, 2)
        .toUpperCase() || 'RS';

    const newRes: Reservation = {
      id: `res-${Date.now()}`,
      bookingRef: `${prefix}-${Math.floor(7000 + Math.random() * 2000)}`,
      guestName: data.guestName,
      guestEmail: data.guestEmail,
      guestPhone: data.guestPhone,
      guestCnicOrPassport: data.guestCnicOrPassport,
      cityOrCountry: data.cityOrCountry,
      roomId: room.id,
      roomNumber: room.number,
      roomName: room.name,
      roomType: room.type,
      checkInDate: data.checkInDate,
      checkOutDate: data.checkOutDate,
      adults: data.adults,
      children: data.children,
      mealPlan: data.mealPlan,
      extras: [],
      nightlyRate: room.ratePerNight,
      nightsCount,
      roomTotal,
      mealPlanTotal,
      extrasTotal,
      discountType: dType,
      discountValue: dValue,
      discountAmount,
      discountReason: data.discountReason,
      taxAmount,
      totalAmount,
      paidAmount: initialPaid,
      paymentStatus,
      paymentMethod: data.paymentMethod,
      status: 'confirmed',
      specialRequests: data.specialRequests,
      createdAt: currentDate,
    };

    updateActiveProperty((prop) => {
      const existingGuest = prop.guests.find(
        (g) => g.email.toLowerCase() === data.guestEmail.toLowerCase()
      );
      const nextGuests = existingGuest
        ? prop.guests.map((g) =>
            g.id === existingGuest.id
              ? {
                  ...g,
                  totalSpend: g.totalSpend + totalAmount,
                  totalStays: g.totalStays + 1,
                  lastStayDate: data.checkInDate,
                }
              : g
          )
        : [
            ...prop.guests,
            {
              id: `guest-${Date.now()}`,
              name: data.guestName,
              email: data.guestEmail,
              phone: data.guestPhone,
              cnicOrPassport: data.guestCnicOrPassport,
              cityOrCountry: data.cityOrCountry,
              vipStatus: 'Standard' as const,
              totalStays: 1,
              totalSpend: totalAmount,
              preferences: data.specialRequests || 'Standard guest requirements',
              lastStayDate: data.checkInDate,
            },
          ];

      return {
        ...prop,
        reservations: [newRes, ...prop.reservations],
        rooms:
          data.checkInDate === currentDate && room.status === 'available'
            ? prop.rooms.map((r) => (r.id === room.id ? { ...r, status: 'reserved' } : r))
            : prop.rooms,
        guests: nextGuests,
      };
    });

    return newRes;
  };

  const addExtraCharge = (reservationId: string, chargeData: Omit<ExtraCharge, 'id' | 'date'>) => {
    const charge: ExtraCharge = {
      id: `ext-${Date.now()}`,
      description: chargeData.description,
      category: chargeData.category,
      amount: chargeData.amount,
      date: currentDate,
      addedBy:
        chargeData.addedBy || `${currentUser?.name || 'Front Desk'} (${currentUser?.role || 'Staff'})`,
    };

    updateActiveProperty((prop) => ({
      ...prop,
      reservations: prop.reservations.map((res) => {
        if (res.id !== reservationId) return res;

        const newExtras = [...res.extras, charge];
        const newExtrasTotal = newExtras.reduce((sum, item) => sum + item.amount, 0);
        const { discountAmount, taxAmount, totalAmount } = computeReservationTotals(
          res.roomTotal,
          res.mealPlanTotal,
          newExtrasTotal,
          res.discountType || 'flat',
          res.discountValue || 0,
          prop.hotelInfo.taxRate
        );

        let newPaymentStatus = res.paymentStatus;
        if (res.paidAmount < totalAmount) {
          newPaymentStatus = res.paidAmount > 0 ? 'partial' : 'pending';
        }

        return {
          ...res,
          extras: newExtras,
          extrasTotal: newExtrasTotal,
          discountAmount,
          taxAmount,
          totalAmount,
          paymentStatus: newPaymentStatus,
        };
      }),
    }));
  };

  const updateRoom = (roomId: string, updates: Partial<Room>) => {
    updateActiveProperty((prop) => ({
      ...prop,
      rooms: prop.rooms.map((r) => (r.id === roomId ? { ...r, ...updates } : r)),
    }));
  };

  const updateHousekeepingStatus = (roomId: string, status: HousekeepingStatus) => {
    updateActiveProperty((prop) => ({
      ...prop,
      rooms: prop.rooms.map((r) => {
        if (r.id !== roomId) return r;
        return {
          ...r,
          housekeeping: status,
          status:
            status === 'clean' || status === 'inspected'
              ? r.status === 'occupied'
                ? 'occupied'
                : 'available'
              : r.status,
        };
      }),
      housekeepingTasks:
        status === 'clean' || status === 'inspected'
          ? prop.housekeepingTasks.map((t) =>
              t.roomId === roomId && t.status !== 'completed'
                ? {
                    ...t,
                    status: 'completed',
                    completedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  }
                : t
            )
          : prop.housekeepingTasks,
    }));
  };

  const createHousekeepingTask = (task: Omit<HousekeepingTask, 'id'>) => {
    const newTask: HousekeepingTask = { ...task, id: `task-${Date.now()}` };
    updateActiveProperty((prop) => ({
      ...prop,
      housekeepingTasks: [newTask, ...prop.housekeepingTasks],
      rooms:
        task.status === 'in_progress'
          ? prop.rooms.map((r) => (r.id === task.roomId ? { ...r, housekeeping: 'cleaning_in_progress' } : r))
          : prop.rooms,
    }));
  };

  const updateHousekeepingTask = (taskId: string, updates: Partial<HousekeepingTask>) => {
    updateActiveProperty((prop) => {
      const targetTask = prop.housekeepingTasks.find((t) => t.id === taskId);
      const nextTasks = prop.housekeepingTasks.map((t) => {
        if (t.id !== taskId) return t;
        const updated = { ...t, ...updates };
        if (updates.status === 'completed' && !updated.completedAt) {
          updated.completedAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        return updated;
      });
      let nextRooms = prop.rooms;
      if (targetTask) {
        if (updates.status === 'completed') {
          nextRooms = prop.rooms.map((r) =>
            r.id === targetTask.roomId ? { ...r, housekeeping: 'inspected' } : r
          );
        } else if (updates.status === 'in_progress') {
          nextRooms = prop.rooms.map((r) =>
            r.id === targetTask.roomId ? { ...r, housekeeping: 'cleaning_in_progress' } : r
          );
        }
      }
      return { ...prop, housekeepingTasks: nextTasks, rooms: nextRooms };
    });
  };

  const createMaintenanceRequest = (req: Omit<MaintenanceRequest, 'id' | 'reportedAt'>) => {
    const newReq: MaintenanceRequest = {
      ...req,
      id: `maint-${Date.now()}`,
      reportedAt: `${currentDate} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
    };
    updateActiveProperty((prop) => ({
      ...prop,
      maintenanceRequests: [newReq, ...prop.maintenanceRequests],
      rooms:
        req.priority === 'urgent' || req.priority === 'high'
          ? prop.rooms.map((r) =>
              r.id === req.roomId ? { ...r, status: 'maintenance', notes: `Maintenance: ${req.issueTitle}` } : r
            )
          : prop.rooms,
    }));
  };

  const resolveMaintenanceRequest = (reqId: string, notes?: string) => {
    const target = maintenanceRequests.find((m) => m.id === reqId);
    updateActiveProperty((prop) => ({
      ...prop,
      maintenanceRequests: prop.maintenanceRequests.map((m) =>
        m.id === reqId
          ? {
              ...m,
              status: 'resolved',
              resolvedAt: `${currentDate} ${new Date().toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}`,
              notes: notes ? `${m.notes ? m.notes + ' | ' : ''}${notes}` : m.notes,
            }
          : m
      ),
      rooms: target
        ? prop.rooms.map((r) =>
            r.id === target.roomId ? { ...r, status: 'available', notes: undefined } : r
          )
        : prop.rooms,
    }));
  };

  const addStaffMember = (member: Omit<StaffMember, 'id'>) => {
    if (!isAdmin) {
      alert('Access Denied: Only Administrator can recruit and onboard new staff members.');
      return;
    }
    const initials = member.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    const newStaff: StaffMember = {
      ...member,
      id: `staff-${Date.now()}`,
      avatarInitials: initials || 'ST',
    };
    updateActiveProperty((prop) => ({
      ...prop,
      staff: [...prop.staff, newStaff],
    }));
  };

  const updateStaffMember = (staffId: string, updates: Partial<StaffMember>) => {
    updateActiveProperty((prop) => ({
      ...prop,
      staff: prop.staff.map((s) => (s.id === staffId ? { ...s, ...updates } : s)),
    }));
  };

  const toggleStaffDuty = (staffId: string) => {
    updateActiveProperty((prop) => ({
      ...prop,
      staff: prop.staff.map((s) => {
        if (s.id !== staffId) return s;
        const nextStatus: Record<string, 'on_duty' | 'off_duty' | 'break'> = {
          on_duty: 'break',
          break: 'off_duty',
          off_duty: 'on_duty',
          on_leave: 'on_duty',
        };
        return { ...s, status: nextStatus[s.status] || 'on_duty' };
      }),
    }));
  };

  const addOrUpdateGuest = (guestData: Omit<GuestProfile, 'id'>): GuestProfile => {
    const existing = guests.find((g) => g.email.toLowerCase() === guestData.email.toLowerCase());
    if (existing) {
      const updated: GuestProfile = { ...existing, ...guestData };
      updateActiveProperty((prop) => ({
        ...prop,
        guests: prop.guests.map((g) => (g.id === existing.id ? updated : g)),
      }));
      return updated;
    } else {
      const newGuest: GuestProfile = { ...guestData, id: `guest-${Date.now()}` };
      updateActiveProperty((prop) => ({
        ...prop,
        guests: [...prop.guests, newGuest],
      }));
      return newGuest;
    }
  };

  const resetToDemoData = () => {
    if (!isMasterAdmin) {
      alert('Access Denied: Only Master Administrator can perform platform-wide database resets.');
      return;
    }
    const defaultProp = createDefaultMashakalaProperty();
    setProperties([defaultProp]);
    setActivePropertyId(defaultProp.id);
    setSystemUsers(INITIAL_SYSTEM_USERS);
    clearOpenEntityModals();
    Object.values(STORAGE_KEYS).forEach((k) => {
      try { localStorage.removeItem(k); } catch {}
    });
  };

  const totalRooms = rooms.length;
  const occupiedRooms = rooms.filter((r) => r.status === 'occupied').length;
  const availableRooms = rooms.filter((r) => r.status === 'available').length;
  const dirtyRooms = rooms.filter(
    (r) => r.housekeeping === 'dirty' || r.housekeeping === 'cleaning_in_progress'
  ).length;
  const maintenanceRooms = rooms.filter((r) => r.status === 'maintenance').length;
  const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

  const todayArrivals = reservations.filter(
    (r) => r.checkInDate === currentDate && (r.status === 'confirmed' || r.status === 'checked_in')
  );
  const todayDepartures = reservations.filter(
    (r) => r.checkOutDate === currentDate && (r.status === 'checked_in' || r.status === 'checked_out')
  );
  const activeInHouse = reservations.filter((r) => r.status === 'checked_in');
  const todayRevenue = activeInHouse.reduce((acc, curr) => acc + curr.nightlyRate, 0);
  const totalActiveRevenue = reservations.reduce(
    (acc, curr) => acc + (curr.status !== 'cancelled' ? curr.paidAmount : 0),
    0
  );
  const totalDiscountsGiven = reservations.reduce(
    (acc, curr) => acc + (curr.status !== 'cancelled' ? curr.discountAmount || 0 : 0),
    0
  );

  const onDutyStaffCount = staff.filter((s) => s.status === 'on_duty').length;
  const pendingTasksCount = housekeepingTasks.filter((t) => t.status !== 'completed').length;
  const urgentMaintenanceCount = maintenanceRequests.filter(
    (m) => m.status !== 'resolved' && m.priority === 'urgent'
  ).length;
  const adr = occupiedRooms > 0 ? Math.round(todayRevenue / occupiedRooms) : 0;
  const revPAR = totalRooms > 0 ? Math.round(todayRevenue / totalRooms) : 0;

  return (
    <HotelContext.Provider
      value={{
        properties,
        accessibleProperties,
        activePropertyId: activeProperty.id,
        activeProperty,
        switchProperty,
        addProperty,
        deleteProperty,

        hotelInfo,
        updateHotelInfo,
        resetHotelInfo,
        formatPrice,

        roomCategories,
        addRoomCategory,
        updateRoomCategory,
        deleteRoomCategory,

        systemUsers,
        addSystemUser,
        updateSystemUser,
        deleteSystemUser,

        rooms,
        reservations,
        staff,
        housekeepingTasks,
        maintenanceRequests,
        guests,
        currentDate,

        currentUser,
        login,
        switchAccountWithPassword,
        logout,
        isMasterAdmin,
        isAdmin,
        isManager,

        selectedRoomForDetail,
        setSelectedRoomForDetail,
        selectedReservationForFolio,
        setSelectedReservationForFolio,
        isNewReservationModalOpen,
        setIsNewReservationModalOpen,
        isNewStaffModalOpen,
        setIsNewStaffModalOpen,
        isReportMaintenanceModalOpen,
        setIsReportMaintenanceModalOpen,
        isAddChargeModalOpen,
        setIsAddChargeModalOpen,
        reservationForCharge,
        setReservationForCharge,
        quickCheckInRoom,
        setQuickCheckInRoom,

        isRoomFormModalOpen,
        setIsRoomFormModalOpen,
        roomToEdit,
        setRoomToEdit,
        addRoom,
        editRoom,
        deleteRoom,

        reservationToEdit,
        setReservationToEdit,
        isReservationEditModalOpen,
        setIsReservationEditModalOpen,
        updateReservationDetails,
        applyDiscountToReservation,
        deleteReservation,
        deleteStaffMember,

        checkInReservation,
        checkOutReservation,
        cancelReservation,
        createReservation,
        addExtraCharge,
        updateRoom,
        updateHousekeepingStatus,
        createHousekeepingTask,
        updateHousekeepingTask,
        createMaintenanceRequest,
        resolveMaintenanceRequest,
        addStaffMember,
        updateStaffMember,
        toggleStaffDuty,
        addOrUpdateGuest,
        resetToDemoData,

        stats: {
          totalRooms,
          occupiedRooms,
          availableRooms,
          dirtyRooms,
          maintenanceRooms,
          occupancyRate,
          todayArrivals,
          todayDepartures,
          activeInHouse,
          todayRevenue,
          totalActiveRevenue,
          totalDiscountsGiven,
          onDutyStaffCount,
          pendingTasksCount,
          urgentMaintenanceCount,
          revPAR,
          adr,
        },
      }}
    >
      {children}
    </HotelContext.Provider>
  );
};

export const useHotel = () => {
  const context = useContext(HotelContext);
  if (!context) {
    throw new Error('useHotel must be used within a HotelProvider');
  }
  return context;
};
