import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
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
        <GameSessionProvider>
          <Header />
          {children}
          <Footer />
        </GameSessionProvider>
      </body>
    </html>
  );
}
