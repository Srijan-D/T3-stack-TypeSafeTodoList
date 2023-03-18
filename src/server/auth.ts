/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type GetServerSidePropsContext } from "next";
import { createTransport } from "nodemailer"
import {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
} from "next-auth";
// import DiscordProvider from "next-auth/providers/discord";
import EmailProvider from "next-auth/providers/email"
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "~/server/db";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
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
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        // session.user.role = user.role; <-- put other properties on the session here
      }
      return session;
    },
  },
  adapter: PrismaAdapter(prisma),
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  providers: [
    // EmailProvider({
    //   server: {
    //     host: process.env.EMAIL_SERVER || "https://localhost:3000",
    //     port: 587,
    //     auth: {
    //       user: "",
    //       pass: process.env.EMAIL_PASS || "",
    //     },
    //   },
    //   from: process.env.EMAIL_FROM || "no-reply@localhost",
    //in development mode we don't want to send emails
    //we spread the object so that we don't have to duplicate the code
    // ...(process.env.NODE_ENV !== "production" ? {
    // sendVerificationRequest: ({ url }): void => {
    //     console.log("LOGIN LINK", url)
    //   },
    // } : {}),
    //nodemailer transport
    EmailProvider({
      server: {
        host: "smtp.gmail.com",
        port: 587,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
        from: process.env.EMAIL_FROM,
        sendVerificationRequest({
          identifier: email, url,
          provider: { server, from },
        }) {
          async function sendVerificationRequest(params: any) {
            const { identifier, url, provider, theme } = params
            // NOTE: You are not required to use `nodemailer`, use whatever you want.
            const transport = createTransport(provider.server)
            const result = await transport.sendMail({
              to: identifier,
              from: provider.from,
              subject: `Sign in to https://localhost:3000`,
              text: `Sign in to https://localhost:3000`,
              html: `<h1>Sign in to ${url}</h1>`
            })
             const failed = result.rejected.concat(result.pending).filter(Boolean)
            if (failed.length) {
              throw new Error(`Email(s) (${failed.join(", ")}) could not be sent`)
            }
          }
        },
      },
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
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
