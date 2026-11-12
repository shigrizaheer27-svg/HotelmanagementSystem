export type RoomType = 'Standard King' | 'Deluxe Ocean' | 'Executive Suite' | 'Presidential Suite' | 'Garden Villa';

export type RoomStatus = 'available' | 'occupied' | 'reserved' | 'maintenance';

export type HousekeepingStatus = 'clean' | 'dirty' | 'cleaning_in_progress' | 'inspected';

export interface Room {
  id: string;
  number: string; // e.g. "101", "204"
  floor: number;
  type: RoomType;
  status: RoomStatus;
  housekeeping: HousekeepingStatus;
  ratePerNight: number;
  bedType: 'King' | 'Queen' | 'Twin Doubles' | 'Super King';
  maxCapacity: number;
  amenities: string[];
  currentGuestId?: string;
  currentGuestName?: string;
  currentReservationId?: string;
  notes?: string;
}

export type ReservationStatus = 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled';

export type MealPlan = 'Room Only' | 'Bed & Breakfast' | 'Half Board' | 'All Inclusive';

export interface ExtraCharge {
  id: string;
  description: string;
  category: 'Room Service' | 'Mini Bar' | 'Spa & Wellness' | 'Laundry' | 'Airport Transfer' | 'Food & Beverage' | 'Other';
  amount: number;
  date: string;
  addedBy: string;
}

export interface Reservation {
  id: string;
  bookingRef: string; // e.g. "AS-8492"
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  guestPassport: string;
  nationality: string;
  roomId: string;
  roomNumber: string;
  roomType: RoomType;
  checkInDate: string; // "YYYY-MM-DD"
  checkOutDate: string; // "YYYY-MM-DD"
  adults: number;
  children: number;
  mealPlan: MealPlan;
  extras: ExtraCharge[];
  nightlyRate: number;
  nightsCount: number;
  roomTotal: number;
  mealPlanTotal: number;
  extrasTotal: number;
  taxAmount: number;
  totalAmount: number;
  paidAmount: number;
  paymentStatus: 'paid' | 'partial' | 'pending';
  paymentMethod: 'Credit Card' | 'Cash' | 'Bank Transfer' | 'Corporate Account';
  status: ReservationStatus;
  specialRequests?: string;
  createdAt: string;
  checkedInAt?: string;
  checkedOutAt?: string;
}

export type Department = 'Front Office' | 'Housekeeping' | 'Food & Beverage' | 'Engineering' | 'Security' | 'Management';

export type StaffRole = 
  | 'General Manager'
  | 'Front Desk Manager'
  | 'Receptionist'
  | 'Executive Housekeeper'
  | 'Room Attendant'
  | 'Concierge'
  | 'Head Chef'
  | 'Maintenance Lead'
  | 'Security Supervisor';

export type ShiftType = 'Morning (07:00 - 15:30)' | 'Evening (15:00 - 23:30)' | 'Night (23:00 - 07:30)';

export interface StaffMember {
  id: string;
  name: string;
  role: StaffRole;
  department: Department;
  email: string;
  phone: string;
  shift: ShiftType;
  status: 'on_duty' | 'off_duty' | 'break' | 'on_leave';
  avatarInitials: string;
  assignedRooms?: string[];
  rating: number;
  hireDate: string;
  emergencyContact: string;
}

export interface HousekeepingTask {
  id: string;
  roomId: string;
  roomNumber: string;
  taskType: 'Full Turnover' | 'Daily Refresh' | 'Deep Clean' | 'Linen Change' | 'VIP Setup';
  priority: 'urgent' | 'high' | 'normal';
  assignedStaffId?: string;
  assignedStaffName?: string;
  status: 'pending' | 'in_progress' | 'completed';
  notes?: string;
  scheduledTime: string;
  completedAt?: string;
}

export interface MaintenanceRequest {
  id: string;
  roomId: string;
  roomNumber: string;
  issueTitle: string;
  category: 'HVAC / AC' | 'Plumbing' | 'Electrical' | 'Keycard Lock' | 'Furniture' | 'Appliances';
  priority: 'urgent' | 'high' | 'normal';
  status: 'reported' | 'in_progress' | 'resolved';
  reportedBy: string;
  reportedAt: string;
  assignedStaffId?: string;
  assignedStaffName?: string;
  resolvedAt?: string;
  notes?: string;
}

export interface GuestProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  passportNumber: string;
  nationality: string;
  vipStatus: 'Standard' | 'Silver' | 'Gold' | 'Platinum VIP';
  totalStays: number;
  totalSpend: number;
  preferences: string;
  dietaryRestrictions?: string;
  notes?: string;
  lastStayDate: string;
}
