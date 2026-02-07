import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    async function handleSignup(e) {
        e.preventDefault();
        setLoading(true);

        try {
        await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/auth/signup`,
            { email, password }
        );

        navigate("/verify-otp", { state: { email } });
        } catch {
        alert("Signup failed");
        } finally {
        setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0F172A] px-4">
        <div className="w-full max-w-md bg-[#020617] rounded-2xl p-8 text-white">

            <h1 className="text-3xl font-bold mb-2">
            Join Swa<span className="text-red-500">GU</span>Tv
            </h1>
            <p className="text-gray-400 mb-6">
            Only university emails allowed
            </p>

            <form onSubmit={handleSignup} className="space-y-4">
            <input
                type="email"
                placeholder="University email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full bg-black/40 border border-white/10
                        px-4 py-3 rounded-xl focus:outline-none"
            />

            <input
                type="password"
                placeholder="Create password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full bg-black/40 border border-white/10
                        px-4 py-3 rounded-xl focus:outline-none"
            />

            <button
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
