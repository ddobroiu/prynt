import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token") || "";
  const origin = url.origin;
  if (!token) return NextResponse.redirect(new URL("/", origin));
  try {
    const sub = await prisma.subscriber.findFirst({ where: { token } });
    if (!sub) return NextResponse.redirect(new URL("/", origin));
    await prisma.subscriber.update({ where: { id: sub.id }, data: { confirmedAt: new Date() } });
    return NextResponse.redirect(new URL("/thank-you?subscribed=1", origin));
  } catch (e) {
    return NextResponse.redirect(new URL("/", origin));
  }
}
