// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { toast } from "react-toastify";

// const Register = () => {
//     const [fullName, setFullName] = useState("");
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");

//     const navigate = useNavigate();

//     const handleRegister = async (e) => {
//         e.preventDefault();

//         try {
//             const userData = { fullName, email, password };

//             const res = await axios.post("http://localhost:5000/register", userData);

//             // SUCCESS RESPONSE (HTTP 201)
//             if (res.status === 201 && res.data?.userId) {
//                 toast.success("Register Successful");

//                 setTimeout(() => {
//                     navigate("/login");
//                 }, 1000);
//             } 
//             else {
//                 toast.error("Register Failed");
//             }

//         } catch (error) {
//             // Always show "Register Failed"
//             toast.error("Register Failed");
//         }
//     };

//     return (
//         <div className="max-w-md mx-auto p-5 border rounded-lg shadow-lg">
//             <h2 className="text-2xl font-bold text-center mb-4">Register</h2>

//             <form onSubmit={handleRegister} className="space-y-4">

//                 <input
//                     type="text"
//                     placeholder="Full Name"
//                     className="input input-bordered w-full"
//                     value={fullName}
//                     onChange={(e) => setFullName(e.target.value)}
//                     required
//                 />

//                 <input
//                     type="email"
//                     placeholder="Email (Gmail only)"
//                     className="input input-bordered w-full"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     required
//                 />

//                 <input
//                     type="password"
//                     placeholder="Password"
//                     className="input input-bordered w-full"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     required
//                 />

//                 <button type="submit" className="btn btn-primary w-full">
//                     Register
//                 </button>

//                 <p className="text-center">
//                     Already have an account? <Link to="/login" className="link">Login</Link>
//                 </p>
//             </form>
//         </div>
//     );
// };

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Register = () => {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        const userData = { fullName, email, password };
        console.log("Attempting to register user:", { ...userData, password: "***" });

        try {
            const res = await axios.post(
                "http://localhost:5000/register",
                userData,
                { headers: { "Content-Type": "application/json" } }
            );

            console.log("Backend response:", res);

            if (res.status === 201 && res.data?.userId) {
                console.log("Register successful, user ID:", res.data.userId);
                toast.success("Register Successful");

                setTimeout(() => navigate("/login"), 1000);
            } else {
                console.log("Register failed - unexpected response:", res.data);
                toast.error("Register Failed");
            }

        } catch (error) {
            console.error("Register request failed:", error);
            toast.error("Register Failed");
        }
    };

    return (
        <div className="max-w-md mx-auto p-5 border rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-center mb-4">Register</h2>

            <form onSubmit={handleRegister} className="space-y-4">
                <input
                    type="text"
                    placeholder="Full Name"
                    className="input input-bordered w-full"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                />

                <input
                    type="email"
                    placeholder="Email (Gmail only)"
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

                <button type="submit" className="btn btn-primary w-full">Register</button>

                <p className="text-center">
                    Already have an account? <Link to="/login" className="link">Login</Link>
                </p>
            </form>
        </div>
    );
};

export default Register;
