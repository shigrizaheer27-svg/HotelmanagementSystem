import React, { useState, useEffect } from 'react';
import { useHotel } from '../../context/HotelContext';
import { Room, RoomType } from '../../types/hotel';
import { X, Trash2, Plus } from 'lucide-react';

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
    roomCategories,
    addRoomCategory,
  } = useHotel();

  const [number, setNumber] = useState('');
  const [name, setName] = useState('');
  const [floor, setFloor] = useState<number>(1);
  const [type, setType] = useState<RoomType>(roomCategories[0]?.name || 'Heritage Deluxe');
  const [ratePerNight, setRatePerNight] = useState<number>(roomCategories[0]?.defaultRate || 28000);
  const [bedType, setBedType] = useState<Room['bedType']>('King');
  const [maxCapacity, setMaxCapacity] = useState<number>(2);
  const [amenitiesStr, setAmenitiesStr] = useState('Central Geyser, Electric Blankets, Mountain View, Wi-Fi');
  const [notes, setNotes] = useState('');

  // Quick inline new category creation
  const [isAddingCat, setIsAddingCat] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatRate, setNewCatRate] = useState<number>(30000);

  useEffect(() => {
    if (roomToEdit) {
      setNumber(roomToEdit.number);
      setName(roomToEdit.name || '');
      setFloor(roomToEdit.floor);
      setType(roomToEdit.type);
      setRatePerNight(roomToEdit.ratePerNight);
      setBedType(roomToEdit.bedType);
      setMaxCapacity(roomToEdit.maxCapacity);
      setAmenitiesStr(roomToEdit.amenities.join(', '));
      setNotes(roomToEdit.notes || '');
    } else {
      const defaultCat = roomCategories[0];
      setNumber('');
      setName('');
      setFloor(1);
      setType(defaultCat?.name || 'Deluxe Room');
      setRatePerNight(defaultCat?.defaultRate || 28000);
      setBedType('King');
      setMaxCapacity(2);
      setAmenitiesStr('Central Heating, Smart TV, Wi-Fi, Mountain / Garden View');
      setNotes('');
    }
    setIsAddingCat(false);
  }, [roomToEdit, isRoomFormModalOpen]);

  if (!isRoomFormModalOpen) return null;

  const handleCategoryChange = (selectedType: string) => {
    setType(selectedType);
    if (!roomToEdit) {
      const matched = roomCategories.find((c) => c.name === selectedType);
      if (matched) setRatePerNight(matched.defaultRate);
    }
  };

  const handleQuickCreateCategory = () => {
    if (!newCatName.trim()) return;
    const created = addRoomCategory({
      name: newCatName.trim(),
      defaultRate: Math.max(0, Number(newCatRate)),
    });
    setType(created.name);
    setRatePerNight(created.defaultRate);
    setNewCatName('');
    setIsAddingCat(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!number.trim()) return;

    const amenities = amenitiesStr
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const finalRoomName = name.trim() || `${type} ${number.trim()}`;

    if (roomToEdit) {
      editRoom(roomToEdit.id, {
        number: number.trim(),
        name: finalRoomName,
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
        number: number.trim(),
        name: finalRoomName,
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
    if (confirm(`Are you sure you want to permanently delete Room #${roomToEdit.number} (${roomToEdit.name})?`)) {
      deleteRoom(roomToEdit.id);
      setIsRoomFormModalOpen(false);
      setRoomToEdit(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 my-8">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">
              {roomToEdit ? `Edit Room #${roomToEdit.number} — ${roomToEdit.name}` : 'Add New Room to Inventory'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {hotelInfo.name} · Name, Category & Rates ({hotelInfo.currency})
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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

            <div className="sm:col-span-2">
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Room / Suite Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Apricot Blossom Deluxe"
                className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-medium text-slate-700 dark:text-slate-300">
                  Room Category
                </label>
                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => setIsAddingCat((v) => !v)}
                    className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-0.5"
                  >
                    <Plus className="w-3 h-3" /> New Category
                  </button>
                )}
              </div>
              <select
                value={type}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
              >
                {roomCategories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
                {!roomCategories.some((c) => c.name === type) && type && (
                  <option value={type}>{type}</option>
                )}
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Nightly Rate ({hotelInfo.currency}) *
              </label>
              <input
                type="number"
                min="0"
                step="500"
                required
                value={ratePerNight}
                onChange={(e) => setRatePerNight(Number(e.target.value))}
                className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:outline-none"
              />
            </div>
          </div>

          {isAddingCat && isAdmin && (
            <div className="p-3 rounded-lg bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 space-y-2">
              <div className="font-semibold text-amber-900 dark:text-amber-200 text-[11px]">
                Quick Create Room Category
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="Category name"
                  className="p-1.5 rounded border border-amber-300 dark:border-amber-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
                <input
                  type="number"
                  min="0"
                  step="500"
                  value={newCatRate}
                  onChange={(e) => setNewCatRate(Number(e.target.value))}
                  placeholder={`Rate (${hotelInfo.currency})`}
                  className="p-1.5 rounded border border-amber-300 dark:border-amber-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingCat(false)}
                  className="px-2.5 py-1 text-slate-600 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleQuickCreateCategory}
                  className="px-3 py-1 bg-amber-600 text-white font-semibold rounded"
                >
                  Add & Select
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Floor Level
              </label>
              <select
                value={floor}
                onChange={(e) => setFloor(Number(e.target.value))}
                className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
              >
                <option value={1}>Floor 1</option>
                <option value={2}>Floor 2</option>
                <option value={3}>Floor 3</option>
                <option value={4}>Floor 4</option>
                <option value={5}>Floor 5</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Bedding
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
                Max Guests
              </label>
              <input
                type="number"
                min="1"
                max="8"
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
              rows={2}
              className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
            />
          </div>

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
            ) : (
              <div />
            )}

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
