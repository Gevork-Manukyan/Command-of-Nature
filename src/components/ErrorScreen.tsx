interface ErrorScreenProps {
    message: string;
}

export function ErrorScreen({ message }: ErrorScreenProps) {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <div className="text-red-500 text-4xl mb-4">⚠️</div>
                <p className="text-red-600 font-medium">{message}</p>
            </div>
        </div>
    );
} 