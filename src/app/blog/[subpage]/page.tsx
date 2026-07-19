import { BlogLayout } from "@/components/blog";
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
    console.error("Failed to load SEO metadata for blog subpage:", err);
  }

  const title = matchedSeo?.meta_title || `${subpage.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")} | Jivanjor`;
  const description = matchedSeo?.meta_description || "Explore Jivanjor's woodworking knowledge hub — application tips, adhesive guides, and troubleshooting articles.";
  const canonical = matchedSeo?.canonical_url || `https://jivanjor.com/blog/${subpage}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      images: matchedSeo?.image ? [{ url: matchedSeo.image }] : undefined,
    }
  };
}

export default async function BlogSubpage({ params }: PageProps) {
  const { subpage } = await params;

  let template = undefined;
  try {
    template = await api.getActiveTemplateForPage(subpage);
  } catch (err) {
    console.error(`Failed to load active template for blog subpage ${subpage}:`, err);
  }

  if (!template) {
    notFound();
  }

  const sections = template?.rawSections || template?.sections || {};

  return <BlogLayout data={sections} />;
}
