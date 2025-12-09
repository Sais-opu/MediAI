
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import * as jwt_decode from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // Load user on page refresh
    useEffect(() => {
        const token = localStorage.getItem("authToken");

        if (token) {
            try {
                const decoded = jwt_decode.default(token);
                setUser({
                    email: decoded.email,
                    role: decoded.userRole || "user",
                    id: decoded.id,
                });
            } catch (error) {
                console.error("Invalid token");
                setUser(null);
            }
        }
    }, []);

    // LOGIN using backend /login
    const login = async (email, password) => {
        const res = await axios.post("http://localhost:5000/login", {
            email,
            password,
        });

        const token = res.data.token;
        localStorage.setItem("authToken", token);

        const decoded = jwt_decode.default(token);

        setUser({
            email: decoded.email,
            role: decoded.userRole || "user",
            id: decoded.id,
        });

        return decoded;
    };

    // LOGOUT
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
