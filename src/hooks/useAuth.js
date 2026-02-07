import { useNavigate } from "react-router-dom";

export function useAuth() {
    const navigate = useNavigate();

    const getToken = () => localStorage.getItem("jwt");

    const logout = () => {
        localStorage.removeItem("jwt");
        navigate("/login");
    };

    return { getToken, logout };
}
