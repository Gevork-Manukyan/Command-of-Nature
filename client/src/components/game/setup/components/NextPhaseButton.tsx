import { cn } from "@/lib/client/utils";

type NextPhaseButtonProps = {
    children: React.ReactNode;
    className?: string;
    onClick: () => void;
    disabled: boolean;
}

export default function NextPhaseButton({ children, className, onClick, disabled }: NextPhaseButtonProps) {
    return (
        <button
            onClick={onClick}
            className={cn("px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed", className)}
            disabled={disabled}
        >
            {children}
        </button>
    )
}