import React from "react";

const PatientRow = ({ patient }) => {
  return (
    <tr className="border-b last:border-0">
      <td className="px-3 py-2 text-sm font-medium text-gray-900">
        {patient.name}
      </td>
      <td className="px-3 py-2 text-xs text-gray-600">{patient.condition}</td>
      <td className="px-3 py-2 text-xs text-gray-600">{patient.lastVisit}</td>
      <td className="px-3 py-2 text-xs text-gray-600">{patient.nextVisit}</td>
      <td className="px-3 py-2 text-right text-xs">
        <button className="rounded-md border border-gray-200 px-2 py-1 text-gray-700 hover:bg-gray-50">
          View Records
        </button>
      </td>
    </tr>
  );
};

export default PatientRow;

