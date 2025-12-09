// Patient Booking
export default function BookingReview({ appointmentData, onConfirm }) {
  const { doctorName, specialization, date, start, end, fee } = appointmentData;

  return (
    <div className="card bg-base-100 shadow-md p-6 space-y-4">
      <h2 className="text-xl font-bold">Review Your Appointment</h2>
      <div className="space-y-2 text-gray-700 text-sm">
        <p><span className="font-semibold">Doctor:</span> {doctorName}</p>
        <p><span className="font-semibold">Specialization:</span> {specialization}</p>
        <p><span className="font-semibold">Date:</span> {date}</p>
        <p><span className="font-semibold">Time:</span> {start} - {end}</p>
        <p><span className="font-semibold">Fee:</span> ৳{fee}</p>
      </div>
      <button className="btn btn-primary w-full" onClick={onConfirm}>
        Proceed to Payment
      </button>
    </div>
  );
}
