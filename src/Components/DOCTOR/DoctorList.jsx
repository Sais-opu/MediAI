import React, { useEffect, useState } from "react";
import DoctorCard from "./DoctorCard";
import axios from "axios";

export default function DoctorList() {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/doctors")
      .then(res => setDoctors(res.data))
      .catch(err => console.error("Error loading doctors:", err));
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {doctors.length === 0 ? (
        <p className="text-center text-gray-500">No doctors found.</p>
      ) : (
        doctors.map(doc => <DoctorCard key={doc._id} doctor={doc} />)
      )}
    </div>
  );
}
