// components/PaymentScreen.jsx
import { useState } from "react";

export default function PaymentScreen({ appointment, onPaymentSuccess }) {
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);
  const [paymentId, setPaymentId] = useState("");

  async function handlePayment() {
    setError("");
    setProcessing(true);

    const res = await fetch("/api/payment/charge", {
      method: "POST",
      body: JSON.stringify({
        userId: appointment.patientId,
        appointmentId: appointment.appointmentId,
        amount: appointment.fee,
        paymentInfo: { cardNumber, expiry, cvv }
      })
    });

    const data = await res.json();
    setProcessing(false);

    if (!res.ok) {
      setError("Transaction failed. Please check your card or network.");
      console.error(data.error);
      return;
    }

    setPaymentId(data.paymentId);
    onPaymentSuccess(data.paymentId);
  }

  return (
    <div className="card bg-base-100 shadow-lg p-6 space-y-6">
      <h2 className="text-xl font-bold">Payment</h2>

      <div className="form-control">
        <label className="label">Card Number</label>
        <input
          type="text"
          className="input input-bordered"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
        />
      </div>

      <div className="flex gap-4">
        <div className="form-control flex-1">
          <label className="label">Expiry</label>
          <input
            type="text"
            className="input input-bordered"
            placeholder="MM/YY"
            value={expiry}
            onChange={(e) => setExpiry(e.target.value)}
          />
        </div>
        <div className="form-control flex-1">
          <label className="label">CVV</label>
          <input
            type="password"
            className="input input-bordered"
            value={cvv}
            onChange={(e) => setCvv(e.target.value)}
          />
        </div>
      </div>

      {error && <div className="alert alert-error text-sm">{error}</div>}

      <button
        className={`btn btn-primary w-full ${processing ? "loading" : ""}`}
        onClick={handlePayment}
        disabled={processing}
      >
        {processing ? "Processing..." : `Pay ৳${appointment.fee}`}
      </button>

      {paymentId && (
        <div className="alert alert-success mt-4 text-sm">
          Payment successful. Payment ID: {paymentId}
        </div>
      )}
    </div>
  );
}
