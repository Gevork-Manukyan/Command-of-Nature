"use client";
import Login from "@/components/login";
import { GUEST_SESSIONS_COLLECTION } from "@/lib/constants";
import { auth, db } from "@/lib/firebase/firebase";
import { clearGuestStorage, getUserId } from "@/lib/localstorage";
import { deleteDoc, doc } from "firebase/firestore";
import { useEffect, useState } from "react";

export default function Home() {
  const [hasGuestSession, setHasGuestSession] = useState(false);

  useEffect(() => {
    const guestSessionId = getUserId();
    if (guestSessionId) {
      setHasGuestSession(true);
      console.log(`Reconnecting session: ${guestSessionId}`);
    }
  }, []);

  async function handleDelete() {
    const user = auth.currentUser;
    if (user) {
      try {
        const sessionRef = doc(db, GUEST_SESSIONS_COLLECTION, user.uid);
        await deleteDoc(sessionRef);
        await user.delete();
        clearGuestStorage();
        setHasGuestSession(false);
        console.log("Guest user deleted");
      } catch (error) {
        console.error("Error deleting session:", error);
      }
    }
  }

  return (
    <div className="w-[100vw] h-[100vh] flex justify-center items-center">
      {!hasGuestSession && <Login onSubmit={() => setHasGuestSession(true)} />}
      {hasGuestSession && (
        <button className="border-2 border-black" onClick={handleDelete}>
          Delete
        </button>
      )}
    </div>
  );
}
