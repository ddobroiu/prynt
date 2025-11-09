import { notFound } from "next/navigation";
import { listAllLandingRoutes, LANDING_CATALOG } from "@/lib/landingData";
import LandingTemplate from "@/components/LandingTemplate";
import type { LandingInfo } from "@/lib/landingData";
import type { Metadata } from "next";

type Props = { params?: { category: string; slug: string } };

export async function generateStaticParams() {
  // pre-render all known landing routes (from landingData)
  return listAllLandingRoutes().map((r) => ({ category: r.category, slug: r.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = params?.category ?? "";
  const slug = params?.slug ?? "";
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
  const category = String((params ?? {}).category ?? "").toLowerCase();
  const slug = String((params ?? {}).slug ?? "").toLowerCase();

  const landing: LandingInfo | undefined = (LANDING_CATALOG as any)[category]?.[slug];
  if (!landing) return notFound();

  // optional: if landing.productRouteSlug exists, you can fetch product dims from lib/products
  return <LandingTemplate category={category} landing={landing} productSlug={landing.productRouteSlug} />;
}