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
  RoomType
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

interface HotelContextType {
  hotelInfo: typeof HOTEL_INFO;
  rooms: Room[];
  reservations: Reservation[];
  staff: StaffMember[];
  housekeepingTasks: HousekeepingTask[];
  maintenanceRequests: MaintenanceRequest[];
  guests: GuestProfile[];
  currentDate: string;
  
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

  // Actions
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

  // Computed metrics
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

export interface NewReservationInput {
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  guestPassport: string;
  nationality: string;
  roomId: string;
  checkInDate: string;
  checkOutDate: string;
  adults: number;
  children: number;
  mealPlan: MealPlan;
  paymentMethod: 'Credit Card' | 'Cash' | 'Bank Transfer' | 'Corporate Account';
  initialPayment: number;
  specialRequests?: string;
}

const STORAGE_KEYS = {
  ROOMS: 'aurastay_pms_rooms_v1',
  RESERVATIONS: 'aurastay_pms_reservations_v1',
  STAFF: 'aurastay_pms_staff_v1',
  HOUSEKEEPING: 'aurastay_pms_housekeeping_v1',
  MAINTENANCE: 'aurastay_pms_maintenance_v1',
  GUESTS: 'aurastay_pms_guests_v1',
};

const HotelContext = createContext<HotelContextType | undefined>(undefined);

export const HotelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const currentDate = '2026-11-12';

  // Initialize state from LocalStorage or defaults
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

  // UI state
  const [selectedRoomForDetail, setSelectedRoomForDetail] = useState<Room | null>(null);
  const [selectedReservationForFolio, setSelectedReservationForFolio] = useState<Reservation | null>(null);
  const [isNewReservationModalOpen, setIsNewReservationModalOpen] = useState(false);
  const [isNewStaffModalOpen, setIsNewStaffModalOpen] = useState(false);
  const [isReportMaintenanceModalOpen, setIsReportMaintenanceModalOpen] = useState(false);
  const [isAddChargeModalOpen, setIsAddChargeModalOpen] = useState(false);
  const [reservationForCharge, setReservationForCharge] = useState<Reservation | null>(null);
  const [quickCheckInRoom, setQuickCheckInRoom] = useState<Room | null>(null);

  // Sync to LocalStorage on changes
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

  // Keep selected room up-to-date if rooms update
  useEffect(() => {
    if (selectedRoomForDetail) {
      const updated = rooms.find((r) => r.id === selectedRoomForDetail.id);
      if (updated) setSelectedRoomForDetail(updated);
    }
  }, [rooms]);

  // Keep selected reservation up-to-date
  useEffect(() => {
    if (selectedReservationForFolio) {
      const updated = reservations.find((r) => r.id === selectedReservationForFolio.id);
      if (updated) setSelectedReservationForFolio(updated);
    }
  }, [reservations]);

  // Check-In Guest Action
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
          passportNumber: res.guestPassport,
          nationality: res.nationality,
          vipStatus: 'Standard',
          totalStays: 1,
          totalSpend: res.totalAmount,
          preferences: res.specialRequests || 'None specified',
          lastStayDate: currentDate,
        };
        return [...prev, newGuest];
      }
    });
  };

  // Check-Out Guest Action
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
              notes: `Prior guest checked out at ${nowStr}`,
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
      notes: `Departure turnover for ${res.guestName}. Disinfect, sanitize, change bed linens, restock mini-bar.`,
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

    // If room was reserved or assigned, release it if unoccupied
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

  // Create new reservation
  const createReservation = (data: NewReservationInput): Reservation => {
    const room = rooms.find((r) => r.id === data.roomId);
    if (!room) throw new Error('Room not found');

    const checkIn = new Date(data.checkInDate);
    const checkOut = new Date(data.checkOutDate);
    const timeDiff = Math.max(1, checkOut.getTime() - checkIn.getTime());
    const nightsCount = Math.max(1, Math.ceil(timeDiff / (1000 * 3600 * 24)));

    // Meal plan calculation per night
    let mealRatePerNight = 0;
    if (data.mealPlan === 'Bed & Breakfast') mealRatePerNight = 30 * data.adults;
    if (data.mealPlan === 'Half Board') mealRatePerNight = 70 * data.adults;
    if (data.mealPlan === 'All Inclusive') mealRatePerNight = 140 * data.adults;

    const roomTotal = room.ratePerNight * nightsCount;
    const mealPlanTotal = mealRatePerNight * nightsCount;
    const extrasTotal = 0;
    const subtotal = roomTotal + mealPlanTotal + extrasTotal;
    const taxAmount = subtotal * HOTEL_INFO.taxRate;
    const totalAmount = Math.round((subtotal + taxAmount) * 100) / 100;

    const initialPaid = Math.min(data.initialPayment, totalAmount);
    let paymentStatus: 'paid' | 'partial' | 'pending' = 'pending';
    if (initialPaid >= totalAmount) paymentStatus = 'paid';
    else if (initialPaid > 0) paymentStatus = 'partial';

    const newRes: Reservation = {
      id: `res-${Date.now()}`,
      bookingRef: `AS-${Math.floor(1000 + Math.random() * 9000)}`,
      guestName: data.guestName,
      guestEmail: data.guestEmail,
      guestPhone: data.guestPhone,
      guestPassport: data.guestPassport,
      nationality: data.nationality,
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

    // If starting today and room is available, mark as reserved
    if (data.checkInDate === currentDate && room.status === 'available') {
      setRooms((prev) =>
        prev.map((r) =>
          r.id === room.id ? { ...r, status: 'reserved' } : r
        )
      );
    }

    // Update Guest CRM
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
          passportNumber: data.guestPassport,
          nationality: data.nationality,
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

  // Add Extra Charge to a guest reservation folio
  const addExtraCharge = (reservationId: string, chargeData: Omit<ExtraCharge, 'id' | 'date'>) => {
    const charge: ExtraCharge = {
      id: `ext-${Date.now()}`,
      description: chargeData.description,
      category: chargeData.category,
      amount: chargeData.amount,
      date: currentDate,
      addedBy: chargeData.addedBy || 'Front Desk Staff',
    };

    setReservations((prev) =>
      prev.map((res) => {
        if (res.id !== reservationId) return res;

        const newExtras = [...res.extras, charge];
        const newExtrasTotal = newExtras.reduce((sum, item) => sum + item.amount, 0);
        const subtotal = res.roomTotal + res.mealPlanTotal + newExtrasTotal;
        const newTaxAmount = Math.round(subtotal * HOTEL_INFO.taxRate * 100) / 100;
        const newTotalAmount = Math.round((subtotal + newTaxAmount) * 100) / 100;

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

  // Update Housekeeping status on Room
  const updateHousekeepingStatus = (roomId: string, status: HousekeepingStatus) => {
    setRooms((prev) =>
      prev.map((r) => {
        if (r.id !== roomId) return r;
        return {
          ...r,
          housekeeping: status,
          // If clean/inspected and was maintenance-free, ensure room is ready
          status: status === 'clean' || status === 'inspected' ? (r.status === 'occupied' ? 'occupied' : 'available') : r.status
        };
      })
    );

    // If marked as clean or inspected, auto-complete active tasks for this room
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

  // Create Housekeeping Task
  const createHousekeepingTask = (task: Omit<HousekeepingTask, 'id'>) => {
    const newTask: HousekeepingTask = {
      ...task,
      id: `task-${Date.now()}`,
    };
    setHousekeepingTasks((prev) => [newTask, ...prev]);

    // Update room status to match
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
          // Also set room to inspected/clean
          updateRoom(t.roomId, { housekeeping: 'inspected' });
        } else if (updates.status === 'in_progress') {
          updateRoom(t.roomId, { housekeeping: 'cleaning_in_progress' });
        }
        return updated;
      })
    );
  };

  // Create Maintenance Request
  const createMaintenanceRequest = (req: Omit<MaintenanceRequest, 'id' | 'reportedAt'>) => {
    const newReq: MaintenanceRequest = {
      ...req,
      id: `maint-${Date.now()}`,
      reportedAt: `${currentDate} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
    };
    setMaintenanceRequests((prev) => [newReq, ...prev]);

    // If urgent, place room out of order
    if (req.priority === 'urgent' || req.priority === 'high') {
      updateRoom(req.roomId, { status: 'maintenance', notes: `Maintenance: ${req.issueTitle}` });
    }
  };

  // Resolve Maintenance Request
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

    // Restore room if it had maintenance
    const target = maintenanceRequests.find((m) => m.id === reqId);
    if (target) {
      updateRoom(target.roomId, { status: 'available', notes: undefined });
    }
  };

  // Add Staff Member
  const addStaffMember = (member: Omit<StaffMember, 'id'>) => {
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

  // Update Staff Member
  const updateStaffMember = (staffId: string, updates: Partial<StaffMember>) => {
    setStaff((prev) => prev.map((s) => (s.id === staffId ? { ...s, ...updates } : s)));
  };

  // Toggle Staff Duty Status
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

  // Add or update guest CRM
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

  // Reset to Demo Data
  const resetToDemoData = () => {
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

  // Computed metrics
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
