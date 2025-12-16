import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import TodayAppointmentCard from "./DoctorFiles/TodayAppointmentCard";
import UpcomingRow from "./DoctorFiles/UpcomingRow";
import PatientRow from "./DoctorFiles/PatientRow";
import StatCard from "./DoctorFiles/StatCard";
import ScheduleForm from "./DoctorFiles/ScheduleForm";

const DoctorDashboard = () => {
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [weeklyStats, setWeeklyStats] = useState(null);
  const [scheduleSlots, setScheduleSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("authToken");

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

        const response = await axios.get("http://localhost:5001/doctor/dashboard", { headers });

        setTodayAppointments(response.data.todayAppointments || []);
        setUpcomingAppointments(response.data.upcomingAppointments || []);
        setPatients(response.data.patients || []);
        setWeeklyStats(response.data.weeklyStats || null);
        setScheduleSlots(response.data.scheduleSlots || []);
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
      await axios.post("http://localhost:5001/doctor/schedule", slot, { headers });
      const scheduleRes = await axios.get("http://localhost:5001/doctor/schedule", {
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
    try {
      const headers = { Authorization: `Bearer ${token}` };
      await axios.delete(`http://localhost:5001/doctor/schedule/${slotId}`, {
        headers,
      });
      setScheduleSlots((prev) => prev.filter((s) => s._id !== slotId));
      toast.success("Schedule slot deleted successfully");
    } catch (err) {
      console.error("Error deleting schedule:", err);
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
      <div className="max-w-7xl mx-auto p-4 md:p-8 mt-6 md:mt-10 mb-10">
        <div className="flex h-64 items-center justify-center bg-gray-50 rounded-xl">
          <div className="text-center">
            <span className="loading loading-spinner loading-lg text-primary"></span>
            <p className="mt-4 text-sm text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-4 md:p-8 mt-6 md:mt-10 mb-10">
        <div className="flex h-64 items-center justify-center bg-gray-50 rounded-xl">
          <div className="text-center">
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 btn btn-primary"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 mt-6 md:mt-10 mb-10">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary-focus text-white rounded-2xl p-6 md:p-8 shadow-lg mb-6">
        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Doctor Dashboard</h1>
            <p className="text-primary-content/80">
              Centralized view of your appointments, patients, and weekly performance.
            </p>
          </div>
          <div className="text-right mt-4 md:mt-0">
            <p className="text-xs font-medium uppercase tracking-wide text-primary-content/70">
              Today
            </p>
            <p className="text-sm font-semibold">{today}</p>
          </div>
        </div>
      </div>

      {/* Top grid: Today + Weekly stats */}
      <div className="grid gap-4 lg:grid-cols-[2fr,1fr] mb-6">
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
      <div className="grid gap-4 lg:grid-cols-2 mb-6">
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
            Plan and manage your future schedule efficiently with quick access actions.
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
            Patients you have seen or have upcoming appointments with, with quick access to their medical history.
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
      <div>
        <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900">
              Scheduling Management
            </h2>
            <span className="text-[11px] text-gray-500">
              Availability is synced to the patient booking interface in real time.
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
};

export default DoctorDashboard;
