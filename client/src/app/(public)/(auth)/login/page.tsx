import { Metadata } from "next"
import { LoginForm } from "./login-form"
import { AuthCard } from "../auth-card"

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your account",
}

export default function Page() {
  return (
    <AuthCard 
      title="Login" 
      description="Enter your name below to login to your account"
    >
      <LoginForm />
    </AuthCard>
  )
} 