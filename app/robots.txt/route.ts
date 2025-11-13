import { NextResponse } from "next/server";

export async function GET() {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || process.env.PUBLIC_BASE_URL || "https://www.prynt.ro").replace(/\/$/, "");
  const lines: string[] = [];

  // Allow major AI crawlers explicitly; keep checkout private
  const aiAgents = [
    "GPTBot", // OpenAI crawler
    "Google-Extended", // Google content for AI features
    "CCBot", // CommonCrawl
    "ClaudeBot", // Anthropic
    "PerplexityBot", // Perplexity
  ];

  for (const agent of aiAgents) {
    lines.push(`User-agent: ${agent}`);
    lines.push("Allow: /");
    lines.push("Disallow: /checkout");
    lines.push("Disallow: /checkout/");
    lines.push("");
  }

  // Default policy: allow everything important, block checkout
  lines.push("User-agent: *");
  lines.push("Allow: /");
  lines.push("Disallow: /checkout");
  lines.push("Disallow: /checkout/");
  lines.push("");

  // Sitemaps and feeds
  lines.push(`Sitemap: ${siteUrl}/sitemap.xml`);
  lines.push(`Sitemap: ${siteUrl}/feed.xml`);
  lines.push("");

  const txt = lines.join("\n");
  return new NextResponse(txt, { headers: { "Content-Type": "text/plain" } });
}