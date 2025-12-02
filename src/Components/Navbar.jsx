import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../Components/Auth/AuthProvider.jsx';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);

    return (
        <div className="navbar bg-base-100 shadow-sm">
            {/* Navbar Start */}
            <div className="navbar-start">
                <div className="dropdown">
                    {/* Mobile menu button */}
                    <label tabIndex={0} className="btn btn-ghost lg:hidden">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h8m-8 6h16"
                            />
                        </svg>
                    </label>
                    {/* Dropdown menu */}
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow"
                    >
                        <li><Link to="/">Home</Link></li>
                        <li>
                            <a>Parent</a>
                            <ul className="p-2">
                                <li><a>Submenu 1</a></li>
                                <li><a>Submenu 2</a></li>
                            </ul>
                        </li>
                        <li><Link to="/about">About</Link></li>
                    </ul>
                </div>
                <Link to="/" className="btn btn-ghost text-xl normal-case">
                    MediAi
                </Link>
            </div>

            {/* Navbar Center (desktop) */}
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    <li><Link to="/">Home</Link></li>
                    <li>
                        <details>
                            <summary>Parent</summary>
                            <ul className="p-2">
                                <li><a>Submenu 1</a></li>
                                <li><a>Submenu 2</a></li>
                            </ul>
                        </details>
                    </li>
                    <li><Link to="/about">About</Link></li>
                </ul>
            </div>

            {/* Navbar End */}
            <div className="navbar-end">
                {user ? (
                    <>
                        <span className="mr-2">Hi, {user.fullName || user.email}</span>
                        <button className="btn btn-outline btn-warning" onClick={logout}>
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="btn btn-primary mr-2">
                            Login
                        </Link>
                        <Link to="/register" className="btn btn-secondary">
                            Register
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
};

export default Navbar;
