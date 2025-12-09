import React, { useState, useEffect } from "react";

export default function PatientBookAppointment({ doctorId, patientId }) {
  const [slots, setSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [message, setMessage] = useState("");

  // Fetch all availability for the doctor
  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/doctor/slots?doctorId=${doctorId}`);
      const data = await res.json();
      setSlots(data);
    }
    load();
  }, [doctorId]);

  // When date changes → show available slots
  useEffect(() => {
    const day = slots.find((d) => d.date === selectedDate);
    setAvailableSlots(day ? day.slots : []);
  }, [selectedDate, slots]);

  // Book Appointment
  async function book(start, end) {
    setMessage("");

    const res = await fetch("/api/appointments/book", {
      method: "POST",
      body: JSON.stringify({
        doctorId,
        patientId,
        date: selectedDate,
        start,
        end
      })
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.error || "Error booking appointment. Please try again.");
      return;
    }

    setMessage("Appointment booked successfully!");

    // Update UI without reload
    setAvailableSlots((prev) =>
      prev.map((s) =>
        s.start === start ? { ...s, booked: true } : s
      )
    );
  }

  return (
    <div className="space-y-6">

      {/* Date selector */}
      <div className="form-control">
        <label className="label font-semibold">Select Date</label>
        <input
          type="date"
          className="input input-bordered"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      {/* Available slots */}
      <h3 className="font-bold text-lg">Available Slots</h3>

      {availableSlots.length === 0 && selectedDate && (
        <div className="text-gray-500">No slots available for this date.</div>
      )}

      <div className="flex flex-wrap gap-3">
        {availableSlots.map((slot) => (
          <button
            key={slot.start}
            className={`btn ${
              slot.booked ? "btn-disabled" : "btn-primary"
            }`}
            disabled={slot.booked}
            onClick={() => book(slot.start, slot.end)}
          >
            {slot.start} - {slot.end}
          </button>
        ))}
      </div>

      {/* Messages */}
      {message && (
        <div className="alert alert-info mt-4">
          {message}
        </div>
      )}

    </div>
  );
}
