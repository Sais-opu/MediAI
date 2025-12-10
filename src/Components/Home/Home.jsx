
import React, { useContext } from "react";
import { AuthContext } from "../Auth/AuthProvider.jsx";
import Banner from "./Banner";

const Home = () => {
    const { user } = useContext(AuthContext);

    // If user is logged in, show dashboard
    if (user) {
        return (
            <div className="max-w-7xl mx-auto p-4 md:p-8 mt-6 md:mt-10 mb-10">
                <div className="bg-gradient-to-r from-primary to-primary-focus text-white rounded-2xl p-6 md:p-8 shadow-lg mb-6">
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">Welcome to Your Dashboard</h1>
                    <p className="text-primary-content/80">Manage your health and appointments</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Dashboard Cards */}
                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">My Appointments</h3>
                        <p className="text-gray-600">View and manage your appointments</p>
                        <button className="btn btn-primary btn-sm mt-4">View Appointments</button>
                    </div>
                    
                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Find Doctors</h3>
                        <p className="text-gray-600">Search for doctors and book appointments</p>
                        <button className="btn btn-primary btn-sm mt-4">Find Doctors</button>
                    </div>
                    
                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Profile Settings</h3>
                        <p className="text-gray-600">Update your profile information</p>
                        <button className="btn btn-primary btn-sm mt-4">Edit Profile</button>
                    </div>
                </div>
            </div>
        );
    }

    // If user is not logged in, show public home page
    return (
        <div>
            <Banner></Banner>
        </div>
    );
};

export default Home;
