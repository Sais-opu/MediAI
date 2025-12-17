import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../Auth/AuthProvider.jsx";

const PatientEmergencyList = () => {
    const { token } = useContext(AuthContext);
    const [emergencies, setEmergencies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!token) return;

        const fetchEmergencies = async () => {
            try {
                setLoading(true);
                setError(null);

                const res = await axios.get("http://localhost:5000/emergency/patient", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const sortedEmergencies = res.data.sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                );

                setEmergencies(sortedEmergencies);
            } catch (err) {
                console.error("Failed to fetch emergencies:", err);
                if (err.response?.status === 401) setError("Session expired. Please log in again.");
                else if (err.response?.status === 403) setError("Access denied. Patients only.");
                else setError("Failed to load your emergency history. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchEmergencies();
    }, [token]);

    if (loading) return <p className="text-center mt-20">Loading emergencies...</p>;
    if (error) return <p className="text-center mt-20 text-red-600">{error}</p>;

    return (
        <div className="max-w-7xl mx-auto mt-10 px-4 pb-16">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">My Emergency Appointments</h2>

            {emergencies.length === 0 ? (
                <div className="text-center py-20 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 shadow-inner">
                    <p className="text-2xl font-semibold text-gray-700">No emergency appointments yet</p>
                </div>
            ) : (
                <div className="overflow-x-auto shadow-2xl rounded-2xl border border-gray-200 bg-white">
                    <table className="min-w-full divide-y divide-gray-300">
                        <thead className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
                            <tr>
                                <th className="py-6 px-6 text-left text-sm font-bold uppercase tracking-wider">Doctor</th>
                                <th className="py-6 px-6 text-left text-sm font-bold uppercase tracking-wider">Details</th>
                                <th className="py-6 px-6 text-left text-sm font-bold uppercase tracking-wider">Status</th>
                                <th className="py-6 px-6 text-left text-sm font-bold uppercase tracking-wider">Slot Time</th>
                                <th className="py-6 px-6 text-left text-sm font-bold uppercase tracking-wider">Checkup</th>
                                <th className="py-6 px-6 text-left text-sm font-bold uppercase tracking-wider">Updated At</th>
                                <th className="py-6 px-6 text-left text-sm font-bold uppercase tracking-wider">Requested On</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {emergencies.map((e) => (
                                <tr key={e._id} className="hover:bg-blue-50 transition-all duration-200">
                                    <td className="py-4 px-6 font-semibold text-gray-900">{e.doctorName || <i>Assigning...</i>}</td>
                                    <td className="py-4 px-6 text-gray-700 truncate max-w-md" title={e.details}>{e.details || "—"}</td>
                                    <td className="py-4 px-6">
                                        <span
                                            className={`inline-flex px-5 py-2.5 rounded-full text-sm font-bold tracking-wide ${
                                                e.status === "pending"
                                                    ? "bg-yellow-100 text-yellow-800 border border-yellow-300"
                                                    : e.status === "accepted"
                                                    ? "bg-green-100 text-green-800 border border-green-300"
                                                    : e.status === "rejected"
                                                    ? "bg-red-100 text-red-800 border border-red-300"
                                                    : "bg-gray-100 text-gray-800 border border-gray-300"
                                            }`}
                                        >
                                            {e.status.charAt(0).toUpperCase() + e.status.slice(1)}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 font-medium text-gray-800">
                                        {e.slotTime ? `${e.slotTime.start} - ${e.slotTime.end} (${e.slotTime.duration} mins)` : "Not scheduled"}
                                    </td>
                                    <td className="py-4 px-6 font-medium text-gray-800">{e.checkUp || "Not"}</td>
                                    <td className="py-4 px-6 font-medium text-gray-600">
                                        {e.updatedAt ? new Date(e.updatedAt).toLocaleString() : "—"}
                                    </td>
                                    <td className="py-4 px-6 text-gray-600 text-sm">
                                        {new Date(e.createdAt).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default PatientEmergencyList;
