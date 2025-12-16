import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post("http://localhost:5001/login", { email, password });

            // Save JWT token
            localStorage.setItem("authToken", res.data.token);

            toast.success("Login successful!");
            
            // Auto refresh session - reload page to refresh all components and redirect to home
            window.location.href = "/";
        } catch (err) {
            toast.error(err.response?.data?.message || "Invalid email or password");
        }
    };

    return (
        <div className="max-w-md mx-auto p-5 border rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-center mb-4">Login</h2>

            <form onSubmit={handleLogin} className="space-y-4">
                <input
                    type="email"
                    placeholder="Email"
                    className="input input-bordered w-full"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <input
                    type="password"
                    placeholder="Password"
                    className="input input-bordered w-full"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button type="submit" className="btn btn-primary w-full">Login</button>

                <p className="text-center">
                    New here? <Link to="/register" className="link">Register</Link>
                </p>
            </form>
        </div>
    );
};

export default Login;