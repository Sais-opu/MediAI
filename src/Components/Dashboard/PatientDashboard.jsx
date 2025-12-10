import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../Auth/AuthProvider.jsx";
import axios from "axios";
import { toast } from "react-toastify";

const PatientDashboard = () => {
    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8 mt-6 md:mt-10 mb-10">
            <div className="bg-gradient-to-r from-primary to-primary-focus text-white rounded-2xl p-6 md:p-8 shadow-lg mb-6">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">Patient Dashboard</h1>
                <p className="text-primary-content/80">Manage your appointments</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <p className="text-gray-600 text-center py-12">Patient dashboard coming soon...</p>
            </div>
        </div>
    );
};
export default PatientDashboard;

