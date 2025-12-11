import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function DoctorProfile() {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/doctors/${id}`)
      .then(res => setDoctor(res.data))
      .catch(err => console.error("Error loading doctor:", err));
  }, [id]);

  if (!doctor) {
    return <div className="p-10 text-center text-gray-500">Loading doctor details...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-5 space-y-4">
      <h1 className="text-3xl font-bold">{doctor.name}</h1>
      <p className="text-lg text-gray-600">{doctor.specialization}</p>

      <p className="text-gray-700">
        <strong>Fee:</strong> ৳{doctor.fee}
      </p>

      <p>
        <strong>Rating:</strong> ⭐ {doctor.rating}
      </p>

      <p className="text-gray-700">
        <strong>Biography:</strong><br />
        {doctor.bio || "No biography available."}
      </p>

      <button className="btn btn-success mt-4">
        Book Appointment
      </button>
    </div>
  );
}
