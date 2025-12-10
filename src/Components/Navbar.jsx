import React, { useContext, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../Components/Auth/AuthProvider.jsx";
import axios from "axios";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [userRole, setUserRole] = useState(""); // 'admin' | 'doctor' | 'user' | ''
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const token = localStorage.getItem("authToken");
  const location = useLocation();

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);

  // Fetch user role only when logged in
  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user?.email || !token) {
        setUserRole(""); // Ensure it's cleared on logout
        return;
      }

      try {
        const res = await axios.get(
          `http://localhost:5000/users/role?email=${user.email}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUserRole(res.data.role || "user");
      } catch (err) {
        console.error("Error fetching user role:", err);
        setUserRole("user"); // fallback
      }
    };

    fetchUserRole();
  }, [user, token]); // No need to depend on location unless role can change mid-session

  // Define navigation items based on auth state and role
  const getNavItems = () => {
    // Guest (not logged in)
    if (!user) {
      return [
        { name: "Home", path: "/" },
        { name: "Doctors", path: "/doctors" },
        { name: "Services", path: "/services" },
        { name: "About Us", path: "/about" },
        { name: "Contact", path: "/contact" },
      ];
    }

    // Admin
    if (userRole === "admin") {
      return [
        { name: "Home", path: "/" },
        { name: "Dashboard", path: "/admin/dashboard" },
        { name: "Users", path: "/users" },
        { name: "Doctors", path: "/admin/doctors" },
        { name: "Appointments", path: "/admin/appointments" },
        { name: "Reports", path: "/admin/reports" },
      ];
    }

    // Doctor
    if (userRole === "doctor") {
      return [
        { name: "Home", path: "/" },
        { name: "My Appointments", path: "/appoinments" },
        { name: "Patients", path: "/doctor/patients" },
        { name: "Reports", path: "/doctor/reports" },
        { name: "qwer", path: "/doctor/qwer" },
      ];
    }

    // Regular logged-in user (default)
    return [
      { name: "Home", path: "/" },
      { name: "Find Doctors", path: "/doctors" },
      { name: "Book Appointment", path: "/appointments/book" },
      { name: "My Appointments", path: "/appointments/my" },
      { name: "Profile", path: "/profile" },
    ];
  };

  const navItems = getNavItems();

  return (
    <div className="navbar bg-base-100 shadow-md px-4 sticky top-0 z-50">
      {/* Logo */}
      <div className="navbar-start">
        <Link to="/" className="btn btn-ghost text-2xl font-bold text-primary">
          MediAi
        </Link>
      </div>

      {/* Desktop Menu - Center */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-4">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                className="font-medium hover:text-primary transition-colors"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Desktop Auth Buttons */}
      <div className="navbar-end hidden lg:flex items-center gap-3">
        {user ? (
          <>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium">{user.email}</span>
              <span className="badge badge-info badge-sm">
                {userRole || "User"}
              </span>
            </div>
            <button
              onClick={logout}
              className="btn btn-outline btn-error btn-sm"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-primary btn-sm">
              Login
            </Link>
            <Link to="/register" className="btn btn-ghost btn-sm">
              Register
            </Link>
          </>
        )}
      </div>

      {/* Mobile Hamburger */}
      <div className="lg:hidden navbar-end">
        <button onClick={toggleMobileMenu} className="btn btn-ghost btn-circle">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-base-100 shadow-2xl z-50 lg:hidden border-t">
          <ul className="menu p-4 space-y-2">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className="text-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              </li>
            ))}

            <div className="divider my-2"></div>

            {/* Mobile Auth Section */}
            {user ? (
              <div className="flex flex-col gap-3 pt-2">
                <div className="text-center">
                  <p className="font-semibold">{user.email}</p>
                  <p className="text-sm opacity-70 capitalize">
                    Role: {userRole || "User"}
                  </p>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="btn btn-error w-full"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3 pt-2">
                <Link
                  to="/login"
                  className="btn btn-primary w-full"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn btn-outline w-full"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Navbar;
