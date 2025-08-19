import NextAuth, { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { loginFormSchema } from "../zod-schemas";
import { prisma } from "./prisma";
import { compare } from "bcryptjs";
import { getServerEnv } from "../env";

const serverEnv = getServerEnv();

const config = {
  secret: serverEnv.JWT_SECRET,
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      // Runs on login
      async authorize(credentials) {
        // Validation
        const validatedFormData = loginFormSchema.safeParse(credentials);
        if (!validatedFormData.success) return null;

        // Retrieve User from DB
        const { username, password } = validatedFormData.data;

        const user = await prisma.user.findUnique({
          where: { username },
        });
        if (!user) {
          console.error(`User ${username} not found`);
          return null;
        }

        // Check password
        const isPasswordValid = await compare(password, user.password);
        if (!isPasswordValid) {
          console.error(`Invalid credentials`);
          return null;
        }

        // Convert Prisma user to NextAuth format
        return {
          id: user.id,
          username: user.username,
          password: user.password,
        };
      },
    }),
  ],
  callbacks: {
    // Runs on every request with middleware
    authorized: ({ auth, request }) => {
      const isLoggedIn = Boolean(auth?.user);
      const isTryingToAccessProtectedRoute = request.nextUrl.pathname.startsWith("/app");

      // User logged in and trying to access protected route
      if (isTryingToAccessProtectedRoute && isLoggedIn) {
        return true;
      }

      // User NOT logged in and trying to access protected route
      if (isTryingToAccessProtectedRoute && !isLoggedIn) {
        return false;
      }

      // User logged in and trying to access public route
      if (!isTryingToAccessProtectedRoute && isLoggedIn) {
        // User trying to access login or register page
        if (
          request.nextUrl.pathname.includes("/login") ||
          request.nextUrl.pathname.includes("/register")
        ) {
          return Response.redirect(new URL("/app/lobby", request.url));
        }

        // User trying to access other public route
        return true;
      }

      // User NOT logged in and trying to access public route
      if (!isTryingToAccessProtectedRoute && !isLoggedIn) {
        return true;
      }

      // Default: Deny access
      return false;
    },
    jwt: async ({ token, user, trigger }) => {
      // On signin (user is the user object passed from authorize)
      if (user) {
        token.userId = user.id;
        token.username = user.username;
      }

      return token;
    },
    session: async ({ session, token }) => {
      session.user.id = token.userId;
      session.user.username = token.username;

      return session;
    },
  },
} satisfies NextAuthConfig;

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth(config);