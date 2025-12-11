import React from "react";
import { useNavigate } from "react-router-dom";

export default function DoctorCard({ doctor }) {
  const navigate = useNavigate();

  return (
    <div className="card bg-base-100 shadow-md hover:shadow-xl transition-all duration-200 rounded-xl border">
      <div className="card-body space-y-3">

        {/* Doctor Name */}
        <h2 className="card-title text-xl font-semibold text-primary">
          {doctor.name}
        </h2>

        {/* Specialization */}
        <p className="text-sm text-gray-600">
          Specialization: <span className="font-medium">{doctor.specialization}</span>
        </p>

        {/* Consultation Fee */}
        <p className="text-sm text-gray-700">
          Fee: <span className="text-success font-semibold">৳{doctor.fee}</span>
        </p>

        {/* Ratings */}
        <div className="flex items-center gap-2">
          <div className="rating rating-sm">
            {[...Array(5)].map((_, index) => (
              <input
                key={index}
                type="radio"
                className="mask mask-star-2 bg-yellow-400"
                checked={index + 1 === Math.round(doctor.rating)}
                readOnly
              />
            ))}
          </div>
          <span className="text-sm text-gray-500">({doctor.rating})</span>
        </div>

        {/* Buttons */}
        <div className="card-actions justify-end">
          <button 
            className="btn btn-primary btn-sm"
            onClick={() => navigate(`/doctor/${doctor._id}`)}
          >
            View Profile
          </button>
        </div>

      </div>
    </div>
  );
}
