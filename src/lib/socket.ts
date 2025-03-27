import io from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3002";

export const socket = io(SOCKET_URL, {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  timeout: 10000
});

export function handleConnect() {
  if (!socket.connected) {
    socket.connect();
    console.log("Attempting to connect to socket server at:", SOCKET_URL);
  }
}

export const handleDisconnect = () => {
  if (socket.connected) {
    socket.disconnect();
    console.log("Disconnected from socket server");
  }
};

export function handleUpdate() {
  socket.emit("move", { x: 10, y: 20 });
}

// Add connection event listeners
socket.on("connect", () => {
  console.log("Socket connected successfully");
});

socket.on("connect_error", (error) => {
  console.error("Socket connection error:", error);
});

socket.on("disconnect", (reason) => {
  console.log("Socket disconnected:", reason);
});

socket.on("reconnect", (attemptNumber) => {
  console.log("Socket reconnected on attempt:", attemptNumber);
});

socket.on("reconnect_error", (error) => {
  console.error("Socket reconnection error:", error);
});

socket.on("reconnect_failed", () => {
  console.error("Socket reconnection failed after all attempts");
});

