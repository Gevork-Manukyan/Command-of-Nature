import "./globals.css";
import type { Metadata } from "next";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/shadcn-ui/sonner";

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
            <body className={``}>
                <SessionProvider>
                    <Header />
                    {children}
                    <Footer />
                    <Toaster />
                </SessionProvider>
            </body>
        </html>
    );
}
