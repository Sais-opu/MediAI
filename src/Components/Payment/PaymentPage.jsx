import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

export default function PaymentPage() {
  const { appointmentId, amount } = useParams();  // <-- FIXED
  const [cardNumber, setCardNumber] = useState("");

  const handlePayment = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/payment/charge",
        {
          appointmentId,
          amount,
          paymentInfo: { cardNumber }
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      toast.success("Payment Successful!");

      console.log("Payment ID:", res.data.paymentId);

      // When invoice is implemented:
      // window.open(`/invoice/${res.data.paymentId}`, "_blank");

    } catch (err) {
      toast.error(
        err.response?.data?.error ||
          "Transaction failed. Please check your card or network."
      );
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6 p-10">
      <h1 className="text-2xl font-bold">Payment</h1>

      <p className="text-lg">
        Amount Payable: <strong>৳{amount}</strong>
      </p>

      <input
        type="text"
        placeholder="Enter card number"
        className="input input-bordered w-full max-w-xs"
        value={cardNumber}
        onChange={(e) => setCardNumber(e.target.value)}
      />

      <button
        className="btn btn-primary w-full max-w-xs"
        onClick={handlePayment}
      >
        Pay Now
      </button>
    </div>
  );
}
