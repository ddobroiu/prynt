import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { Resend } from 'resend';
import { getHtmlTemplate } from "@/lib/email";

const resend = new Resend(process.env.RESEND_API_KEY);

export const authOptions: NextAuthOptions = {
	adapter: PrismaAdapter(prisma),
	session: {
		strategy: "jwt",
	},
	pages: {
		signIn: '/login',
		error: '/login', // Redirecționează erorile tot către login
	},
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
			allowDangerousEmailAccountLinking: true, // Permite conectarea automată dacă emailul există deja
		}),
		FacebookProvider({
			clientId: process.env.FACEBOOK_CLIENT_ID!,
			clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
			allowDangerousEmailAccountLinking: true, // ESENȚIAL: Permite conectarea dacă ai deja cont cu acest email
		}),
		EmailProvider({
			server: "", // Nu folosim SMTP, ci API-ul Resend direct
			from: "no-reply@prynt.ro",
			// Customizam trimiterea email-ului pentru a avea design
			async sendVerificationRequest({ identifier: email, url, provider }) {
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
		async session({ session, token }) {
			if (session.user && token.sub) {
				// Adăugăm ID-ul utilizatorului în sesiune pentru a-l avea disponibil în frontend
				(session.user as any).id = token.sub;
			}
			return session;
		},
		async jwt({ token, user, account }) {
			// Când utilizatorul se loghează prima dată
			if (user) {
				token.sub = user.id;
			}
			return token;
		}
	},
	// Secretul este obligatoriu în producție pentru criptarea token-urilor
	secret: process.env.NEXTAUTH_SECRET, 
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };