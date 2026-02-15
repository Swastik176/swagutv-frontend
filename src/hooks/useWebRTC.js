import { useRef, useState, useEffect } from "react";

// const config = {
//     iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
// };

const config = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    {
      urls: "turn:65.0.130.192:3478",
      username: "swagutv",
      credential: "StrongPassword123"
    }
  ]
};

export function useWebRTC(socketRef, token) {
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const pcRef = useRef(null);
    const localStreamRef = useRef(null);
    const pendingCandidates = useRef([]);

    const [inQueue, setInQueue] = useState(false);
    const [inCall, setInCall] = useState(false);

    async function startCamera() {
        if (localStreamRef.current) return;

        const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
        });

        localStreamRef.current = stream;
        localVideoRef.current.srcObject = stream;
    }

    function createPeer() {
        const pc = new RTCPeerConnection(config);

        localStreamRef.current
        .getTracks()
        .forEach((t) => pc.addTrack(t, localStreamRef.current));

        pc.ontrack = (e) => {
        remoteVideoRef.current.srcObject = e.streams[0];
        };

        pc.onicecandidate = (e) => {
        if (e.candidate) {
            socketRef.current.emit("ice", e.candidate);
        }
        };

        pcRef.current = pc;
        return pc;
    }

    function cleanupCall() {
        if (pcRef.current) {
        pcRef.current.close();
        pcRef.current = null;
        }

        remoteVideoRef.current.srcObject = null;
        pendingCandidates.current = [];
        setInCall(false);
    }

    // 🔌 SOCKET EVENTS
    useEffect(() => {
        const socket = socketRef.current;
        if (!socket) return;

        socket.on("matched", async ({ initiator }) => {
        setInCall(true);

        const pc = createPeer();

        if (initiator) {
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            socket.emit("offer", offer);
        }
        });

        socket.on("offer", async (offer) => {
        const pc = createPeer();

        await pc.setRemoteDescription(offer);

        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.emit("answer", answer);

        pendingCandidates.current.forEach((c) =>
            pc.addIceCandidate(c)
        );
        pendingCandidates.current = [];
        });

        socket.on("answer", async (answer) => {
        await pcRef.current.setRemoteDescription(answer);

        pendingCandidates.current.forEach((c) =>
            pcRef.current.addIceCandidate(c)
        );
        pendingCandidates.current = [];
        });

        socket.on("ice", async (candidate) => {
        if (!pcRef.current || !pcRef.current.remoteDescription) {
            pendingCandidates.current.push(candidate);
            return;
        }
        await pcRef.current.addIceCandidate(candidate);
        });

        socket.on("leave", () => {
        cleanupCall();
        if (inQueue) {
            socket.emit("join", { token: `Bearer ${token}` });
        }
        });

        return () => {
        socket.off();
        };
    }, [inQueue]);

    // 🎮 ACTIONS
    function start() {
        if (inQueue) return;
        setInQueue(true);
        socketRef.current.emit("join", {
        token: `Bearer ${token}`,
        });
    }

    function stop() {
        setInQueue(false);
        socketRef.current.emit("leave-manual");
        cleanupCall();
    }

    function next() {
        socketRef.current.emit("leave-manual");
        cleanupCall();
        socketRef.current.emit("join", {
        token: `Bearer ${token}`,
        });
    }

    return {
        localVideoRef,
        remoteVideoRef,
        startCamera,
        start,
        stop,
        next,
        inQueue,
        inCall,
    };
}
