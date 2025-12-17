import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../Auth/AuthProvider.jsx";
import { toast } from "react-toastify";

const BookEmergencyAppointment = () => {
    const { state } = useLocation();
    const doctor = state?.doctor;
    const navigate = useNavigate();
    const { user, token } = useContext(AuthContext);

    const [profile, setProfile] = useState({
        fullName: "",
        email: "",
        gender: "",
        dob: "",
        phoneNumber: "",
    });

    const [schedules, setSchedules] = useState([]);
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [details, setDetails] = useState("");
    const [loading, setLoading] = useState(false);

    // Redirect if no doctor object
    useEffect(() => {
        if (!doctor) navigate("/doctors");
    }, [doctor, navigate]);

    // Prefill user profile if logged in
    useEffect(() => {
        if (!token) return;

        const fetchProfile = async () => {
            try {
                const res = await axios.get("http://localhost:5000/users/profile", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setProfile({
                    fullName: res.data.fullName || "",
                    email: res.data.email || "",
                    gender: res.data.gender || "",
                    dob: res.data.dob || "",
                    phoneNumber: res.data.phoneNumber || "",
                });
            } catch (err) {
                console.error("Failed to load profile", err);
                toast.error("Failed to load profile");
            }
        };
        fetchProfile();
    }, [token]);

    // Fetch doctor schedules
    useEffect(() => {
        if (!doctor) return;

        const fetchSchedules = async () => {
            try {
                const res = await axios.get(
                    `http://localhost:5000/doctor/${doctor._id}/schedules`
                );

                if (res.data.message === "No schedules found") {
                    setSchedules([]);
                    return;
                }

                setSchedules(res.data);
            } catch (err) {
                console.error("Failed to fetch schedules", err);
                toast.error("Failed to fetch schedules");
            }
        };

        fetchSchedules();
    }, [doctor]);

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleEmergency = async () => {
        if (!user) {
            toast.info("Please login to book an appointment");
            return navigate("/login");
        }
        if (!selectedSchedule) {
            toast.warn("Please select a schedule");
            return;
        }
        if (!details.trim()) {
            toast.warn("Emergency details are required");
            return;
        }

        setLoading(true);

        try {
            await axios.post(
                "http://localhost:5000/emergency/book",
                {
                    doctorId: doctor._id,
                    scheduleId: selectedSchedule._id,
                    details,
                    fullName: profile.fullName,
                    email: profile.email,
                    gender: profile.gender,
                    dob: profile.dob,
                    phoneNumber: profile.phoneNumber,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            toast.success("Emergency appointment requested successfully!");
            navigate("/patient-emergencies");
        } catch (err) {
            console.error(err);
            toast.error("Failed to book emergency appointment");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto space-y-4 p-4 border rounded shadow mt-8">
            <h2 className="text-xl font-bold text-center mb-4">
                Emergency Appointment with {doctor?.fullName}
            </h2>

            <input
                type="text"
                name="fullName"
                value={profile.fullName}
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full p-2 border rounded"
            />
            <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full p-2 border rounded"
            />
            <select
                name="gender"
                value={profile.gender}
                onChange={handleChange}
                className="w-full p-2 border rounded"
            >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
            </select>
            <div>
                <label className="block text-sm text-gray-600 mb-1">Date of Birth</label>
                <input
                    type="date"
                    name="dob"
                    value={profile.dob}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                />
            </div>
            <input
                type="text"
                name="phoneNumber"
                value={profile.phoneNumber}
                onChange={handleChange}
                placeholder="Phone Number"
                className="w-full p-2 border rounded"
            />

            {schedules.length > 0 ? (
                <div className="overflow-x-auto mb-4">
                    <table className="min-w-full bg-white border border-gray-300 rounded-md">
                        <thead className="bg-blue-100">
                            <tr>
                                <th className="py-2 px-4 border-b">Day</th>
                                <th className="py-2 px-4 border-b">Time</th>
                                <th className="py-2 px-4 border-b">Duration</th>
                            </tr>
                        </thead>
                        <tbody>
                            {schedules.map((s) => (
                                <tr
                                    key={s._id}
                                    className={`text-center cursor-pointer ${
                                        selectedSchedule?._id === s._id ? "bg-blue-200" : ""
                                    }`}
                                    onClick={() => setSelectedSchedule(s)}
                                >
                                    <td className="py-2 px-4 border-b">{s.day}</td>
                                    <td className="py-2 px-4 border-b">
                                        {s.start} - {s.end}
                                    </td>
                                    <td className="py-2 px-4 border-b">{s.duration}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-center text-gray-500">No schedules available</p>
            )}

            <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Describe your emergency (required)"
                className="w-full p-3 border rounded"
                rows={4}
            />

            <button
                onClick={handleEmergency}
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded font-bold"
            >
                {loading ? "Sending..." : "Book Emergency Appointment"}
            </button>
        </div>
    );
};

export default BookEmergencyAppointment;
