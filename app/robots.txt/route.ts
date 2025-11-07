import { NextResponse } from "next/server";

export async function GET() {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || process.env.PUBLIC_BASE_URL || "https://www.prynt.ro").replace(/\/$/, "");
  const txt = `User-agent: *
Disallow:

Sitemap: ${siteUrl}/sitemap.xml
`;
  return new NextResponse(txt, { headers: { "Content-Type": "text/plain" } });
}