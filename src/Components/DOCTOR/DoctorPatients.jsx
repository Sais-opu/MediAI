import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import PatientRow from "../Dashboard/DoctorFiles/PatientRow";

const DoctorPatients = () => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    const token = localStorage.getItem("authToken");

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                setLoading(true);
                const headers = { Authorization: `Bearer ${token}` };
                // Using the existing dashboard endpoint for now, or a specific patients endpoint if it exists
                const response = await axios.get("/doctor/patients", { headers });
                setPatients(response.data || []);
            } catch (err) {
                console.error("Error fetching patients:", err);
                setError("Failed to load patients");
                toast.error("Failed to load patients");
            } finally {
                setLoading(false);
            }
        };

        fetchPatients();
    }, [token]);

    const filteredPatients = patients.filter(patient =>
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.condition?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto p-4 md:p-8 mt-6">
                <div className="flex h-64 items-center justify-center bg-gray-50 rounded-xl">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8 mt-6 mb-10">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Patient Directory</h1>
                <p className="text-gray-500 mt-2">Manage and view medical records for all your patients.</p>
            </div>

            <div className="mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="relative w-full md:w-96">
                    <input
                        type="text"
                        placeholder="Search by name or condition..."
                        className="input input-bordered w-full pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <div className="text-sm font-medium text-gray-600">
                    Total Patients: {filteredPatients.length}
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="table w-full">
                        <thead>
                            <tr className="bg-gray-50">
                                <th>Patient</th>
                                <th>Primary Concern</th>
                                <th>Last Visit</th>
                                <th>Next Visit</th>
                                <th className="text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPatients.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-8 text-gray-500">
                                        {searchTerm ? "No patients match your search." : "No patients found."}
                                    </td>
                                </tr>
                            ) : (
                                filteredPatients.map((patient) => (
                                    <PatientRow key={patient._id} patient={patient} />
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DoctorPatients;
