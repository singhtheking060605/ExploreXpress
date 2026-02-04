import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { GoogleLogin } from "@react-oauth/google";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { login, googleLoginHandler } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        const result = await login(email, password);
        if (result.success) {
            navigate("/dashboard");
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
                <h2 className="mb-6 text-center text-3xl font-bold">Login</h2>
                {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="mb-2 block font-bold text-gray-700" htmlFor="email">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="w-full rounded border px-3 py-2 outline-none focus:border-blue-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label
                            className="mb-2 block font-bold text-gray-700"
                            htmlFor="password"
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            className="w-full rounded border px-3 py-2 outline-none focus:border-blue-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600"
                    >
                        Sign In
                    </button>
                </form>

                <div className="my-4 flex items-center justify-between">
                    <hr className="w-full border-gray-300" />
                    <span className="mx-2 text-gray-500">OR</span>
                    <hr className="w-full border-gray-300" />
                </div>

                <div className="flex justify-center">
                    <GoogleLogin
                        onSuccess={async (credentialResponse) => {
                            const result = await googleLoginHandler(credentialResponse);
                            if (result.success) {
                                navigate("/dashboard");
                            } else {
                                setError(result.message);
                            }
                        }}
                        onError={() => {
                            setError("Google Login Failed");
                        }}
                    />
                </div>

                <p className="mt-4 text-center">
                    Don't have an account?{" "}
                    <Link to="/signup" className="text-blue-500 hover:text-blue-700">
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
