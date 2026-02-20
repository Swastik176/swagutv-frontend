import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/auth/forgot-password`, null, {
                    params: { email }
                }
            );
            navigate("/verify-otp", { state: { email, reset: true } });
        } catch (error) {
            setError(error.response?.data?.message || "Failed to send reset link. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0F172A] px-4">
            <div className="w-full max-w-md bg-[#020617] rounded-2xl p-8 text-white">

                <h1 className="text-3xl font-bold mb-2">
                    Swa<span className="text-red-500">GU</span>Tv
                </h1>
                <p className="text-gray-400 mb-6">
                    Enter your email to reset password
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="email"
                        placeholder="University email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        className="w-full bg-black/40 border border-white/10
                                px-4 py-3 rounded-xl focus:outline-none"
                    />
                    

                    {error && (
                        <p className="text-sm text-red-500 text-center">
                            {error}
                        </p>
                    )}

                    <button
                        disabled={loading}
                        className="w-full bg-indigo-500 hover:bg-indigo-600
                                py-3 rounded-xl font-semibold transition"
                    >
                        {loading ? "Sending OTP..." : "Send OTP"}
                    </button>
                </form>

                <p className="text-sm text-gray-400 mt-6 text-center">
                    New here?{" "}
                    <a href="/signup" className="text-indigo-400 hover:underline">
                        Create an account
                    </a>
                </p>
            </div>
        </div>
    );
}
