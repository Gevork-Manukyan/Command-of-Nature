"use client";
import { loginAsGuest, logout } from "@/lib/auth";
import { auth, db } from "@/lib/firebase";
import { createGuestSession } from "@/lib/game";
import { deleteDoc, doc } from "firebase/firestore";
import { useEffect } from "react";
import io, { Socket } from "socket.io-client";

// WEB SOCKETS
let socket: Socket;

function handleConnect() {
  socket.connect();
  console.log("Attempting to connect...");
}

function handleDisconnect() {
  if (socket) {
    socket.disconnect();
    console.log("Socket disconnected");
  }
}

function handleUpdate() {
  socket.emit("move", { x: 10, y: 20 });
}

// FIRE BASE
const LOCALSTORAGE_GUEST_KEY = 'guestSession'

async function handleGuestLogin() {
  const user = await loginAsGuest();
  if (user) {
    console.log("Guest user logged in: ", user);
    createGuestSession(user.uid);
  }
}

async function handleLogin() {}

async function handleRegister() {}

async function handleSignOut() {
  await logout();
}

async function handleDelete() {
  const user = auth.currentUser;
  if (user) {
    try {
      const sessionRef = doc(db, "sessions", user.uid);
      await deleteDoc(sessionRef);
      await user.delete();
      localStorage.removeItem(LOCALSTORAGE_GUEST_KEY)
      console.log("Guest user deleted");
    } catch (error) {
      console.error("Error deleting session:", error);
    }
  }
}

export default function Home() {
  useEffect(() => {
    // Initialize the socket with autoConnect: false to prevent automatic connection
    socket = io("http://localhost:3002", { autoConnect: false });

    socket.on("update", (data) => {
      console.log("Received update:", data);
    });

    socket.on("connect", () => {
      console.log("Connected to server");
    });

    return () => {
      handleDisconnect();
    };
  }, []);

  useEffect(() => {
    const guestSessionId = localStorage.getItem(LOCALSTORAGE_GUEST_KEY);
    if (guestSessionId) {
      console.log(`Reconnecting session: ${guestSessionId}`);
    }
  }, []);

  return (
    <div className="flex flex-col gap-y-2 w-[100px]">
      <MyButton onClick={handleGuestLogin}>Guest Login</MyButton>
      {/* <MyButton onClick={handleLogin}>Login</MyButton> */}
      {/* <MyButton onClick={handleRegister}>Register</MyButton> */}
      {/* <MyButton onClick={handleSignOut}>Sign Out</MyButton> */}
      <MyButton onClick={handleDelete}>Delete</MyButton>
      <MyButton onClick={handleConnect}>Connect</MyButton>
      <MyButton onClick={handleUpdate}>Update</MyButton>
      <MyButton onClick={handleDisconnect}>Disconnect</MyButton>
    </div>
  );
}

type MyButtonProps = {
  children: React.ReactNode;
  onClick: () => void;
};

function MyButton({ children, onClick }: MyButtonProps) {
  return (
    <button className="border-solid border-black border-2" onClick={onClick}>
      {children}
    </button>
  );
}
