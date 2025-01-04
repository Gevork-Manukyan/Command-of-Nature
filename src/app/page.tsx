"use client";
import { loginAsGuest } from "@/lib/firebase/auth";
import { auth, db } from "@/lib/firebase/firebase";
import { createGuestSession } from "@/lib/firebase/game";
import { deleteDoc, doc } from "firebase/firestore";
import { useEffect } from "react";

// FIRE BASE
const LOCALSTORAGE_GUEST_KEY = 'guestSession'

async function handleGuestLogin() {
  const user = await loginAsGuest();
  if (user) {
    console.log("Guest user logged in: ", user);
    createGuestSession(user.uid);
  }
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
    const guestSessionId = localStorage.getItem(LOCALSTORAGE_GUEST_KEY);
    if (guestSessionId) {
      console.log(`Reconnecting session: ${guestSessionId}`);
    }
  }, []);

  return (
    <div className="">
      
    </div>
  );
}