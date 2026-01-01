import React from "react";
import StatusBadge from "./StatusBadge";

const TodayAppointmentCard = ({ appt, onStartCall }) => {
  const isOnline = appt.consultationType === "online";
  return (
    <div className="flex items-start justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div>
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-semibold text-gray-900">
            {appt.patientName}
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
        <button className="rounded-lg border border-gray-200 px-2 py-1 text-gray-700 hover:bg-gray-50">
          View Details
        </button>
        <button className="rounded-lg border border-gray-200 px-2 py-1 text-gray-700 hover:bg-gray-50">
          Prescriptions
        </button>
        <button
          onClick={onStartCall}
          disabled={!isOnline}
          className={`rounded-lg px-2 py-1 font-medium text-white transition-colors ${isOnline
            ? "bg-indigo-600 hover:bg-indigo-700"
            : "bg-gray-300 cursor-not-allowed"
            }`}
          title={!isOnline ? "Only for online consultations" : "Start Video Consult"}
        >
          {isOnline ? "Start Call" : "Physical"}
        </button>
      </div>
    </div>
  );
};

export default TodayAppointmentCard;

