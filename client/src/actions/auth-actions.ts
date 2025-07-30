"use server";
import { signIn, signOut } from "@/lib/server/auth";
import { prisma } from "@/lib/server/prisma";
import { registerFormSchema } from "@/lib/zod-schemas";
import { hash } from "bcryptjs";
import { AuthError } from "next-auth";

export async function loginAction(prevState: unknown, formData: unknown) {
  if (!(formData instanceof FormData)) {
    return { error: "Invalid form data" };
  }

  try {
    // Sign in the user and attach the auth cookie to the response
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            message: "Invalid email or password",
          };
        default:
          return {
            message: "Something went wrong",
          };
      }
    }

    // nextjs redirects throws error (redirect is called by signIn) so we need to rethrow it
    throw error;
  }
}

export async function registerAction(prevState: unknown, formData: unknown) {
  if (!(formData instanceof FormData)) {
    return { error: "Invalid form data" };
  }

  // Validate the form data
  const formDataObject = Object.fromEntries(formData.entries());
  const validatedFormData = registerFormSchema.safeParse(formDataObject);
  if (!validatedFormData.success) return { error: "Invalid form data" };

  const { username, password } = validatedFormData.data;

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });
    if (existingUser) return { error: "Username already exists" };

    // Hash the password
    const hashedPassword = await hash(password, 10);

    // Create the user
    await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    return { error: "Error creating user" };
  }

  // Sign in the user and attach the auth cookie to the response
  await signIn("credentials", formData);
}

export async function logoutAction() {
  try {
    await signOut({
      redirectTo: "/login",
    });
  } catch (error) {
    console.error("Error during logout:", error);
    return { error: "Error during logout" };
  }
}
