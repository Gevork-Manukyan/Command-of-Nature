"use client"

import { Metadata } from "next"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcn-ui/card"
import { Button } from "@/components/shadcn-ui/button"
import { Input } from "@/components/shadcn-ui/input"
import { Label } from "@/components/shadcn-ui/label"
import { Eye, EyeOff } from "lucide-react"
import { useUserContext } from "@/contexts/UserContext"
import { LoginFormData, loginFormSchema } from "@/lib/zod-schemas"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ErrorMessage } from "@/components/error/error-message"

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your account",
}

export default function LoginPage() {
  const router = useRouter()
  const { login } = useUserContext()
  const [showPassword, setShowPassword] = useState(false)
  const [apiError, setApiError] = useState("")
  const { 
    register: loginForm, 
    handleSubmit, 
    formState: { errors, isLoading } 
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: "",
      password: ""
    }
  })

  async function onSubmit(data: LoginFormData) {
    setApiError("")
    const result = await login(data.username, data.password)
    
    if (result.success) {
      router.push("/lobby")
    } else {
      setApiError(result.error || "Login failed")
    }
  }

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>
          Enter your name below to login to your account
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
                <Label htmlFor="username">Username</Label>
                <Input
                    id="username"
                    placeholder="Enter your username"
                    {...loginForm("username")}
                    disabled={isLoading}
                />
                {errors.username && <ErrorMessage message={errors.username.message || ""} />}
                
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input 
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      {...loginForm("password")}
                      disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && <ErrorMessage message={errors.password.message || ""} />}
            </div>
          </div>
          {apiError && <ErrorMessage message={apiError} />}

          <div className="flex flex-col gap-2 mt-4 justify-between items-center">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
            <a href="/register" className="text-sm text-muted-foreground">Don't have an account?</a>
          </div>
        </form>
      </CardContent>
    </Card>
  )
} 