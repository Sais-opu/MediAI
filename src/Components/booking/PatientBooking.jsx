import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";

export default function PatientBooking() {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const [slots, setSlots] = useState([]);
  const [type, setType] = useState("normal");
  const [medium, setMedium] = useState("physical");
  const [emergencyDetails, setEmergencyDetails] = useState({
    fullName: "",
    email: "",
    gender: "Male",
    dob: "",
    phoneNumber: "",
    reason: ""
  });

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmergencyDetails(prev => ({ ...prev, [name]: value }));
  };

  const bookAppointment = async (day = null, slot = null) => {
    try {
      const bookingData = {
        doctorId,
        type,
        medium,
        date: day?.date,
        start: slot?.start,
        end: slot?.end,
        patientDetails: type === "emergency" ? emergencyDetails : null
      };

      const res = await axios.post(
        "http://localhost:5001/api/appointments/book",
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
            onChange={(e) => setType(e.target.value)}
          >
            <option value="normal">Normal Appointment</option>
            <option value="emergency">Emergency Appointment</option>
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

      {type === "emergency" && (
        <div className="bg-red-50 p-6 rounded-2xl border border-red-100 space-y-4">
          <h3 className="text-xl font-bold text-red-800 flex items-center gap-2">
            🚑 Emergency Patient Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              className="input input-bordered w-full"
              value={emergencyDetails.fullName}
              onChange={handleInputChange}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="input input-bordered w-full"
              value={emergencyDetails.email}
              onChange={handleInputChange}
            />
            <select
              name="gender"
              className="select select-bordered w-full"
              value={emergencyDetails.gender}
              onChange={handleInputChange}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <input
              type="date"
              name="dob"
              className="input input-bordered w-full"
              value={emergencyDetails.dob}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="phoneNumber"
              placeholder="Phone Number"
              className="input input-bordered w-full"
              value={emergencyDetails.phoneNumber}
              onChange={handleInputChange}
            />
            <textarea
              name="reason"
              placeholder="Reason for emergency (e.g. chest pain)"
              className="textarea textarea-bordered w-full md:col-span-2"
              value={emergencyDetails.reason}
              onChange={handleInputChange}
            />
          </div>
          <button
            className="btn btn-error w-full text-white font-bold"
            onClick={() => bookAppointment()}
          >
            Request Emergency Appointment
          </button>
        </div>
      )}

      {type === "normal" && (
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
      )}
    </div>
  );
}
