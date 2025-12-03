// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { toast } from "react-toastify";

// const Register = () => {
//     const [fullName, setFullName] = useState("");
//     const [email, setEmail] = useState("");
//     const [photoURL, setPhotoURL] = useState("");
//     const navigate = useNavigate();

//     const handleRegister = async (e) => {
//         e.preventDefault();

//         try {
//             const userData = {
//                 fullName,
//                 email,
//                 photoURL,
//             };

//             // Register user in your backend
//             await axios.post("http://localhost:5000/register", userData);

//             toast.success("Registration successful!");

//             // Get JWT token after register
//             const tokenRes = await axios.post("http://localhost:5000/jwt", { email });
//             localStorage.setItem("authToken", tokenRes.data.token);

//             navigate("/");
//         } catch (error) {
//             toast.error(error.response?.data?.message || "Registration failed");
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
//                     onChange={e => setFullName(e.target.value)}
//                     required
//                 />

//                 <input
//                     type="email"
//                     placeholder="Email"
//                     className="input input-bordered w-full"
//                     value={email}
//                     onChange={e => setEmail(e.target.value)}
//                     required
//                 />

//                 <input
//                     type="text"
//                     placeholder="Photo URL"
//                     className="input input-bordered w-full"
//                     value={photoURL}
//                     onChange={e => setPhotoURL(e.target.value)}
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

// export default Register;


import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Register = () => {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [photoURL, setPhotoURL] = useState("");
    const [gender, setGender] = useState("");
    const [dob, setDob] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!fullName || !email || !password || !gender || !dob) {
            toast.error("Full name, email, password, gender, and date of birth are required");
            return;
        }

        try {
            const userData = {
                fullName,
                email,
                password,   // include password
                photoURL,
                gender,
                dob,
            };

            // Register user in backend
            await axios.post("http://localhost:5000/register", userData);

            toast.success("Registration successful!");

            // Get JWT token after registration
            const tokenRes = await axios.post("http://localhost:5000/jwt", { email });
            localStorage.setItem("authToken", tokenRes.data.token);

            navigate("/");
        } catch (error) {
            toast.error(error.response?.data?.message || "Registration failed");
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
                    onChange={e => setFullName(e.target.value)}
                    required
                />

                <input
                    type="email"
                    placeholder="Email"
                    className="input input-bordered w-full"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                />

                <input
                    type="password"
                    placeholder="Password"
                    className="input input-bordered w-full"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                />

                <input
                    type="text"
                    placeholder="Photo URL (optional)"
                    className="input input-bordered w-full"
                    value={photoURL}
                    onChange={e => setPhotoURL(e.target.value)}
                />

                <select
                    className="input input-bordered w-full"
                    value={gender}
                    onChange={e => setGender(e.target.value)}
                    required
                >
                    <option value="" disabled>
                        Select Gender
                    </option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                </select>
                
                <input
                    type="date"
                    placeholder="Date of Birth"
                    className="input input-bordered w-full"
                    value={dob}
                    onChange={e => setDob(e.target.value)}
                    required
                />

                <button type="submit" className="btn btn-primary w-full">
                    Register
                </button>

                <p className="text-center">
                    Already have an account? <Link to="/login" className="link">Login</Link>
                </p>
            </form>
        </div>
    );
};

export default Register;
