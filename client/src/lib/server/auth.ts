import NextAuth, { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { loginFormSchema } from "../zod-schemas";
import dbConnect from "./db";
import { User } from "./models/User";
import { compare } from "bcryptjs";

const config = {
  pages: {
    signIn: '/login',
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

        await dbConnect();
        const user = await User.findOne({ username });
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

        // Convert Mongoose _id to id for NextAuth compatibility
        return {
          id: user._id.toString(),
          username: user.username,
          password: user.password
        };
      }
    })
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
        if (request.nextUrl.pathname.includes('/login') || request.nextUrl.pathname.includes('/register')) {
          return false;
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
    }
  },
} satisfies NextAuthConfig;

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth(config);

// import { SignJWT, jwtVerify, JWTPayload } from 'jose';
// import { cookies } from 'next/headers';
// import { getServerEnv } from '../env';

// const serverEnv = getServerEnv();
// const JWT_SECRET = new TextEncoder().encode(serverEnv.JWT_SECRET);

// export interface TokenPayload extends JWTPayload {
//   userId: string;
//   username: string;
// }

// export async function generateToken(payload: TokenPayload): Promise<string> {
//   return await new SignJWT(payload)
//     .setProtectedHeader({ alg: 'HS256' })
//     .setIssuedAt()
//     .setExpirationTime('1d')
//     .sign(JWT_SECRET);
// }

// export async function verifyToken(token: string): Promise<TokenPayload | null> {
//   try {
//     const { payload } = await jwtVerify(token, JWT_SECRET);
//     return payload as TokenPayload;
//   } catch (error) {
//     console.error('Token verification failed:', error);
//     return null;
//   }
// }

// export function setAuthCookie(token: string) {
//   cookies().set('auth-token', token, {
//     httpOnly: true,
//     secure: serverEnv.NODE_ENV === 'production',
//     sameSite: 'strict',
//     path: '/',
//     maxAge: 60 * 60 * 24 * 1, // 1 day
//   });
// }

// export function removeAuthCookie() {
//   cookies().delete('auth-token');
// }

// export function getTokenFromCookie(): string | undefined {
//   return cookies().get('auth-token')?.value;
// } 