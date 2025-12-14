import { useEffect, useState } from "react";
import DoctorCard from "./DoctorCard";
import axios from "axios";

export default function DoctorList() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("http://localhost:5000/api/doctors");
        const data = await res.json();
        setDoctors(Array.isArray(data) ? data : []);
      } catch (e) {
        setDoctors([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="p-4">Loading doctors...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {doctors.map((d) => (
        <DoctorCard key={d._id} doctor={d} />
      ))}
    </div>
  );
}
