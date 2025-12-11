// // src/pages/Appoinment.jsx
// import React, { useMemo, useState } from "react";

// const mockTodayAppointments = [
//   {
//     id: 1,
//     patientName: "Ayesha Rahman",
//     time: "09:30 AM",
//     reason: "Follow-up consultation",
//     status: "Confirmed",
//     type: "In-person",
//   },
//   {
//     id: 2,
//     patientName: "Arif Hasan",
//     time: "11:00 AM",
//     reason: "Blood pressure check",
//     status: "Completed",
//     type: "Telemedicine",
//   },
//   {
//     id: 3,
//     patientName: "Nusrat Jahan",
//     time: "02:30 PM",
//     reason: "New patient intake",
//     status: "Pending",
//     type: "In-person",
//   },
// ];

// const mockUpcomingAppointments = [
//   {
//     id: 4,
//     date: "Tomorrow",
//     patientName: "Imran Hossain",
//     time: "10:15 AM",
//     reason: "Diabetes consultation",
//     status: "Confirmed",
//     type: "Telemedicine",
//   },
//   {
//     id: 5,
//     date: "Thu, Dec 11",
//     patientName: "Sadia Akter",
//     time: "01:00 PM",
//     reason: "General check-up",
//     status: "Confirmed",
//     type: "In-person",
//   },
//   {
//     id: 6,
//     date: "Fri, Dec 12",
//     patientName: "Mahmudul Karim",
//     time: "03:45 PM",
//     reason: "Lab report discussion",
//     status: "Pending",
//     type: "Telemedicine",
//   },
// ];

// const mockPatients = [
//   {
//     id: 1,
//     name: "Ayesha Rahman",
//     lastVisit: "Today",
//     nextVisit: "—",
//     condition: "Hypertension",
//   },
//   {
//     id: 2,
//     name: "Arif Hasan",
//     lastVisit: "Today",
//     nextVisit: "Thu, Dec 11",
//     condition: "Cardiac follow-up",
//   },
//   {
//     id: 3,
//     name: "Nusrat Jahan",
//     lastVisit: "—",
//     nextVisit: "Today",
//     condition: "First-time consultation",
//   },
//   {
//     id: 4,
//     name: "Imran Hossain",
//     lastVisit: "Last week",
//     nextVisit: "Tomorrow",
//     condition: "Type 2 Diabetes",
//   },
// ];

// const mockWeeklyStats = {
//   totalAppointments: 32,
//   completedAppointments: 27,
//   newPatients: 8,
//   revenue: "৳52,500",
//   dailyAppointments: [
//     { day: "Mon", count: 6 },
//     { day: "Tue", count: 5 },
//     { day: "Wed", count: 7 },
//     { day: "Thu", count: 4 },
//     { day: "Fri", count: 6 },
//     { day: "Sat", count: 3 },
//     { day: "Sun", count: 1 },
//   ],
// };

// const defaultSlots = [
//   { id: 1, day: "Sunday", start: "09:00", end: "13:00", duration: 30 },
//   { id: 2, day: "Tuesday", start: "16:00", end: "19:00", duration: 20 },
// ];

// function StatusBadge({ status }) {
//   const base =
//     "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium";
//   const styles =
//     status === "Completed"
//       ? " bg-green-100 text-green-700"
//       : status === "Confirmed"
//       ? " bg-blue-100 text-blue-700"
//       : " bg-yellow-100 text-yellow-700";

//   return <span className={base + styles}>{status}</span>;
// }

// function TodayAppointmentCard({ appt }) {
//   return (
//     <div className="flex items-start justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
//       <div>
//         <div className="flex items-center gap-2">
//           <h4 className="text-sm font-semibold text-gray-900">
//             {appt.patientName}
//           </h4>
//           <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600">
//             {appt.type}
//           </span>
//         </div>
//         <p className="mt-1 text-xs text-gray-500">{appt.reason}</p>
//         <p className="mt-1 text-sm font-medium text-gray-800">
//           {appt.time} • <StatusBadge status={appt.status} />
//         </p>
//       </div>
//       <div className="flex flex-col gap-1 text-xs">
//         <button className="rounded-lg border border-gray-200 px-2 py-1 text-gray-700 hover:bg-gray-50">
//           View Details
//         </button>
//         <button className="rounded-lg border border-gray-200 px-2 py-1 text-gray-700 hover:bg-gray-50">
//           Prescriptions
//         </button>
//         <button className="rounded-lg bg-indigo-600 px-2 py-1 font-medium text-white hover:bg-indigo-700">
//           Start Call
//         </button>
//       </div>
//     </div>
//   );
// }

// function UpcomingRow({ appt }) {
//   return (
//     <tr className="border-b last:border-0">
//       <td className="px-3 py-2 text-xs text-gray-500">{appt.date}</td>
//       <td className="px-3 py-2 text-sm font-medium text-gray-900">
//         {appt.patientName}
//       </td>
//       <td className="px-3 py-2 text-xs text-gray-600">{appt.time}</td>
//       <td className="px-3 py-2 text-xs text-gray-600">{appt.reason}</td>
//       <td className="px-3 py-2">
//         <StatusBadge status={appt.status} />
//       </td>
//       <td className="px-3 py-2 text-right text-xs">
//         <button className="rounded-md border border-gray-200 px-2 py-1 text-gray-700 hover:bg-gray-50">
//           Details
//         </button>
//       </td>
//     </tr>
//   );
// }

// function PatientRow({ patient }) {
//   return (
//     <tr className="border-b last:border-0">
//       <td className="px-3 py-2 text-sm font-medium text-gray-900">
//         {patient.name}
//       </td>
//       <td className="px-3 py-2 text-xs text-gray-600">{patient.condition}</td>
//       <td className="px-3 py-2 text-xs text-gray-600">{patient.lastVisit}</td>
//       <td className="px-3 py-2 text-xs text-gray-600">{patient.nextVisit}</td>
//       <td className="px-3 py-2 text-right text-xs">
//         <button className="rounded-md border border-gray-200 px-2 py-1 text-gray-700 hover:bg-gray-50">
//           View Records
//         </button>
//       </td>
//     </tr>
//   );
// }

// function StatCard({ label, value, sublabel }) {
//   return (
//     <div className="flex flex-col rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
//       <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
//         {label}
//       </span>
//       <span className="mt-2 text-2xl font-semibold text-gray-900">{value}</span>
//       {sublabel && (
//         <span className="mt-1 text-xs text-gray-500">{sublabel}</span>
//       )}
//     </div>
//   );
// }

// function ScheduleForm({ slots, onAddSlot }) {
//   const [form, setForm] = useState({
//     day: "Sunday",
//     start: "09:00",
//     end: "13:00",
//     duration: 30,
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({
//       ...prev,
//       [name]: name === "duration" ? Number(value) : value,
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!form.day || !form.start || !form.end || !form.duration) return;

//     onAddSlot(form);
//     setForm((prev) => ({
//       ...prev,
//       start: "09:00",
//       end: "13:00",
//     }));
//   };

//   return (
//     <div className="space-y-4">
//       <form
//         className="grid grid-cols-2 gap-3 md:grid-cols-4"
//         onSubmit={handleSubmit}
//       >
//         <div className="flex flex-col">
//           <label className="text-xs font-medium text-gray-600">Day</label>
//           <select
//             name="day"
//             value={form.day}
//             onChange={handleChange}
//             className="mt-1 rounded-lg border border-gray-200 px-2 py-1.5 text-xs outline-none focus:ring-1 focus:ring-indigo-500"
//           >
//             {[
//               "Sunday",
//               "Monday",
//               "Tuesday",
//               "Wednesday",
//               "Thursday",
//               "Friday",
//               "Saturday",
//             ].map((d) => (
//               <option key={d} value={d}>
//                 {d}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div className="flex flex-col">
//           <label className="text-xs font-medium text-gray-600">Start</label>
//           <input
//             type="time"
//             name="start"
//             value={form.start}
//             onChange={handleChange}
//             className="mt-1 rounded-lg border border-gray-200 px-2 py-1.5 text-xs outline-none focus:ring-1 focus:ring-indigo-500"
//           />
//         </div>

//         <div className="flex flex-col">
//           <label className="text-xs font-medium text-gray-600">End</label>
//           <input
//             type="time"
//             name="end"
//             value={form.end}
//             onChange={handleChange}
//             className="mt-1 rounded-lg border border-gray-200 px-2 py-1.5 text-xs outline-none focus:ring-1 focus:ring-indigo-500"
//           />
//         </div>

//         <div className="flex flex-col">
//           <label className="text-xs font-medium text-gray-600">
//             Slot Duration (min)
//           </label>
//           <input
//             type="number"
//             name="duration"
//             min={5}
//             step={5}
//             value={form.duration}
//             onChange={handleChange}
//             className="mt-1 rounded-lg border border-gray-200 px-2 py-1.5 text-xs outline-none focus:ring-1 focus:ring-indigo-500"
//           />
//         </div>

//         <div className="col-span-2 md:col-span-4">
//           <button
//             type="submit"
//             className="w-full rounded-lg bg-indigo-600 px-3 py-2 text-xs font-medium text-white hover:bg-indigo-700"
//           >
//             Add Availability Slot
//           </button>
//         </div>
//       </form>

//       <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 text-xs">
//         <h4 className="mb-2 text-xs font-semibold text-gray-700">
//           Current Available Slots (Real-time sync with patients)
//         </h4>
//         {slots.length === 0 ? (
//           <p className="text-xs text-gray-500">
//             No availability set yet. Add your first slot above.
//           </p>
//         ) : (
//           <ul className="space-y-1">
//             {slots.map((slot) => (
//               <li
//                 key={slot.id}
//                 className="flex items-center justify-between rounded-lg bg-white px-3 py-1.5"
//               >
//                 <span className="font-medium text-gray-800">
//                   {slot.day} • {slot.start}–{slot.end}
//                 </span>
//                 <span className="text-[11px] text-gray-500">
//                   {slot.duration} min / appointment
//                 </span>
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </div>
//   );
// }

// export default function Appoinment() {
//   const [scheduleSlots, setScheduleSlots] = useState(defaultSlots);

//   const handleAddSlot = (slot) => {
//     setScheduleSlots((prev) => [
//       ...prev,
//       {
//         id: prev.length ? prev[prev.length - 1].id + 1 : 1,
//         ...slot,
//       },
//     ]);
//   };

//   const totalDailyAppointments = useMemo(
//     () =>
//       mockWeeklyStats.dailyAppointments.reduce((sum, d) => sum + d.count, 0),
//     []
//   );

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
//   };

//   const today = new Date().toLocaleDateString(undefined, {
//     weekday: "long",
//     month: "short",
//     day: "numeric",
//   });

//   if (loading) {
//     return (
//       <div className="flex h-screen items-center justify-center bg-gray-50">
//         <div className="text-center">
//           <div className="loading loading-spinner loading-lg text-indigo-600"></div>
//           <p className="mt-4 text-sm text-gray-600">Loading dashboard...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex h-screen items-center justify-center bg-gray-50">
//         <div className="text-center">
//           <p className="text-red-600">{error}</p>
//           <button 
//             onClick={() => window.location.reload()} 
//             className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full bg-gray-50 px-4 py-6 md:px-8">
//       {/* Header */}
//       <div className="mb-6 flex flex-col justify-between gap-3 md:flex-row md:items-center">
//         <div>
//           <h1 className="text-2xl font-semibold text-gray-900">
//             Doctor Dashboard
//           </h1>
//           <p className="text-sm text-gray-500">
//             Centralized view of your appointments, patients, and weekly
//             performance.
//           </p>
//         </div>
//         <div className="text-right">
//           <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
//             Today
//           </p>
//           <p className="text-sm font-semibold text-gray-900">{today}</p>
//         </div>
//       </div>

//       {/* Top grid: Today + Weekly stats */}
//       <div className="grid gap-4 lg:grid-cols-[2fr,1fr]">
//         {/* Today's Appointments */}
//         <section className="space-y-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
//           <div className="flex items-center justify-between">
//             <h2 className="text-sm font-semibold text-gray-900">
//               Today&apos;s Appointments
//             </h2>
//             <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700">
//               {mockTodayAppointments.length} appointments
//             </span>
//           </div>
//           <p className="text-xs text-gray-500">
//             View, manage, and start telemedicine consultations in real time.
//           </p>
//           <div className="space-y-3">
//             {mockTodayAppointments.map((appt) => (
//               <TodayAppointmentCard key={appt.id} appt={appt} />
//             ))}
//           </div>
//         </section>

//         {/* Weekly Stats */}
//         <section className="space-y-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
//           <div className="flex items-center justify-between">
//             <h2 className="text-sm font-semibold text-gray-900">
//               Weekly Statistics Summary
//             </h2>
//             <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] text-gray-600">
//               This week
//             </span>
//           </div>

//           <div className="grid grid-cols-2 gap-3">
//             <StatCard
//               label="Total Appointments"
//               value={mockWeeklyStats.totalAppointments}
//               sublabel={`${mockWeeklyStats.completedAppointments} completed`}
//             />
//             <StatCard
//               label="New Patients"
//               value={mockWeeklyStats.newPatients}
//               sublabel="This week"
//             />
//             <StatCard
//               label="Revenue"
//               value={mockWeeklyStats.revenue}
//               sublabel="Estimated"
//             />
//             <StatCard
//               label="Avg. per day"
//               value={(totalDailyAppointments / 7).toFixed(1)}
//               sublabel="Appointments"
//             />
//           </div>

//           {/* Simple bar chart using divs */}
//           <div className="mt-2">
//             <p className="mb-2 text-xs font-medium text-gray-600">
//               Daily appointment volume
//             </p>
//             <div className="flex items-end gap-1 rounded-xl bg-gray-50 px-3 py-2">
//               {mockWeeklyStats.dailyAppointments.map((d) => (
//                 <div
//                   key={d.day}
//                   className="flex flex-1 flex-col items-center gap-1"
//                 >
//                   <div className="flex h-16 w-full items-end rounded-md bg-white">
//                     <div
//                       className="w-full rounded-md bg-indigo-500"
//                       style={{
//                         height: `${(d.count / 8) * 100}%`,
//                       }}
//                     />
//                   </div>
//                   <span className="text-[10px] text-gray-500">{d.day}</span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>
//       </div>

//       {/* Middle grid: Upcoming + Patient list */}
//       <div className="mt-6 grid gap-4 lg:grid-cols-2">
//         {/* Upcoming Appointments */}
//         <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
//           <div className="mb-2 flex items-center justify-between">
//             <h2 className="text-sm font-semibold text-gray-900">
//               Upcoming Appointments
//             </h2>
//             <button className="text-xs font-medium text-indigo-600 hover:underline">
//               View all
//             </button>
//           </div>
//           <p className="mb-3 text-xs text-gray-500">
//             Plan and manage your future schedule efficiently with quick access
//             actions.
//           </p>
//           <div className="overflow-x-auto">
//             <table className="min-w-full text-left text-xs">
//               <thead className="border-b text-[11px] uppercase tracking-wide text-gray-500">
//                 <tr>
//                   <th className="px-3 py-2">Date</th>
//                   <th className="px-3 py-2">Patient</th>
//                   <th className="px-3 py-2">Time</th>
//                   <th className="px-3 py-2">Reason</th>
//                   <th className="px-3 py-2">Status</th>
//                   <th className="px-3 py-2 text-right">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {mockUpcomingAppointments.map((appt) => (
//                   <UpcomingRow key={appt.id} appt={appt} />
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </section>

//         {/* Patient List Summary */}
//         <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
//           <div className="mb-2 flex items-center justify-between">
//             <h2 className="text-sm font-semibold text-gray-900">
//               Patient List Summary
//             </h2>
//             <button className="text-xs font-medium text-indigo-600 hover:underline">
//               View all patients
//             </button>
//           </div>
//           <p className="mb-3 text-xs text-gray-500">
//             Patients you have seen or have upcoming appointments with, with
//             quick access to their medical history.
//           </p>
//           <div className="overflow-x-auto">
//             <table className="min-w-full text-left text-xs">
//               <thead className="border-b text-[11px] uppercase tracking-wide text-gray-500">
//                 <tr>
//                   <th className="px-3 py-2">Patient</th>
//                   <th className="px-3 py-2">Primary Concern</th>
//                   <th className="px-3 py-2">Last Visit</th>
//                   <th className="px-3 py-2">Next Visit</th>
//                   <th className="px-3 py-2 text-right">Records</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {mockPatients.map((p) => (
//                   <PatientRow key={p.id} patient={p} />
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </section>
//       </div>

//       {/* Scheduling Management */}
//       <div className="mt-6">
//         <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
//           <div className="mb-2 flex items-center justify-between">
//             <h2 className="text-sm font-semibold text-gray-900">
//               Scheduling Management
//             </h2>
//             <span className="text-[11px] text-gray-500">
//               Availability is synced to the patient booking interface in real
//               time.
//             </span>
//           </div>
//           <ScheduleForm slots={scheduleSlots} onAddSlot={handleAddSlot} />
//         </section>
//       </div>

//       {/* NOTE: 
//         - Replace mock data with API calls (fetch/axios/RTK Query).
//         - Use WebSockets or a real-time service (e.g. Socket.io) 
//           to keep appointments and schedule in sync.
//       */}
//     </div>
//   );
// }

// src/pages/Appoinment.jsx
import React, { useMemo, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const API_BASE_URL = "http://localhost:5000";

function StatusBadge({ status }) {
  const base =
    "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium";
  const styles =
    status === "Completed"
      ? " bg-green-100 text-green-700"
      : status === "Confirmed"
      ? " bg-blue-100 text-blue-700"
      : " bg-yellow-100 text-yellow-700";

  return <span className={base + styles}>{status}</span>;
}

function TodayAppointmentCard({ appt }) {
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
        <button className="rounded-lg bg-indigo-600 px-2 py-1 font-medium text-white hover:bg-indigo-700">
          Start Call
        </button>
      </div>
    </div>
  );
}

function UpcomingRow({ appt }) {
  return (
    <tr className="border-b last:border-0">
      <td className="px-3 py-2 text-xs text-gray-500">{appt.date}</td>
      <td className="px-3 py-2 text-sm font-medium text-gray-900">
        {appt.patientName}
      </td>
      <td className="px-3 py-2 text-xs text-gray-600">{appt.time}</td>
      <td className="px-3 py-2 text-xs text-gray-600">{appt.reason}</td>
      <td className="px-3 py-2">
        <StatusBadge status={appt.status || "Pending"} />
      </td>
      <td className="px-3 py-2 text-right text-xs">
        <button className="rounded-md border border-gray-200 px-2 py-1 text-gray-700 hover:bg-gray-50">
          Details
        </button>
      </td>
    </tr>
  );
}

function PatientRow({ patient }) {
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
}

function StatCard({ label, value, sublabel }) {
  return (
    <div className="flex flex-col rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
        {label}
      </span>
      <span className="mt-2 text-2xl font-semibold text-gray-900">{value}</span>
      {sublabel && (
        <span className="mt-1 text-xs text-gray-500">{sublabel}</span>
      )}
    </div>
  );
}

function ScheduleForm({ slots, onAddSlot, onDeleteSlot }) {
  const [form, setForm] = useState({
    day: "Sunday",
    start: "09:00",
    end: "13:00",
    duration: 30,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "duration" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.day || !form.start || !form.end || !form.duration) return;
    onAddSlot(form);
  };

  return (
    <div className="space-y-4">
      <form
        className="grid grid-cols-2 gap-3 md:grid-cols-4"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col">
          <label className="text-xs font-medium text-gray-600">Day</label>
          <select
            name="day"
            value={form.day}
            onChange={handleChange}
            className="mt-1 rounded-lg border border-gray-200 px-2 py-1.5 text-xs outline-none focus:ring-1 focus:ring-indigo-500"
          >
            {[
              "Sunday",
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
            ].map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-xs font-medium text-gray-600">Start</label>
          <input
            type="time"
            name="start"
            value={form.start}
            onChange={handleChange}
            className="mt-1 rounded-lg border border-gray-200 px-2 py-1.5 text-xs outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-xs font-medium text-gray-600">End</label>
          <input
            type="time"
            name="end"
            value={form.end}
            onChange={handleChange}
            className="mt-1 rounded-lg border border-gray-200 px-2 py-1.5 text-xs outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-xs font-medium text-gray-600">
            Slot Duration (min)
          </label>
          <input
            type="number"
            name="duration"
            min={5}
            step={5}
            value={form.duration}
            onChange={handleChange}
            className="mt-1 rounded-lg border border-gray-200 px-2 py-1.5 text-xs outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="col-span-2 md:col-span-4">
          <button
            type="submit"
            className="w-full rounded-lg bg-indigo-600 px-3 py-2 text-xs font-medium text-white hover:bg-indigo-700"
          >
            Add Availability Slot
          </button>
        </div>
      </form>

      <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 text-xs">
        <h4 className="mb-2 text-xs font-semibold text-gray-700">
          Current Available Slots (Real-time sync with patients)
        </h4>
        {slots.length === 0 ? (
          <p className="text-xs text-gray-500">
            No availability set yet. Add your first slot above.
          </p>
        ) : (
          <ul className="space-y-1">
            {slots.map((slot) => (
              <li
                key={slot._id || slot.id}
                className="flex items-center justify-between rounded-lg bg-white px-3 py-1.5"
              >
                <div>
                  <span className="font-medium text-gray-800">
                    {slot.day} • {slot.start}–{slot.end}
                  </span>
                  <span className="ml-2 text-[11px] text-gray-500">
                    {slot.duration} min / appointment
                  </span>
                </div>
                {onDeleteSlot && (
                  <button
                    onClick={() => onDeleteSlot(slot._id)}
                    className="rounded-md border border-red-200 px-2 py-0.5 text-[11px] text-red-600 hover:bg-red-50"
                  >
                    Remove
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default function Appoinment() {
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [weeklyStats, setWeeklyStats] = useState(null);
  const [scheduleSlots, setScheduleSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("authToken");

  const formatDate = (value) => {
    if (!value) return "—";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value; // fallback if it's already string
    return d.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (value) => {
    // Backend might store "10:30 AM" as string; if it's Date, format it
    if (!value) return "";
    if (typeof value === "string") return value;
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Fetch dashboard data from backend
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!token) {
        setError("No authentication token found");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const headers = { Authorization: `Bearer ${token}` };

        const [todayRes, upcomingRes, patientsRes, statsRes, scheduleRes] =
          await Promise.all([
            axios.get(`${API_BASE_URL}/doctor/appointments/today`, { headers }),
            axios.get(`${API_BASE_URL}/doctor/appointments/upcoming`, {
              headers,
            }),
            axios.get(`${API_BASE_URL}/doctor/patients`, { headers }),
            axios.get(`${API_BASE_URL}/doctor/appointments/stats`, {
              headers,
            }),
            axios.get(`${API_BASE_URL}/doctor/schedule`, { headers }),
          ]);

        // Map today appointments
        const todayMapped = todayRes.data.map((a) => ({
          ...a,
          time: formatTime(a.appointmentTime),
        }));

        // Map upcoming appointments
        const upcomingMapped = upcomingRes.data.map((a) => ({
          ...a,
          date: formatDate(a.appointmentDate),
          time: formatTime(a.appointmentTime),
        }));

        // Map patients dates
        const patientsMapped = patientsRes.data.map((p) => ({
          ...p,
          lastVisit: formatDate(p.lastVisit),
          nextVisit: formatDate(p.nextVisit),
        }));

        setTodayAppointments(todayMapped);
        setUpcomingAppointments(upcomingMapped);
        setPatients(patientsMapped);
        setWeeklyStats(statsRes.data || null);
        setScheduleSlots(scheduleRes.data || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        const message =
          err.response?.data?.message || "Failed to load dashboard data";
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token]);

  const handleAddSlot = async (slot) => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      await axios.post(`${API_BASE_URL}/doctor/schedule`, slot, { headers });
      const scheduleRes = await axios.get(`${API_BASE_URL}/doctor/schedule`, {
        headers,
      });
      setScheduleSlots(scheduleRes.data || []);
      toast.success("Schedule slot added successfully");
    } catch (err) {
      console.error("Error adding schedule:", err);
      toast.error(
        err.response?.data?.message || "Failed to add schedule slot"
      );
    }
  };

  const handleDeleteSlot = async (slotId) => {
    console.log("Attempting to delete slot with ID:", slotId);
    console.log("Current scheduleSlots:", scheduleSlots);
    
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.delete(`${API_BASE_URL}/doctor/schedule/${slotId}`, {
        headers,
      });
      
      console.log("Delete response:", response.data);
      
      setScheduleSlots((prev) => {
        const updated = prev.filter((s) => s._id !== slotId);
        console.log("Updated slots after delete:", updated);
        return updated;
      });
      
      toast.success("Schedule slot deleted successfully");
    } catch (err) {
      console.error("Error deleting schedule:", err);
      console.error("Error response:", err.response?.data);
      toast.error(
        err.response?.data?.message || "Failed to delete schedule slot"
      );
    }
  };

  const totalDailyAppointments = useMemo(
    () =>
      weeklyStats?.dailyAppointments?.reduce((sum, d) => sum + d.count, 0) ||
      0,
    [weeklyStats]
  );

  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-indigo-600"></div>
          <p className="mt-4 text-sm text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-50 px-4 py-6 md:px-8">
      {/* Header */}
      <div className="mb-6 flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Doctor Dashboard
          </h1>
          <p className="text-sm text-gray-500">
            Centralized view of your appointments, patients, and weekly
            performance.
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
            Today
          </p>
          <p className="text-sm font-semibold text-gray-900">{today}</p>
        </div>
      </div>

      {/* Top grid: Today + Weekly stats */}
      <div className="grid gap-4 lg:grid-cols-[2fr,1fr]">
        {/* Today's Appointments */}
        <section className="space-y-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900">
              Today&apos;s Appointments
            </h2>
            <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700">
              {todayAppointments.length} appointments
            </span>
          </div>
          <p className="text-xs text-gray-500">
            View, manage, and start telemedicine consultations in real time.
          </p>
          <div className="space-y-3">
            {todayAppointments.length === 0 ? (
              <p className="py-4 text-center text-sm text-gray-500">
                No appointments today
              </p>
            ) : (
              todayAppointments.map((appt) => (
                <TodayAppointmentCard key={appt._id} appt={appt} />
              ))
            )}
          </div>
        </section>

        {/* Weekly Stats */}
        <section className="space-y-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900">
              Weekly Statistics Summary
            </h2>
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] text-gray-600">
              This week
            </span>
          </div>

          {weeklyStats && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <StatCard
                  label="Total Appointments"
                  value={weeklyStats.totalAppointments}
                  sublabel={`${weeklyStats.completedAppointments} completed`}
                />
                <StatCard
                  label="New Patients"
                  value={weeklyStats.newPatients}
                  sublabel="This week"
                />
                <StatCard
                  label="Revenue"
                  value={weeklyStats.revenue}
                  sublabel="Estimated"
                />
                <StatCard
                  label="Avg. per day"
                  value={(totalDailyAppointments / 7).toFixed(1)}
                  sublabel="Appointments"
                />
              </div>

              {/* Simple bar chart using divs */}
              <div className="mt-2">
                <p className="mb-2 text-xs font-medium text-gray-600">
                  Daily appointment volume
                </p>
                <div className="flex items-end gap-1 rounded-xl bg-gray-50 px-3 py-2">
                  {weeklyStats.dailyAppointments.map((d) => (
                    <div
                      key={d.day}
                      className="flex flex-1 flex-col items-center gap-1"
                    >
                      <div className="flex h-16 w-full items-end rounded-md bg-white">
                        <div
                          className="w-full rounded-md bg-indigo-500"
                          style={{
                            height: `${(d.count / 8) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-[10px] text-gray-500">
                        {d.day}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </section>
      </div>

      {/* Middle grid: Upcoming + Patient list */}
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {/* Upcoming Appointments */}
        <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900">
              Upcoming Appointments
            </h2>
            <button className="text-xs font-medium text-indigo-600 hover:underline">
              View all
            </button>
          </div>
          <p className="mb-3 text-xs text-gray-500">
            Plan and manage your future schedule efficiently with quick access
            actions.
          </p>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-xs">
              <thead className="border-b text-[11px] uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-3 py-2">Date</th>
                  <th className="px-3 py-2">Patient</th>
                  <th className="px-3 py-2">Time</th>
                  <th className="px-3 py-2">Reason</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {upcomingAppointments.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="py-4 text-center text-sm text-gray-500"
                    >
                      No upcoming appointments
                    </td>
                  </tr>
                ) : (
                  upcomingAppointments.map((appt) => (
                    <UpcomingRow key={appt._id} appt={appt} />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Patient List Summary */}
        <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900">
              Patient List Summary
            </h2>
            <button className="text-xs font-medium text-indigo-600 hover:underline">
              View all patients
            </button>
          </div>
          <p className="mb-3 text-xs text-gray-500">
            Patients you have seen or have upcoming appointments with, with
            quick access to their medical history.
          </p>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-xs">
              <thead className="border-b text-[11px] uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-3 py-2">Patient</th>
                  <th className="px-3 py-2">Primary Concern</th>
                  <th className="px-3 py-2">Last Visit</th>
                  <th className="px-3 py-2">Next Visit</th>
                  <th className="px-3 py-2 text-right">Records</th>
                </tr>
              </thead>
              <tbody>
                {patients.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="py-4 text-center text-sm text-gray-500"
                    >
                      No patients found
                    </td>
                  </tr>
                ) : (
                  patients.map((p) => <PatientRow key={p._id} patient={p} />)
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* Scheduling Management */}
      <div className="mt-6">
        <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900">
              Scheduling Management
            </h2>
            <span className="text-[11px] text-gray-500">
              Availability is synced to the patient booking interface in real
              time.
            </span>
          </div>
          <ScheduleForm
            slots={scheduleSlots}
            onAddSlot={handleAddSlot}
            onDeleteSlot={handleDeleteSlot}
          />
        </section>
      </div>
    </div>
  );
}
