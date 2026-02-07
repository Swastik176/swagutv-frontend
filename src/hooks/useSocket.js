import { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./useAuth";

export function useSocket() {
    const socketRef = useRef(null);
    const { getToken, logout } = useAuth();

    useEffect(() => {
        const token = getToken();
        if (!token) return;

        const socket = io("http://localhost:3001", {
        autoConnect: false,
        });

        socket.on("connect", () => {
        console.log("Socket connected");
        });

        socket.on("disconnect", () => {
        console.log("Socket disconnected");
        });

        socket.on("unauthorized", () => {
        logout();
        });

        socket.connect();
        socketRef.current = socket;

        return () => {
        socket.disconnect();
        };
    }, []);

    return socketRef;
}
