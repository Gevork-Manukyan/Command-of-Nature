"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { apiClient } from "@/lib/client/api-client"
import { loginFormSchema, registerFormSchema } from "@/lib/zod-schemas"

export async function loginAction(prevState: unknown,formData: unknown) {
    if (!(formData instanceof FormData)) {
        return { error: "Invalid form data" }
    }

    const formDataObject = Object.fromEntries(formData.entries());
    const validatedFormData = loginFormSchema.safeParse(formDataObject);

    if (!validatedFormData.success) {
        return { error: "Invalid form data" }
    }

    const { username, password } = validatedFormData.data;

    
}

export async function registerAction(prevState: unknown,formData: unknown) {
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