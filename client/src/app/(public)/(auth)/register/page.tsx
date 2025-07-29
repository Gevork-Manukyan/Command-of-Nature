import { Metadata } from "next"
import { RegisterForm } from "./register-form"
import { AuthCard } from "../auth-card"

export const metadata: Metadata = {
  title: "Register",
  description: "Create a new account",
}

export default function Page() {
  return (
    <AuthCard 
      title="Register" 
      description="Create a new account to start playing"
    >
      <RegisterForm />
    </AuthCard>
  )
} 