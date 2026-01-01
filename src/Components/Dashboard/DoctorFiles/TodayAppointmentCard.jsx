import React from "react";
import StatusBadge from "./StatusBadge";

const TodayAppointmentCard = ({ appt, onPrescriptionClick, onViewDetails }) => {
  return (
    <div className="flex items-start justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div>
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-semibold text-gray-900">
            {appt.patientDetails?.fullName || appt.fullName || appt.patientName || "Unknown"}
          </h4>
          {appt.type && (
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600">
              {appt.type}
            </span>
          )}
        </div>
        {appt.reason && (
          <p className="mt-1 text-xs text-gray-500">{appt.reason}</p>
        )}
        <p className="mt-1 text-sm font-medium text-gray-800">
          {appt.time} • <StatusBadge status={appt.status || "Pending"} />
        </p>
      </div>
      <div className="flex flex-col gap-1 text-xs">
        <button
          onClick={() => onViewDetails && onViewDetails(appt)}
          className="rounded-lg border border-gray-200 px-2 py-1 text-gray-700 hover:bg-gray-50"
        >
          View Details
        </button>
        <button
          onClick={() => onPrescriptionClick(appt)}
          className="rounded-lg border border-gray-200 px-2 py-1 text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Prescriptions
        </button>
        <button className="rounded-lg bg-indigo-600 px-2 py-1 font-medium text-white hover:bg-indigo-700">
          Start Call
        </button>
      </div>
    </div>
  );
};

export default TodayAppointmentCard;

