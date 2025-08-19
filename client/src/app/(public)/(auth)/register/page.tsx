import { Metadata } from "next";
import { RegisterForm } from "../../../../components/auth/register-form";
import { AuthCard } from "../../../../components/auth/auth-card";

export const metadata: Metadata = {
    title: "Register",
    description: "Create a new account",
};

export default function Page() {
    return (
        <AuthCard
            title="Register"
            description="Create a new account to start playing"
        >
            <RegisterForm />
        </AuthCard>
    );
}
