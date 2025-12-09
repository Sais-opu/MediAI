// app/book/page.jsx
"use client";

import { useEffect, useState } from "react";
import DoctorList from "@/components/DoctorList";
import BookingReview from "@/components/BookingReview";
import PaymentScreen from "@/components/PaymentScreen";

export default function BookPage() {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const [step, setStep] = useState("select"); // select → review → payment → done

  const patientId = "676767676767676767676767"; // replace with logged-in user ID

  useEffect(() => {
    // load doctors (replace with real /api/doctors)
    (async () => {
      const res = await fetch("/api/doctors"); // you need this route
      const data = await res.json();
      setDoctors(data);
    })();
  }, []);

  useEffect(() => {
    if (!selectedDoctor || !date) return;
    (async () => {
      const res = await fetch(`/api/doctor/slots?doctorId=${selectedDoctor._id}`);
      const data = await res.json();
      const day = data.find((d) => d.date === date);
      setSlots(day ? day.slots : []);
    })();
  }, [selectedDoctor, date]);

  async function handleCreateAppointment() {
    if (!selectedDoctor || !selectedSlot || !date) return;

    const res = await fetch("/api/appointments/create", {
      method: "POST",
      body: JSON.stringify({
        doctorId: selectedDoctor._id,
        patientId,
        date,
        start: selectedSlot.start,
        end: selectedSlot.end
      })
    });

    const data = await res.json();
    if (!res.ok) {
      alert(data.error || "Error creating appointment");
      return;
    }

    setAppointmentState({
      appointmentId: data.appointment._id,
      doctorId: selectedDoctor._id,
      patientId,
      doctorName: selectedDoctor.name,
      specialization: selectedDoctor.specialization,
      date,
      start: selectedSlot.start,
      end: selectedSlot.end,
      fee: selectedDoctor.fee
    });

    setStep("review");
  }

  const [appointmentState, setAppointmentState] = useState(null);

  function handleReviewConfirm() {
    setStep("payment");
  }

  function handlePaymentSuccess() {
    setStep("done");
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {step === "select" && (
        <>
          <h1 className="text-2xl font-bold mb-4">Book an Appointment</h1>

          <h2 className="font-semibold mb-2">1. Choose a Doctor</h2>
          <DoctorList doctors={doctors} onSelect={setSelectedDoctor} />

          {selectedDoctor && (
            <>
              <h2 className="font-semibold mt-6 mb-2">
                2. Choose Date and Time for {selectedDoctor.name}
              </h2>

              <div className="form-control max-w-xs mb-4">
                <label className="label">Select Date</label>
                <input
                  type="date"
                  className="input input-bordered"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>

              {date && (
                <div className="flex flex-wrap gap-3">
                  {slots.length === 0 && (
                    <span className="text-sm text-gray-500">
                      No slots available for this date.
                    </span>
                  )}
                  {slots.map((slot) => (
                    <button
                      key={slot.start}
                      className={`btn btn-sm ${
                        slot.booked
                          ? "btn-disabled"
                          : selectedSlot?.start === slot.start
                          ? "btn-primary"
                          : "btn-outline"
                      }`}
                      disabled={slot.booked}
                      onClick={() => setSelectedSlot(slot)}
                    >
                      {slot.start} - {slot.end}
                    </button>
                  ))}
                </div>
              )}

              <button
                className="btn btn-success mt-6"
                disabled={!selectedSlot}
                onClick={handleCreateAppointment}
              >
                Continue
              </button>
            </>
          )}
        </>
      )}

      {step === "review" && appointmentState && (
        <BookingReview appointmentData={appointmentState} onConfirm={handleReviewConfirm} />
      )}

      {step === "payment" && appointmentState && (
        <PaymentScreen appointment={appointmentState} onPaymentSuccess={handlePaymentSuccess} />
      )}

      {step === "done" && (
        <div className="alert alert-success">
          Appointment booked and payment processed successfully.
        </div>
      )}
    </div>
  );
}
