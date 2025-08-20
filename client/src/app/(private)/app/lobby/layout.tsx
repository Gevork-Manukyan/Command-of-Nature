import { LobbyProvider } from "@/contexts/LobbyContext";

export default function LobbyLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="p-6 max-w-4xl mx-auto">
                    <LobbyProvider>
                        {children}
                    </LobbyProvider>
                </div>
            </div>
        </div>
    );
}
