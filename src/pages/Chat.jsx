import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useSocket } from "../hooks/useSocket";
import { useWebRTC } from "../hooks/useWebRTC";

export default function Chat() {
    const { getToken, logout } = useAuth();
    const socketRef = useSocket();
    const token = getToken();

    const {
        localVideoRef,
        remoteVideoRef,
        startCamera,
        start,
        stop,
        next,
        inQueue,
        inCall,
    } = useWebRTC(socketRef, token);

    const [remoteVisible, setRemoteVisible] = useState(false);

    useEffect(() => {
        startCamera();
    }, []);

    // Fade in / out remote video based on call state
    useEffect(() => {
        if (inCall) {
        setRemoteVisible(true);
        } else {
        setRemoteVisible(false);
        }
    }, [inCall]);

    const statusText = inCall
    ? "Connected"
    : inQueue
    ? "Finding someone cool for you…"
    : "Hit Start to meet someone new";

    return (
    <div className="h-screen w-screen flex flex-col bg-black">

        {/* VIDEO SECTION */}
        <div className="flex flex-1 flex-col md:flex-row">

            {/* REMOTE VIDEO — TOP ON MOBILE, LEFT ON DESKTOP */}
            <div className="relative w-full md:w-1/2 flex-1 bg-black">
            <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
            />
            </div>

            {/* LOCAL VIDEO — BOTTOM ON MOBILE, RIGHT ON DESKTOP */}
            <div className="relative w-full md:w-1/2 flex-1 bg-black">
            <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
                style={{ transform: "scaleX(-1)" }}
            />

            {/* STATUS (mobile-friendly) */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2
                            bg-black/70 backdrop-blur-md
                            text-gray-300 text-xs md:text-sm
                            px-4 py-2 rounded-xl">
                {statusText}
            </div>
            </div>

        </div>

        {/* BOTTOM CONTROL BAR */}
        <div className="w-full bg-black/80 backdrop-blur-lg
                        border-t border-white/10
                        px-4 py-4">

            <div
            className="flex flex-col md:flex-row
                        items-center md:items-center
                        justify-between gap-4 md:gap-0">

            {/* BRANDING */}
            <div className="text-center md:text-left">
                <h2 className="text-lg md:text-xl font-bold text-white">
                Swa<span className="text-red-500">GU</span>
                <span className="text-gray-300">Tv</span>
                </h2>
                <p className="text-xs text-gray-400">
                Real students. Real conversations.
                </p>
            </div>

            {/* CONTROLS */}
            <div className="flex">
                {!inQueue ? (
                <button
                    onClick={start}
                    className="bg-green-500 hover:bg-green-600
                            text-white px-8 py-2
                            rounded-xl font-semibold"
                >
                    Start
                </button>
                ) : (
                <>
                    <button
                    onClick={next}
                    className="bg-indigo-500 hover:bg-indigo-600
                                text-white px-6 py-2
                                rounded-xl font-semibold"
                    >
                    Next
                    </button>

                    <button
                    onClick={stop}
                    className="bg-red-500 hover:bg-red-600
                                text-white px-6 py-2
                                rounded-xl font-semibold"
                    >
                    Stop
                    </button>
                </>
                )}
            </div>

            {/* LOGOUT */}
            <button
                onClick={logout}
                className="text-sm text-gray-300 hover:text-red-500 transition"
            >
                Logout
            </button>

            </div>
        </div>
        </div>

    );
}
