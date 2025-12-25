import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const DoctorModal = ({ doctor, isOpen, onClose }) => {
    const navigate = useNavigate();
    if (!doctor) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="bg-white rounded-xl shadow-xl max-w-3xl w-full overflow-hidden relative"
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0.8 }}
                        transition={{ duration: 0.3 }}
                    >
                        {/* Close Button */}
                        <button
                            className="absolute top-3 right-3 btn btn-sm btn-circle btn-ghost"
                            onClick={onClose}
                        >
                            ✕
                        </button>

                        {/* Modal Content */}
                        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 p-6">
                            {/* Doctor Photo */}
                            <div className="flex-shrink-0 w-40 h-40">
                                <img
                                    src={doctor.photoURL || "https://via.placeholder.com/200"}
                                    alt={doctor.fullName}
                                    className="w-full h-full object-cover rounded-full border-2 border-gray-200"
                                />
                            </div>

                            {/* Doctor Info */}
                            <div className="flex-1">
                                <h2 className="text-3xl font-bold mb-2">
                                    {doctor.fullName}
                                </h2>

                                <p className="text-blue-600 font-semibold text-lg mb-2">
                                    {doctor.specialization}
                                </p>

                                <p className="text-gray-600 mb-2">
                                    {doctor.qualifications}
                                </p>

                                {doctor.experience && (
                                    <p className="text-gray-500 mb-2">
                                        {doctor.experience} yrs experience
                                    </p>
                                )}

                                {doctor.email && (
                                    <p className="text-gray-700 mb-1">
                                        <span className="font-semibold">Email:</span>{" "}
                                        {doctor.email}
                                    </p>
                                )}

                                {doctor.phoneNumber && (
                                    <p className="text-gray-700 mb-1">
                                        <span className="font-semibold">Phone:</span>{" "}
                                        {doctor.phoneNumber}
                                    </p>
                                )}

                                {doctor.bio && (
                                    <p className="text-gray-700 mt-3">
                                        {doctor.bio}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row justify-end gap-4 px-6 pb-6">
                            <button
                                className="btn btn-error text-white"
                                onClick={() => alert("Emergency appointment requested!")}
                            >
                                🚑 Emergency Appointment
                            </button>

                            <button
                                className="btn btn-primary"
                                onClick={() => {
                                    navigate(`/book/${doctor._id}`);
                                    onClose();
                                }}
                            >
                                Book Appointment
                            </button>

                            <button
                                className="btn btn-outline"
                                onClick={onClose}
                            >
                                Close
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default DoctorModal;

