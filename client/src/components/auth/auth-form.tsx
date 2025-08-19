"use client"

import { ErrorMessage } from "@/components/error/error-message"
import { AuthBtn } from "./auth-btn"
import { useFormState } from "react-dom"
import { registerAction } from "@/actions/auth-actions"
import { loginAction } from "@/actions/auth-actions"

type AuthFormProps = {
    children: React.ReactNode
    type: "login" | "register"
}

export function AuthForm({ children, type }: AuthFormProps) {
    const [loginState, loginFormAction] = useFormState(loginAction, null)
    const [registerState, registerFormAction] = useFormState(registerAction, null)

    return (
        <form action={type === "login" ? loginFormAction : registerFormAction}>
            <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                    {children}
                </div>
            </div>
            {type === "login" && loginState && loginState.error && <ErrorMessage message={loginState.error} />}
            {type === "register" && registerState && registerState.error && <ErrorMessage message={registerState.error} />}

            <div className="flex flex-col gap-2 mt-4 justify-between items-center">
                <AuthBtn>{type === "login" ? "Login" : "Register"}</AuthBtn>
                {type === "login" && (
                    <a href="/register" className="text-sm text-muted-foreground">
                        Don't have an account?
                    </a>
                )}
                {type === "register" && (
                    <a href="/login" className="text-sm text-muted-foreground">
                        Already have an account? Login
                    </a>
                )}
            </div>
        </form>
    );
}
