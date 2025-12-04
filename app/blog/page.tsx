import React from "react";
import Link from "next/link";
import { getAllPosts } from "@/lib/blogPosts";
import BreadcrumbsJsonLd from "@/components/BreadcrumbsJsonLd";

export const metadata = {
  title: "Blog – Sfaturi de print și publicitar | Prynt",
  description: "Articole cu sfaturi despre bannere, autocolante, pliante, afișe și materiale de promovare. Ghiduri practice, prețuri instant în configuratoare și tricks din industria de tipar.",
  keywords: [
    "blog tipar digital",
    "sfaturi bannere",
    "ghid afișe",
    "tips autocolante",
    "materiale publicitare",
    "industrie tipar",
    "configuratoare print",
    "articole promovare"
  ],
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Blog – Sfaturi de print și publicitar | Prynt",
    description: "Articole cu sfaturi despre bannere, autocolante, pliante, afișe și materiale de promovare. Ghiduri practice și tips din industrie.",
    type: "website",
    images: [{
      url: "/logo.jpg",
      width: 1200,
      height: 630,
      alt: "Blog Prynt - Sfaturi tipar digital"
    }]
  }
};

export default function BlogIndexPage() {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || process.env.PUBLIC_BASE_URL || "https://www.prynt.ro").replace(/\/$/, "");
  const posts = getAllPosts();
  return (
    <main className="page py-10">
      <BreadcrumbsJsonLd items={[{ name: "Acasă", url: `${base}/` }, { name: "Blog", url: `${base}/blog` }]} />
      <header className="text-center mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-ui">Blog</h1>
        <p className="text-muted mt-1">Ghiduri, sfaturi și idei pentru materialele tale</p>
      </header>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((p) => (
          <article key={p.slug} className="card p-4 flex flex-col">
            {p.hero ? (
              <div className="aspect-video rounded-lg overflow-hidden border border-white/10 mb-3">
                <img src={p.hero} alt={p.title} className="w-full h-full object-cover" />
              </div>
            ) : null}
            <h2 className="text-lg font-bold mb-1">
              <Link href={`/blog/${p.slug}`}>{p.title}</Link>
            </h2>
            <p className="text-sm text-muted mb-3">{p.description}</p>
            <div className="mt-auto flex items-center justify-between text-xs text-muted">
              <time>{new Date(p.date).toLocaleDateString("ro-RO")}</time>
              <div className="flex flex-wrap gap-1">
                {p.tags.slice(0, 3).map((t) => (
                  <span key={t} className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10">#{t}</span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
