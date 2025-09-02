import { Button } from "@/components/shadcn-ui/button";
import { cn } from "@/lib/client/utils";

type NextPhaseButtonProps = {
    children: React.ReactNode;
    className?: string;
    onClick: () => void;
    disabled: boolean;
}

export default function NextPhaseButton({ children, className, onClick, disabled }: NextPhaseButtonProps) {
    return (
        <Button
            onClick={onClick}
            className={cn(className)}
            disabled={disabled}
        >
            {children}
        </Button>
    )
}