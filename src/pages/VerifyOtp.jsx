import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

export default function VerifyOtp() {
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { state } = useLocation();

    const email = state?.email;

    async function handleVerify(e) {
        e.preventDefault();
        setLoading(true);

        try {
        await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/auth/verify-otp`,
            { email, otp }
        );
        navigate("/login");
        } catch {
        alert("Invalid OTP");
        } finally {
        setLoading(false);
        }
    }

    if (!email) {
        return <p className="text-white">Invalid access</p>;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0F172A] px-4">
        <div className="w-full max-w-md bg-[#020617] rounded-2xl p-8 text-white">

            <h1 className="text-3xl font-bold mb-2">
            Verify Email
            </h1>
            <p className="text-gray-400 mb-6">
            Enter the OTP sent to <br />
            <span className="text-indigo-400">{email}</span>
            </p>

            <form onSubmit={handleVerify} className="space-y-4">
            <input
                type="text"
                placeholder="6-digit OTP"
                value={otp}
                onChange={e => setOtp(e.target.value)}
                required
                className="w-full bg-black/40 border border-white/10
                        px-4 py-3 rounded-xl focus:outline-none text-center tracking-widest"
            />

            <button
                disabled={loading}
                className="w-full bg-indigo-500 hover:bg-indigo-600
                        py-3 rounded-xl font-semibold transition"
            >
                {loading ? "Verifying..." : "Verify"}
            </button>
            </form>
        </div>
        </div>
    );
}
