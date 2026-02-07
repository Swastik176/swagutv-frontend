import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    async function handleLogin(e) {
        e.preventDefault();
        setError("");

        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        if (!res.ok) {
            setError("Invalid credentials");
            return;
        }

        const token = await res.text();
        localStorage.setItem("jwt", token);
        navigate("/chat");
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <form
            onSubmit={handleLogin}
            className="bg-white p-6 rounded shadow w-80 space-y-4"
        >
            <h2 className="text-xl font-bold text-center">Login</h2>

            <input
            className="w-full border p-2 rounded"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            />

            <input
            className="w-full border p-2 rounded"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            />

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded"
            >
            Login
            </button>
        </form>
        </div>
    );
}
