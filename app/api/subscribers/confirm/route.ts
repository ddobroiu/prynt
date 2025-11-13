import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token") || "";
  if (!token) return NextResponse.redirect(new URL("/", url.origin));
  try {
    const sub = await prisma.subscriber.findFirst({ where: { token } });
    if (!sub) return NextResponse.redirect(new URL("/", url.origin));
    await prisma.subscriber.update({ where: { id: sub.id }, data: { confirmedAt: new Date() } });
    return NextResponse.redirect(new URL("/thank-you?subscribed=1", url.origin));
  } catch (e) {
    return NextResponse.redirect(new URL("/", url.origin));
  }
}
