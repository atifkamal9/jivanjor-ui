import { Suspense } from "react";
import { api } from "@/lib/api";
import { ApplicationsLayout } from "@/components/applications";
import JsonLdScript from "@/components/seo/JsonLdScript";
import { getResolvedSeoAndSchema, FallbackSeoData } from "@/lib/seo-helper";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

interface ApplicationsPageProps {
  searchParams?: Promise<{ article?: string }>;
}

const APPROVED_GUIDES = [
  {
    name: "Furniture Assembly & Joinery",
    slug: "furniture-assembly-%26-joinery",
    url: "https://jivanjor.com/applications?article=furniture-assembly-%26-joinery",
  },
  {
    name: "Lamination & Veneering",
    slug: "lamination-%26-veneering",
    url: "https://jivanjor.com/applications?article=lamination-%26-veneering",
  },
  {
    name: "Edge Banding & Finishing",
    slug: "edge-banding-%26-finishing",
    url: "https://jivanjor.com/applications?article=edge-banding-%26-finishing",
  },
  {
    name: "Wooden Cabinets & Storage Units",
    slug: "wooden-cabinets-%26-storage-units",
    url: "https://jivanjor.com/applications?article=wooden-cabinets-%26-storage-units",
  },
  {
    name: "Repair & Restoration",
    slug: "repair-%26-restoration",
    url: "https://jivanjor.com/applications?article=repair-%26-restoration",
  },
  {
    name: "Small Assembly & Detail Work",
    slug: "small-assembly-%26-detail-work",
    url: "https://jivanjor.com/applications?article=small-assembly-%26-detail-work",
  },
];

const APPLICATIONS_HUB_FALLBACK: FallbackSeoData = {
  pageSchemaType: "CollectionPage",
  title: "Furniture and Woodwork Adhesive Solutions | Jivanjor",
  description:
    "Explore Jivanjor's woodworking adhesive applications: furniture assembly, lamination, edge banding, kitchen cabinets, and repair.",
  canonical: "https://jivanjor.com/applications",
  breadcrumbs: [
    { name: "Home", url: "https://jivanjor.com/" },
    { name: "Applications", url: "https://jivanjor.com/applications" },
  ],
  itemList: APPROVED_GUIDES.map((g) => ({ name: g.name, url: g.url })),
};

export async function generateMetadata({
  searchParams,
}: ApplicationsPageProps): Promise<Metadata> {
  const params = searchParams ? await searchParams : {};
  const articleSlug = params.article;

  if (articleSlug) {
    const matched = APPROVED_GUIDES.find(
      (g) =>
        g.slug.toLowerCase() === articleSlug.toLowerCase() ||
        g.name.toLowerCase().replace(/[^a-z0-9]/g, "-") ===
          articleSlug.toLowerCase()
    );
    const guideTitle = matched?.name || articleSlug;
    const canonical = `https://jivanjor.com/applications?article=${articleSlug}`;

    const fallback: FallbackSeoData = {
      pageSchemaType: "WebPage",
      title: `${guideTitle} | Jivanjor`,
      description: `Comprehensive woodworking application guide for ${guideTitle}.`,
      canonical,
      breadcrumbs: [
        { name: "Home", url: "https://jivanjor.com/" },
        { name: "Applications", url: "https://jivanjor.com/applications" },
        { name: guideTitle, url: canonical },
      ],
    };

    const { metadata } = await getResolvedSeoAndSchema(
      "use_case",
      articleSlug,
      fallback,
      [articleSlug, guideTitle, matched?.slug]
    );
    return metadata;
  }

  const { metadata } = await getResolvedSeoAndSchema(
    "static",
    "applications",
    APPLICATIONS_HUB_FALLBACK,
    ["applications", "applications-hub"]
  );
  return metadata;
}

export default async function ApplicationsPage({
  searchParams,
}: ApplicationsPageProps) {
  const params = searchParams ? await searchParams : {};
  const articleSlug = params.article;

  let template = null;
  let matchedPage = null;
  try {
    const [t, pages] = await Promise.all([
      api.getActiveTemplateForPage("applications").catch(() => null),
      api.getPages().catch(() => []),
    ]);
    template = t;
    matchedPage = pages.find((p) => p.slug === "applications");
  } catch (err) {
    console.error("Failed to load active template for page applications:", err);
  }

  const sections = template?.rawSections || template?.sections || null;

  let schemaConfig;

  if (articleSlug) {
    const matched = APPROVED_GUIDES.find(
      (g) =>
        g.slug.toLowerCase() === articleSlug.toLowerCase() ||
        g.name.toLowerCase().replace(/[^a-z0-9]/g, "-") ===
          articleSlug.toLowerCase()
    );
    const guideName = matched ? matched.name : articleSlug;
    const canonical = `https://jivanjor.com/applications?article=${articleSlug}`;

    const fallback: FallbackSeoData = {
      pageSchemaType: "WebPage",
      canonical,
      title: `${guideName} | Jivanjor`,
      description: `Application guide on ${guideName} using Jivanjor adhesives.`,
      breadcrumbs: [
        { name: "Home", url: "https://jivanjor.com/" },
        { name: "Applications", url: "https://jivanjor.com/applications" },
        { name: guideName, url: canonical },
      ],
    };

    const res = await getResolvedSeoAndSchema(
      "use_case",
      articleSlug,
      fallback,
      [articleSlug, guideName, matched?.slug]
    );
    schemaConfig = res.schemaConfig;
  } else {
    const fallback: FallbackSeoData = {
      ...APPLICATIONS_HUB_FALLBACK,
      description: matchedPage?.description || APPLICATIONS_HUB_FALLBACK.description,
    };

    const res = await getResolvedSeoAndSchema(
      "static",
      "applications",
      fallback,
      ["applications", "applications-hub"]
    );
    schemaConfig = res.schemaConfig;
  }

  return (
    <>
      <JsonLdScript config={schemaConfig} />
      <Suspense fallback={<div className="min-h-screen" />}>
        <ApplicationsLayout
          data={sections}
          pageSlug="applications"
          pageTitle={
            matchedPage?.title || "Furniture & Woodwork Adhesive Solutions"
          }
          pageDescription={matchedPage?.description}
        />
      </Suspense>
    </>
  );
}
