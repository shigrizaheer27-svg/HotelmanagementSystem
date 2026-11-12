export type UserRole = 'admin' | 'manager';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  designation: string;
  avatarInitials: string;
}

export type RoomType = 
  | 'Heritage Deluxe' 
  | 'Karakoram View' 
  | 'Executive Shigar Suite' 
  | 'Royal Shigar Suite' 
  | 'Riverside Chalet';

export type RoomStatus = 'available' | 'occupied' | 'reserved' | 'maintenance';

export type HousekeepingStatus = 'clean' | 'dirty' | 'cleaning_in_progress' | 'inspected';

export interface Room {
  id: string;
  number: string; // e.g. "101", "204"
  floor: number;
  type: RoomType;
  status: RoomStatus;
  housekeeping: HousekeepingStatus;
  ratePerNight: number; // in PKR
  bedType: 'King' | 'Queen' | 'Twin Doubles' | 'Royal Master King';
  maxCapacity: number;
  amenities: string[];
  currentGuestId?: string;
  currentGuestName?: string;
  currentReservationId?: string;
  notes?: string;
}

export type ReservationStatus = 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled';

export type MealPlan = 
  | 'Room Only' 
  | 'Desi & Continental Breakfast' 
  | 'Half Board (Breakfast & Dinner Buffet)' 
  | 'Full Board (All Meals & Balti High Tea)';

export interface ExtraCharge {
  id: string;
  description: string;
  category: 
    | 'Balti & Desi Dining' 
    | 'Bonfire & Trout BBQ' 
    | 'Minibar & Dry Fruits' 
    | 'Skardu Airport Transfer' 
    | 'Jeep Safari / Tour' 
    | 'Laundry & Heating' 
    | 'Other';
  amount: number; // in PKR
  date: string;
  addedBy: string;
}

export type PakistaniPaymentMethod = 
  | 'Raast / Bank Transfer' 
  | 'EasyPaisa / JazzCash' 
  | 'Credit / Debit Card' 
  | 'Cash at Front Desk' 
  | 'Corporate Account';

export interface Reservation {
  id: string;
  bookingRef: string; // e.g. "MK-8492"
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  guestCnicOrPassport: string; // CNIC or Passport
  cityOrCountry: string; // e.g. "Islamabad, Pakistan", "Lahore", "UK"
  roomId: string;
  roomNumber: string;
  roomType: RoomType;
  checkInDate: string; // "YYYY-MM-DD"
  checkOutDate: string; // "YYYY-MM-DD"
  adults: number;
  children: number;
  mealPlan: MealPlan;
  extras: ExtraCharge[];
  nightlyRate: number; // in PKR
  nightsCount: number;
  roomTotal: number; // in PKR
  mealPlanTotal: number; // in PKR
  extrasTotal: number; // in PKR
  taxAmount: number; // in PKR
  totalAmount: number; // in PKR
  paidAmount: number; // in PKR
  paymentStatus: 'paid' | 'partial' | 'pending';
  paymentMethod: PakistaniPaymentMethod;
  status: ReservationStatus;
  specialRequests?: string;
  createdAt: string;
  checkedInAt?: string;
  checkedOutAt?: string;
}

export type Department = 
  | 'Front Office' 
  | 'Housekeeping' 
  | 'Kitchen & Balti Dining' 
  | 'Engineering & Generator' 
  | 'Tours & Security' 
  | 'Management';

export type StaffRole = 
  | 'General Manager'
  | 'Front Desk Manager'
  | 'Receptionist'
  | 'Executive Housekeeper'
  | 'Room Attendant'
  | 'Concierge & Guide'
  | 'Head Chef (Balti & Continental)'
  | 'Maintenance & Generator Lead'
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
  category: 'Heating & Water Geyser' | 'Generator / Electrical' | 'Plumbing' | 'Room Lock' | 'Woodwork & Furniture' | 'Appliances';
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
  cnicOrPassport: string;
  cityOrCountry: string;
  vipStatus: 'Standard' | 'Silver' | 'Gold' | 'Platinum VIP';
  totalStays: number;
  totalSpend: number; // in PKR
  preferences: string;
  dietaryRestrictions?: string;
  notes?: string;
  lastStayDate: string;
}
