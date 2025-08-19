'use client'

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Input } from "../shadcn-ui/input";
import { Label } from "@/components/shadcn-ui/label";

type PasswordFieldProps = {
    confirmPassword?: boolean;
}

export function PasswordField({ confirmPassword=false }: PasswordFieldProps) {
    const [showPassword, setShowPassword] = useState(false);
    
    return (
        <>
        <Label htmlFor="password">Password</Label>
        <div className="relative">
            <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                required
                />
            <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2"
                >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
        </div>

        {confirmPassword && (
            <>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Confirm your password"
                required
            />
            </>
        )}
        </>
    )
}