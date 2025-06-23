import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { UserProvider } from '@/contexts/UserContext';
import { GameSessionProvider } from '@/contexts/GameSessionContext';

export const metadata: Metadata = {
  title: "Command of Nature",
  description: "Play the game Command of Nature",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={``}
      >
        <UserProvider>
          <GameSessionProvider>
            <Header />
            {children}
            <Footer />
          </GameSessionProvider>
        </UserProvider>
      </body>
    </html>
  );
}
