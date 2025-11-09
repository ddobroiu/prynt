import { notFound } from "next/navigation";
import type { Metadata } from "next";
import LandingTemplate from "@/components/LandingTemplate";
import { LANDING_CATALOG, listAllLandingRoutes } from "@/lib/landingData";
import type { LandingInfo } from "@/lib/landingData";

type Props = { params?: { category: string; slug: string } };

export async function generateStaticParams() {
  return listAllLandingRoutes().map((r) => ({ category: r.category, slug: r.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = String(params?.category ?? "").toLowerCase();
  const slug = String(params?.slug ?? "").toLowerCase();
  const landing: LandingInfo | undefined = (LANDING_CATALOG as any)[category]?.[slug];
  if (!landing) return {};
  const base = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.prynt.ro").replace(/\/$/, "");
  const url = `${base}/${category}/${slug}`;

  return {
    title: landing.seoTitle || landing.title,
    description: landing.seoDescription || landing.shortDescription,
    openGraph: { title: landing.seoTitle || landing.title, description: landing.seoDescription || landing.shortDescription, images: landing.images ?? [], url },
    alternates: { canonical: url },
  };
}

export default function Page({ params }: Props) {
  const category = String(params?.category ?? "").toLowerCase();
  const slug = String(params?.slug ?? "").toLowerCase();
  const landing: LandingInfo | undefined = (LANDING_CATALOG as any)[category]?.[slug];
  if (!landing) return notFound();

  // Optionally compute initial sizes from lib/products if you want
  return <LandingTemplate category={category} landing={landing} />;
}