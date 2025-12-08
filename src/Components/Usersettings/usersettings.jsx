import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AuthContext } from "../Auth/AuthProvider.jsx";
import * as jwt_decode from "jwt-decode";

const UserSettings = () => {
    const { user } = useContext(AuthContext);
    const [isEditing, setIsEditing] = useState(false);
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [showCancelConfirm, setShowCancelConfirm] = useState(false);
    const [role, setRole] = useState("patient"); // or "doctor"
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(true);

    // --- Profile Info ---
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        dob: "",
        gender: "",
        photoURL: "",

        // Doctor specific fields
        specialization: "",
        qualifications: "",
        experience: "",
        bio: ""
    });

    // Store original form data to restore on cancel
    const [originalFormData, setOriginalFormData] = useState({
        name: "",
        email: "",
        phone: "",
        dob: "",
        gender: "",
        photoURL: "",
        specialization: "",
        qualifications: "",
        experience: "",
        bio: ""
    });

    // --- Profile Picture Upload ---
    const [profilePicture, setProfilePicture] = useState(null);
    const [profilePicturePreview, setProfilePicturePreview] = useState("");
    const [originalProfilePicturePreview, setOriginalProfilePicturePreview] = useState("");

    // ---Password Change ---
    const [passData, setPassData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: ""
    });

    // Get user ID from token
    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (token) {
            try {
                const decoded = jwt_decode.default(token);
                console.log("Decoded token:", decoded); // Debug log
                const extractedUserId = decoded.userId || decoded.id;
                console.log("Extracted userId:", extractedUserId); // Debug log
                setUserId(extractedUserId);
                setRole(decoded.userRole || "patient");
            } catch (err) {
                console.error("Error decoding token", err);
            }
        } else {
            console.error("No auth token found in localStorage");
        }
    }, []);

    // 1. Fetch User Data
    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem("authToken");
            if (!token) {
                console.error("No auth token found");
                setLoading(false);
                return;
            }

            try {
                console.log("Fetching user profile from token...");
                let response;
                try {
                    response = await axios.get(`http://localhost:5000/users/profile`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                } catch (profileError) {
                    if (userId) {
                        console.log("Profile endpoint failed, trying userId endpoint...");
                        response = await axios.get(`http://localhost:5000/api/user/${userId}`, {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        });
                    } else {
                        throw profileError;
                    }
                }
                
                console.log("User data received:", response.data);
                const userData = response.data;
                
                if (userData._id && !userId) {
                    setUserId(userData._id);
                }
                
                const initialFormData = {
                    name: userData.fullName || userData.name || "",
                    email: userData.email || user?.email || "",
                    phone: userData.phone || userData.phoneNumber || "",
                    dob: userData.dob || "",
                    gender: userData.gender || "",
                    photoURL: userData.photoURL || "",
                    specialization: userData.specialization || "",
                    qualifications: userData.qualifications || "",
                    experience: userData.experience || "",
                    bio: userData.bio || ""
                };
                
                console.log("Initial form data:", initialFormData);
                setFormData(initialFormData);
                setOriginalFormData(initialFormData);
                
                if (userData.photoURL && userData.photoURL !== "default-url") {
                    setProfilePicturePreview(userData.photoURL);
                    setOriginalProfilePicturePreview(userData.photoURL);
                }
                
                setLoading(false);
            } catch (error) {
                console.error("Error fetching user data:", error);
                console.error("Error response:", error.response?.data);
                if (user) {
                    const fallbackData = {
                        ...formData,
                        email: user.email || "",
                        name: user.fullName || user.name || "",
                    };
                    setFormData(fallbackData);
                    setOriginalFormData(fallbackData);
                }
                setLoading(false);
            }
        };

        fetchUserData();
    }, []); 

    //profile picture file selection
    const handleProfilePictureChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePicture(file);
            setFormData({...formData, photoURL: ""});
            // preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePicturePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle URL input change
    const handlePhotoURLChange = (e) => {
        const url = e.target.value;
        setFormData({...formData, photoURL: url});
        // Clear file selection when URL is entered
        if (url) {
            setProfilePicture(null);
            setProfilePicturePreview(url);
        } else {
            setProfilePicturePreview(originalProfilePicturePreview);
        }
    };

    // Ref for file input
    const fileInputRef = useRef(null);

    // cancel confirmation
    const handleCancelConfirm = () => {
        // Restore original data
        setFormData(originalFormData);
        setProfilePicture(null);
        setProfilePicturePreview(originalProfilePicturePreview);
        setIsEditing(false);
        setShowCancelConfirm(false);
    };

    // save from modal
    const handleSaveFromModal = async (e) => {
        e?.preventDefault();
        setShowCancelConfirm(false);
        const syntheticEvent = {
            preventDefault: () => {}
        };
        await handleProfileUpdate(syntheticEvent);
    };

    // 2. Handle Profile Update
    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        
        if (!isEditing) {
            return;
        }

        // Check if userId exists
        if (!userId) {
            toast.error("User ID not found. Please refresh the page.");
            return;
        }

        // Check if token exists
        const token = localStorage.getItem("authToken");
        if (!token) {
            toast.error("Authentication token not found. Please log in again.");
            return;
        }

        try {
            const formDataToSend = new FormData();
            
            // Add text fields
            formDataToSend.append('fullName', formData.name || "");
            formDataToSend.append('phone', formData.phone || "");
            formDataToSend.append('dob', formData.dob || "");
            formDataToSend.append('gender', formData.gender || "");
            
            // Add doctor-specific fields if role is doctor
            if (role === 'doctor') {
                formDataToSend.append('specialization', formData.specialization || "");
                formDataToSend.append('qualifications', formData.qualifications || "");
                formDataToSend.append('experience', formData.experience || "");
                formDataToSend.append('bio', formData.bio || "");
            }

            // Add profile picture if selected
            if (profilePicture) {
                formDataToSend.append('profilePicture', profilePicture);
            } else if (formData.photoURL) {
                formDataToSend.append('photoURL', formData.photoURL);
            }

            console.log("Sending update request with token:", token ? "Token present" : "No token");
            console.log("User ID:", userId);
            
            const response = await axios.post(`http://localhost:5000/api/user/profile/${userId}`, formDataToSend, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            toast.success("Profile updated successfully.");
            
            // Update form data with response from server
            if (response.data && response.data.user) {
                const updatedUserData = response.data.user;
                const updatedFormData = {
                    name: updatedUserData.fullName || updatedUserData.name || "",
                    email: updatedUserData.email || formData.email || "",
                    phone: updatedUserData.phone || updatedUserData.phoneNumber || "",
                    dob: updatedUserData.dob || "",
                    gender: updatedUserData.gender || "",
                    photoURL: updatedUserData.photoURL || "",
                    specialization: updatedUserData.specialization || "",
                    qualifications: updatedUserData.qualifications || "",
                    experience: updatedUserData.experience || "",
                    bio: updatedUserData.bio || ""
                };
                
                setFormData(updatedFormData);
                setOriginalFormData(updatedFormData);
                
                if (updatedUserData.photoURL && updatedUserData.photoURL !== "default-url") {
                    setProfilePicturePreview(updatedUserData.photoURL);
                    setOriginalProfilePicturePreview(updatedUserData.photoURL);
                }
            } else {
                // Fallback: update with current form data
                setOriginalFormData(formData);
                if (profilePicturePreview) {
                    setOriginalProfilePicturePreview(profilePicturePreview);
                }
            }
            
            setIsEditing(false);
            setProfilePicture(null);
        } catch (error) {
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else if (error.message?.includes('profile picture') || error.message?.includes('upload')) {
                toast.error("Error uploading profile picture.");
            } else {
            toast.error("Error updating profile.");
            }
        }
    };

    // 3. Handle Password Change
    const handlePasswordChange = async (e) => {
        e.preventDefault();
        
        // Frontend Validation: Check if new passwords match 
        if (passData.newPassword !== passData.confirmNewPassword) {
            toast.error("New passwords do not match.");
            return;
        }

        // Additional validation
        if (passData.newPassword.length < 6) {
            toast.error("New password must be at least 6 characters long.");
            return;
        }

        try {
            const token = localStorage.getItem("authToken");
            const res = await axios.put(`http://localhost:5000/api/user/change-password/${userId}`, {
                currentPassword: passData.currentPassword,
                newPassword: passData.newPassword
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            if (res.data.success) {
                toast.success("Password updated successfully");
                setPassData({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
                setShowPasswordForm(false);
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Current password doesn't match.";
            toast.error(errorMessage);
        }
    };

    if (loading) {
        return (
            <div className="max-w-5xl mx-auto p-8 mt-10">
                <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl p-8">
                    <div className="flex flex-col justify-center items-center h-64">
                        <span className="loading loading-spinner loading-lg text-primary"></span>
                        <p className="mt-4 text-gray-500">Loading your profile...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto p-4 md:p-8 mt-6 md:mt-10 mb-10">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-primary to-primary-focus text-white rounded-t-2xl p-6 md:p-8 shadow-lg">
                <h2 className="text-3xl md:text-4xl font-bold mb-2">User Settings</h2>
                <p className="text-primary-content/80">Manage your profile information and account settings</p>
            </div>

            {/* Main Content Card */}
            <div className="bg-white rounded-b-2xl shadow-xl -mt-2 p-6 md:p-8">




            {/* --- SECTION 1: PROFILE PICTURE --- */}
            <div className="mb-10 text-center bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-100">
                <div className="avatar mb-4">
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-full ring-4 ring-primary/20 ring-offset-4 ring-offset-white shadow-lg">
                        {profilePicturePreview ? (
                            <img src={profilePicturePreview} alt="Profile Preview" className="rounded-full object-cover" />
                        ) : formData.photoURL ? (
                            <img src="/src/assets/default-url.jpg" className="rounded-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-primary to-primary-focus flex items-center justify-center text-5xl md:text-6xl text-white font-bold shadow-inner">
                                {formData.name ? formData.name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase() || "U"}
                            </div>
                        )}
                    </div>
                </div>
                {isEditing && (
                    <div className="max-w-md mx-auto">
                        <div className="form-control">
                            <label className="label justify-center">
                                <span className="label-text font-semibold text-gray-700">Profile Picture</span>
                            </label>
                            <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    className="input input-bordered flex-1 bg-white text-gray-800 focus:border-primary focus:ring-2 focus:ring-primary/20" 
                                    placeholder="Enter image URL or choose a file" 
                                    value={profilePicture ? profilePicture.name : formData.photoURL} 
                                    onChange={handlePhotoURLChange}
                                    disabled={!!profilePicture}
                                />
                                <input 
                                    type="file" 
                                    ref={fileInputRef}
                                    accept="image/*" 
                                    className="hidden" 
                                    onChange={handleProfilePictureChange}
                                />
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    Choose File
                                </button>
                            </div>
                            {profilePicture && (
                                <button
                                    type="button"
                                    className="btn btn-ghost btn-sm mt-2"
                                    onClick={() => {
                                        setProfilePicture(null);
                                        setProfilePicturePreview(originalProfilePicturePreview);
                                        if (fileInputRef.current) {
                                            fileInputRef.current.value = '';
                                        }
                                    }}
                                >
                                    Clear File
                                </button>
                            )}
                            <label className="label">
                                <span className="label-text-alt text-gray-500">Enter a URL or choose a file (JPG, PNG or GIF - Max. 5MB)</span>
                            </label>
                        </div>
                    </div>
                )}
            </div>





            {/* --- SECTION 2: EDIT PROFILE --- */}
            <div className="mb-10 bg-gray-50 rounded-xl p-6 border border-gray-200">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-4 border-b-2 border-gray-200">
                    <div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-1">Profile Information</h3>
                        <p className="text-sm text-gray-500">Update your personal details and preferences</p>
                    </div>
                    <button 
                        type="button"
                        className="btn btn-sm md:btn-md btn-ghost btn-error mt-3 sm:mt-0"
                        onClick={() => {
                            if (isEditing) {
                                // Show confirmation modal
                                setShowCancelConfirm(true);
                            } else {
                                setIsEditing(true);
                            }
                        }}
                    >
                        {isEditing ? (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Cancel
                            </>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Edit Profile
                            </>
                        )}
                    </button>
                </div>
                
                <form onSubmit={handleProfileUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Email Field - Read Only */}
                    <div className="form-control md:col-span-2">
                        <label className="label">
                            <span className="label-text font-semibold text-gray-700">Email Address</span>
                            <span className="label-text-alt text-gray-400">(Cannot be changed)</span>
                        </label>
                        <div className="relative">
                            <input 
                                type="email" 
                                className="input input-bordered w-full bg-gray-50 border-gray-200 text-gray-800" 
                                value={formData.email || user?.email || ""} 
                                disabled
                                readOnly
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v13a2 2 0 002 2zm10-5V7a2 2 0 00-2-2H8a2 2 0 00-2 2v7" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Common Fields */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-semibold text-gray-700">Full Name</span>
                        </label>
                        <input 
                            type="text" 
                            className={`input input-bordered w-full transition-all text-gray-800 
                                ${!isEditing ? 'bg-gray-50' : 'bg-white focus:border-primary focus:ring-2 focus:ring-primary/20'}`}
                            value={formData.name} 
                            onChange={(e) => setFormData({...formData, name: e.target.value})} 
                            disabled={!isEditing} 
                        />
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-semibold text-gray-700">Date of Birth</span>
                        </label>
                        <input 
                            type="date" 
                            className={`input input-bordered w-full transition-all text-gray-800 
                                ${!isEditing ? 'bg-gray-50' : 'bg-white focus:border-primary focus:ring-2 focus:ring-primary/20'}`}
                            value={formData.dob ? formData.dob.split('T')[0] : ''} 
                            onChange={(e) => setFormData({...formData, dob: e.target.value})} 
                            disabled={!isEditing} 
                        />
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-semibold text-gray-700">Gender</span>
                        </label>
                        <select 
                            className={`select select-bordered w-full transition-all text-gray-800 
                                ${!isEditing ? 'bg-gray-50' : 'bg-white focus:border-primary focus:ring-2 focus:ring-primary/20'}`}
                            value={formData.gender} 
                            onChange={(e) => setFormData({...formData, gender: e.target.value})} 
                            disabled={!isEditing}
                        >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-semibold text-gray-700">Phone Number</span>
                        </label>
                        <input 
                            type="tel" 
                            className={`input input-bordered w-full transition-all text-gray-800 ${!isEditing ? 'bg-gray-50' : 'bg-white focus:border-primary focus:ring-2 focus:ring-primary/20'}`}
                            placeholder="+880 1XXX-XXXXXX" 
                            value={formData.phone} 
                            onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                            disabled={!isEditing}
                        />
                    </div>

                    {/* Doctor Only Fields */}
                    {role === 'doctor' && (
                        <>
                            <div className="form-control md:col-span-2 mt-2">
                                <div className="divider">
                                    <h4 className="text-lg font-bold text-primary">Professional Details</h4>
                                </div>
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-semibold text-gray-700">Specialization</span>
                                </label>
                                <input 
                                    type="text" 
                                    className={`input input-bordered w-full transition-all text-gray-800 
                                        ${!isEditing ? 'bg-gray-50' : 'bg-white focus:border-primary focus:ring-2 focus:ring-primary/20'}`}
                                    placeholder="e.g., Cardiology, Neurology" 
                                    value={formData.specialization} 
                                    onChange={(e) => setFormData({...formData, specialization: e.target.value})} 
                                    disabled={!isEditing}
                                />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-semibold text-gray-700">Qualifications</span>
                                </label>
                                <input 
                                    type="text" 
                                    className={`input input-bordered w-full transition-all text-gray-800 
                                        ${!isEditing ? 'bg-gray-50' : 'bg-white focus:border-primary focus:ring-2 focus:ring-primary/20'}`}
                                    placeholder="e.g., MBBS, MD, PhD" 
                                    value={formData.qualifications} 
                                    onChange={(e) => setFormData({...formData, qualifications: e.target.value})} 
                                    disabled={!isEditing}
                                />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-semibold text-gray-700">Experience (Years)</span>
                                </label>
                                <input 
                                    type="number" 
                                    className={`input input-bordered w-full transition-all text-gray-800 
                                        ${!isEditing ? 'bg-gray-50' : 'bg-white focus:border-primary focus:ring-2 focus:ring-primary/20'}`}
                                    placeholder="0" 
                                    value={formData.experience} 
                                    onChange={(e) => setFormData({...formData, experience: e.target.value})} 
                                    disabled={!isEditing}
                                />
                            </div>
                             <div className="form-control md:col-span-2">
                                <label className="label">
                                    <span className="label-text font-semibold text-gray-700">Bio</span>
                                </label>
                                <br />
                                <textarea 
                                    className={`textarea textarea-bordered h-24 transition-all text-gray-800 
                                        ${!isEditing ? 'bg-gray-50' : 'bg-white focus:border-primary focus:ring-2 focus:ring-primary/20'}`}
                                    placeholder="Tell us about your professional background..." 
                                    value={formData.bio} 
                                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                                    disabled={!isEditing}
                                    ></textarea>
                            </div>
                        </>
                    )}

                    {isEditing && (
                        <div className="md:col-span-2 mt-6 pt-4 border-t border-gray-200">
                            <button type="submit" className="btn btn-primary w-full md:w-auto shadow-lg hover:shadow-xl transition-all">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Save Changes
                            </button>
                    </div>
                    )}
                </form>
            </div>





            {/* --- SECTION 3: CHANGE PASSWORD --- */}
            <div className="bg-red-50 rounded-xl p-6 border-2 border-red-100">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-4 border-b-2 border-red-200">
            <div>
                        <h3 className="text-2xl font-bold text-red-600 mb-1">Change Password</h3>
                        <p className="text-sm text-red-500/70">Update your account password for better security</p>
                    </div>
                    {!showPasswordForm ? (
                        <button 
                            type="button"
                            className="btn btn-sm md:btn-md btn-error mt-3 sm:mt-0 shadow-md hover:shadow-lg transition-all"
                            onClick={() => setShowPasswordForm(true)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                            </svg>
                            Change Password
                        </button>
                    ) : (
                        <button 
                            type="button"
                            className="btn btn-sm md:btn-md btn-ghost btn-error mt-3 sm:mt-0"
                            onClick={() => {
                                setShowPasswordForm(false);
                                setPassData({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
                            }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Cancel
                        </button>
                    )}
                </div>
                
                {showPasswordForm && (
                    <form onSubmit={handlePasswordChange} className="max-w-md space-y-5 bg-white rounded-lg p-5 border border-red-200">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold text-gray-700">Current Password</span>
                            </label>
                            <input 
                                type="password" 
                                placeholder="Enter your current password" 
                                className="input input-bordered w-full bg-white text-gray-800 focus:border-red-400 focus:ring-2 focus:ring-red-400/20" 
                        value={passData.currentPassword} 
                                onChange={(e) => setPassData({...passData, currentPassword: e.target.value})} 
                            />
                        </div>
                        
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold text-gray-700">New Password</span>
                            </label>
                            <input 
                                type="password" 
                                placeholder="Enter your new password" 
                                className="input input-bordered w-full bg-white text-gray-800 focus:border-red-400 focus:ring-2 focus:ring-red-400/20" 
                        value={passData.newPassword} 
                                onChange={(e) => setPassData({...passData, newPassword: e.target.value})} 
                            />
                            <label className="label">
                                <span className="label-text-alt text-gray-400">Must be at least 6 characters</span>
                            </label>
                        </div>
                        
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold text-gray-700">Confirm New Password</span>
                            </label>
                            <input 
                                type="password" 
                                placeholder="Confirm your new password" 
                                className="input input-bordered w-full bg-white text-gray-800 focus:border-red-400 focus:ring-2 focus:ring-red-400/20" 
                        value={passData.confirmNewPassword} 
                                onChange={(e) => setPassData({...passData, confirmNewPassword: e.target.value})}  
                            />
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button type="submit" className="btn btn-error flex-1 shadow-md hover:shadow-lg transition-all">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Update Password
                            </button>
                            <button 
                                type="button"
                                className="btn btn-sm md:btn-md btn-ghost btn-error mt-3 sm:mt-0"
                                onClick={() => {
                                    setShowPasswordForm(false);
                                    setPassData({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                </form>
                )}
            </div>
            </div>




            {/* Cancel Confirmation Modal */}
            {showCancelConfirm && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg mb-4">Do you want to exit?</h3>
                        <p className="py-4 text-gray-600">
                            You have unsaved changes. Do you want to save your changes before exiting?
                        </p>
                        <div className="modal-action">
                            <button 
                                className="btn btn-ghost"
                                onClick={() => setShowCancelConfirm(false)}
                            >
                                Go Back
                            </button>
                            <button 
                                className="btn btn-error bg-red-500 hover:bg-red-600 text-white border-none"
                                onClick={handleCancelConfirm}
                            >
                                Cancel
                            </button>
                            <button 
                                className="btn btn-primary"
                                onClick={handleSaveFromModal}
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                    <div className="modal-backdrop" onClick={() => setShowCancelConfirm(false)}></div>
                </div>
            )}
        </div>
    );
};

export default UserSettings;
