import { Button } from "../shadcn-ui/button";

interface ErrorScreenProps {
    message: string;
    onGoBack?: () => void;
}

export function ErrorScreen({ message, onGoBack }: ErrorScreenProps) {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <div className="text-red-500 text-4xl mb-4">⚠️</div>
                <p className="text-red-600 font-medium">{message}</p>
                {onGoBack && (
                    <Button className="mt-4" onClick={onGoBack}>Go Back</Button>
                )}
            </div>
        </div>
    );
} 