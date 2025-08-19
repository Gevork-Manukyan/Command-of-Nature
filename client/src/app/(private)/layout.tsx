import { SocketProvider } from '@/contexts/SocketContext';
import { requireUserSession } from '@/lib/server/utils';

export default async function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireUserSession();
  
  return (
    <SocketProvider userId={session.user.id}>
      {children}
    </SocketProvider>
  );
}
