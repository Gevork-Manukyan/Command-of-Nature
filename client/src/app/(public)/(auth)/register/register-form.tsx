"use client"

import { useState } from "react"
import { Button } from "@/components/shadcn-ui/button"
import { Input } from "@/components/shadcn-ui/input"
import { Label } from "@/components/shadcn-ui/label"
import { Eye, EyeOff } from "lucide-react"
import { ErrorMessage } from "@/components/error/error-message"
import { registerAction } from "@/actions/auth-actions"
import { useFormState } from "react-dom"
import { AuthBtn } from "../auth-btn"

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [state, formAction] = useFormState(registerAction, null)

  return (
    <form action={formAction}>
      <div className="grid w-full items-center gap-4">
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            name="username"
            placeholder="Choose a username"
            required
          />

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

          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input 
            id="confirmPassword"
            name="confirmPassword"
            type={showPassword ? "text" : "password"}
            placeholder="Confirm your password"
            required
          />
        </div>
      </div>

      {state && state.error && <ErrorMessage message={state.error} />}
    
      <div className="flex flex-col gap-2 mt-4 justify-between items-center">
        <AuthBtn>Register</AuthBtn>
        <a href="/login" className="text-sm text-muted-foreground hover:underline">
          Already have an account? Login
        </a>
      </div>
    </form>
  )
}