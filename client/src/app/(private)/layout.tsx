"use client";

import { useUserContext } from '@/contexts/UserContext';
import { SocketProvider } from '@/contexts/SocketContext';

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = useUserContext();

  return (
    <SocketProvider userId={userId || ''}>
      {children}
    </SocketProvider>
  );
}
