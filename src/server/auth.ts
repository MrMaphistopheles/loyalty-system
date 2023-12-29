import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { UserRole } from "@prisma/client";

import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import "next-auth/jwt";
import { db } from "@/server/db";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    id?: string;
    role?: UserRole | null;
  }
}

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: UserRole | null;
    } & DefaultSession["user"];
  }

  export interface Profile {
    iss?: string;
    azp?: string;
    aud?: string;
    sub?: string;
    email?: string;
    email_verified?: boolean;
    at_hash?: string;
    name?: string;
    picture?: string;
    given_name?: string;
    family_name?: string;
    locale?: string;
    iat?: number;
    exp?: number;
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    async session({ session, user }) {
      const dbUser = await db.user.findFirst({
        where: {
          email: user?.email,
        },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          role: true,
        },
      });

      if (dbUser) {
        session.user.id = dbUser.id;
        session.user.name = dbUser.name;
        session.user.email = dbUser.email;
        session.user.image = dbUser.image;
        session.user.role = dbUser.role as UserRole;
      }

      return session;
    },
    async signIn({ profile }) {
      const linkedAccount = await db.user.findUnique({
        where: {
          email: profile?.email,
        },
      });

      console.log(profile);

      if (linkedAccount?.name === null) {
        await db.user.update({
          where: {
            id: linkedAccount.id,
          },
          data: {
            name: profile?.name,
            image: profile?.picture,
          },
        });
      }
      if (linkedAccount?.image === null) {
        await db.user.update({
          where: {
            id: linkedAccount.id,
          },
          data: {
            image: profile?.picture,
          },
        });
      }
      if (linkedAccount) {
        return true;
      } else {
        await db.user.create({
          data: {
            name: profile?.name,
            email: profile?.email,
            image: profile?.picture,
          },
        });
        return true;
      }
    },
  },
  pages: {
    signIn: "/signin",
  },
  adapter: PrismaAdapter(db),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      allowDangerousEmailAccountLinking: true,
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions);
