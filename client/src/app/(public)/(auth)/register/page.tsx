import { Metadata } from "next"
import RegisterPage from "./register"

export const metadata: Metadata = {
  title: "Register",
  description: "Create a new account",
}

export default function Page() {
  return <RegisterPage />
} 