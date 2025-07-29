"use server"
import { signIn } from "@/lib/server/auth";
import { registerFormSchema } from "@/lib/zod-schemas"
import { AuthError } from "next-auth"

export async function loginAction(prevState: unknown, formData: unknown) {
    if (!(formData instanceof FormData)) {
        return { error: "Invalid form data" }
    }

    try {
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
        return { error: "Invalid form data" }
    }

    const formDataObject = Object.fromEntries(formData.entries());
    const validatedFormData = registerFormSchema.safeParse(formDataObject);

    if (!validatedFormData.success) {
        return { error: "Invalid form data" }
    }

    const { username, password } = validatedFormData.data;
    
    
    
}