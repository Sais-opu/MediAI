import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../Auth/AuthProvider.jsx";

const EmergencyAppointment = () => {
    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState("");

    const handleEmergency = async () => {
        if (!user) {
            alert("Please login to book an emergency appointment");
            return;
        }

        setLoading(true);
        setStatus("Sending emergency request...");

        try {
            // 1️⃣ Send emergency request to backend
            const res = await axios.post("/api/emergency/book", { patientId: user._id });
            const appointmentId = res.data.appointmentId;

            setStatus("Emergency request sent. Waiting for doctor response...");

            // 2️⃣ Poll backend for status every 3 seconds
            const interval = setInterval(async () => {
                try {
                    const statusRes = await axios.get(`/api/emergency/status/${appointmentId}`);
                    setStatus(`Current Status: ${statusRes.data.status.toUpperCase()}`);

                    if (["accepted", "rejected"].includes(statusRes.data.status)) {
                        clearInterval(interval);
                        alert(`Emergency Appointment ${statusRes.data.status.toUpperCase()}`);
                    }
                } catch (err) {
                    console.error(err);
                }
            }, 3000);

        } catch (err) {
            console.error(err);
            setStatus("Failed to book emergency appointment");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mb-6 text-center">
            <button
                onClick={handleEmergency}
                disabled={loading}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold"
            >
                {loading ? "Sending..." : "Book Emergency Appointment"}
            </button>
            {status && <p className="mt-2 text-gray-700 font-medium">{status}</p>}
        </div>
    );
};

export default EmergencyAppointment;
