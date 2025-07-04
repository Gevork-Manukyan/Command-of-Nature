"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcn-ui/card"
import { Button } from "@/components/shadcn-ui/button"
import { Input } from "@/components/shadcn-ui/input"
import { Label } from "@/components/shadcn-ui/label"
import { Eye, EyeOff } from "lucide-react"
import { useUserContext } from "@/contexts/UserContext"
import { useForm } from "react-hook-form"
import { RegisterFormData, registerFormSchema } from "@/lib/zod-schemas"
import { zodResolver } from "@hookform/resolvers/zod"

export function RegisterForm() {
  const router = useRouter()
  const { register } = useUserContext()
  const [showPassword, setShowPassword] = useState(false)
  const [apiError, setApiError] = useState("")
  const { 
    register: registerForm, 
    handleSubmit, 
    formState: { errors, isLoading } 
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: ""
    }
  })

  async function onSubmit(data: RegisterFormData) {
    setApiError("")
    const result = await register(data.username, data.password)
    if (result.success) {
      router.push("/lobby")
    } else {
      setApiError(result.error || "Registration failed")
    }
  }

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Register</CardTitle>
        <CardDescription>
          Create a new account to start playing
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="Choose a username"
                {...registerForm("username")}
              />
              {errors.username && <p className="text-sm text-red-500">{errors.username.message}</p>}

              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input 
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  {...registerForm("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}

              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input 
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Confirm your password"
                {...registerForm("confirmPassword")}
              />
              {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>}
            </div>
          </div>

          {apiError && <p className="text-sm text-red-500 mt-2">{apiError}</p>}
        
          <div className="flex flex-col gap-2 mt-4 justify-between items-center">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Register"}
            </Button>
            <a href="/login" className="text-sm text-muted-foreground hover:underline">
              Already have an account? Login
            </a>
          </div>
        </form>
      </CardContent>
    </Card>
  )
} 