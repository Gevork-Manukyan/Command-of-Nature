import { LoadingSpinner } from "./loading-spinner";

interface LoadingScreenProps {
    message?: string;
}

export function LoadingScreen({ message = "Loading..." }: LoadingScreenProps) {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <LoadingSpinner />
                <p className="text-gray-600">{message}</p>
            </div>
        </div>
    );
} 