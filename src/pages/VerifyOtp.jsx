import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

export default function VerifyOtp() {
    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email;

    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [cooldown, setCooldown] = useState(60);
    const [resending, setResending] = useState(false);

    // Redirect if no email
    useEffect(() => {
        if (!email) {
            navigate("/signup");
        }
    }, [email, navigate]);

    // Cooldown timer
    useEffect(() => {
        if (cooldown <= 0) return;

        const timer = setTimeout(() => {
            setCooldown(prev => prev - 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [cooldown]);

    const verifyOtp = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/auth/verify-otp`, null, {
                        params: { email, otp }
                }
            );

            navigate("/login");
        } catch {
            alert("Invalid OTP");
        } finally {
            setLoading(false);
        }
    };

    const resendOtp = async () => {
        setResending(true);

        try {
            await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/auth/resend-otp`,
                { email }
            );

            setCooldown(60); // reset timer
        } catch {
            alert("Failed to resend OTP");
        } finally {
            setResending(false);
        }
    };

    if (!email) return null;

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0F172A] px-4">
            <div className="w-full max-w-md bg-[#020617] rounded-2xl p-8 text-white">

                <h1 className="text-3xl font-bold mb-2">
                    Verify Your Email
                </h1>

                <p className="text-gray-400 mb-2 text-sm">
                    We’ve sent a 6-digit OTP to:
                </p>

                <p className="text-indigo-400 mb-4 text-sm break-all">
                    {email}
                </p>

                <p className="text-gray-500 text-xs mb-6">
                    Didn’t receive it? Please check your spam folder.
                </p>

                <form onSubmit={verifyOtp} className="space-y-4">

                    <input
                        type="text"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                        maxLength={6}
                        className="w-full bg-black/40 border border-white/10
                                   px-4 py-3 rounded-xl focus:outline-none
                                   text-center tracking-widest text-lg"
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-500 hover:bg-indigo-600
                                   py-3 rounded-xl font-semibold transition"
                    >
                        {loading ? "Verifying..." : "Verify OTP"}
                    </button>

                </form>

                {/* Resend Section */}
                <div className="mt-6 text-center">

                    {cooldown > 0 ? (
                        <p className="text-gray-500 text-sm">
                            Resend OTP in {cooldown}s
                        </p>
                    ) : (
                        <button
                            onClick={resendOtp}
                            disabled={resending}
                            className="text-indigo-400 hover:underline text-sm"
                        >
                            {resending ? "Sending..." : "Resend OTP"}
                        </button>
                    )}

                </div>

            </div>
        </div>
    );
}