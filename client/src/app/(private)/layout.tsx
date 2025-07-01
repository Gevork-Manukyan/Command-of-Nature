"use client";

import { useEffect } from 'react';
import { useUserContext } from '@/contexts/UserContext';
import { socketService } from '@/services/socket';

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = useUserContext();

  useEffect(() => {
    // Only connect to socket if user is logged in
    if (userId) {
      const connectToSocket = async () => {
        try {
          if (!socketService.getConnected()) {
            await socketService.connect(userId);
          }
        } catch (error) {
          console.error('Failed to connect to socket:', error);
        }
      };

      connectToSocket();
    }

    // Cleanup function to disconnect when component unmounts or user logs out
    return () => {
      if (socketService.getConnected()) {
        socketService.disconnect();
      }
    };
  }, [userId]); // Re-run when userId changes (login/logout)

  return <>{children}</>;
}
