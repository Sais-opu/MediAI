import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import DoctorModal from "./DoctorModal";
import { AuthContext } from "../Auth/AuthProvider.jsx"; 

const DoctorsCard = () => {
    const { user } = useContext(AuthContext); 
    const navigate = useNavigate();           

    const [doctors, setDoctors] = useState([]);
    const [filteredDoctors, setFilteredDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [searchQuery, setSearchQuery] = useState("");
    const [aiMode, setAiMode] = useState(false);
    const [aiLoading, setAiLoading] = useState(false);

    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    // Fetch doctors from API
    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const res = await axios.get("http://localhost:5000/doctors");
                setDoctors(res.data);
                setFilteredDoctors(res.data);
                setLoading(false);
            } catch (err) {
                setError("Failed to fetch doctors");
                setLoading(false);
            }
        };
        fetchDoctors();
    }, []);

    // NORMAL SEARCH (auto-filter)
    const normalSearch = (query) => {
        if (!query) {
            setFilteredDoctors(doctors);
            return;
        }
        const filtered = doctors.filter((doctor) =>
            Object.values(doctor).some((val) =>
                val?.toString().toLowerCase().includes(query.toLowerCase())
            )
        );
        setFilteredDoctors(filtered);
    };

    // AI SEARCH
    const aiSearch = async (query) => {
        if (!query.trim()) {
            setFilteredDoctors(doctors);
            return;
        }
        try {
            setAiLoading(true);
            const res = await axios.post("http://localhost:5000/aisearch", { query });
            const specialties = res.data?.specialties || [];

            const filtered = doctors.filter((doctor) =>
                specialties.some((spec) =>
                    doctor.specialization?.toLowerCase().includes(spec.toLowerCase())
                )
            );

            setFilteredDoctors(filtered);
        } catch (err) {
            console.error(err);
        } finally {
            setAiLoading(false);
        }
    };

    const handleFilter = () => {
        if (aiMode) aiSearch(searchQuery);
    };

    useEffect(() => {
        if (!aiMode) {
            normalSearch(searchQuery);
        }
    }, [searchQuery, aiMode]);

    if (loading) return <p className="text-center mt-10">Loading doctors...</p>;
    if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

    return (
        <div className="p-6 min-h-screen bg-gray-50">
            <h2 className="text-3xl font-bold text-center mb-8">Our Doctors</h2>

            {/* SEARCH BAR */}
            <div className="max-w-md mx-auto mb-6 flex gap-2">
                <motion.div
                    className="rounded-lg p-[2px] flex-1"
                    animate={
                        aiMode
                            ? { backgroundPosition: ["0% 50%", "100% 50%"] }
                            : { backgroundPosition: "0% 50%" }
                    }
                    transition={
                        aiMode
                            ? { duration: 3, repeat: Infinity, ease: "linear" }
                            : {}
                    }
                    style={{
                        backgroundImage: aiMode
                            ? "linear-gradient(90deg,#3b82f6,#8b5cf6,#ec4899)"
                            : "linear-gradient(#d1d5db,#d1d5db)",
                        backgroundSize: "300% 300%",
                    }}
                >
                    <input
                        type="text"
                        className="w-full px-4 py-3 rounded-lg outline-none"
                        placeholder={
                            aiMode
                                ? "Ask AI: Describe your symptoms..."
                                : "Search doctors (Press TAB for AI)"
                        }
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Tab") {
                                e.preventDefault();
                                setAiMode(!aiMode);
                                setSearchQuery("");
                                setFilteredDoctors(doctors);
                            }
                        }}
                    />
                </motion.div>

                {aiMode && (
                    <button className="btn btn-primary" onClick={handleFilter}>
                        Filter
                    </button>
                )}
            </div>

            {aiLoading && (
                <p className="text-sm text-blue-500 mt-2 text-center">
                    AI is analyzing your symptoms...
                </p>
            )}

            {/* DOCTOR GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredDoctors.map((doctor) => (
                    <div
                        key={doctor._id}
                        className="bg-white rounded-xl shadow-md hover:shadow-xl transition flex flex-col"
                    >
                        <img
                            src={doctor.photoURL || "https://via.placeholder.com/400x300"}
                            alt={doctor.fullName}
                            className="w-full h-52 object-cover overflow-hidden border border-gray-500 rounded-xl"
                        />

                        <div className="p-5 flex flex-col flex-1">
                            <h3 className="text-xl font-semibold">{doctor.fullName}</h3>
                            <p className="text-blue-600 font-medium">{doctor.specialization}</p>
                            <p className="text-sm text-gray-600">{doctor.qualifications}</p>

                            {doctor.experience && (
                                <p className="text-sm text-gray-500 mt-1">
                                    {doctor.experience} yrs experience
                                </p>
                            )}

                            {/* 🔐 AUTH CONTEXT CHECK */}
                            <button
                                className="btn btn-primary mt-auto"
                                onClick={() => {
                                    if (!user) {
                                        navigate("/login"); // ✅ redirect if not logged in
                                        return;
                                    }
                                    setSelectedDoctor(doctor);
                                    setModalOpen(true);
                                }}
                            >
                                View Details
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <DoctorModal
                doctor={selectedDoctor}
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
            />
        </div>
    );
};

export default DoctorsCard;
