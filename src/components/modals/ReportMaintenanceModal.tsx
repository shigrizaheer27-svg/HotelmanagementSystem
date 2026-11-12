import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext';
import { MaintenanceRequest } from '../../types/hotel';
import { X, Wrench, AlertTriangle } from 'lucide-react';

export const ReportMaintenanceModal: React.FC = () => {
  const {
    rooms,
    staff,
    isReportMaintenanceModalOpen,
    setIsReportMaintenanceModalOpen,
    createMaintenanceRequest,
  } = useHotel();

  const [roomId, setRoomId] = useState(rooms[0]?.id || '');
  const [issueTitle, setIssueTitle] = useState('');
  const [category, setCategory] = useState<MaintenanceRequest['category']>('HVAC / AC');
  const [priority, setPriority] = useState<MaintenanceRequest['priority']>('high');
  const [assignedStaffId, setAssignedStaffId] = useState('');
  const [notes, setNotes] = useState('');

  if (!isReportMaintenanceModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const room = rooms.find((r) => r.id === roomId);
    if (!room || !issueTitle) return;

    const assigned = staff.find((s) => s.id === assignedStaffId);

    createMaintenanceRequest({
      roomId: room.id,
      roomNumber: room.number,
      issueTitle,
      category,
      priority,
      status: 'reported',
      reportedBy: 'Front Desk Duty Staff',
      assignedStaffId: assigned?.id,
      assignedStaffName: assigned?.name || 'Engineering Queue',
      notes,
    });

    setIsReportMaintenanceModalOpen(false);
    setIssueTitle('');
    setNotes('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">
              Report Engineering / Maintenance Issue
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Dispatches work ticket to facilities maintenance lead
            </p>
          </div>
          <button
            onClick={() => setIsReportMaintenanceModalOpen(false)}
            className="text-slate-400 hover:text-slate-600 text-lg leading-none"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Select Affected Room *
            </label>
            <select
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
            >
              {rooms.map((r) => (
                <option key={r.id} value={r.id}>
                  Room #{r.number} ({r.type}) — Status: {r.status}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
              >
                <option value="HVAC / AC">HVAC / Thermostat / AC</option>
                <option value="Plumbing">Plumbing / Water Pressure</option>
                <option value="Electrical">Electrical / Lighting</option>
                <option value="Keycard Lock">Electronic RFID Lock</option>
                <option value="Furniture">Furniture & Fixtures</option>
                <option value="Appliances">TV / Mini Fridge / Safe</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Urgency Level
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
              >
                <option value="urgent">Urgent (Room Out of Order)</option>
                <option value="high">High Priority</option>
                <option value="normal">Standard Routine</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Issue Summary *
            </label>
            <input
              type="text"
              required
              value={issueTitle}
              onChange={(e) => setIssueTitle(e.target.value)}
              placeholder="e.g. Master bathroom vanity faucet slow drain leak"
              className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Assign Technician
            </label>
            <select
              value={assignedStaffId}
              onChange={(e) => setAssignedStaffId(e.target.value)}
              className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
            >
              <option value="">Engineering Queue (Auto-dispatch)</option>
              {staff
                .filter((s) => s.department === 'Engineering')
                .map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.role})
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Detailed Diagnostics
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Symptoms, guest statements, or test notes..."
              rows={2}
              className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsReportMaintenanceModalOpen(false)}
              className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-lg shadow-sm"
            >
              Dispatch Ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
