import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext';
import { HousekeepingTask, MaintenanceRequest } from '../../types/hotel';
import {
  Sparkles,
  Wrench,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Plus,
  User,
  ShieldCheck,
  Check,
  ArrowRight
} from 'lucide-react';

export const HousekeepingView: React.FC = () => {
  const {
    rooms,
    staff,
    housekeepingTasks,
    maintenanceRequests,
    updateHousekeepingTask,
    updateHousekeepingStatus,
    resolveMaintenanceRequest,
    setIsReportMaintenanceModalOpen,
    createHousekeepingTask,
  } = useHotel();

  const [activeTab, setActiveTab] = useState<'housekeeping' | 'maintenance'>('housekeeping');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);

  // New task form state
  const [newTaskRoomId, setNewTaskRoomId] = useState(rooms[0]?.id || '');
  const [newTaskType, setNewTaskType] = useState<HousekeepingTask['taskType']>('Full Turnover');
  const [newTaskPriority, setNewTaskPriority] = useState<HousekeepingTask['priority']>('normal');
  const [newTaskStaffId, setNewTaskStaffId] = useState('');
  const [newTaskNotes, setNewTaskNotes] = useState('');

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    const room = rooms.find((r) => r.id === newTaskRoomId);
    if (!room) return;

    const assignedStaff = staff.find((s) => s.id === newTaskStaffId);

    createHousekeepingTask({
      roomId: room.id,
      roomNumber: room.number,
      taskType: newTaskType,
      priority: newTaskPriority,
      assignedStaffId: assignedStaff?.id,
      assignedStaffName: assignedStaff?.name,
      status: 'pending',
      notes: newTaskNotes,
      scheduledTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });

    setIsNewTaskModalOpen(false);
    setNewTaskNotes('');
  };

  const getPriorityBadge = (priority: 'urgent' | 'high' | 'normal') => {
    switch (priority) {
      case 'urgent':
        return (
          <span className="text-[11px] font-semibold text-red-700 dark:text-red-400">
            Urgent Turnaround
          </span>
        );
      case 'high':
        return (
          <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-400">
            High Priority
          </span>
        );
      case 'normal':
        return (
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
            Standard Routine
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white font-display">
            Housekeeping & Maintenance Operations
          </h2>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            <span>Room sanitization & turnover</span>
            <span aria-hidden="true">·</span>
            <span>Inspection verification</span>
            <span aria-hidden="true">·</span>
            <span>Engineering work tickets</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'housekeeping' ? (
            <button
              onClick={() => setIsNewTaskModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-amber-600 hover:bg-slate-800 dark:hover:bg-amber-500 rounded-lg shadow-sm transition-colors whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>Assign Cleaning Task</span>
            </button>
          ) : (
            <button
              onClick={() => setIsReportMaintenanceModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-500 rounded-lg shadow-sm transition-colors whitespace-nowrap"
            >
              <Wrench className="w-4 h-4" />
              <span>Report Engineering Issue</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Switcher Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('housekeeping')}
          className={`pb-2 px-3 text-xs font-semibold transition-all border-b-2 -mb-2.5 flex items-center gap-2 ${
            activeTab === 'housekeeping'
              ? 'border-slate-900 text-slate-900 dark:border-amber-400 dark:text-amber-400'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Housekeeping Tasks ({housekeepingTasks.filter((t) => t.status !== 'completed').length} Pending)</span>
        </button>

        <button
          onClick={() => setActiveTab('maintenance')}
          className={`pb-2 px-3 text-xs font-semibold transition-all border-b-2 -mb-2.5 flex items-center gap-2 ${
            activeTab === 'maintenance'
              ? 'border-slate-900 text-slate-900 dark:border-amber-400 dark:text-amber-400'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Wrench className="w-4 h-4" />
          <span>Maintenance Work Orders ({maintenanceRequests.filter((m) => m.status !== 'resolved').length} Active)</span>
        </button>
      </div>

      {/* Tab 1: Housekeeping Content */}
      {activeTab === 'housekeeping' && (
        <div className="space-y-6">
          {/* Room Cleanliness Overview Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Ready & Inspected</span>
              <div className="mt-1.5 text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
                {rooms.filter((r) => r.housekeeping === 'inspected' || r.housekeeping === 'clean').length}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Cleaning In Progress</span>
              <div className="mt-1.5 text-2xl font-bold font-mono text-amber-500">
                {rooms.filter((r) => r.housekeeping === 'cleaning_in_progress').length}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Dirty / Needs Turnover</span>
              <div className="mt-1.5 text-2xl font-bold font-mono text-red-500">
                {rooms.filter((r) => r.housekeeping === 'dirty').length}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Housekeeping Staff On Duty</span>
              <div className="mt-1.5 text-2xl font-bold font-mono text-purple-600 dark:text-purple-400">
                {staff.filter((s) => s.department === 'Housekeeping' && s.status === 'on_duty').length} Attendants
              </div>
            </div>
          </div>

          {/* Tasks Grid */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white font-display">
              Active Housekeeping Schedule
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {housekeepingTasks.map((task) => {
                const isCompleted = task.status === 'completed';
                const isInProgress = task.status === 'in_progress';

                return (
                  <div
                    key={task.id}
                    className={`p-4.5 rounded-xl border transition-all flex flex-col justify-between ${
                      isCompleted
                        ? 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 opacity-75'
                        : isInProgress
                        ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-base font-bold text-slate-900 dark:text-white">
                            Room #{task.roomNumber}
                          </span>
                          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                            {task.taskType}
                          </span>
                        </div>
                        {getPriorityBadge(task.priority)}
                      </div>

                      {task.notes && (
                        <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                          {task.notes}
                        </p>
                      )}

                      <div className="mt-3.5 space-y-1 text-[11px] text-slate-500 dark:text-slate-400">
                        <div className="flex items-center justify-between">
                          <span>Assigned Attendant:</span>
                          <span className="font-medium text-slate-800 dark:text-slate-200">
                            {task.assignedStaffName || 'Unassigned'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between font-mono">
                          <span>Scheduled:</span>
                          <span>{task.scheduledTime}</span>
                        </div>
                        {task.completedAt && (
                          <div className="flex items-center justify-between font-mono text-emerald-600 dark:text-emerald-400">
                            <span>Completed at:</span>
                            <span>{task.completedAt}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                      {!isCompleted && !isInProgress && (
                        <button
                          onClick={() => updateHousekeepingTask(task.id, { status: 'in_progress' })}
                          className="px-2.5 py-1 text-xs font-medium text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-950/60 rounded transition-colors"
                        >
                          Start Cleaning
                        </button>
                      )}

                      {!isCompleted && (
                        <button
                          onClick={() => updateHousekeepingTask(task.id, { status: 'completed' })}
                          className="flex items-center gap-1 px-3 py-1 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded transition-colors"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Mark Inspected</span>
                        </button>
                      )}

                      {isCompleted && (
                        <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> Ready for Guest
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Maintenance Work Orders */}
      {activeTab === 'maintenance' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white font-display">
                  Active Engineering & Facilities Tickets
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Track HVAC, electrical, plumbing, keycards, and in-room fixtures
                </p>
              </div>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {maintenanceRequests.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500">
                  No maintenance work orders reported. All rooms fully operational.
                </div>
              ) : (
                maintenanceRequests.map((req) => {
                  const isResolved = req.status === 'resolved';

                  return (
                    <div
                      key={req.id}
                      className="p-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="space-y-1 max-w-2xl">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white">
                            Room #{req.roomNumber}
                          </span>
                          <span className="text-xs font-semibold text-slate-900 dark:text-white">
                            {req.category}
                          </span>
                          <span
                            className={`text-[11px] font-semibold ${
                              req.priority === 'urgent'
                                ? 'text-red-600 dark:text-red-400'
                                : 'text-amber-600 dark:text-amber-400'
                            }`}
                          >
                            · {req.priority.toUpperCase()}
                          </span>
                          {isResolved ? (
                            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                              · Resolved
                            </span>
                          ) : (
                            <span className="text-xs text-amber-500 font-semibold">
                              · {req.status === 'in_progress' ? 'In Progress' : 'Reported'}
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                          {req.issueTitle}
                        </p>

                        <div className="flex items-center gap-3 text-[11px] text-slate-400 dark:text-slate-500">
                          <span>Reported by: {req.reportedBy}</span>
                          <span aria-hidden="true">·</span>
                          <span>Time: {req.reportedAt}</span>
                          {req.assignedStaffName && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span>Assigned to: {req.assignedStaffName}</span>
                            </>
                          )}
                        </div>

                        {req.notes && (
                          <div className="text-[11px] text-slate-600 dark:text-slate-400 italic">
                            Tech Notes: {req.notes}
                          </div>
                        )}
                      </div>

                      <div className="shrink-0 self-end md:self-center">
                        {!isResolved ? (
                          <button
                            onClick={() => {
                              const notes = prompt('Enter resolution notes (optional):');
                              resolveMaintenanceRequest(req.id, notes || undefined);
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-sm transition-colors"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Mark Resolved & Ready</span>
                          </button>
                        ) : (
                          <span className="text-xs text-slate-400 font-mono">
                            Fixed at {req.resolvedAt}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* New Cleaning Task Modal */}
      {isNewTaskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">
                Assign Housekeeping Task
              </h3>
              <button
                onClick={() => setIsNewTaskModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Select Room
                </label>
                <select
                  value={newTaskRoomId}
                  onChange={(e) => setNewTaskRoomId(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                >
                  {rooms.map((r) => (
                    <option key={r.id} value={r.id}>
                      Room #{r.number} ({r.type}) — Currently {r.housekeeping}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Task Type
                  </label>
                  <select
                    value={newTaskType}
                    onChange={(e) => setNewTaskType(e.target.value as any)}
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                  >
                    <option value="Full Turnover">Full Turnover</option>
                    <option value="Daily Refresh">Daily Refresh</option>
                    <option value="Deep Clean">Deep Clean</option>
                    <option value="Linen Change">Linen Change</option>
                    <option value="VIP Setup">VIP Setup</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Priority
                  </label>
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value as any)}
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                  >
                    <option value="normal">Normal Routine</option>
                    <option value="high">High Priority</option>
                    <option value="urgent">Urgent Turnaround</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Assign Attendant
                </label>
                <select
                  value={newTaskStaffId}
                  onChange={(e) => setNewTaskStaffId(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                >
                  <option value="">Unassigned (Queue)</option>
                  {staff
                    .filter((s) => s.department === 'Housekeeping')
                    .map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.status === 'on_duty' ? 'On Duty' : 'Off Duty'})
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Special Instructions
                </label>
                <textarea
                  value={newTaskNotes}
                  onChange={(e) => setNewTaskNotes(e.target.value)}
                  placeholder="e.g. Extra pillows, replenish Bulgari bath essentials..."
                  rows={3}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewTaskModalOpen(false)}
                  className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 dark:bg-amber-600 text-white font-semibold rounded-lg hover:bg-slate-800"
                >
                  Create & Schedule Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
