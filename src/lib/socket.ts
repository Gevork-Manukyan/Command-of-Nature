import io from "socket.io-client";

export const socket = io("http://localhost:3002/gameplay", {
  autoConnect: false,
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

export function handleConnect() {
  socket.connect();
  console.log("Attempting to connect...");
}

export const handleDisconnect = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};

export function handleUpdate() {
  socket.emit("move", { x: 10, y: 20 });
}

socket.on("connect_error", (error) => {
  console.error("Connection error:", error);
});

socket.on("reconnect", (attemptNumber) => {
  console.log("Reconnected on attempt:", attemptNumber);
});

