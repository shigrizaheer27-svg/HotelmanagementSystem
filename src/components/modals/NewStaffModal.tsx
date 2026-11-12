import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext';
import { Department, StaffRole, ShiftType } from '../../types/hotel';
import { X, UserPlus } from 'lucide-react';

export const NewStaffModal: React.FC = () => {
  const { isNewStaffModalOpen, setIsNewStaffModalOpen, addStaffMember } = useHotel();

  const [name, setName] = useState('');
  const [department, setDepartment] = useState<Department>('Front Office');
  const [role, setRole] = useState<StaffRole>('Receptionist');
  const [shift, setShift] = useState<ShiftType>('Morning (07:00 - 15:30)');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');

  if (!isNewStaffModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    addStaffMember({
      name,
      department,
      role,
      shift,
      email: email || `${name.toLowerCase().replace(/\s+/g, '.')}@aurastayresort.com`,
      phone: phone || '+1 (555) 401-0000',
      status: 'on_duty',
      rating: 5.0,
      hireDate: new Date().toISOString().split('T')[0],
      emergencyContact: emergencyContact || 'Contact on file',
      avatarInitials: '',
    });

    setIsNewStaffModalOpen(false);
    setName('');
    setEmail('');
    setPhone('');
    setEmergencyContact('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">
              Onboard Staff Member
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Department roster & shift scheduling
            </p>
          </div>
          <button
            onClick={() => setIsNewStaffModalOpen(false)}
            className="text-slate-400 hover:text-slate-600 text-lg leading-none"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Liam Sterling"
              className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Department
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value as Department)}
                className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
              >
                <option value="Front Office">Front Office</option>
                <option value="Housekeeping">Housekeeping</option>
                <option value="Food & Beverage">Food & Beverage</option>
                <option value="Engineering">Engineering</option>
                <option value="Security">Security</option>
                <option value="Management">Management</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Designated Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as StaffRole)}
                className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
              >
                <option value="Receptionist">Receptionist</option>
                <option value="Front Desk Manager">Front Desk Manager</option>
                <option value="Room Attendant">Room Attendant</option>
                <option value="Executive Housekeeper">Executive Housekeeper</option>
                <option value="Concierge">Concierge</option>
                <option value="Head Chef">Head Chef</option>
                <option value="Maintenance Lead">Maintenance Lead</option>
                <option value="Security Supervisor">Security Supervisor</option>
                <option value="General Manager">General Manager</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Primary Shift Schedule
            </label>
            <select
              value={shift}
              onChange={(e) => setShift(e.target.value as ShiftType)}
              className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
            >
              <option value="Morning (07:00 - 15:30)">Morning Shift (07:00 - 15:30)</option>
              <option value="Evening (15:00 - 23:30)">Evening Shift (15:00 - 23:30)</option>
              <option value="Night (23:00 - 07:30)">Night Audit Shift (23:00 - 07:30)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 401-..."
                className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Emergency Contact
              </label>
              <input
                type="text"
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
                placeholder="Name & Tel"
                className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsNewStaffModalOpen(false)}
              className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-slate-900 dark:bg-amber-600 text-white font-semibold rounded-lg hover:bg-slate-800"
            >
              Add Staff Member
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
