import { getServerSession } from "next-auth";
import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { Resend } from 'resend';
import { getHtmlTemplate } from "@/lib/email";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      allowDangerousEmailAccountLinking: true,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID || "",
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || "",
      allowDangerousEmailAccountLinking: true,
    }),
    EmailProvider({
      server: "", 
      from: "no-reply@prynt.ro",
      async sendVerificationRequest({ identifier: email, url }) {
        if (!resend) {
            console.error("RESEND_API_KEY lipsă.");
            // În development nu crăpăm totul dacă lipsește cheia, doar logăm
            if (process.env.NODE_ENV === 'development') {
                console.log("Link autentificare (DEV):", url);
                return;
            }
            throw new Error("Serviciul de email indisponibil.");
        }

        const html = getHtmlTemplate({
          title: "Autentificare Prynt",
          message: "Apasă pe butonul de mai jos pentru a te autentifica în contul tău Prynt. Acest link este valabil 24 de ore.",
          buttonText: "Autentificare",
          buttonUrl: url,
          footerText: "Dacă nu ai încercat să te autentifici, ignoră acest email."
        });

        try {
          await resend.emails.send({
            from: 'Prynt <no-reply@prynt.ro>',
            to: email,
            subject: 'Link de autentificare Prynt',
            html: html,
          });
        } catch (error) {
          console.error("Eroare la trimiterea email-ului de login:", error);
          throw new Error("Nu s-a putut trimite email-ul.");
        }
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user || !user.passwordHash) {
          return null;
        }

        const isValid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!isValid) return null;

        return user;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Adăugăm ID-ul în token la login
      if (user) {
        token.sub = user.id;
      }
      
      // OPTIONAL: Dacă frontend-ul trimite un semnal de update, actualizăm token-ul local
      if (trigger === "update" && session?.user) {
        token.name = session.user.name;
        token.email = session.user.email;
      }
      
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        (session.user as any).id = token.sub;

        // CRITIC: Citim datele proaspete din baza de date pentru a fi siguri că avem numele actualizat
        // (Altfel, NextAuth ar folosi numele vechi stocat în cookie)
        try {
           const freshUser = await prisma.user.findUnique({
               where: { id: token.sub },
               select: { name: true, email: true } // Luăm doar ce ne trebuie
           });
           
           if (freshUser) {
               session.user.name = freshUser.name;
               session.user.email = freshUser.email;
           }
        } catch (e) {
            console.error("Eroare la reîmprospătarea sesiunii din DB:", e);
        }
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
};

export async function getAuthSession() {
  return getServerSession(authOptions);
}