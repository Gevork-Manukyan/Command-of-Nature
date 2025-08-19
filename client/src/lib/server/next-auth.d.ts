import { User } from "next-auth";

declare module "next-auth" {
    interface User {
        id: string;
        username: string;
    }

    interface Session {
        user: User
    }
}

declare module "@auth/core/jwt" {
    interface JWT {
        userId: string;
        username: string;
    }
}