import { useNavigate } from "react-router-dom";
import axios from "axios";

export function useAuth() {
    const navigate = useNavigate();

    const getToken = () => localStorage.getItem("jwt");

    const login = async (email, password) => {
        const res = await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/auth/login`,
            { email, password }
        );

        // backend returns raw JWT string
        const token = res.data;

        localStorage.setItem("jwt", token);
        return token;
    };


    const logout = () => {
        localStorage.removeItem("jwt");
        navigate("/login");
    };

    return { getToken, login, logout };
}
