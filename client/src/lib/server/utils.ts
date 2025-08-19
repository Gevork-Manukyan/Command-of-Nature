import { redirect } from "next/navigation";
import { auth } from "./auth";

/**
 * Ensures the user is authenticated. If not, redirects to /login.
 * Returns the session if authenticated.
 */
export async function requireUserSession() {
    const session = await auth();
    if (!session?.user) {
      redirect("/login");
    }
    return session;
}