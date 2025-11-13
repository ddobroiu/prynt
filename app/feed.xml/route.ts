import { NextResponse } from "next/server";
import { POSTS, type BlogPost } from "../../lib/blogPosts";

export const dynamic = "force-static";

export async function GET() {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || process.env.PUBLIC_BASE_URL || "https://www.prynt.ro").replace(/\/$/, "");
  const feedItems = POSTS
    .map((p: BlogPost) => {
      const link = `${siteUrl}/blog/${p.slug}`;
      const description = escapeXml(p.description || "");
      const title = escapeXml(p.title);
      return `
      <item>
        <title>${title}</title>
        <link>${link}</link>
        <guid>${link}</guid>
        <description>${description}</description>
      </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0">
    <channel>
      <title>Prynt Blog</title>
      <link>${siteUrl}/blog</link>
      <description>Articole utile despre print și producție publicitară</description>
      ${feedItems}
    </channel>
  </rss>`;

  return new NextResponse(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}

function escapeXml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
