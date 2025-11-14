import { Resend } from "resend";
import { prisma } from "@/lib/prisma";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { NextAuthOptions } from "next-auth";
import Google from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import { getServerSession } from "next-auth";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "database" },
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: "/login",
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      allowDangerousEmailAccountLinking: true,
    }),
    EmailProvider({
      from: process.env.EMAIL_FROM || "contact@prynt.ro",
      async sendVerificationRequest({ identifier, url }) {
        const base = process.env.NEXT_PUBLIC_SITE_URL || process.env.PUBLIC_BASE_URL;
        const safeUrl = base ? url.replace(/^https?:\/\/localhost(?::\d+)?/i, base) : url;
        const html = `<p>Autentificare pe Prynt.ro</p><p><a href="${safeUrl}">Apasă pentru a te autentifica</a></p>`;
        if (!resend) throw new Error("RESEND_API_KEY missing; cannot send email magic link");
        await resend.emails.send({
          from: process.env.EMAIL_FROM || "contact@prynt.ro",
          to: identifier,
          subject: "Link de autentificare",
          html,
        });
      },
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session?.user) (session.user as any).id = (user as any)?.id;
      return session;
    },
  },
};

export async function getAuthSession() {
  return getServerSession(authOptions);
}
