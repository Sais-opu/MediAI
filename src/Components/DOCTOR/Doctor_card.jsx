import React from "react";

export default function DoctorCard({
  name,
  specialization,
  fee,
  rating,
  onViewProfile
}) {
  return (
    <div className="card bg-base-100 shadow-md hover:shadow-lg transition rounded-xl">
      <div className="card-body">
        {/* Doctor Name */}
        <h2 className="card-title text-lg font-semibold">
          {name}
        </h2>

        {/* Specialization */}
        <p className="text-sm text-gray-500">
          {specialization}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-2 mt-2">
          <div className="rating rating-sm">
            {Array.from({ length: 5 }).map((_, i) => (
              <input
                key={i}
                type="radio"
                className="mask mask-star-2 bg-yellow-400"
                checked={i < rating}
                readOnly
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">{rating}.0</span>
        </div>

        {/* Fee */}
        <p className="mt-2 font-medium">
          Consultation Fee: <span className="text-primary">৳{fee}</span>
        </p>

        {/* View Profile Button */}
        <div className="card-actions mt-4">
          <button
            className="btn btn-primary w-full"
            onClick={onViewProfile}
          >
            View Profile
          </button>
        </div>
      </div>
    </div>
  );
}


// components/DoctorCard.jsx
export default function DoctorCard({ doctor, onSelect }) {
  return (
    <div className="card bg-base-100 shadow-md hover:shadow-lg transition rounded-xl">
      <div className="card-body">
        <h2 className="card-title text-lg font-semibold">{doctor.name}</h2>
        <p className="text-sm text-gray-500">{doctor.specialization}</p>
        <p className="mt-1">Fee: <span className="text-primary font-semibold">৳{doctor.fee}</span></p>
        <div className="card-actions mt-4">
          <button className="btn btn-primary w-full" onClick={() => onSelect(doctor)}>
            Select Doctor
          </button>
        </div>
      </div>
    </div>
  );
}


// components/DoctorList.jsx
import DoctorCard from "./DoctorCard";

export default function DoctorList({ doctors, onSelect }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {doctors.map((doc) => (
        <DoctorCard key={doc._id || doc.id} doctor={doc} onSelect={onSelect} />
      ))}
    </div>
  );
}
