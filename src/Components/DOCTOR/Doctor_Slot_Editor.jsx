import React, { useState, useEffect } from "react";

export default function DoctorSlotEditor({ doctorId }) {
  const [date, setDate] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [days, setDays] = useState([]);

  // Fetch slots from backend
  useEffect(() => {
    if (!doctorId) return;

    async function loadSlots() {
      const res = await fetch(`/api/doctor/slots?doctorId=${doctorId}`);
      const data = await res.json();
      setDays(data);
    }

    loadSlots();
  }, [doctorId]);

  // Add Slot
  async function addSlot() {
    const res = await fetch("/api/doctor/slots", {
      method: "POST",
      body: JSON.stringify({ doctorId, date, start, end })
    });

    const updated = await res.json();
    setDays((prev) => {
      const others = prev.filter((d) => d.date !== updated.date);
      return [...others, updated];
    });
  }

  // Delete Slot
  async function deleteSlot(date, start) {
    const res = await fetch("/api/doctor/slots/delete", {
      method: "POST",
      body: JSON.stringify({ doctorId, date, start })
    });

    const updated = await res.json();
    setDays((prev) => {
      const others = prev.filter((d) => d.date !== updated.date);
      return [...others, updated];
    });
  }

  return (
    <div className="space-y-6">
      
      {/* Select Date */}
      <div className="form-control">
        <label className="label font-semibold">Select Date</label>
        <input
          type="date"
          className="input input-bordered"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      {/* Time Inputs */}
      <div className="flex gap-4">
        <input
          type="time"
          className="input input-bordered"
          value={start}
          onChange={(e) => setStart(e.target.value)}
        />
        <input
          type="time"
          className="input input-bordered"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
        />
        <button className="btn btn-primary" onClick={addSlot}>
          Add Slot
        </button>
      </div>

      {/* Display All Slots */}
      <div className="space-y-4">
        {days.map((day) => (
          <div key={day.date} className="card bg-base-100 shadow-md p-4">
            <h3 className="font-bold text-lg mb-2">{day.date}</h3>
            <div className="flex flex-wrap gap-3">
              {day.slots.map((s) => (
                <div key={s.start} className="badge bg-primary text-white p-3">
                  {s.start} - {s.end}
                  <button
                    onClick={() => deleteSlot(day.date, s.start)}
                    className="btn btn-xs btn-error ml-2"
                  >
                    x
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



// components/DoctorSlotEditor.jsx
import { useEffect, useState } from "react";

export default function DoctorSlotEditor({ doctorId }) {
  const [date, setDate] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [days, setDays] = useState([]);

  useEffect(() => {
    if (!doctorId) return;
    (async () => {
      const res = await fetch(`/api/doctor/slots?doctorId=${doctorId}`);
      const data = await res.json();
      setDays(data);
    })();
  }, [doctorId]);

  async function addSlot() {
    const res = await fetch("/api/doctor/slots", {
      method: "POST",
      body: JSON.stringify({ doctorId, date, start, end })
    });
    const updated = await res.json();
    setDays((prev) => {
      const others = prev.filter((d) => d.date !== updated.date);
      return [...others, updated];
    });
  }

  async function deleteSlot(dateVal, startVal) {
    const res = await fetch("/api/doctor/slots/delete", {
      method: "POST",
      body: JSON.stringify({ doctorId, date: dateVal, start: startVal })
    });
    const updated = await res.json();
    setDays((prev) => {
      const others = prev.filter((d) => d.date !== updated.date);
      return [...others, updated];
    });
  }

  return (
    <div className="space-y-6">
      <div className="form-control">
        <label className="label font-semibold">Select Date</label>
        <input
          type="date"
          className="input input-bordered"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      <div className="flex gap-4">
        <input
          type="time"
          className="input input-bordered"
          value={start}
          onChange={(e) => setStart(e.target.value)}
        />
        <input
          type="time"
          className="input input-bordered"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
        />
        <button className="btn btn-primary" onClick={addSlot}>
          Add Slot
        </button>
      </div>

      <div className="space-y-4">
        {days.map((day) => (
          <div key={day._id} className="card bg-base-100 shadow-md p-4">
            <h3 className="font-bold text-lg mb-2">{day.date}</h3>
            <div className="flex flex-wrap gap-3">
              {day.slots.map((s) => (
                <div key={s.start} className="badge bg-primary text-white p-3">
                  {s.start} - {s.end}
                  <button
                    onClick={() => deleteSlot(day.date, s.start)}
                    className="btn btn-xs btn-error ml-2"
                  >
                    x
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
