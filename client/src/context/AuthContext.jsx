import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { googleLogout } from "@react-oauth/google";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Configure axios base URL
    axios.defaults.baseURL = "http://localhost:4000";

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            try {
                const decoded = jwtDecode(token);
                // Check if token is expired
                const currentTime = Date.now() / 1000;
                if (decoded.exp < currentTime) {
                    logout();
                } else {
                    // Verify with backend or just trust decoded for now and let backend 401 handle it
                    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
                    setUser(decoded.user);
                }
            } catch (error) {
                logout();
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await axios.post("/api/users/login", {
                email,
                password,
            });
            const { accessToken } = response.data;
            localStorage.setItem("accessToken", accessToken);
            axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
            const decoded = jwtDecode(accessToken);
            setUser(decoded.user);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || "Login failed",
            };
        }
    };

    const signup = async (name, email, password) => {
        try {
            const response = await axios.post("/api/users/signup", {
                name,
                email,
                password,
            });
            const { accessToken } = response.data;
            localStorage.setItem("accessToken", accessToken);
            axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
            const decoded = jwtDecode(accessToken);
            setUser(decoded.user);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || "Signup failed",
            };
        }
    };

    const googleLoginHandler = async (credentialResponse) => {
        try {
            const { credential } = credentialResponse;
            const response = await axios.post("/api/users/google", {
                token: credential,
            });
            const { accessToken } = response.data;
            localStorage.setItem("accessToken", accessToken);
            axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
            const decoded = jwtDecode(accessToken);
            setUser(decoded.user);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || "Google Login failed",
            };
        }
    };

    const logout = () => {
        localStorage.removeItem("accessToken");
        delete axios.defaults.headers.common["Authorization"];
        setUser(null);
        googleLogout();
    };

    return (
        <AuthContext.Provider
            value={{ user, login, signup, googleLoginHandler, logout, loading }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
