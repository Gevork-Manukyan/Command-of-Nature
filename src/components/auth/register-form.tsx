"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/shadcn-ui/card"
import { Button } from "@/components/shadcn-ui/button"
import { Input } from "@/components/shadcn-ui/input"
import { Label } from "@/components/shadcn-ui/label"

export function RegisterForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  })
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Registration failed")
      }

      // Redirect to lobby or home page after successful registration
      router.push("/lobby")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed")
    }
  }

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your name below to create your account
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="Enter your username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />

              <Label htmlFor="password">Password</Label>
              <Input 
                id="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />

              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input 
                id="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              />

              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
          </div>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col gap-2 justify-between">
        <Button onClick={handleSubmit}>Register</Button>
        <a href="/login" className="text-sm text-muted-foreground">Already have an account?</a>
      </CardFooter>
    </Card>
  )
} 