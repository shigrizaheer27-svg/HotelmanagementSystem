import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext';
import { StaffMember, Department, ShiftType } from '../../types/hotel';
import {
  Users2,
  Clock,
  Plus,
  Phone,
  Mail,
  Shield,
  Star,
  CheckCircle2,
  Coffee,
  Moon,
  Sun,
  Trash2,
  Briefcase
} from 'lucide-react';

export const StaffManagementView: React.FC = () => {
  const { staff, toggleStaffDuty, setIsNewStaffModalOpen, deleteStaffMember, isAdmin, isManager, stats } = useHotel();

  const [deptFilter, setDeptFilter] = useState<string>('all');
  const [shiftFilter, setShiftFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStaff = staff.filter((member) => {
    if (deptFilter !== 'all' && member.department !== deptFilter) return false;
    if (shiftFilter !== 'all' && !member.shift.toLowerCase().includes(shiftFilter.toLowerCase())) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        member.name.toLowerCase().includes(q) ||
        member.role.toLowerCase().includes(q) ||
        member.department.toLowerCase().includes(q) ||
        member.phone.includes(q)
      );
    }
    return true;
  });

  const getDutyStatusBadge = (status: StaffMember['status']) => {
    switch (status) {
      case 'on_duty':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>On Duty</span>
          </span>
        );
      case 'break':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>Tea Break</span>
          </span>
        );
      case 'off_duty':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 dark:text-slate-500">
            <span className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-600" />
            <span>Off Duty</span>
          </span>
        );
      case 'on_leave':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-600 dark:text-purple-400">
            <span className="w-2 h-2 rounded-full bg-purple-500" />
            <span>On Leave</span>
          </span>
        );
    }
  };

  const departments: Department[] = [
    'Front Office',
    'Housekeeping',
    'Kitchen & Balti Dining',
    'Engineering & Generator',
    'Tours & Security',
    'Management',
  ];

  return (
    <div className="space-y-6">
      {/* Title & Top Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white font-display">
            Staff Directory & Shift Roster · Mashakala Resort
          </h2>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            <span>{staff.length} Team Members</span>
            <span aria-hidden="true">·</span>
            <span>{stats.onDutyStaffCount} Active On Duty</span>
            <span aria-hidden="true">·</span>
            <span>{isAdmin ? 'Admin Full Access' : 'Manager Operations Access'}</span>
          </div>
        </div>

        {/* ADMIN ACTION: Add Staff */}
        {isAdmin && (
          <button
            onClick={() => setIsNewStaffModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-amber-600 hover:bg-slate-800 dark:hover:bg-amber-500 rounded-lg shadow-sm transition-colors whitespace-nowrap self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Onboard Staff Member (Admin)</span>
          </button>
        )}
      </div>

      {/* 3 Shifts Roster Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Sun className="w-4 h-4 text-amber-500" /> Morning Shift
            </span>
            <span className="font-mono text-slate-400 text-[11px]">07:00 - 15:30</span>
          </div>
          <div className="mt-2 text-xl font-bold font-mono text-slate-900 dark:text-white">
            {staff.filter((s) => s.shift.includes('Morning') && s.status === 'on_duty').length} Active
          </div>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            Front desk, Desi breakfast brigade & morning room turnovers
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-blue-500" /> Evening Shift
            </span>
            <span className="font-mono text-slate-400 text-[11px]">15:00 - 23:30</span>
          </div>
          <div className="mt-2 text-xl font-bold font-mono text-slate-900 dark:text-white">
            {staff.filter((s) => s.shift.includes('Evening') && s.status === 'on_duty').length} Active
          </div>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            Shigar arrivals, Trout BBQ, Bonfire setup & turn-down service
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Moon className="w-4 h-4 text-purple-500" /> Night Audit Shift
            </span>
            <span className="font-mono text-slate-400 text-[11px]">23:00 - 07:30</span>
          </div>
          <div className="mt-2 text-xl font-bold font-mono text-slate-900 dark:text-white">
            {staff.filter((s) => s.shift.includes('Night') && s.status === 'on_duty').length} Active
          </div>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            Resort perimeter security, generator watch & night audit ledger
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setDeptFilter('all')}
            className={`px-3 py-1.5 text-xs rounded-md font-medium transition-colors ${
              deptFilter === 'all'
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            All Departments
          </button>
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setDeptFilter(dept)}
              className={`px-3 py-1.5 text-xs rounded-md font-medium whitespace-nowrap transition-colors ${
                deptFilter === dept
                  ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <select
            value={shiftFilter}
            onChange={(e) => setShiftFilter(e.target.value)}
            className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="all">All Shifts</option>
            <option value="Morning">Morning Shift</option>
            <option value="Evening">Evening Shift</option>
            <option value="Night">Night Audit Shift</option>
          </select>
        </div>
      </div>

      {/* Staff Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStaff.map((member) => {
          return (
            <div
              key={member.id}
              className="p-4.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center font-display border border-slate-200 dark:border-slate-700 shrink-0">
                      {member.avatarInitials}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                        {member.name}
                      </h4>
                      <p className="text-xs font-medium text-amber-600 dark:text-amber-400 mt-0.5">
                        {member.role}
                      </p>
                    </div>
                  </div>
                  <div>{getDutyStatusBadge(member.status)}</div>
                </div>

                <div className="mt-3.5 space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center justify-between">
                    <span>Department:</span>
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {member.department}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Scheduled Shift:</span>
                    <span className="font-mono text-slate-700 dark:text-slate-300 text-[11px]">
                      {member.shift.split(' ')[0]}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Contact:</span>
                    <span className="font-mono text-slate-700 dark:text-slate-300 text-[11px]">
                      {member.phone}
                    </span>
                  </div>
                  {member.assignedRooms && member.assignedRooms.length > 0 && (
                    <div className="flex items-center justify-between">
                      <span>Assigned Suites:</span>
                      <span className="font-mono text-slate-700 dark:text-slate-300 font-medium">
                        {member.assignedRooms.map((r) => `#${r}`).join(', ')}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-1">
                    <span>Performance Rating:</span>
                    <span className="font-mono font-medium text-amber-600 dark:text-amber-400 flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                      <span>{member.rating} / 5.0</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Quick Action: Duty State Toggle & Admin Delete */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <span className="text-[11px] text-slate-400">
                  Hired: <span className="font-mono">{member.hireDate}</span>
                </span>

                <div className="flex items-center gap-1.5">
                  {/* ADMIN ACTION: Delete Staff */}
                  {isAdmin && (
                    <button
                      onClick={() => {
                        if (confirm(`Administrator: Remove staff profile for ${member.name} (${member.role})?`)) {
                          deleteStaffMember(member.id);
                        }
                      }}
                      title="Terminate / Remove Staff Profile (Admin Only)"
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <button
                    onClick={() => toggleStaffDuty(member.id)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                      member.status === 'on_duty'
                        ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 dark:bg-amber-950/60 dark:text-amber-200'
                        : member.status === 'break'
                        ? 'bg-slate-200 hover:bg-slate-300 text-slate-800 dark:bg-slate-800 dark:text-slate-200'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    }`}
                  >
                    {member.status === 'on_duty'
                      ? 'Tea Break'
                      : member.status === 'break'
                      ? 'Clock Out'
                      : 'Clock In'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
