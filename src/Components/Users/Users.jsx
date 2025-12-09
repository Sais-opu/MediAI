import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [filters, setFilters] = useState({
        search: "",
        role: "",
        registrationDate: "",
    });

    const token = localStorage.getItem("authToken");

    const fetchUsers = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await axios.get("http://localhost:5000/users", {
                headers: { Authorization: `Bearer ${token}` },
            });

            let filtered = res.data;

            // Filter by search (name or email)
            if (filters.search) {
                const searchLower = filters.search.toLowerCase();
                filtered = filtered.filter(
                    (user) =>
                        user.fullName.toLowerCase().includes(searchLower) ||
                        user.email.toLowerCase().includes(searchLower)
                );
            }

            // Filter by role
            if (filters.role) {
                filtered = filtered.filter((user) => user.userRole === filters.role);
            }

            // Filter by registration date
            if (filters.registrationDate) {
                filtered = filtered.filter(
                    (user) =>
                        new Date(user.registrationDate).toDateString() ===
                        new Date(filters.registrationDate).toDateString()
                );
            }

            setUsers(filtered);
        } catch (err) {
            console.error(err);
            setError("Unable to fetch users. Try again later.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const applyFilters = () => {
        fetchUsers();
    };

    const handleDelete = async (userId) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;
        try {
            await axios.delete(`http://localhost:5000/users/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success("User deleted successfully!");
            fetchUsers();
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete user.");
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            await axios.put(
                `http://localhost:5000/users/role`,
                { userId, role: newRole },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success(`Role changed to ${newRole}`);
            fetchUsers();
        } catch (err) {
            console.error(err);
            toast.error("Failed to change role.");
        }
    };

    return (
        <div className="max-w-6xl mx-auto mt-10 p-5">
            <h2 className="text-3xl font-bold mb-5 text-center">Registered Users</h2>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
                <input
                    type="text"
                    name="search"
                    placeholder="Search by name or email"
                    className="input input-bordered w-full"
                    value={filters.search}
                    onChange={handleFilterChange}
                />
                <select
                    name="role"
                    className="select select-bordered w-full"
                    value={filters.role}
                    onChange={handleFilterChange}
                >
                    <option value="">All Roles</option>
                    <option value="user">User</option>
                    <option value="doctor">Doctor</option>
                    <option value="admin">Admin</option>
                </select>
                <input
                    type="date"
                    name="registrationDate"
                    placeholder="Select registration date"
                    className="input input-bordered w-full"
                    value={filters.registrationDate}
                    onChange={handleFilterChange}
                />
            </div>

            <button onClick={applyFilters} className="btn btn-primary mb-5">
                Apply Filters
            </button>

            {/* Table */}
            {loading ? (
                <p className="text-center text-lg font-semibold">Loading users...</p>
            ) : error ? (
                <p className="text-center text-red-500 font-bold">{error}</p>
            ) : users.length === 0 ? (
                <p className="text-center text-gray-500 font-semibold">
                    No users found for the selected criteria.
                </p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="table table-zebra w-full">
                        <thead>
                            <tr className="bg-base-200">
                                <th>User ID</th>
                                <th>Full Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Registration Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user._id}>
                                    <td>{user._id}</td>
                                    <td>{user.fullName}</td>
                                    <td>{user.email}</td>
                                    <td>{user.userRole}</td>
                                    <td>{new Date(user.registrationDate).toLocaleDateString()}</td>
                                    <td className="flex gap-2">
                                        <button
                                            onClick={() => handleDelete(user._id)}
                                            className="btn btn-sm btn-error"
                                        >
                                            Delete
                                        </button>

                                        {/* Role Dropdown */}
                                        <select
                                            value={user.userRole}
                                            onChange={(e) =>
                                                handleRoleChange(user._id, e.target.value)
                                            }
                                            className="select select-sm select-bordered"
                                        >
                                            <option value="user">User</option>
                                            <option value="doctor">Doctor</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Users;
