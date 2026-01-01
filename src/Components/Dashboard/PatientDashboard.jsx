import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../Auth/AuthProvider.jsx";
import axios from "axios";
import { toast } from "react-toastify";
import PatientConsultation from "../Consultation/PatientConsultation";

import PatientPrescriptionModal from "./PatientPrescriptionModal";

const PatientDashboard = () => {
    const { user } = useContext(AuthContext);
    const [upcomingAppointments, setUpcomingAppointments] = useState([]);
    const [pastAppointments, setPastAppointments] = useState([]);
    const [consultationHistory, setConsultationHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal States
    const [showConsultation, setShowConsultation] = useState(false);
    const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
    const [showPrescription, setShowPrescription] = useState(false);
    const [selectedPrescriptionAppt, setSelectedPrescriptionAppt] = useState(null);

    const [metrics, setMetrics] = useState({
        totalConsultations: 0,
        bookedConsultations: 0,
        upcomingThisWeek: 0
    });

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        const token = localStorage.getItem("authToken");


        try {
            const headers = { Authorization: `Bearer ${token}` };
            const response = await axios.get(
                "http://localhost:5001/patient/dashboard",
                { headers }
            );

            // console.log("Dashboard Data:", response.data);

            const { metrics, upcomingAppointments, pastAppointments, history } = response.data;

            setMetrics(metrics);
            setUpcomingAppointments(upcomingAppointments);
            setPastAppointments(pastAppointments);
            setConsultationHistory(history || []);

        } catch (error) {
            console.error("Error fetching dashboard data:", error);
            toast.error("Failed to load dashboard data");
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = (appointmentId) => {
        toast.info("View Details functionality coming soon");
    };

    const handleViewPrescription = (appointment) => {
        if (!appointment.prescription) {
            toast.error("Prescription data not found");
            return;
        }
        setSelectedPrescriptionAppt(appointment);
        setShowPrescription(true);
    };

    const handleReschedule = (appointmentId) => {
        toast.info("Reschedule functionality coming soon");
    };

    const handleCancel = (appointmentId) => {
        if (window.confirm("Are you sure you want to cancel this appointment?")) {
            toast.info("Cancel appointment functionality coming soon");
        }
    };


    const handleJoinConsultation = async (appointmentId) => {
        // Check if it's consultation time
        const appointment = upcomingAppointments.find(apt => apt.id === appointmentId);
        if (!appointment) return;

        if (appointment.status === "Cancelled") {
            toast.error("This appointment has been cancelled");
            return;
        }

        if (appointment.consultationType !== "online" && appointment.consultationType !== "telemedicine") {
            toast.error("This is not an online consultation");
            return;
        }

        // Check if it's consultation time (allow 15 minutes before)
        const now = new Date();
        const appointmentDate = new Date(appointment.appointmentDate);
        const [hours, minutes] = appointment.appointmentTime.replace(" AM", "").replace(" PM", "").split(':');
        const isPM = appointment.appointmentTime.includes("PM");
        appointmentDate.setHours(parseInt(hours) + (isPM && hours !== "12" ? 12 : 0), parseInt(minutes), 0, 0);
        const fifteenMinutesBefore = new Date(appointmentDate.getTime() - 15 * 60 * 1000);

        if (now < fifteenMinutesBefore) {
            toast.error("Not consultation time yet. Please join 15 minutes before the scheduled time.");
            return;
        }

        setSelectedAppointmentId(appointmentId);
        setShowConsultation(true);
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto p-4 md:p-8 mt-6 md:mt-10 mb-10">
                <div className="flex justify-center items-center h-64">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8 mt-6 md:mt-10 mb-10">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-primary-focus text-white rounded-2xl p-6 md:p-8 shadow-lg mb-6">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">Patient Dashboard</h1>
                <p className="text-primary-content/80">Manage your appointments and consultations</p>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Total Consultations</p>
                            <p className="text-3xl font-bold text-gray-800">{metrics.totalConsultations}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Booked Consultations</p>
                            <p className="text-3xl font-bold text-gray-800">{metrics.bookedConsultations}</p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Upcoming This Week</p>
                            <p className="text-3xl font-bold text-gray-800">{metrics.upcomingThisWeek}</p>
                        </div>
                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Upcoming Appointments Section */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Upcoming Appointments</h2>

                {upcomingAppointments.length === 0 ? (
                    <div className="text-center py-12">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-gray-600 text-lg">No upcoming appointments</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {upcomingAppointments.map((appointment) => (
                            <div key={appointment.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-start gap-4">
                                            <div className="flex-1">
                                                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                                                    {appointment.doctorName}
                                                </h3>
                                                <p className="text-sm text-gray-600 mb-2">{appointment.specialization}</p>
                                                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                                    <div className="flex items-center gap-1">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                        <span>{new Date(appointment.appointmentDate).toLocaleDateString()}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        <span>{appointment.appointmentTime}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <span className={`badge ${appointment.paymentStatus === 'Paid' ? 'badge-success' : 'badge-warning'}`}>
                                                            {appointment.paymentStatus}
                                                        </span>
                                                    </div>
                                                    {(appointment.consultationType === 'online' || appointment.consultationType === 'telemedicine') && (
                                                        <span className="badge badge-info">Online Consultation</span>
                                                    )}
                                                    {appointment.type === 'Emergency' && (
                                                        <span className="badge badge-error text-white animate-pulse">Emergency</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {(appointment.consultationType === 'online' || appointment.consultationType === 'telemedicine') && (
                                            <button
                                                onClick={() => handleJoinConsultation(appointment.id)}
                                                className="btn btn-primary btn-sm"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                </svg>
                                                Join Consultation
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleViewDetails(appointment.id)}
                                            className="btn btn-outline btn-sm"
                                        >
                                            View Details
                                        </button>
                                        <button
                                            onClick={() => handleReschedule(appointment.id)}
                                            className="btn btn-outline btn-sm"
                                        >
                                            Reschedule
                                        </button>
                                        <button
                                            onClick={() => handleCancel(appointment.id)}
                                            className="btn btn-error btn-sm"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Past Appointments Section */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Past Appointments</h2>

                {pastAppointments.length === 0 ? (
                    <div className="text-center py-12">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-gray-600 text-lg">No past appointments</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {pastAppointments.map((appointment) => (
                            <div key={appointment.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow opacity-75">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-start gap-4">
                                            <div className="flex-1">
                                                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                                                    {appointment.doctorName}
                                                </h3>
                                                <p className="text-sm text-gray-600 mb-2">{appointment.specialization}</p>
                                                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                                    <div className="flex items-center gap-1">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                        <span>{new Date(appointment.appointmentDate).toLocaleDateString()}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        <span>{appointment.appointmentTime}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <span className="badge badge-success">{appointment.paymentStatus}</span>
                                                    </div>
                                                    <span className="badge badge-ghost">Completed</span>
                                                    {appointment.type === 'Emergency' && (
                                                        <span className="badge badge-error text-white animate-pulse">Emergency</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        {/* View Prescription Button for Past Appointments if available */}
                                        {appointment.prescription && (
                                            <button
                                                onClick={() => handleViewPrescription(appointment)}
                                                className="btn btn-outline btn-primary btn-sm"
                                            >
                                                Prescription
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleViewDetails(appointment.id)}
                                            className="btn btn-outline btn-sm"
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Telemedicine History Section */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm mt-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Telemedicine History</h2>

                {consultationHistory.length === 0 ? (
                    <div className="text-center py-12">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <p className="text-gray-600 text-lg">No telemedicine consultations yet</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {consultationHistory.map((consultation) => (
                            <div key={consultation.consultationId} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-1">
                                            {consultation.doctorName}
                                        </h3>
                                        <p className="text-sm text-gray-600 mb-2">{consultation.doctorSpecialization}</p>
                                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                            <div className="flex items-center gap-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <span>{consultation.appointmentDate ? new Date(consultation.appointmentDate).toLocaleDateString() : "N/A"}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span>{consultation.appointmentTime}</span>
                                            </div>
                                            {consultation.rating && (
                                                <div className="flex items-center gap-1">
                                                    <span className="text-yellow-400">★</span>
                                                    <span>{consultation.rating}/5</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {/* Use explicit prescription check rather than hasPrescription flag if possible, or assume it's there */}
                                        {(consultation.hasPrescription || consultation.prescription) && (
                                            <button
                                                onClick={() => handleViewPrescription(consultation)}
                                                className="btn btn-outline btn-sm"
                                            >
                                                View Prescription
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Consultation Modal */}
            {showConsultation && selectedAppointmentId && (
                <PatientConsultation
                    appointmentId={selectedAppointmentId}
                    onClose={() => {
                        setShowConsultation(false);
                        setSelectedAppointmentId(null);
                        fetchDashboardData();
                    }}
                />
            )}

            {/* Prescription Modal */}
            <PatientPrescriptionModal
                isOpen={showPrescription}
                onClose={() => {
                    setShowPrescription(false);
                    setSelectedPrescriptionAppt(null);
                }}
                appointment={selectedPrescriptionAppt}
            />
        </div>
    );
};

export default PatientDashboard;

