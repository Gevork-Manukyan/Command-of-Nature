import io from "socket.io-client";

export const socket = io("http://localhost:3002", { autoConnect: false });

export function handleConnect() {
  socket.connect();
  console.log("Attempting to connect...");
}

export function handleDisconnect() {
  if (socket) {
    socket.disconnect();
    console.log("Socket disconnected");
  }
}

export function handleUpdate() {
  socket.emit("move", { x: 10, y: 20 });
}

