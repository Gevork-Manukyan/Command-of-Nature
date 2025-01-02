import type { Metadata } from "next";
import "./globals.css";

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
        {children}
      </body>
    </html>
  );
}
