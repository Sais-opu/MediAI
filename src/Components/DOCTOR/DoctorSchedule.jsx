import React, { useEffect, useState } from "react";
import axios from "axios";

export default function DoctorSchedule({ doctorId }) {
  const [date, setDate] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [slots, setSlots] = useState([]);

  useEffect(() => {
    if (doctorId) loadSlots();
  }, [doctorId]);

  const loadSlots = async () => {
    const res = await axios.get(
      `http://localhost:5000/api/doctor/slots?doctorId=${doctorId}`
    );
    setSlots(res.data);
  };

  const addSlot = async () => {
    await axios.post("http://localhost:5000/api/doctor/slots", {
      doctorId,
      date,
      start,
      end
    });

    loadSlots();
  };

  const deleteSlot = async (date, start) => {
    await axios.delete("http://localhost:5000/api/doctor/slots", {
      data: { doctorId, date, start }
    });

    loadSlots();
  };

  return (
    <div className="p-6 space-y-6">

      <h2 className="text-2xl font-bold">Doctor Availability Schedule</h2>

      {/* Date Picker */}
      <div className="flex gap-4">
        <input
          type="date"
          className="input input-bordered"
          value={date}
          onChange={e => setDate(e.target.value)}
        />

        <input
          type="time"
          className="input input-bordered"
          value={start}
          onChange={e => setStart(e.target.value)}
        />

        <input
          type="time"
          className="input input-bordered"
          value={end}
          onChange={e => setEnd(e.target.value)}
        />

        <button className="btn btn-primary" onClick={addSlot}>
          Add Slot
        </button>
      </div>

      {/* Show Slots */}
      <div className="space-y-4">
        {slots.map(day => (
          <div key={day.date} className="border p-4 rounded-xl">
            <h3 className="font-semibold text-lg">{day.date}</h3>

            <div className="flex flex-wrap gap-3 mt-3">
              {day.slots.map((slot, index) => (
                <div
                  key={index}
                  className="badge badge-outline p-3 flex items-center gap-2"
                >
                  {slot.start} - {slot.end}

                  <button
                    className="btn btn-xs btn-error"
                    onClick={() => deleteSlot(day.date, slot.start)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
