import React, { useState } from "react";

const ScheduleForm = ({ slots, onAddSlot, onDeleteSlot }) => {
  const [form, setForm] = useState({
    day: "Sunday",
    start: "09:00",
    end: "13:00",
    duration: "30",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "duration" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.day || !form.start || !form.end || !form.duration) return;
    onAddSlot(form);
  };

  return (
    <div className="space-y-4">
      <form
        className="grid grid-cols-2 gap-3 md:grid-cols-4"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col">
          <label className="text-xs font-medium text-gray-600">Day</label>
          <select
            name="day"
            value={form.day}
            onChange={handleChange}
            className="mt-1 rounded-lg border border-gray-200 px-2 py-1.5 text-xs outline-none focus:ring-1 focus:ring-indigo-500"
          >
            {[
              "Sunday",
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
            ].map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-xs font-medium text-gray-600">Start</label>
          <input
            type="time"
            name="start"
            value={form.start}
            onChange={handleChange}
            className="mt-1 rounded-lg border border-gray-200 px-2 py-1.5 text-xs outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-xs font-medium text-gray-600">End</label>
          <input
            type="time"
            name="end"
            value={form.end}
            onChange={handleChange}
            className="mt-1 rounded-lg border border-gray-200 px-2 py-1.5 text-xs outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-xs font-medium text-gray-600">
            Slot Duration (min)
          </label>
          <input
            type="number"
            name="duration"
            min={5}
            step={5}
            value={form.duration}
            onChange={handleChange}
            className="mt-1 rounded-lg border border-gray-200 px-2 py-1.5 text-xs outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="col-span-2 md:col-span-4">
          <button
            type="submit"
            className="w-full rounded-lg bg-indigo-600 px-3 py-2 text-xs font-medium text-white hover:bg-indigo-700"
          >
            Add Availability Slot
          </button>
        </div>
      </form>

      <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 text-xs">
        <h4 className="mb-2 text-xs font-semibold text-gray-700">
          Current Available Slots (Real-time sync with patients)
        </h4>
        {slots.length === 0 ? (
          <p className="text-xs text-gray-500">
            No availability set yet. Add your first slot above.
          </p>
        ) : (
          <ul className="space-y-1">
            {slots.map((slot) => (
              <li
                key={slot._id || slot.id}
                className="flex items-center justify-between rounded-lg bg-white px-3 py-1.5"
              >
                <div>
                  <span className="font-medium text-gray-800">
                    {slot.day} • {slot.start}–{slot.end}
                  </span>
                  <span className="ml-2 text-[11px] text-gray-500">
                    {slot.duration} min / appointment
                  </span>
                </div>
                {onDeleteSlot && (
                  <button
                    onClick={() => onDeleteSlot(slot._id)}
                    className="rounded-md border border-red-200 px-2 py-0.5 text-[11px] text-red-600 hover:bg-red-50"
                  >
                    Remove
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ScheduleForm;

