import { ApplicationsLayout } from "@/components/applications";
import { api } from "@/lib/api";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ subpage: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { subpage } = await params;

  let matchedSeo = undefined;
  try {
    const [seos, pages] = await Promise.all([
      api.getSeoMetadata(),
      api.getPages()
    ]);
    const matchedPage = pages.find(p => p.slug === subpage);
    matchedSeo = seos.find((s) =>
      s.page_type === "static" &&
      (s.page_id === subpage || (matchedPage && s.page_id === matchedPage.id))
    );
  } catch (err) {
    console.error("Failed to load SEO metadata for applications subpage:", err);
  }

  const title = matchedSeo?.meta_title || `${subpage.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")} | Jivanjor`;
  const description = matchedSeo?.meta_description || "Discover specialised Jivanjor woodworking adhesives, applications guides, related products, and FAQs.";
  const canonical = matchedSeo?.canonical_url || `https://jivanjor.com/applications/${subpage}`;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      images: matchedSeo?.image ? [{ url: matchedSeo.image }] : undefined,
    }
  };
}

export default async function ApplicationsSubpage({ params }: PageProps) {
  const { subpage } = await params;

  let template = undefined;
  let matchedPage = undefined;
  try {
    const [t, pages] = await Promise.all([
      api.getActiveTemplateForPage(subpage).catch(() => null),
      api.getPages().catch(() => []),
    ]);
    template = t;
    matchedPage = pages.find((p) => p.slug === subpage);
  } catch (err) {
    console.error(`Failed to load active template for page ${subpage}:`, err);
  }

  if (!template && !matchedPage) {
    notFound();
  }

  const sections = template?.rawSections || template?.sections || {};

  return (
    <ApplicationsLayout
      data={sections}
      pageSlug={subpage}
      pageTitle={matchedPage?.title}
      pageDescription={matchedPage?.description}
    />
  );
}
