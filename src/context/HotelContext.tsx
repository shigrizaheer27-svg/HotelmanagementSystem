import React, { createContext, useContext, useState, useEffect } from 'react';
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
  RoomType,
  AuthUser,
  UserRole,
  PakistaniPaymentMethod
} from '../types/hotel';
import {
  INITIAL_ROOMS,
  INITIAL_RESERVATIONS,
  INITIAL_STAFF,
  INITIAL_HOUSEKEEPING_TASKS,
  INITIAL_MAINTENANCE,
  INITIAL_GUESTS,
  HOTEL_INFO
} from '../data/mockData';

export const PRESET_USERS: Record<string, AuthUser & { pass: string }> = {
  admin: {
    id: 'user-admin',
    name: 'Haider Ali Shigri',
    email: 'admin@mashakalaresort.pk',
    role: 'admin',
    designation: 'General Manager & System Admin',
    avatarInitials: 'HA',
    pass: 'admin123',
  },
  manager: {
    id: 'user-manager',
    name: 'Ali Shigri',
    email: 'manager@mashakalaresort.pk',
    role: 'manager',
    designation: 'Front Desk Operations Manager',
    avatarInitials: 'AS',
    pass: 'manager123',
  },
};

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
  specialRequests?: string;
}

interface HotelContextType {
  hotelInfo: typeof HOTEL_INFO;
  rooms: Room[];
  reservations: Reservation[];
  staff: StaffMember[];
  housekeepingTasks: HousekeepingTask[];
  maintenanceRequests: MaintenanceRequest[];
  guests: GuestProfile[];
  currentDate: string;

  // Auth & Roles
  currentUser: AuthUser | null;
  login: (email: string, pass: string) => boolean;
  logout: () => void;
  switchRole: (role: UserRole) => void;
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

  // Room Management (Admin/Manager)
  isRoomFormModalOpen: boolean;
  setIsRoomFormModalOpen: (open: boolean) => void;
  roomToEdit: Room | null;
  setRoomToEdit: (room: Room | null) => void;
  addRoom: (roomData: Omit<Room, 'id'>) => void;
  editRoom: (roomId: string, updates: Partial<Room>) => void;
  deleteRoom: (roomId: string) => void;

  // Reservation Editing (Admin)
  reservationToEdit: Reservation | null;
  setReservationToEdit: (res: Reservation | null) => void;
  isReservationEditModalOpen: boolean;
  setIsReservationEditModalOpen: (open: boolean) => void;
  updateReservationDetails: (reservationId: string, updates: Partial<Reservation>) => void;
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

  // Computed metrics (PKR)
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
    onDutyStaffCount: number;
    pendingTasksCount: number;
    urgentMaintenanceCount: number;
    revPAR: number;
    adr: number;
  };
}

const STORAGE_KEYS = {
  ROOMS: 'mashakala_pms_rooms_v2',
  RESERVATIONS: 'mashakala_pms_reservations_v2',
  STAFF: 'mashakala_pms_staff_v2',
  HOUSEKEEPING: 'mashakala_pms_housekeeping_v2',
  MAINTENANCE: 'mashakala_pms_maintenance_v2',
  GUESTS: 'mashakala_pms_guests_v2',
  AUTH: 'mashakala_pms_auth_v2',
};

const HotelContext = createContext<HotelContextType | undefined>(undefined);

export const HotelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const currentDate = '2026-11-12';

  // Auth state (defaults to Admin logged-in so user immediately has full capability)
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.AUTH);
      return saved ? JSON.parse(saved) : PRESET_USERS.admin;
    } catch {
      return PRESET_USERS.admin;
    }
  });

  // State initialization
  const [rooms, setRooms] = useState<Room[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ROOMS);
      return saved ? JSON.parse(saved) : INITIAL_ROOMS;
    } catch {
      return INITIAL_ROOMS;
    }
  });

  const [reservations, setReservations] = useState<Reservation[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.RESERVATIONS);
      return saved ? JSON.parse(saved) : INITIAL_RESERVATIONS;
    } catch {
      return INITIAL_RESERVATIONS;
    }
  });

  const [staff, setStaff] = useState<StaffMember[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STAFF);
      return saved ? JSON.parse(saved) : INITIAL_STAFF;
    } catch {
      return INITIAL_STAFF;
    }
  });

  const [housekeepingTasks, setHousekeepingTasks] = useState<HousekeepingTask[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.HOUSEKEEPING);
      return saved ? JSON.parse(saved) : INITIAL_HOUSEKEEPING_TASKS;
    } catch {
      return INITIAL_HOUSEKEEPING_TASKS;
    }
  });

  const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MAINTENANCE);
      return saved ? JSON.parse(saved) : INITIAL_MAINTENANCE;
    } catch {
      return INITIAL_MAINTENANCE;
    }
  });

  const [guests, setGuests] = useState<GuestProfile[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.GUESTS);
      return saved ? JSON.parse(saved) : INITIAL_GUESTS;
    } catch {
      return INITIAL_GUESTS;
    }
  });

  // UI modal states
  const [selectedRoomForDetail, setSelectedRoomForDetail] = useState<Room | null>(null);
  const [selectedReservationForFolio, setSelectedReservationForFolio] = useState<Reservation | null>(null);
  const [isNewReservationModalOpen, setIsNewReservationModalOpen] = useState(false);
  const [isNewStaffModalOpen, setIsNewStaffModalOpen] = useState(false);
  const [isReportMaintenanceModalOpen, setIsReportMaintenanceModalOpen] = useState(false);
  const [isAddChargeModalOpen, setIsAddChargeModalOpen] = useState(false);
  const [reservationForCharge, setReservationForCharge] = useState<Reservation | null>(null);
  const [quickCheckInRoom, setQuickCheckInRoom] = useState<Room | null>(null);

  // Room Form Modal (Add / Edit)
  const [isRoomFormModalOpen, setIsRoomFormModalOpen] = useState(false);
  const [roomToEdit, setRoomToEdit] = useState<Room | null>(null);

  // Reservation Edit Modal (Admin)
  const [reservationToEdit, setReservationToEdit] = useState<Reservation | null>(null);
  const [isReservationEditModalOpen, setIsReservationEditModalOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(STORAGE_KEYS.AUTH);
      }
    } catch (e) {
      console.error(e);
    }
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(rooms));
    } catch (e) {
      console.error(e);
    }
  }, [rooms]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(reservations));
    } catch (e) {
      console.error(e);
    }
  }, [reservations]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.STAFF, JSON.stringify(staff));
    } catch (e) {
      console.error(e);
    }
  }, [staff]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.HOUSEKEEPING, JSON.stringify(housekeepingTasks));
    } catch (e) {
      console.error(e);
    }
  }, [housekeepingTasks]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.MAINTENANCE, JSON.stringify(maintenanceRequests));
    } catch (e) {
      console.error(e);
    }
  }, [maintenanceRequests]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.GUESTS, JSON.stringify(guests));
    } catch (e) {
      console.error(e);
    }
  }, [guests]);

  // Update selected details if objects update
  useEffect(() => {
    if (selectedRoomForDetail) {
      const updated = rooms.find((r) => r.id === selectedRoomForDetail.id);
      if (updated) setSelectedRoomForDetail(updated);
    }
  }, [rooms]);

  useEffect(() => {
    if (selectedReservationForFolio) {
      const updated = reservations.find((r) => r.id === selectedReservationForFolio.id);
      if (updated) setSelectedReservationForFolio(updated);
    }
  }, [reservations]);

  // Auth Handlers
  const login = (email: string, pass: string): boolean => {
    const cleanEmail = email.trim().toLowerCase();
    if (cleanEmail === PRESET_USERS.admin.email.toLowerCase() && (pass === PRESET_USERS.admin.pass || pass === 'admin')) {
      setCurrentUser(PRESET_USERS.admin);
      return true;
    }
    if (cleanEmail === PRESET_USERS.manager.email.toLowerCase() && (pass === PRESET_USERS.manager.pass || pass === 'manager')) {
      setCurrentUser(PRESET_USERS.manager);
      return true;
    }
    // Generic manager fallback for any credentials entered
    setCurrentUser({
      id: `user-${Date.now()}`,
      name: email.split('@')[0],
      email,
      role: 'manager',
      designation: 'Duty Manager',
      avatarInitials: email.slice(0, 2).toUpperCase(),
    });
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const switchRole = (role: UserRole) => {
    if (role === 'admin') {
      setCurrentUser(PRESET_USERS.admin);
    } else {
      setCurrentUser(PRESET_USERS.manager);
    }
  };

  const isAdmin = currentUser?.role === 'admin';
  const isManager = currentUser?.role === 'manager' || isAdmin;

  // ADMIN ACTION: Add Room
  const addRoom = (roomData: Omit<Room, 'id'>) => {
    if (!isAdmin) {
      alert('Access Denied: Only Administrator can add new rooms to inventory.');
      return;
    }
    const newRoom: Room = {
      ...roomData,
      id: `room-${Date.now()}`,
    };
    setRooms((prev) => [...prev, newRoom]);
  };

  // ADMIN / MANAGER ACTION: Edit Room
  const editRoom = (roomId: string, updates: Partial<Room>) => {
    setRooms((prev) => prev.map((r) => (r.id === roomId ? { ...r, ...updates } : r)));
  };

  // ADMIN ACTION: Delete Room
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
    setRooms((prev) => prev.filter((r) => r.id !== roomId));
    if (selectedRoomForDetail?.id === roomId) {
      setSelectedRoomForDetail(null);
    }
  };

  // ADMIN ACTION: Delete Staff Member
  const deleteStaffMember = (staffId: string) => {
    if (!isAdmin) {
      alert('Access Denied: Only Administrator can terminate or remove staff profiles.');
      return;
    }
    setStaff((prev) => prev.filter((s) => s.id !== staffId));
  };

  // ADMIN ACTION: Delete Reservation
  const deleteReservation = (reservationId: string) => {
    if (!isAdmin) {
      alert('Access Denied: Only Administrator can permanently purge booking records.');
      return;
    }
    const res = reservations.find((r) => r.id === reservationId);
    if (res) {
      // Free room if occupied
      setRooms((prev) =>
        prev.map((r) => {
          if (r.id === res.roomId && r.currentReservationId === res.id) {
            return {
              ...r,
              status: 'available',
              currentGuestId: undefined,
              currentGuestName: undefined,
              currentReservationId: undefined,
            };
          }
          return r;
        })
      );
    }
    setReservations((prev) => prev.filter((r) => r.id !== reservationId));
    if (selectedReservationForFolio?.id === reservationId) {
      setSelectedReservationForFolio(null);
    }
  };

  // ADMIN ACTION: Edit Reservation Details (dates, guest, rates)
  const updateReservationDetails = (reservationId: string, updates: Partial<Reservation>) => {
    if (!isAdmin && !isManager) return;
    setReservations((prev) =>
      prev.map((r) => {
        if (r.id !== reservationId) return r;
        const updated = { ...r, ...updates };

        // Recalculate totals if nights, rate, or meal plan changed
        if (updates.nightlyRate !== undefined || updates.nightsCount !== undefined || updates.mealPlan !== undefined) {
          const roomTotal = (updates.nightlyRate ?? r.nightlyRate) * (updates.nightsCount ?? r.nightsCount);
          let mealPlanDailyRate = 0;
          const plan = updates.mealPlan ?? r.mealPlan;
          if (plan === 'Desi & Continental Breakfast') mealPlanDailyRate = 2500 * r.adults;
          if (plan === 'Half Board (Breakfast & Dinner Buffet)') mealPlanDailyRate = 6500 * r.adults;
          if (plan === 'Full Board (All Meals & Balti High Tea)') mealPlanDailyRate = 12000 * r.adults;

          const mealPlanTotal = mealPlanDailyRate * (updates.nightsCount ?? r.nightsCount);
          const subtotal = roomTotal + mealPlanTotal + r.extrasTotal;
          const taxAmount = Math.round(subtotal * HOTEL_INFO.taxRate);
          const totalAmount = subtotal + taxAmount;

          updated.roomTotal = roomTotal;
          updated.mealPlanTotal = mealPlanTotal;
          updated.taxAmount = taxAmount;
          updated.totalAmount = totalAmount;
          updated.paymentStatus = (updated.paidAmount >= totalAmount) ? 'paid' : (updated.paidAmount > 0 ? 'partial' : 'pending');
        }

        return updated;
      })
    );
  };

  // Standard PMS: Check-in
  const checkInReservation = (reservationId: string) => {
    const res = reservations.find((r) => r.id === reservationId);
    if (!res) return;

    const nowStr = `${currentDate} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    setReservations((prev) =>
      prev.map((item) =>
        item.id === reservationId
          ? {
              ...item,
              status: 'checked_in',
              checkedInAt: nowStr,
            }
          : item
      )
    );

    // Update Room
    setRooms((prev) =>
      prev.map((r) =>
        r.id === res.roomId
          ? {
              ...r,
              status: 'occupied',
              currentGuestId: res.id,
              currentGuestName: res.guestName,
              currentReservationId: res.id,
            }
          : r
      )
    );

    // Update Guest CRM
    setGuests((prev) => {
      const existing = prev.find((g) => g.email.toLowerCase() === res.guestEmail.toLowerCase());
      if (existing) {
        return prev.map((g) =>
          g.id === existing.id
            ? { ...g, totalStays: g.totalStays + 1, lastStayDate: currentDate }
            : g
        );
      } else {
        const newGuest: GuestProfile = {
          id: `guest-${Date.now()}`,
          name: res.guestName,
          email: res.guestEmail,
          phone: res.guestPhone,
          cnicOrPassport: res.guestCnicOrPassport,
          cityOrCountry: res.cityOrCountry,
          vipStatus: 'Standard',
          totalStays: 1,
          totalSpend: res.totalAmount,
          preferences: res.specialRequests || 'Standard guest requirements',
          lastStayDate: currentDate,
        };
        return [...prev, newGuest];
      }
    });
  };

  // Standard PMS: Check-out
  const checkOutReservation = (reservationId: string, paymentMethod?: string) => {
    const res = reservations.find((r) => r.id === reservationId);
    if (!res) return;

    const nowStr = `${currentDate} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    setReservations((prev) =>
      prev.map((item) =>
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
      )
    );

    // Mark room as Available & Dirty (triggers housekeeping turnover)
    setRooms((prev) =>
      prev.map((r) =>
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
      )
    );

    // Auto-create a turnover housekeeping task
    const newTask: HousekeepingTask = {
      id: `task-${Date.now()}`,
      roomId: res.roomId,
      roomNumber: res.roomNumber,
      taskType: 'Full Turnover',
      priority: 'high',
      status: 'pending',
      notes: `Departure turnover for ${res.guestName}. Restock pine wood logs, thermal blankets & mini-bar dry fruits.`,
      scheduledTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setHousekeepingTasks((prev) => [newTask, ...prev]);
  };

  // Cancel reservation
  const cancelReservation = (reservationId: string) => {
    const res = reservations.find((r) => r.id === reservationId);
    if (!res) return;

    setReservations((prev) =>
      prev.map((item) => (item.id === reservationId ? { ...item, status: 'cancelled' } : item))
    );

    setRooms((prev) =>
      prev.map((r) => {
        if (r.id === res.roomId && r.currentReservationId === res.id) {
          return {
            ...r,
            status: 'available',
            currentGuestId: undefined,
            currentGuestName: undefined,
            currentReservationId: undefined,
          };
        }
        return r;
      })
    );
  };

  // Create new reservation (PKR calculated)
  const createReservation = (data: NewReservationInput): Reservation => {
    const room = rooms.find((r) => r.id === data.roomId);
    if (!room) throw new Error('Room not found');

    const checkIn = new Date(data.checkInDate);
    const checkOut = new Date(data.checkOutDate);
    const timeDiff = Math.max(1, checkOut.getTime() - checkIn.getTime());
    const nightsCount = Math.max(1, Math.ceil(timeDiff / (1000 * 3600 * 24)));

    // Meal plan calculation per night in PKR
    let mealRatePerNight = 0;
    if (data.mealPlan === 'Desi & Continental Breakfast') mealRatePerNight = 2500 * data.adults;
    if (data.mealPlan === 'Half Board (Breakfast & Dinner Buffet)') mealRatePerNight = 6500 * data.adults;
    if (data.mealPlan === 'Full Board (All Meals & Balti High Tea)') mealRatePerNight = 12000 * data.adults;

    const roomTotal = room.ratePerNight * nightsCount;
    const mealPlanTotal = mealRatePerNight * nightsCount;
    const extrasTotal = 0;
    const subtotal = roomTotal + mealPlanTotal + extrasTotal;
    const taxAmount = Math.round(subtotal * HOTEL_INFO.taxRate);
    const totalAmount = subtotal + taxAmount;

    const initialPaid = Math.min(data.initialPayment, totalAmount);
    let paymentStatus: 'paid' | 'partial' | 'pending' = 'pending';
    if (initialPaid >= totalAmount) paymentStatus = 'paid';
    else if (initialPaid > 0) paymentStatus = 'partial';

    const newRes: Reservation = {
      id: `res-${Date.now()}`,
      bookingRef: `MK-${Math.floor(7000 + Math.random() * 2000)}`,
      guestName: data.guestName,
      guestEmail: data.guestEmail,
      guestPhone: data.guestPhone,
      guestCnicOrPassport: data.guestCnicOrPassport,
      cityOrCountry: data.cityOrCountry,
      roomId: room.id,
      roomNumber: room.number,
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
      taxAmount,
      totalAmount,
      paidAmount: initialPaid,
      paymentStatus,
      paymentMethod: data.paymentMethod,
      status: 'confirmed',
      specialRequests: data.specialRequests,
      createdAt: currentDate,
    };

    setReservations((prev) => [newRes, ...prev]);

    if (data.checkInDate === currentDate && room.status === 'available') {
      setRooms((prev) =>
        prev.map((r) => (r.id === room.id ? { ...r, status: 'reserved' } : r))
      );
    }

    // Guest CRM Update
    setGuests((prev) => {
      const existing = prev.find((g) => g.email.toLowerCase() === data.guestEmail.toLowerCase());
      if (existing) {
        return prev.map((g) =>
          g.id === existing.id
            ? {
                ...g,
                totalSpend: g.totalSpend + totalAmount,
                totalStays: g.totalStays + 1,
                lastStayDate: data.checkInDate,
              }
            : g
        );
      } else {
        const newGuest: GuestProfile = {
          id: `guest-${Date.now()}`,
          name: data.guestName,
          email: data.guestEmail,
          phone: data.guestPhone,
          cnicOrPassport: data.guestCnicOrPassport,
          cityOrCountry: data.cityOrCountry,
          vipStatus: 'Standard',
          totalStays: 1,
          totalSpend: totalAmount,
          preferences: data.specialRequests || 'Standard guest requirements',
          lastStayDate: data.checkInDate,
        };
        return [...prev, newGuest];
      }
    });

    return newRes;
  };

  // Add extra charge (Room service, Trout BBQ, 4x4 tour, etc.)
  const addExtraCharge = (reservationId: string, chargeData: Omit<ExtraCharge, 'id' | 'date'>) => {
    const charge: ExtraCharge = {
      id: `ext-${Date.now()}`,
      description: chargeData.description,
      category: chargeData.category,
      amount: chargeData.amount,
      date: currentDate,
      addedBy: chargeData.addedBy || `${currentUser?.name || 'Front Desk'} (${currentUser?.role || 'Staff'})`,
    };

    setReservations((prev) =>
      prev.map((res) => {
        if (res.id !== reservationId) return res;

        const newExtras = [...res.extras, charge];
        const newExtrasTotal = newExtras.reduce((sum, item) => sum + item.amount, 0);
        const subtotal = res.roomTotal + res.mealPlanTotal + newExtrasTotal;
        const newTaxAmount = Math.round(subtotal * HOTEL_INFO.taxRate);
        const newTotalAmount = subtotal + newTaxAmount;

        let newPaymentStatus = res.paymentStatus;
        if (res.paidAmount < newTotalAmount) {
          newPaymentStatus = res.paidAmount > 0 ? 'partial' : 'pending';
        }

        return {
          ...res,
          extras: newExtras,
          extrasTotal: newExtrasTotal,
          taxAmount: newTaxAmount,
          totalAmount: newTotalAmount,
          paymentStatus: newPaymentStatus,
        };
      })
    );
  };

  // Update Room
  const updateRoom = (roomId: string, updates: Partial<Room>) => {
    setRooms((prev) => prev.map((r) => (r.id === roomId ? { ...r, ...updates } : r)));
  };

  // Housekeeping status update
  const updateHousekeepingStatus = (roomId: string, status: HousekeepingStatus) => {
    setRooms((prev) =>
      prev.map((r) => {
        if (r.id !== roomId) return r;
        return {
          ...r,
          housekeeping: status,
          status: status === 'clean' || status === 'inspected' ? (r.status === 'occupied' ? 'occupied' : 'available') : r.status
        };
      })
    );

    if (status === 'clean' || status === 'inspected') {
      setHousekeepingTasks((prev) =>
        prev.map((t) =>
          t.roomId === roomId && t.status !== 'completed'
            ? { ...t, status: 'completed', completedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
            : t
        )
      );
    }
  };

  // Housekeeping task creation
  const createHousekeepingTask = (task: Omit<HousekeepingTask, 'id'>) => {
    const newTask: HousekeepingTask = {
      ...task,
      id: `task-${Date.now()}`,
    };
    setHousekeepingTasks((prev) => [newTask, ...prev]);

    if (task.status === 'in_progress') {
      updateRoom(task.roomId, { housekeeping: 'cleaning_in_progress' });
    }
  };

  // Update Housekeeping Task
  const updateHousekeepingTask = (taskId: string, updates: Partial<HousekeepingTask>) => {
    setHousekeepingTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const updated = { ...t, ...updates };
        if (updates.status === 'completed' && !updated.completedAt) {
          updated.completedAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          updateRoom(t.roomId, { housekeeping: 'inspected' });
        } else if (updates.status === 'in_progress') {
          updateRoom(t.roomId, { housekeeping: 'cleaning_in_progress' });
        }
        return updated;
      })
    );
  };

  // Maintenance creation
  const createMaintenanceRequest = (req: Omit<MaintenanceRequest, 'id' | 'reportedAt'>) => {
    const newReq: MaintenanceRequest = {
      ...req,
      id: `maint-${Date.now()}`,
      reportedAt: `${currentDate} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
    };
    setMaintenanceRequests((prev) => [newReq, ...prev]);

    if (req.priority === 'urgent' || req.priority === 'high') {
      updateRoom(req.roomId, { status: 'maintenance', notes: `Maintenance: ${req.issueTitle}` });
    }
  };

  // Maintenance resolution
  const resolveMaintenanceRequest = (reqId: string, notes?: string) => {
    setMaintenanceRequests((prev) =>
      prev.map((m) => {
        if (m.id !== reqId) return m;
        return {
          ...m,
          status: 'resolved',
          resolvedAt: `${currentDate} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
          notes: notes ? `${m.notes ? m.notes + ' | ' : ''}${notes}` : m.notes,
        };
      })
    );

    const target = maintenanceRequests.find((m) => m.id === reqId);
    if (target) {
      updateRoom(target.roomId, { status: 'available', notes: undefined });
    }
  };

  // Staff onboarding
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
    setStaff((prev) => [...prev, newStaff]);
  };

  const updateStaffMember = (staffId: string, updates: Partial<StaffMember>) => {
    setStaff((prev) => prev.map((s) => (s.id === staffId ? { ...s, ...updates } : s)));
  };

  const toggleStaffDuty = (staffId: string) => {
    setStaff((prev) =>
      prev.map((s) => {
        if (s.id !== staffId) return s;
        const nextStatus: Record<string, 'on_duty' | 'off_duty' | 'break'> = {
          on_duty: 'break',
          break: 'off_duty',
          off_duty: 'on_duty',
          on_leave: 'on_duty',
        };
        return { ...s, status: nextStatus[s.status] || 'on_duty' };
      })
    );
  };

  const addOrUpdateGuest = (guestData: Omit<GuestProfile, 'id'>): GuestProfile => {
    const existing = guests.find((g) => g.email.toLowerCase() === guestData.email.toLowerCase());
    if (existing) {
      const updated: GuestProfile = { ...existing, ...guestData };
      setGuests((prev) => prev.map((g) => (g.id === existing.id ? updated : g)));
      return updated;
    } else {
      const newGuest: GuestProfile = {
        ...guestData,
        id: `guest-${Date.now()}`,
      };
      setGuests((prev) => [...prev, newGuest]);
      return newGuest;
    }
  };

  // Reset to Demo Data (Admin Only)
  const resetToDemoData = () => {
    if (!isAdmin) {
      alert('Access Denied: Only Administrator can perform system-wide database resets.');
      return;
    }
    setRooms(INITIAL_ROOMS);
    setReservations(INITIAL_RESERVATIONS);
    setStaff(INITIAL_STAFF);
    setHousekeepingTasks(INITIAL_HOUSEKEEPING_TASKS);
    setMaintenanceRequests(INITIAL_MAINTENANCE);
    setGuests(INITIAL_GUESTS);
    localStorage.removeItem(STORAGE_KEYS.ROOMS);
    localStorage.removeItem(STORAGE_KEYS.RESERVATIONS);
    localStorage.removeItem(STORAGE_KEYS.STAFF);
    localStorage.removeItem(STORAGE_KEYS.HOUSEKEEPING);
    localStorage.removeItem(STORAGE_KEYS.MAINTENANCE);
    localStorage.removeItem(STORAGE_KEYS.GUESTS);
  };

  // Computed metrics (PKR)
  const totalRooms = rooms.length;
  const occupiedRooms = rooms.filter((r) => r.status === 'occupied').length;
  const availableRooms = rooms.filter((r) => r.status === 'available').length;
  const dirtyRooms = rooms.filter((r) => r.housekeeping === 'dirty' || r.housekeeping === 'cleaning_in_progress').length;
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
  const totalActiveRevenue = reservations.reduce((acc, curr) => acc + (curr.status !== 'cancelled' ? curr.paidAmount : 0), 0);

  const onDutyStaffCount = staff.filter((s) => s.status === 'on_duty').length;
  const pendingTasksCount = housekeepingTasks.filter((t) => t.status !== 'completed').length;
  const urgentMaintenanceCount = maintenanceRequests.filter((m) => m.status !== 'resolved' && m.priority === 'urgent').length;

  const adr = occupiedRooms > 0 ? Math.round(todayRevenue / occupiedRooms) : 0;
  const revPAR = totalRooms > 0 ? Math.round(todayRevenue / totalRooms) : 0;

  return (
    <HotelContext.Provider
      value={{
        hotelInfo: HOTEL_INFO,
        rooms,
        reservations,
        staff,
        housekeepingTasks,
        maintenanceRequests,
        guests,
        currentDate,

        currentUser,
        login,
        logout,
        switchRole,
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
