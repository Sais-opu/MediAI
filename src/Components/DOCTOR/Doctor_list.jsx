import React, { useEffect, useState } from "react";
import DoctorCard from "./DoctorCard";

export default function DoctorList() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDoctors() {
      try {
        const res = await fetch("/api/doctors"); // MongoDB API
        const data = await res.json();
        setDoctors(data);
      } catch (err) {
        console.error("Error fetching doctors:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchDoctors();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {doctors.map((doc) => (
        <DoctorCard
          key={doc._id}
          name={doc.name}
          specialization={doc.specialization}
          fee={doc.fee}
          rating={doc.rating}
          onViewProfile={() => console.log("Navigate", doc._id)}
        />
      ))}
    </div>
  );
}
