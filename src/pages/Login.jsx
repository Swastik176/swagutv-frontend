import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";


export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        try {
            await login(email, password);
            navigate("/chat");
        } catch (err) {
            setError(err.response?.data?.message || "Login failed. Please try again.");
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
                Login to continue chatting
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

                    <p className="text-sm text-gray-400 ml-1">
                        <a href="/forgot-password" className="text-indigo-400 hover:underline">
                            forgot password?
                        </a>
                    </p>

                    <button
                        disabled={loading}
                        className="w-full bg-indigo-500 hover:bg-indigo-600
                                py-3 rounded-xl font-semibold transition"
                    >
                        {loading ? "Logging in..." : "Login"}
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
