import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";

export default function PatientBooking() {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const [slots, setSlots] = useState([]);

  useEffect(() => {
    loadSlots();
  }, []);

  const loadSlots = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5001/api/doctor/slots?doctorId=${doctorId}`
      );
      setSlots(res.data);
    } catch (err) {
      toast.error("Failed to load slots");
    }
  };

  const bookSlot = async (day, slot) => {
    try {
      const res = await axios.post(
        "http://localhost:5001/api/appointments/book",
        {
          doctorId,
          date: day.date,
          start: slot.start,
          end: slot.end
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`
          }
        }
      );

      toast.success("Appointment booked successfully! Redirecting to payment...");

      const { appointmentId, fee } = res.data;
      // Redirect to payment page
      // Route: /payment/:appointmentId/:amount
      navigate(`/payment/${appointmentId}/${fee || 0}`);

      // No need to reload slots if we are navigating away
      // loadSlots();

    } catch (error) {
      if (error.response?.status === 409) {
        toast.error("Slot is already booked.");
      } else {
        toast.error("Error booking the appointment. Please try again.");
      }
    }
  };

  return (
    <div className="p-5 space-y-5">
      <h2 className="text-xl font-bold">Available Slots</h2>

      {slots.map((day) => (
        <div key={day.date} className="border p-4 rounded-xl space-y-2">

          <h3 className="font-semibold">{day.date}</h3>

          <div className="flex flex-wrap gap-3">
            {day.slots.map((slot, i) => (
              <button
                key={i}
                disabled={slot.booked}
                className={
                  slot.booked
                    ? "btn btn-disabled btn-sm"
                    : "btn btn-outline btn-primary btn-sm"
                }
                onClick={() => !slot.booked && bookSlot(day, slot)}
              >
                {slot.start} - {slot.end}
              </button>
            ))}
          </div>

        </div>
      ))}
    </div>
  );
}
