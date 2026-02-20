import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

export default function ResetPassword() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [validate, setValidate] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;


    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);

        if(password !== confirmPassword) {
            setValidate(false);
            setLoading(false);
            return;
        }

        try {
            await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/auth/reset-password`,
                    { email, password }
            );

            // ✅ navigate AFTER successful signup
            navigate("/login");
        } catch (error) {
            setError(error.response?.data?.message || "Password reset failed. Please try again.");
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
                    Enter new password
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
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

                    <div className="relative">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            required
                            className="w-full bg-black/40 border border-white/10
                                    px-4 py-3 pr-12 rounded-xl focus:outline-none"
                        />

                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(prev => !prev)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                        >
                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                    
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
                        {loading ? "Resetting Password..." : "Reset Password"}
                    </button>
                </form>

                {!validate && (
                    <p  
                        className="text-sm text-red-500 mt-6 text-center">
                        Password and confirm password must match!!
                    </p>
                )}

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
