//consultation/doctorConsultation.jsx
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import AgoraRTC from "agora-rtc-sdk-ng";
import { io } from "socket.io-client";

const DoctorConsultation = ({ appointmentId, onClose }) => {
    const navigate = useNavigate();
    const [consultationData, setConsultationData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sessionStatus, setSessionStatus] = useState("waiting");
    const [patientJoined, setPatientJoined] = useState(false);

    // Video/Audio states
    const [isVideoEnabled, setIsVideoEnabled] = useState(true);
    const [isAudioEnabled, setIsAudioEnabled] = useState(true);
    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const [localVideoTrack, setLocalVideoTrack] = useState(null);
    const [localAudioTrack, setLocalAudioTrack] = useState(null);

    // Agora states
    const client = useRef(AgoraRTC.createClient({ mode: "rtc", codec: "vp8" }));
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);

    // Socket.io states
    const [socket, setSocket] = useState(null);

    // Chat states
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");

    // Prescription states
    const [prescription, setPrescription] = useState({
        medications: [{ name: "", dosage: "", frequency: "", duration: "" }],
        instructions: "",
        followUp: false,
        followUpDate: ""
    });

    // Patient profile
    const [patientProfile, setPatientProfile] = useState(null);

    const token = localStorage.getItem("authToken");

    useEffect(() => {
        initializeConsultation();
        return () => {
            cleanup();
        };
    }, [appointmentId]);

    const cleanup = async () => {
        // Cleanup Agora
        if (localVideoTrack) {
            localVideoTrack.stop();
            localVideoTrack.close();
        }
        if (localAudioTrack) {
            localAudioTrack.stop();
            localAudioTrack.close();
        }
        if (client.current) {
            await client.current.leave();
        }
        // Cleanup Socket
        if (socket) {
            socket.disconnect();
        }
    };

    const initializeConsultation = async () => {
        try {
            setLoading(true);
            const headers = { Authorization: `Bearer ${token}` };

            // Generate consultation token
            const response = await axios.post(
                "/consultation/generate-token",
                { appointmentId },
                { headers }
            );

            const { agoraAppId, agoraToken, channelName, uid } = response.data;
            setConsultationData(response.data);

            // Fetch patient profile
            await fetchPatientProfile(response.data.appointment);

            // Initialize Agora
            await client.current.join(agoraAppId, channelName, agoraToken, uid);

            // Create and publish tracks
            const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();

            setLocalAudioTrack(audioTrack);
            setLocalVideoTrack(videoTrack);

            await client.current.publish([audioTrack, videoTrack]);

            if (localVideoRef.current) {
                videoTrack.play(localVideoRef.current);
            }

            // Handle remote users
            client.current.on("user-published", async (user, mediaType) => {
                await client.current.subscribe(user, mediaType);
                if (mediaType === "video") {
                    setPatientJoined(true);
                    if (remoteVideoRef.current) {
                        user.videoTrack.play(remoteVideoRef.current);
                    }
                }
                if (mediaType === "audio") {
                    user.audioTrack.play();
                }
            });

            client.current.on("user-unpublished", (user) => {
                if (user.uid !== client.current.uid) {
                    setPatientJoined(false);
                }
            });

            // Initialize Socket.io
            await initializeSocket(response.data.consultationId);

            // Fetch prescription if available
            await fetchPrescription();

        } catch (error) {
            console.error("Error initializing consultation:", error);
            const message = error.response?.data?.message || "Failed to start consultation";
            toast.error(message);

            if (message.includes("Not consultation time yet")) {
                setTimeout(() => {
                    onClose();
                }, 2000);
            }
        } finally {
            setLoading(false);
        }
    };

    const initializeSocket = async (consultationId) => {
        const newSocket = io("/", {
            auth: { token }
        });

        newSocket.on("connect", () => {
            console.log("Socket connected");
            const userId = JSON.parse(atob(token.split('.')[1])).id;
            newSocket.emit("join-consultation", {
                consultationId,
                userId,
                role: "doctor"
            });
        });

        newSocket.on("receive-message", (data) => {
            setMessages(prev => [...prev, {
                id: Date.now(),
                text: data.message,
                sender: data.role === "doctor" ? "doctor" : "patient",
                timestamp: data.timestamp
            }]);
        });

        newSocket.on("user-joined", (data) => {
            if (data.role === "patient") {
                setPatientJoined(true);
                toast.info("Patient has joined the consultation");
            }
        });

        setSocket(newSocket);
    };

    const fetchPrescription = async () => {
        try {
            if (consultationData?.consultationId) {
                const headers = { Authorization: `Bearer ${token}` };
                const response = await axios.get(
                    `/consultation/${consultationData.consultationId}/prescription`,
                    { headers }
                );
                setPrescription(response.data);
            }
        } catch (error) {
            // Prescription might not exist yet
            console.log("Prescription not available yet");
        }
    };

    const checkConsultationStatus = async () => {
        try {
            const headers = { Authorization: `Bearer ${token}` };
            const response = await axios.get(
                `/consultation/${appointmentId}/status`,
                { headers }
            );

            if (response.data.exists) {
                setSessionStatus(response.data.sessionStatus);
                setPatientJoined(response.data.patientJoined);
            }
        } catch (error) {
            console.error("Error checking status:", error);
        }
    };

    const fetchPatientProfile = async (appointment) => {
        try {
            const data = appointment || consultationData?.appointment;
            setPatientProfile({
                name: data?.patientName || "Patient",
                condition: data?.reason || "N/A"
            });
        } catch (error) {
            console.error("Error fetching patient profile:", error);
        }
    };

    const toggleVideo = async () => {
        if (localVideoTrack) {
            await localVideoTrack.setEnabled(!isVideoEnabled);
            setIsVideoEnabled(!isVideoEnabled);
        }
    };

    const toggleAudio = async () => {
        if (localAudioTrack) {
            await localAudioTrack.setEnabled(!isAudioEnabled);
            setIsAudioEnabled(!isAudioEnabled);
        }
    };

    const toggleScreenShare = async () => {
        try {
            if (!isScreenSharing) {
                const screenTrack = await AgoraRTC.createScreenVideoTrack();
                await client.current.unpublish(localVideoTrack);
                await client.current.publish(screenTrack);
                if (localVideoRef.current) {
                    screenTrack.play(localVideoRef.current);
                }
                setIsScreenSharing(true);
                setLocalVideoTrack(screenTrack);
            } else {
                const videoTrack = await AgoraRTC.createCameraVideoTrack();
                await client.current.unpublish(localVideoTrack);
                await client.current.publish(videoTrack);
                if (localVideoRef.current) {
                    videoTrack.play(localVideoRef.current);
                }
                setIsScreenSharing(false);
                setLocalVideoTrack(videoTrack);
            }
        } catch (error) {
            console.error("Error sharing screen:", error);
            toast.error("Could not share screen");
        }
    };

    const sendMessage = () => {
        if (newMessage.trim() && socket) {
            const userId = JSON.parse(atob(token.split('.')[1])).id;
            socket.emit("send-message", {
                consultationId: consultationData.consultationId,
                userId,
                role: "doctor",
                message: newMessage,
                timestamp: new Date().toISOString()
            });
            setNewMessage("");
        }
    };

    const addMedication = () => {
        setPrescription({
            ...prescription,
            medications: [...prescription.medications, { name: "", dosage: "", frequency: "", duration: "" }]
        });
    };

    const updateMedication = (index, field, value) => {
        const updated = [...prescription.medications];
        updated[index][field] = value;
        setPrescription({ ...prescription, medications: updated });
    };

    const savePrescription = async () => {
        try {
            const headers = { Authorization: `Bearer ${token}` };
            await axios.post(
                `/consultation/${consultationData.consultationId}/prescription`,
                prescription,
                { headers }
            );
            toast.success("Prescription saved successfully");
        } catch (error) {
            console.error("Error saving prescription:", error);
            toast.error("Failed to save prescription");
        }
    };

    const endConsultation = async (outcome) => {
        try {
            const headers = { Authorization: `Bearer ${token}` };
            await axios.post(
                `/consultation/${consultationData.consultationId}/end`,
                { outcome },
                { headers }
            );
            toast.success("Consultation ended successfully");
            cleanup();
            onClose();
        } catch (error) {
            console.error("Error ending consultation:", error);
            toast.error("Failed to end consultation");
        }
    };

    if (loading) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-8 text-center">
                    <div className="loading loading-spinner loading-lg text-primary"></div>
                    <p className="mt-4">Initializing consultation...</p>
                </div>
            </div>
        );
    }

    if (!patientJoined && sessionStatus === "waiting") {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-8 text-center max-w-md">
                    <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
                    <h2 className="text-2xl font-bold mb-2">Waiting for patient to join…</h2>
                    <p className="text-gray-600">The consultation will begin once the patient joins.</p>
                    <button onClick={onClose} className="btn btn-outline mt-4">Cancel</button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col">
            {/* Header */}
            <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold">Consultation with {patientProfile?.name || "Patient"}</h2>
                    <p className="text-sm text-gray-400">{consultationData?.appointment?.reason}</p>
                </div>
                <button onClick={onClose} className="btn btn-sm btn-ghost">Close</button>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Main Video Area */}
                <div className="flex-1 flex flex-col">
                    <div className="flex-1 bg-black relative">
                        {/* Remote Video (Patient) */}
                        <div ref={remoteVideoRef} className="w-full h-full"></div>

                        {/* Local Video (Doctor) */}
                        <div className="absolute bottom-4 right-4 w-64 h-48 bg-gray-800 rounded-lg overflow-hidden">
                            <div ref={localVideoRef} className="w-full h-full"></div>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="bg-gray-800 p-4 flex justify-center gap-4">
                        <button
                            onClick={toggleVideo}
                            className={`btn btn-circle ${isVideoEnabled ? "btn-primary" : "btn-error"}`}
                        >
                            {isVideoEnabled ? "📹" : "📹❌"}
                        </button>
                        <button
                            onClick={toggleAudio}
                            className={`btn btn-circle ${isAudioEnabled ? "btn-primary" : "btn-error"}`}
                        >
                            {isAudioEnabled ? "🎤" : "🎤❌"}
                        </button>
                        <button
                            onClick={toggleScreenShare}
                            className={`btn btn-circle ${isScreenSharing ? "btn-primary" : "btn-outline"}`}
                        >
                            🖥️
                        </button>
                        <button
                            onClick={() => endConsultation("Completed")}
                            className="btn btn-circle btn-error"
                        >
                            📞
                        </button>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="w-96 bg-white flex flex-col border-l">
                    {/* Tabs */}
                    <div className="flex border-b">
                        <button className="flex-1 p-2 font-semibold border-b-2 border-primary">Chat</button>
                        <button className="flex-1 p-2 font-semibold">Prescription</button>
                        <button className="flex-1 p-2 font-semibold">Profile</button>
                    </div>

                    {/* Chat Panel */}
                    <div className="flex-1 flex flex-col overflow-hidden">
                        <div className="flex-1 overflow-y-auto p-4 space-y-2">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`p-2 rounded ${msg.sender === "doctor" ? "bg-primary text-white ml-auto" : "bg-gray-200"
                                        }`}
                                    style={{ maxWidth: "80%" }}
                                >
                                    {msg.text}
                                </div>
                            ))}
                        </div>
                        <div className="p-4 border-t flex gap-2">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                                placeholder="Type a message..."
                                className="input input-bordered flex-1"
                            />
                            <button onClick={sendMessage} className="btn btn-primary">
                                Send
                            </button>
                        </div>
                    </div>

                    {/* Prescription Form - Same as before */}
                    <div className="hidden flex-1 overflow-y-auto p-4">
                        <h3 className="font-bold mb-4">Prescription</h3>
                        {prescription.medications.map((med, index) => (
                            <div key={index} className="mb-4 p-3 border rounded">
                                <input
                                    type="text"
                                    placeholder="Medication name"
                                    value={med.name}
                                    onChange={(e) => updateMedication(index, "name", e.target.value)}
                                    className="input input-bordered w-full mb-2"
                                />
                                <div className="grid grid-cols-2 gap-2">
                                    <input
                                        type="text"
                                        placeholder="Dosage"
                                        value={med.dosage}
                                        onChange={(e) => updateMedication(index, "dosage", e.target.value)}
                                        className="input input-bordered"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Frequency"
                                        value={med.frequency}
                                        onChange={(e) => updateMedication(index, "frequency", e.target.value)}
                                        className="input input-bordered"
                                    />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Duration"
                                    value={med.duration}
                                    onChange={(e) => updateMedication(index, "duration", e.target.value)}
                                    className="input input-bordered w-full mt-2"
                                />
                            </div>
                        ))}
                        <button onClick={addMedication} className="btn btn-outline btn-sm mb-4">
                            + Add Medication
                        </button>
                        <textarea
                            placeholder="Instructions"
                            value={prescription.instructions}
                            onChange={(e) => setPrescription({ ...prescription, instructions: e.target.value })}
                            className="textarea textarea-bordered w-full mb-4"
                            rows="3"
                        />
                        <div className="form-control mb-4">
                            <label className="label cursor-pointer">
                                <span className="label-text">Follow-up required</span>
                                <input
                                    type="checkbox"
                                    checked={prescription.followUp}
                                    onChange={(e) => setPrescription({ ...prescription, followUp: e.target.checked })}
                                    className="checkbox"
                                />
                            </label>
                        </div>
                        {prescription.followUp && (
                            <input
                                type="date"
                                value={prescription.followUpDate}
                                onChange={(e) => setPrescription({ ...prescription, followUpDate: e.target.value })}
                                className="input input-bordered w-full mb-4"
                            />
                        )}
                        <button onClick={savePrescription} className="btn btn-primary w-full">
                            Save Prescription
                        </button>
                        <div className="mt-4 flex gap-2">
                            <button
                                onClick={() => endConsultation("Completed")}
                                className="btn btn-success flex-1"
                            >
                                Complete
                            </button>
                            <button
                                onClick={() => endConsultation("Needs Follow-up")}
                                className="btn btn-warning flex-1"
                            >
                                Follow-up
                            </button>
                        </div>
                    </div>

                    {/* Patient Profile */}
                    <div className="hidden flex-1 overflow-y-auto p-4">
                        <h3 className="font-bold mb-4">Patient Profile</h3>
                        {patientProfile && (
                            <div>
                                <p><strong>Name:</strong> {patientProfile.name}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorConsultation;
