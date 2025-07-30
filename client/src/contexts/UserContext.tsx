"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  getFromLocalStorage,
  USER,
} from "@/lib/client/localstorage";

type UserContextType = {
  userId: string | null;
};

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Load user from localStorage on mount
    const storedUserId = getFromLocalStorage<string>(USER);
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  return (
    <UserContext.Provider
      value={{
        userId
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
