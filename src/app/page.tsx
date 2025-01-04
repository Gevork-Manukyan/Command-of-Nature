"use client";
import { loginAsGuest } from "@/lib/firebase/auth";
import { auth, db } from "@/lib/firebase/firebase";
import { createGuestSession } from "@/lib/firebase/game";
import { clearGuestStorage, getUserId, setGuestLocalStorage } from "@/lib/localstorage";
import { deleteDoc, doc } from "firebase/firestore";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";

// FIRE BASE

export default function Home() {
  const [hasGuestSession, setHasGuestSession] = useState(false)
  const [guestName, setGuestInput] = useState("")

  useEffect(() => {
    const guestSessionId = getUserId();
    if (guestSessionId) {
      setHasGuestSession(true)
      console.log(`Reconnecting session: ${guestSessionId}`);
    }
  }, []);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setGuestInput(event.target.value)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const user = await loginAsGuest();
    if (user) {
      console.log("Guest user logged in: ", user);
      createGuestSession(user.uid);
      setGuestLocalStorage({userId: user.uid, guestName})
      setHasGuestSession(true)
    }
  }

  async function handleDelete() {
    const user = auth.currentUser;
    if (user) {
      try {
        const sessionRef = doc(db, "sessions", user.uid);
        await deleteDoc(sessionRef);
        await user.delete();
        clearGuestStorage()
        setHasGuestSession(false)
        console.log("Guest user deleted");
      } catch (error) {
        console.error("Error deleting session:", error);
      }
    }
  }

  return (
    <div className="w-[100vw] h-[100vh] flex justify-center items-center">
      {!hasGuestSession &&
        <form onSubmit={handleSubmit} className="flex flex-col border-2 border-black rounded-md p-10">
          <label 
            htmlFor="guest_name" 
            className="pb-1 text-base">Guest Name
          </label>
          <input 
            name="guest_name" 
            type="text"
            className="outline-black border-black border-2 rounded-md p-2 text-lg"
            value={guestName}
            onChange={handleChange}
          />
          <button 
            type="submit"
            className="mt-4 bg-green-400 border-2 border-black rounded-md"
          >
            Play
          </button>
        </form>
      }
      {hasGuestSession && 
        <button className="border-2 border-black" onClick={handleDelete}>Delete</button>
      }
    </div>
  );
}