import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";

export default function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const signup = async () => {
        try {
            setLoading(true);

            await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/auth/signup`,
                {
                    name: name.trim(),
                    email: email.trim(),
                    password
                },
                {
                    headers: { "Content-Type": "application/json" }
                }
            );

            // ✅ navigate AFTER successful signup
            navigate("/verify-otp", { state: { email, reset: false } });

        } catch (err) {
            setError(err.response?.data?.message || "Signup failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0F172A] px-4">
            <div className="w-full max-w-md bg-[#020617] rounded-2xl p-8 text-white">

                <h1 className="text-3xl font-bold mb-2">
                    Join Swa<span className="text-red-500">GU</span>Tv
                </h1>
                <p className="text-gray-400 mb-6">
                    Only university emails allowed
                </p>

                {/* 🔴 FIX IS HERE */}
                <form
                    onSubmit={(e) => {
                        e.preventDefault();   // ⬅️ THIS WAS MISSING
                        signup();
                    }}
                    className="space-y-4"
                >
                    <input
                        type="text"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-black/40 border border-white/10
                                    px-4 py-3 rounded-xl focus:outline-none"
                        required
                    />

                    <input
                        type="email"
                        placeholder="University email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        className="w-full bg-black/40 border border-white/10
                                   px-4 py-3 rounded-xl focus:outline-none"
                    />

                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            className="w-full bg-black/40 border border-white/10
                                    px-4 py-3 pr-12 rounded-xl focus:outline-none"
                        />

                        <button
                            type="button"
                            onClick={() => setShowPassword(prev => !prev)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>

                    {error && (
                        <p className="text-sm text-red-500 text-center">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-green-500 hover:bg-green-600
                                    py-3 rounded-xl font-semibold transition"
                    >
                        {loading ? "Sending OTP..." : "Signup"}
                    </button>
                </form>

                <p className="text-sm text-gray-400 mt-6 text-center">
                    Already have an account?{" "}
                    <a href="/login" className="text-indigo-400 hover:underline">
                        Login
                    </a>
                </p>
            </div>
        </div>
    );
}
