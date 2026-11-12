import React, { useState, useEffect } from 'react';
import { useHotel } from '../../context/HotelContext';
import { Room, RoomType } from '../../types/hotel';
import { X, Bed, DollarSign, Trash2, Building } from 'lucide-react';

export const RoomFormModal: React.FC = () => {
  const {
    isRoomFormModalOpen,
    setIsRoomFormModalOpen,
    roomToEdit,
    setRoomToEdit,
    addRoom,
    editRoom,
    deleteRoom,
    isAdmin,
    hotelInfo,
  } = useHotel();

  const [number, setNumber] = useState('');
  const [floor, setFloor] = useState<number>(1);
  const [type, setType] = useState<RoomType>('Heritage Deluxe');
  const [ratePerNight, setRatePerNight] = useState<number>(28000);
  const [bedType, setBedType] = useState<Room['bedType']>('King');
  const [maxCapacity, setMaxCapacity] = useState<number>(2);
  const [amenitiesStr, setAmenitiesStr] = useState('Central Geyser, Electric Blankets, Mountain View, Wi-Fi');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (roomToEdit) {
      setNumber(roomToEdit.number);
      setFloor(roomToEdit.floor);
      setType(roomToEdit.type);
      setRatePerNight(roomToEdit.ratePerNight);
      setBedType(roomToEdit.bedType);
      setMaxCapacity(roomToEdit.maxCapacity);
      setAmenitiesStr(roomToEdit.amenities.join(', '));
      setNotes(roomToEdit.notes || '');
    } else {
      setNumber('');
      setFloor(1);
      setType('Heritage Deluxe');
      setRatePerNight(28000);
      setBedType('King');
      setMaxCapacity(2);
      setAmenitiesStr('Central Geyser, Electric Blankets, Mountain View, Starlink Wi-Fi');
      setNotes('');
    }
  }, [roomToEdit, isRoomFormModalOpen]);

  if (!isRoomFormModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!number) return;

    const amenities = amenitiesStr
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    if (roomToEdit) {
      editRoom(roomToEdit.id, {
        number,
        floor: Number(floor),
        type,
        ratePerNight: Number(ratePerNight),
        bedType,
        maxCapacity: Number(maxCapacity),
        amenities,
        notes: notes || undefined,
      });
    } else {
      addRoom({
        number,
        floor: Number(floor),
        type,
        status: 'available',
        housekeeping: 'inspected',
        ratePerNight: Number(ratePerNight),
        bedType,
        maxCapacity: Number(maxCapacity),
        amenities,
        notes: notes || undefined,
      });
    }

    setIsRoomFormModalOpen(false);
    setRoomToEdit(null);
  };

  const handleDelete = () => {
    if (!roomToEdit) return;
    if (confirm(`Are you sure you want to permanently delete Room #${roomToEdit.number}? This action cannot be undone.`)) {
      deleteRoom(roomToEdit.id);
      setIsRoomFormModalOpen(false);
      setRoomToEdit(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">
              {roomToEdit ? `Edit Room #${roomToEdit.number}` : 'Add New Room to Inventory'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {hotelInfo.name} · Rates & Specifications (PKR)
            </p>
          </div>
          <button
            onClick={() => {
              setIsRoomFormModalOpen(false);
              setRoomToEdit(null);
            }}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Room Number *
              </label>
              <input
                type="text"
                required
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                placeholder="e.g. 106, 501"
                className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Floor Level
              </label>
              <select
                value={floor}
                onChange={(e) => setFloor(Number(e.target.value))}
                className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
              >
                <option value={1}>Floor 1 - Apricot Garden</option>
                <option value={2}>Floor 2 - Karakoram View</option>
                <option value={3}>Floor 3 - Executive Wing</option>
                <option value={4}>Floor 4 - Royal Shigar Penthouse</option>
                <option value={5}>Floor 5 - Observation Deck</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Room Type Category
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as RoomType)}
                className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
              >
                <option value="Heritage Deluxe">Heritage Deluxe</option>
                <option value="Karakoram View">Karakoram View</option>
                <option value="Riverside Chalet">Riverside Chalet</option>
                <option value="Executive Shigar Suite">Executive Shigar Suite</option>
                <option value="Royal Shigar Suite">Royal Shigar Suite</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Nightly Rate (PKR) *
              </label>
              <input
                type="number"
                min="5000"
                step="500"
                required
                value={ratePerNight}
                onChange={(e) => setRatePerNight(Number(e.target.value))}
                placeholder="28000"
                className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Bedding Configuration
              </label>
              <select
                value={bedType}
                onChange={(e) => setBedType(e.target.value as any)}
                className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
              >
                <option value="King">King Bed</option>
                <option value="Queen">Queen Bed</option>
                <option value="Twin Doubles">Twin Doubles</option>
                <option value="Royal Master King">Royal Master King</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Maximum Guest Capacity
              </label>
              <input
                type="number"
                min="1"
                max="6"
                value={maxCapacity}
                onChange={(e) => setMaxCapacity(Number(e.target.value))}
                className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Amenities & Features (Comma-separated)
            </label>
            <input
              type="text"
              value={amenitiesStr}
              onChange={(e) => setAmenitiesStr(e.target.value)}
              placeholder="e.g. Geyser Heating, Electric Blankets, Fireplace, High-speed Wi-Fi"
              className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Internal Maintenance / Operations Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Traditional walnut ceiling woodwork restored in 2024..."
              rows={2}
              className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
            />
          </div>

          {/* Footer with Actions */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            {roomToEdit && isAdmin ? (
              <button
                type="button"
                onClick={handleDelete}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Room</span>
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsRoomFormModalOpen(false);
                  setRoomToEdit(null);
                }}
                className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-slate-900 dark:bg-amber-600 text-white font-semibold rounded-lg hover:bg-slate-800 dark:hover:bg-amber-500 shadow-sm"
              >
                {roomToEdit ? 'Save Changes' : 'Create Room'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
