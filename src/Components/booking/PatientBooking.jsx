import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";

export default function PatientBooking() {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const [slots, setSlots] = useState([]);
  const [doctor, setDoctor] = useState(null);
  const [type, setType] = useState("normal");
  const [medium, setMedium] = useState("physical");

  useEffect(() => {
    loadSlots();
    loadDoctor();
  }, [doctorId]);

  const loadDoctor = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/doctors/${doctorId}`);
      setDoctor(res.data);
    } catch (err) {
      console.error("Failed to load doctor", err);
    }
  };

  const loadSlots = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/doctor/slots?doctorId=${doctorId}`
      );
      setSlots(res.data);
    } catch (err) {
      toast.error("Failed to load slots");
    }
  };

  const bookAppointment = async (day = null, slot = null) => {
    try {
      const bookingData = {
        doctorId,
        type: "normal",
        medium,
        date: day?.date,
        start: slot?.start,
        end: slot?.end,
        patientDetails: null
      };

      const res = await axios.post(
        "http://localhost:5000/api/appointments/book",
        bookingData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`
          }
        }
      );

      toast.success("Appointment request submitted! Redirecting to payment...");

      const { appointmentId, fee } = res.data;
      navigate(`/payment/${appointmentId}/${fee || 0}`);

    } catch (error) {
      const message = error.response?.data?.message || "Error booking the appointment. Please try again.";
      toast.error(message);
      console.error("Booking error:", error);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <h2 className="text-3xl font-bold text-center text-gray-800">Book Your Appointment</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="form-control">
          <label className="label font-semibold">Appointment Type</label>
          <select
            className="select select-bordered w-full"
            value={type}
            onChange={(e) => {
              if (e.target.value === "emergency") {
                if (doctor) {
                  navigate("/emergency-appointment", { state: { doctor } });
                } else {
                  toast.error("Doctor information not loaded yet. Please try again in a moment.");
                }
              } else {
                setType(e.target.value);
              }
            }}
          >
            <option value="normal">Normal Appointment</option>
            <option value="emergency">Emergency Appointment (Priority)</option>
          </select>
        </div>

        <div className="form-control">
          <label className="label font-semibold">Appointment Medium</label>
          <select
            className="select select-bordered w-full"
            value={medium}
            onChange={(e) => setMedium(e.target.value)}
          >
            <option value="physical">Physical Visit</option>
            <option value="telemedicine">Telemedicine (Online)</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-700">Select an Available Slot</h3>
        {slots.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {slots.map((day) => (
              <div key={day.date} className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm space-y-4">
                <h4 className="font-bold text-blue-600 border-b pb-2">{day.date}</h4>
                <div className="flex flex-wrap gap-2">
                  {day.slots.map((slot, i) => (
                    <button
                      key={i}
                      className={`btn btn-sm ${slot.booked
                        ? "btn-disabled opacity-30"
                        : "btn-outline btn-primary hover:bg-primary hover:text-white"
                        }`}
                      onClick={() => {
                        if (!slot.booked) bookAppointment(day, slot);
                      }}
                      disabled={slot.booked}
                    >
                      {slot.start} - {slot.end}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
            <p className="text-gray-500">No available slots found for this doctor.</p>
          </div>
        )}
      </div>
    </div>
  );
}
