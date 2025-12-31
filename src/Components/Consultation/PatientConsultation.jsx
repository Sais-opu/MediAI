import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import AgoraRTC from "agora-rtc-sdk-ng";
import { io } from "socket.io-client";

const PatientConsultation = ({ appointmentId, onClose }) => {
    const navigate = useNavigate();
    const [consultationData, setConsultationData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showPreCallChecklist, setShowPreCallChecklist] = useState(true);
    const [checklist, setChecklist] = useState({
        camera: false,
        microphone: false,
        connection: false
    });

    // Video/Audio states
    const [isVideoEnabled, setIsVideoEnabled] = useState(true);
    const [isAudioEnabled, setIsAudioEnabled] = useState(true);
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);

    // Chat states
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");

    // Prescription
    const [prescription, setPrescription] = useState(null);
    const [rating, setRating] = useState(0);
    const [ratingComment, setRatingComment] = useState("");

    // Doctor profile
    const [doctorProfile, setDoctorProfile] = useState(null);

    const token = localStorage.getItem("authToken");

    useEffect(() => {
        if (!showPreCallChecklist) {
            initializeConsultation();
        }
        return () => {
            if (localVideoRef.current?.srcObject) {
                localVideoRef.current.srcObject.getTracks().forEach(track => track.stop());
            }
        };
    }, [appointmentId, showPreCallChecklist]);

    const runPreCallChecklist = async () => {
        const results = { ...checklist };

        // Test camera
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = stream;
            }
            results.camera = true;
            stream.getTracks().forEach(track => track.stop());
        } catch (error) {
            console.error("Camera test failed:", error);
            results.camera = false;
        }

        // Test microphone
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            results.microphone = true;
            stream.getTracks().forEach(track => track.stop());
        } catch (error) {
            console.error("Microphone test failed:", error);
            results.microphone = false;
        }

        // Test connection
        try {
            const response = await axios.get("/test-cors");
            results.connection = response.status === 200;
        } catch (error) {
            console.error("Connection test failed:", error);
            results.connection = false;
        }

        setChecklist(results);
        return results.camera && results.microphone && results.connection;
    };

    const handleStartChecklist = async () => {
        const allPassed = await runPreCallChecklist();
        if (allPassed) {
            toast.success("All checks passed! You can join the consultation.");
        } else {
            toast.warning("Some checks failed. Please fix the issues before joining.");
        }
    };

    const handleJoinConsultation = async () => {
        const allPassed = checklist.camera && checklist.microphone && checklist.connection;
        if (!allPassed) {
            toast.error("Please complete all checklist items before joining");
            return;
        }
        setShowPreCallChecklist(false);
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

            setConsultationData(response.data);

            // Initialize video
            await initializeVideo();

            // Fetch doctor profile
            await fetchDoctorProfile();

            // Fetch prescription if available
            await fetchPrescription();

        } catch (error) {
            console.error("Error initializing consultation:", error);
            const message = error.response?.data?.message || "Failed to join consultation";
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

    const initializeVideo = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: isVideoEnabled,
                audio: isAudioEnabled
            });

            if (localVideoRef.current) {
                localVideoRef.current.srcObject = stream;
            }
        } catch (error) {
            console.error("Error accessing media devices:", error);
            toast.error("Could not access camera/microphone");
        }
    };

    const fetchDoctorProfile = async () => {
        try {
            // Fetch doctor profile from consultation data
            setDoctorProfile({
                name: "Dr. Smith", // This would come from API
                specialization: "Cardiologist"
            });
        } catch (error) {
            console.error("Error fetching doctor profile:", error);
        }
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

    const sendMessage = () => {
        if (newMessage.trim() && socket) {
            const userId = JSON.parse(atob(token.split('.')[1])).id;
            socket.emit("send-message", {
                consultationId: consultationData.consultationId,
                userId,
                role: "patient",
                message: newMessage,
                timestamp: new Date().toISOString()
            });
            setNewMessage("");
        }
    };

    const submitRating = async () => {
        try {
            if (!rating || rating < 1 || rating > 5) {
                toast.error("Please select a rating");
                return;
            }

            const headers = { Authorization: `Bearer ${token}` };
            await axios.post(
                `/consultation/${consultationData.consultationId}/rating`,
                { rating, comment: ratingComment },
                { headers }
            );
            toast.success("Thank you for your feedback!");
        } catch (error) {
            console.error("Error submitting rating:", error);
            toast.error("Failed to submit rating");
        }
    };

    const downloadPrescription = () => {
        if (!prescription) return;

        const content = `
PRESCRIPTION
Date: ${new Date(prescription.createdAt).toLocaleDateString()}

MEDICATIONS:
${prescription.medications.map((med, i) =>
            `${i + 1}. ${med.name} - ${med.dosage}, ${med.frequency}, ${med.duration}`
        ).join('\n')}

INSTRUCTIONS:
${prescription.instructions}

${prescription.followUp ? `Follow-up Date: ${prescription.followUpDate}` : ''}
    `;

        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `prescription_${consultationData.consultationId}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    };

    if (loading && !showPreCallChecklist) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-8 text-center">
                    <div className="loading loading-spinner loading-lg text-primary"></div>
                    <p className="mt-4">Joining consultation...</p>
                </div>
            </div>
        );
    }

    if (showPreCallChecklist) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-8 max-w-md w-full">
                    <h2 className="text-2xl font-bold mb-6">Pre-Call Checklist</h2>

                    <div className="space-y-4 mb-6">
                        <div className="flex items-center justify-between p-4 border rounded">
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">📹</span>
                                <span>Camera Test</span>
                            </div>
                            {checklist.camera ? (
                                <span className="text-green-600">✓ Passed</span>
                            ) : (
                                <span className="text-gray-400">Not tested</span>
                            )}
                        </div>

                        <div className="flex items-center justify-between p-4 border rounded">
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">🎤</span>
                                <span>Microphone Test</span>
                            </div>
                            {checklist.microphone ? (
                                <span className="text-green-600">✓ Passed</span>
                            ) : (
                                <span className="text-gray-400">Not tested</span>
                            )}
                        </div>

                        <div className="flex items-center justify-between p-4 border rounded">
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">🌐</span>
                                <span>Connection Test</span>
                            </div>
                            {checklist.connection ? (
                                <span className="text-green-600">✓ Passed</span>
                            ) : (
                                <span className="text-gray-400">Not tested</span>
                            )}
                        </div>
                    </div>

                    <div className="mb-4">
                        <video
                            ref={localVideoRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-full rounded"
                            style={{ maxHeight: "200px" }}
                        />
                    </div>

                    <div className="flex gap-2">
                        <button onClick={handleStartChecklist} className="btn btn-outline flex-1">
                            Run Tests
                        </button>
                        <button
                            onClick={handleJoinConsultation}
                            disabled={!checklist.camera || !checklist.microphone || !checklist.connection}
                            className="btn btn-primary flex-1"
                        >
                            Join Consultation
                        </button>
                        <button onClick={onClose} className="btn btn-ghost">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col">
            {/* Header */}
            <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold">Consultation with {doctorProfile?.name || "Doctor"}</h2>
                    <p className="text-sm text-gray-400">{doctorProfile?.specialization}</p>
                </div>
                <button onClick={onClose} className="btn btn-sm btn-ghost">Close</button>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Main Video Area */}
                <div className="flex-1 flex flex-col">
                    <div className="flex-1 bg-black relative">
                        {/* Remote Video (Doctor) */}
                        <video
                            ref={remoteVideoRef}
                            autoPlay
                            playsInline
                            className="w-full h-full object-cover"
                        />

                        {/* Local Video (Patient) */}
                        <div className="absolute bottom-4 right-4 w-64 h-48 bg-gray-800 rounded-lg overflow-hidden">
                            <video
                                ref={localVideoRef}
                                autoPlay
                                playsInline
                                muted
                                className="w-full h-full object-cover"
                            />
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
                                    className={`p-2 rounded ${msg.sender === "patient" ? "bg-primary text-white ml-auto" : "bg-gray-200"
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

                    {/* Prescription View */}
                    <div className="hidden flex-1 overflow-y-auto p-4">
                        {prescription ? (
                            <div>
                                <h3 className="font-bold mb-4">Prescription</h3>
                                <div className="mb-4">
                                    <h4 className="font-semibold mb-2">Medications:</h4>
                                    {prescription.medications.map((med, index) => (
                                        <div key={index} className="mb-2 p-2 bg-gray-100 rounded">
                                            <p><strong>{med.name}</strong></p>
                                            <p className="text-sm">{med.dosage} - {med.frequency} - {med.duration}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="mb-4">
                                    <h4 className="font-semibold mb-2">Instructions:</h4>
                                    <p>{prescription.instructions}</p>
                                </div>
                                {prescription.followUp && (
                                    <div className="mb-4">
                                        <p><strong>Follow-up Date:</strong> {new Date(prescription.followUpDate).toLocaleDateString()}</p>
                                    </div>
                                )}
                                <button onClick={downloadPrescription} className="btn btn-primary w-full mb-4">
                                    Download Prescription
                                </button>

                                {/* Rating Section */}
                                <div className="border-t pt-4">
                                    <h4 className="font-semibold mb-2">Rate this consultation:</h4>
                                    <div className="flex gap-1 mb-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                onClick={() => setRating(star)}
                                                className={`text-2xl ${star <= rating ? "text-yellow-400" : "text-gray-300"}`}
                                            >
                                                ★
                                            </button>
                                        ))}
                                    </div>
                                    <textarea
                                        placeholder="Add a comment (optional)"
                                        value={ratingComment}
                                        onChange={(e) => setRatingComment(e.target.value)}
                                        className="textarea textarea-bordered w-full mb-2"
                                        rows="2"
                                    />
                                    <button onClick={submitRating} className="btn btn-outline w-full">
                                        Submit Rating
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center text-gray-500 mt-8">
                                <p>Prescription will appear here after the consultation</p>
                            </div>
                        )}
                    </div>

                    {/* Doctor Profile */}
                    <div className="hidden flex-1 overflow-y-auto p-4">
                        <h3 className="font-bold mb-4">Doctor Profile</h3>
                        {doctorProfile && (
                            <div>
                                <p><strong>Name:</strong> {doctorProfile.name}</p>
                                <p><strong>Specialization:</strong> {doctorProfile.specialization}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientConsultation;

