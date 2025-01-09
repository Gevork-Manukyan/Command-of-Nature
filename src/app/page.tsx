"use client";
import { GUEST_SESSIONS_COLLECTION } from "@/lib/constants";
import { auth, db } from "@/lib/firebase/firebase";
import { clearGuestStorage, getUserId } from "@/lib/localstorage";
import { deleteDoc, doc } from "firebase/firestore";
import { useEffect } from "react";

export default function Home() {

  useEffect(() => {
    const guestSessionId = getUserId();
    if (guestSessionId) {
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
        console.log("Guest user deleted");
      } catch (error) {
        console.error("Error deleting session:", error);
      }
    }
  }

  return (
    <div className="w-[100vw] h-[100vh] flex justify-center items-center">
      <button className="border-2 border-black" onClick={handleDelete}>
        Delete
      </button>
    </div>
  );
}
