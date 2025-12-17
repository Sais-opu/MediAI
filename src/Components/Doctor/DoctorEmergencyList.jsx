import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../Auth/AuthProvider.jsx";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DoctorEmergencyList = () => {
    const { token } = useContext(AuthContext);
    const [emergencies, setEmergencies] = useState([]);
    const [loading, setLoading] = useState(true);

    const statusOrder = { pending: 0, accepted: 1, rejected: 2, completed: 3 };

    useEffect(() => {
        if (!token) return;

        const fetchEmergencies = async () => {
            try {
                setLoading(true);
                const res = await axios.get("http://localhost:5000/emergency/doctor", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                // Sort pending first, then accepted, rejected, completed
                const sorted = res.data.sort((a, b) => {
                    if (statusOrder[a.status] !== statusOrder[b.status]) {
                        return statusOrder[a.status] - statusOrder[b.status];
                    }
                    return new Date(b.createdAt) - new Date(a.createdAt);
                });

                setEmergencies(sorted);
            } catch (err) {
                console.error(err);
                toast.error("Failed to fetch emergencies");
            } finally {
                setLoading(false);
            }
        };

        fetchEmergencies();
    }, [token]);

    const handleUpdate = async (id, status, checkUp) => {
        try {
            const res = await axios.patch(
                `http://localhost:5000/emergency/${id}/status`,
                { status, checkUp },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setEmergencies((prev) =>
                prev.map((e) =>
                    e._id === id
                        ? { ...e, status, checkUp: checkUp || e.checkUp, updatedAt: new Date() }
                        : e
                )
            );

            toast.success(`Updated successfully`);
        } catch (err) {
            console.error(err);
            toast.error("Failed to update");
        }
    };

    if (loading) {
        return (
            <div className="text-center mt-20">
                <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-700 font-medium">Loading emergencies...</p>
            </div>
        );
    }

    if (emergencies.length === 0) {
        return (
            <p className="text-center text-gray-500 mt-20 text-lg">
                No emergencies assigned yet.
            </p>
        );
    }

    return (
        <div className="max-w-7xl mx-auto mt-10 px-4 pb-16">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
                My Emergency Appointments
            </h2>

            <div className="overflow-x-auto shadow-2xl rounded-2xl border border-gray-200 bg-white">
                <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
                        <tr>
                            <th className="py-6 px-4 text-left text-sm font-bold uppercase tracking-wider">Patient</th>
                            <th className="py-6 px-4 text-left text-sm font-bold uppercase tracking-wider">Details</th>
                            <th className="py-6 px-4 text-left text-sm font-bold uppercase tracking-wider">Status</th>
                            <th className="py-6 px-4 text-left text-sm font-bold uppercase tracking-wider">CheckUp</th>
                            <th className="py-6 px-4 text-left text-sm font-bold uppercase tracking-wider">Slot Time</th>
                            <th className="py-6 px-4 text-left text-sm font-bold uppercase tracking-wider">Requested On</th>
                            <th className="py-6 px-4 text-left text-sm font-bold uppercase tracking-wider">Updated At</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {emergencies.map((e) => (
                            <tr
                                key={e._id}
                                className={`transition-all duration-200 ${e.status === "pending"
                                        ? "bg-yellow-50"
                                        : e.status === "accepted"
                                            ? "bg-green-50"
                                            : e.status === "rejected"
                                                ? "bg-red-50"
                                                : e.status === "completed"
                                                    ? "bg-purple-50"
                                                    : ""
                                    }`}
                            >
                                <td className="py-4 px-4">{e.fullName}</td>
                                <td className="py-4 px-4 max-w-md truncate">{e.details}</td>

                                <td className="py-4 px-4">
                                    <select
                                        value={e.status}
                                        onChange={(ev) => handleUpdate(e._id, ev.target.value, e.checkUp)}
                                        className="border px-2 py-1 rounded"
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="accepted">Accepted</option>
                                        <option value="rejected">Rejected</option>
                                        <option value="completed">Completed</option>
                                    </select>
                                </td>

                                <td className="py-4 px-4">
                                    <select
                                        value={e.checkUp || "Not"}
                                        onChange={(ev) => handleUpdate(e._id, e.status, ev.target.value)}
                                        className="border px-2 py-1 rounded"
                                    >
                                        <option value="Not">Not</option>
                                        <option value="Done">Done</option>
                                    </select>
                                </td>

                                <td className="py-4 px-4">
                                    {e.slotTime
                                        ? `${e.slotTime.start} - ${e.slotTime.end} (${e.slotTime.duration} mins)`
                                        : "Not scheduled"}
                                </td>

                                <td className="py-4 px-4 text-gray-600 text-sm">
                                    {new Date(e.createdAt).toLocaleString()}
                                </td>

                                <td className="py-4 px-4 text-gray-600 text-sm">
                                    {e.updatedAt ? new Date(e.updatedAt).toLocaleString() : "-"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DoctorEmergencyList;
