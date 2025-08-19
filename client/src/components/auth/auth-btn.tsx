import { Button } from "@/components/shadcn-ui/button";
import { useFormStatus } from "react-dom";

export function AuthBtn({ children }: { children: React.ReactNode }) {
    const { pending } = useFormStatus();
    
    return (
        <Button type="submit" disabled={pending}>
            {children}
        </Button>
    )
}