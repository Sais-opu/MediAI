import React, { useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";
import { AuthContext } from "../Auth/AuthProvider.jsx";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Clock, Activity, AlertCircle, User } from "lucide-react";

const DoctorEmergencyList = () => {
    const { token } = useContext(AuthContext);
    const [emergencies, setEmergencies] = useState([]);
    const [loading, setLoading] = useState(true);

    const statusOrder = { pending: 0, accepted: 1, rejected: 2, completed: 3 };

    const fetchEmergencies = useCallback(async () => {
        if (!token) return;
        try {
            const res = await axios.get("http://localhost:5000/emergency/doctor", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const sorted = res.data.sort((a, b) => {
                if (statusOrder[a.status] !== statusOrder[b.status]) {
                    return statusOrder[a.status] - statusOrder[b.status];
                }
                return new Date(b.createdAt) - new Date(a.createdAt);
            });
            setEmergencies(sorted);
        } catch (err) {
            console.error("Fetch error:", err);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchEmergencies();
        const interval = setInterval(fetchEmergencies, 3000);
        return () => clearInterval(interval);
    }, [fetchEmergencies]);

    const handleUpdate = async (id, status, checkUp) => {
        try {
            await axios.patch(`http://localhost:5000/emergency/${id}/status`, { status, checkUp }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Updated Successfully");
            fetchEmergencies();
        } catch (err) {
            toast.error("Update failed");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this emergency record?")) return;
        try {
            const res = await axios.delete(`http://localhost:5000/doctor/emergency/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.data.success) {
                toast.success("Deleted");
                setEmergencies((prev) => prev.filter((e) => e._id !== id));
            }
        } catch (err) {
            toast.error("Delete failed");
        }
    };

    const formatSlot = (slot) => {
        if (!slot || !slot.day) return "Unassigned";
        return `${slot.day} | ${slot.start}-${slot.end}`;
    };

    if (loading) return <div className="flex justify-center mt-20"><span className="loading loading-ring loading-lg text-primary"></span></div>;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto mt-10 px-4 pb-16">
            <div className="flex justify-between items-center mb-10">
                <h2 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
                    <Activity className="text-rose-500 w-10 h-10" /> Emergency Triage Panel
                </h2>

                {/* Total Patient Count */}
                <div className="bg-white px-6 py-2.5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Active Patients</span>
                    <span className="text-2xl font-black text-rose-600">{emergencies.length}</span>
                </div>
            </div>

            {emergencies.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
                    <AlertCircle className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <p className="text-xl font-bold text-gray-400">No active emergencies</p>
                </div>
            ) : (
                <div className="overflow-x-auto bg-white rounded-2xl shadow-xl border border-gray-100">
                    <table className="table w-full">
                        <thead className="bg-slate-50 border-b border-gray-200">
                            <tr className="text-gray-600 uppercase text-[11px] tracking-widest">
                                <th className="py-5 px-6">Patient</th>
                                <th className="py-5 px-6">Case Details</th>
                                <th className="py-5 px-6 text-center">Status</th>
                                <th className="py-5 px-6">Slot Allocation</th>
                                <th className="py-5 px-6 text-center">Check-up</th>
                                <th className="py-5 px-6">Time</th>
                                <th className="py-5 px-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            <AnimatePresence>
                                {emergencies.map((e) => (
                                    <motion.tr key={e._id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="hover:bg-blue-50/30">
                                        <td className="py-4 px-6 font-bold text-gray-800">
                                            <div className="flex items-center gap-2">
                                                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><User size={16} /></div>
                                                {e.fullName}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-sm text-gray-500 italic truncate max-w-[150px]">"{e.details}"</td>

                                        {/* Status Dropdown - Solid White BG, No transitions */}
                                        <td className="py-4 px-6 text-center">
                                            <select
                                                value={e.status}
                                                onChange={(ev) => handleUpdate(e._id, ev.target.value, e.checkUp)}
                                                className={`select select-sm border-2 font-bold rounded-xl appearance-none bg-white ${e.status === "pending" ? "border-amber-200 text-amber-600" :
                                                        e.status === "accepted" ? "border-emerald-200 text-emerald-600" :
                                                            "border-rose-200 text-rose-600"
                                                    }`}
                                                style={{ transition: 'none' }}
                                            >
                                                <option value="pending" className="bg-white text-gray-800">Pending</option>
                                                <option value="accepted" className="bg-white text-gray-800">Accepted</option>
                                                <option value="rejected" className="bg-white text-gray-800">Rejected</option>
                                            </select>
                                        </td>

                                        <td className="py-4 px-6 text-sm font-medium">
                                            <div className="flex items-center gap-2 text-gray-700">
                                                <Clock size={14} className="text-primary" />
                                                {formatSlot(e.slotTime)}
                                            </div>
                                        </td>

                                        {/* Check-up Dropdown - Solid White BG, No transitions */}
                                        <td className="py-4 px-6 text-center">
                                            <select
                                                value={e.checkUp || "Not"}
                                                onChange={(ev) => handleUpdate(e._id, e.status, ev.target.value)}
                                                className={`select select-sm border-2 font-bold rounded-xl bg-white ${e.checkUp === "Done" ? "border-blue-200 text-blue-600" : "border-slate-200 text-slate-500"
                                                    }`}
                                                style={{ transition: 'none' }}
                                            >
                                                <option value="Not" className="bg-white text-gray-800">Not Yet</option>
                                                <option value="Done" className="bg-white text-gray-800">✓ Done</option>
                                            </select>
                                        </td>

                                        <td className="py-4 px-6 text-[10px] text-gray-400 font-medium">
                                            {e.updatedAt ? new Date(e.updatedAt).toLocaleString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' }) : "—"}
                                        </td>

                                        <td className="py-4 px-6 text-right">
                                            <button
                                                onClick={() => handleDelete(e._id)}
                                                className="p-2 rounded-xl  text-rose-500 hover:bg-rose-500  transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            )}
        </motion.div>
    );
};

export default DoctorEmergencyList;