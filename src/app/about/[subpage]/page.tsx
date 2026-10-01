import AboutUs from "@/components/about/AboutUs";
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
  const canonical = `https://jivanjor.com/about/${subpage}`;

  const fallback: FallbackSeoData = {
    pageSchemaType: "AboutPage",
    title: `${pageTitle} | Jivanjor`,
    description:
      "Learn more about Jivanjor woodworking adhesives, research R&D facilities, performance quality, TVCs, and our presence.",
    canonical,
    breadcrumbs: [
      { name: "Home", url: "https://jivanjor.com/" },
      { name: "About Us", url: "https://jivanjor.com/about" },
      { name: pageTitle, url: canonical },
    ],
  };

  const { metadata } = await getResolvedSeoAndSchema(
    "static",
    subpage,
    fallback,
    [subpage, `about_${subpage}`, `about-${subpage}`]
  );

  return metadata;
}

export default async function AboutSubpage({ params }: PageProps) {
  const { subpage } = await params;

  let template = undefined;
  let pageTitle = "";
  try {
    const [t, pages] = await Promise.all([
      api.getActiveTemplateForPage(subpage).catch(() => null),
      api.getPages().catch(() => []),
    ]);
    template = t;
    const matchedPage = pages.find((p) => p.slug === subpage);
    pageTitle = matchedPage?.title || "";
  } catch (err) {
    console.error(`Failed to load active template/page for ${subpage}:`, err);
  }

  if (!template) {
    notFound();
  }

  const sections = template?.rawSections || {};
  const formattedTitle =
    pageTitle ||
    subpage
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  const canonical = `https://jivanjor.com/about/${subpage}`;

  const fallback: FallbackSeoData = {
    pageSchemaType: "AboutPage",
    title: `${formattedTitle} | Jivanjor`,
    description:
      "Learn more about Jivanjor woodworking adhesives, research R&D facilities, performance quality, TVCs, and our presence.",
    canonical,
    breadcrumbs: [
      { name: "Home", url: "https://jivanjor.com/" },
      { name: "About Us", url: "https://jivanjor.com/about" },
      { name: formattedTitle, url: canonical },
    ],
  };

  const { schemaConfig } = await getResolvedSeoAndSchema(
    "static",
    subpage,
    fallback,
    [subpage, `about_${subpage}`, `about-${subpage}`]
  );

  return (
    <>
      <JsonLdScript config={schemaConfig} />
      <AboutUs data={sections} subpageTitle={pageTitle} />
    </>
  );
}
