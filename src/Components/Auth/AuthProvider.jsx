// import React, { createContext, useState, useEffect } from "react";
// import axios from "axios";
// import * as jwt_decode from "jwt-decode"; // change here

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//     const [user, setUser] = useState(null);
//     const [loading, setLoading] = useState(true);

//     // Check for token in localStorage on page load
//     useEffect(() => {
//         const token = localStorage.getItem("authToken");
//         if (token) {
//             try {
//                 const decoded = jwt_decode.default(token); // use .default
//                 setUser({ email: decoded.email, role: decoded.userRole || "user" });
//             } catch (err) {
//                 console.error("Invalid token", err);
//                 setUser(null);
//             } finally {
//                 setLoading(false);
//             }
//         } else {
//             setLoading(false);
//         }
//     }, []);

//     // Login user (store JWT)
//     const login = async (email) => {
//         try {
//             const tokenRes = await axios.post("http://localhost:5000/jwt", { email });
//             const token = tokenRes.data.token;
//             localStorage.setItem("authToken", token);

//             const decoded = jwt_decode.default(token); // use .default
//             setUser({ email: decoded.email, role: decoded.userRole || "user" });

//             return { email: decoded.email, role: decoded.userRole || "user" };
//         } catch (error) {
//             console.error("Login failed", error);
//             throw error;
//         }
//     };

//     // Logout user
//     const logout = () => {
//         localStorage.removeItem("authToken");
//         setUser(null);
//     };

//     // Update profile
//     const updateProfile = async ({ userId, fullName, photoURL }) => {
//         try {
//             const token = localStorage.getItem("authToken");
//             const res = await axios.put(
//                 "http://localhost:5000/update-user",
//                 { userId, fullName, photoURL },
//                 { headers: { Authorization: `Bearer ${token}` } }
//             );
//             setUser({ ...user, fullName, photoURL });
//             return res.data;
//         } catch (error) {
//             console.error("Profile update failed", error);
//             throw error;
//         }
//     };

//     return (
//         <AuthContext.Provider
//             value={{
//                 user,
//                 loading,
//                 login,
//                 logout,
//                 updateProfile,
//             }}
//         >
//             {children}
//         </AuthContext.Provider>
//     );
// };


import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import * as jwt_decode from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (token) {
            try {
                const decoded = jwt_decode.default(token);
                setUser({ email: decoded.email, role: decoded.userRole || "user" });
            } catch (err) {
                setUser(null);
            }
        }
    }, []);

    const login = async (email) => {
        const tokenRes = await axios.post("http://localhost:5000/jwt", { email });
        localStorage.setItem("authToken", tokenRes.data.token);
        const decoded = jwt_decode.default(tokenRes.data.token);
        setUser({ email: decoded.email, role: decoded.userRole || "user" });
    };

    const logout = () => {
        localStorage.removeItem("authToken");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
