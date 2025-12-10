import React, { useContext } from "react";
import { AuthContext } from "../Auth/AuthProvider.jsx";
import PatientDashboard from "./PatientDashboard.jsx";
import DoctorDashboard from "./DoctorDashboard.jsx";

const Dashboard = () => {
    const { user } = useContext(AuthContext);

    if (!user) {
        return null;
    }

    // Determine user role
    const userRole = user.role?.toLowerCase() || "user";

    if (userRole === "doctor") {
        return <DoctorDashboard />;
    }

    return <PatientDashboard />;
};

export default Dashboard;

