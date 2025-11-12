import React from "react";
import { getAllBlogSlugs, getPostBySlug } from "@/lib/blogPosts";
import BreadcrumbsJsonLd from "@/components/BreadcrumbsJsonLd";
import ArticleJsonLd from "@/components/ArticleJsonLd";

export async function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);
  if (!post) return {} as any;
  return {
    title: `${post.title} | Blog Prynt`,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
  };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);
  if (!post) return null;
  const base = (process.env.NEXT_PUBLIC_SITE_URL || process.env.PUBLIC_BASE_URL || "https://www.prynt.ro").replace(/\/$/, "");
  const url = `${base}/blog/${post.slug}`;
  return (
    <main className="page py-10">
      <BreadcrumbsJsonLd items={[{ name: "Acasă", url: `${base}/` }, { name: "Blog", url: `${base}/blog` }, { name: post.title, url }]} />
      <ArticleJsonLd meta={{ headline: post.title, description: post.description, datePublished: post.date, author: post.author || "Prynt", image: post.hero, url }} />

      <article className="prose prose-invert max-w-3xl mx-auto">
        <header className="mb-6">
          <h1 className="text-3xl font-extrabold tracking-tight text-ui mb-2">{post.title}</h1>
          <p className="text-muted">{post.description}</p>
          <div className="text-xs text-muted mt-1">{new Date(post.date).toLocaleDateString("ro-RO")}{post.author ? ` • ${post.author}` : ""}</div>
        </header>
        {post.hero ? (
          <div className="aspect-video rounded-lg overflow-hidden border border-white/10 mb-6">
            <img src={post.hero} alt={post.title} className="w-full h-full object-cover" />
          </div>
        ) : null}
        <div className="text-sm leading-7" dangerouslySetInnerHTML={{ __html: post.contentHtml }} />

        <div className="mt-8 p-4 card text-center">
          <p className="mb-3">Gata să comanzi? Configurează produsul dorit și primești preț instant:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            <a className="btn-primary" href="/banner">Bannere</a>
            <a className="btn-primary" href="/autocolante">Autocolante</a>
            <a className="btn-primary" href="/pliante">Pliante</a>
            <a className="btn-primary" href="/afise">Afișe</a>
          </div>
        </div>
      </article>
    </main>
  );
}
