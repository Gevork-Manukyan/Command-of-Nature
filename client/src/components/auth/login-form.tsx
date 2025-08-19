import { Input } from "@/components/shadcn-ui/input";
import { Label } from "@/components/shadcn-ui/label";
import { AuthForm } from "./auth-form";
import { PasswordField } from "./password-field";

const USERNAME_ID = "username";

export function LoginForm() {
    return (
        <AuthForm type="login">
            <Label htmlFor={USERNAME_ID}>Username</Label>
            <Input
                id={USERNAME_ID}
                name={USERNAME_ID}
                placeholder="Enter your username"
                required
            />

            <PasswordField />
        </AuthForm>
    );
}