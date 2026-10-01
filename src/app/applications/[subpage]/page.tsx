import { ApplicationsLayout } from "@/components/applications";
import { api } from "@/lib/api";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import JsonLdScript from "@/components/seo/JsonLdScript";
import { getResolvedSeoAndSchema, FallbackSeoData } from "@/lib/seo-helper";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ subpage: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { subpage } = await params;
  const pageTitle = subpage
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  const canonical = `https://jivanjor.com/applications/${subpage}`;

  const fallback: FallbackSeoData = {
    pageSchemaType: "WebPage",
    title: `${pageTitle} | Jivanjor`,
    description:
      "Discover specialised Jivanjor woodworking adhesives, applications guides, related products, and FAQs.",
    canonical,
    breadcrumbs: [
      { name: "Home", url: "https://jivanjor.com/" },
      { name: "Applications", url: "https://jivanjor.com/applications" },
      { name: pageTitle, url: canonical },
    ],
  };

  const { metadata } = await getResolvedSeoAndSchema(
    "static",
    subpage,
    fallback,
    [subpage, `applications_${subpage}`, `applications-${subpage}`]
  );

  return metadata;
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
  const formattedTitle =
    matchedPage?.title ||
    subpage
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  const canonical = `https://jivanjor.com/applications/${subpage}`;

  const fallback: FallbackSeoData = {
    pageSchemaType: "WebPage",
    title: `${formattedTitle} | Jivanjor`,
    description:
      matchedPage?.description ||
      "Discover specialised Jivanjor woodworking adhesives, applications guides, related products, and FAQs.",
    canonical,
    breadcrumbs: [
      { name: "Home", url: "https://jivanjor.com/" },
      { name: "Applications", url: "https://jivanjor.com/applications" },
      { name: formattedTitle, url: canonical },
    ],
  };

  const { schemaConfig } = await getResolvedSeoAndSchema(
    "static",
    subpage,
    fallback,
    [subpage, `applications_${subpage}`, `applications-${subpage}`]
  );

  return (
    <>
      <JsonLdScript config={schemaConfig} />
      <ApplicationsLayout
        data={sections}
        pageSlug={subpage}
        pageTitle={matchedPage?.title}
        pageDescription={matchedPage?.description}
      />
    </>
  );
}
