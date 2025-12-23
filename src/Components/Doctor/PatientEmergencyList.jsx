import React, { useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";
import { AuthContext } from "../Auth/AuthProvider.jsx";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Clock, Activity, AlertCircle, User, Calendar } from "lucide-react";

const PatientEmergencyList = () => {
    const { token } = useContext(AuthContext);
    const [emergencies, setEmergencies] = useState([]);
    const [loading, setLoading] = useState(true);

    const getStatusPriority = (e) => {
        if (e.status === "pending") return 0;
        if (e.status === "accepted" && e.checkUp !== "Done") return 1;
        if (e.status === "rejected") return 2;
        if (e.status === "accepted" && e.checkUp === "Done") return 3;
        return 4;
    };

    const fetchEmergencies = useCallback(async () => {
        if (!token) return;
        try {
            const res = await axios.get("http://localhost:5000/emergency/patient", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const sorted = res.data.sort((a, b) => {
                const priorityA = getStatusPriority(a);
                const priorityB = getStatusPriority(b);
                if (priorityA !== priorityB) return priorityA - priorityB;
                return new Date(b.createdAt) - new Date(a.createdAt);
            });
            setEmergencies(sorted);
        } catch (err) {
            console.error("Sync error:", err);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchEmergencies();
        const interval = setInterval(fetchEmergencies, 3000);
        return () => clearInterval(interval);
    }, [fetchEmergencies]);

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this emergency record?")) return;
        try {
            const res = await axios.delete(`http://localhost:5000/emergency/patient/${id}`, {
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
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto mt-6 md:mt-10 px-4 pb-16">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
                <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 flex items-center gap-3">
                    <Activity className="text-primary w-8 h-8 md:w-10 md:h-10" /> My Emergency Requests
                </h2>
                <div className="bg-white px-6 py-2.5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3 w-full sm:w-auto justify-between">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total History</span>
                    <span className="text-2xl font-black text-primary">{emergencies.length}</span>
                </div>
            </div>

            {emergencies.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
                    <AlertCircle className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <p className="text-xl font-bold text-gray-400">No emergency records found</p>
                </div>
            ) : (
                <div className="overflow-x-auto bg-white rounded-2xl shadow-xl border border-gray-100">
                    <table className="table w-full min-w-[1000px]">
                        <thead className="bg-slate-50 border-b border-gray-200">
                            <tr className="text-gray-600 uppercase text-[11px] tracking-widest">
                                <th className="py-5 px-6">Assigned Doctor</th>
                                <th className="py-5 px-6">Case Details</th>
                                <th className="py-5 px-6 text-center">Status</th>
                                <th className="py-5 px-6">Slot Allocation</th>
                                <th className="py-5 px-6 text-center">Check-up</th>
                                <th className="py-5 px-6">Requested At</th>
                                <th className="py-5 px-6">Last Updated</th>
                                <th className="py-5 px-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            <AnimatePresence>
                                {emergencies.map((e) => {
                                    const canDelete = e.status === "rejected" || (e.status === "accepted" && e.checkUp === "Done");
                                    return (
                                        <motion.tr key={e._id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="hover:bg-blue-50/30 transition-colors">
                                            <td className="py-4 px-6 font-bold text-gray-800">
                                                <div className="flex items-center gap-2">
                                                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><User size={16} /></div>
                                                    <span className="truncate">{e.doctorName || "Pending Assignment"}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-sm text-gray-500 italic truncate max-w-[150px]">"{e.details}"</td>
                                            <td className="py-4 px-6 text-center">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${e.status === "pending" ? "bg-amber-100 text-amber-700 border border-amber-200" : e.status === "accepted" ? "bg-emerald-100 text-emerald-700 border border-emerald-200" : "bg-rose-100 text-rose-700 border border-rose-200"}`}>
                                                    {e.status}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-sm font-medium">
                                                <div className="flex flex-col gap-0.5">
                                                    <div className="flex items-center gap-2 text-gray-700">
                                                        <Clock size={14} className="text-primary" />
                                                        {formatSlot(e.slotTime)}
                                                    </div>
                                                    {/* FIXED: Path corrected to e.slotTime.duration */}
                                                    <span className="text-[10px] text-gray-400 ml-5 italic">
                                                        Duration: {e.slotTime?.duration || "—"} mins
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-center">
                                                <span className={`px-3 py-1 rounded-lg text-xs font-bold ${e.checkUp === "Done" ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-500"}`}>
                                                    {e.checkUp === "Done" ? "✓ Done" : "Not Yet"}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-[10px] text-gray-400 font-medium leading-tight">
                                                <div className="flex items-center gap-1">
                                                    <Calendar size={10} className="text-amber-500" />
                                                    {e.createdAt ? new Date(e.createdAt).toLocaleString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' }) : "—"}
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-[10px] text-gray-400 font-medium leading-tight">
                                                <div className="flex items-center gap-1">
                                                    <Calendar size={10} />
                                                    {e.updatedAt ? new Date(e.updatedAt).toLocaleString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' }) : "—"}
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-right">
                                                <button onClick={() => handleDelete(e._id)} disabled={!canDelete} className={`p-2 rounded-xl transition-all ${canDelete ? "text-rose-500 hover:bg-rose-50" : "text-gray-300 cursor-not-allowed"}`}>
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </motion.tr>
                                    );
                                })}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            )}
        </motion.div>
    );
};

export default PatientEmergencyList;