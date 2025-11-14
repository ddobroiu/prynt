import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import { Prisma } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const { email, source } = await req.json();
    const em = String(email || "").trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) {
      return NextResponse.json({ ok: false, message: "Email invalid" }, { status: 400 });
    }

    // Reuse existing subscriber if exists
    const existing = await prisma.subscriber
      .findUnique({ where: { email: em } })
      .catch((e) => {
        if ((e as any)?.code === "P1001" || e instanceof Prisma.PrismaClientInitializationError) {
          return NextResponse.json(
            { ok: false, message: "Baza de date este indisponibilă. Te rugăm încearcă mai târziu." },
            { status: 503 }
          );
        }
        return null;
      });

    if (existing instanceof NextResponse) return existing;
    if (existing?.confirmedAt) {
      return NextResponse.json({ ok: true, message: "Ești deja abonat(ă)." });
    }

    const token = crypto.randomUUID().replace(/-/g, "");
    let sub;
    try {
      sub = existing
        ? await prisma.subscriber.update({ where: { email: em }, data: { token, source: (existing as any)?.source || source || undefined } })
        : await prisma.subscriber.create({ data: { email: em, token, source: source || undefined } });
    } catch (e) {
      if ((e as any)?.code === "P1001" || e instanceof Prisma.PrismaClientInitializationError) {
        return NextResponse.json(
          { ok: false, message: "Baza de date este indisponibilă. Te rugăm încearcă mai târziu." },
          { status: 503 }
        );
      }
      throw e;
    }

    const base = process.env.NEXT_PUBLIC_SITE_URL || process.env.PUBLIC_BASE_URL || "http://localhost:3000";
    // Use a non-API route for robustness on various deploy targets
    const confirmUrl = `${base}/subscribers/confirm?token=${encodeURIComponent(sub.token)}`;

    try {
      const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
      if (!resend) throw new Error("RESEND_API_KEY lipsă");
      await resend.emails.send({
        from: process.env.EMAIL_FROM || "contact@prynt.ro",
        to: em,
        subject: "Confirmă abonarea la Prynt.ro",
        html: `<p>Confirmă abonarea apăsând linkul:</p><p><a href="${confirmUrl}">Confirmă abonarea</a></p>`,
      });
    } catch (e) {
      console.warn("[subscribers] Nu am putut trimite emailul de confirmare:", (e as any)?.message || e);
    }

    return NextResponse.json({ ok: true, message: "Ți-am trimis email de confirmare." });
  } catch (e) {
    return NextResponse.json({ ok: false, message: "Eroare server" }, { status: 500 });
  }
}
