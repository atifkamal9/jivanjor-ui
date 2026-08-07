import { Suspense } from "react";
import { api } from "@/lib/api";
import { ApplicationsLayout } from "@/components/applications";

export const dynamic = "force-dynamic";

export default async function ApplicationsPage() {
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

  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <ApplicationsLayout
        data={sections}
        pageSlug="applications"
        pageTitle={matchedPage?.title || "Furniture & Woodwork Adhesive Solutions"}
        pageDescription={matchedPage?.description}
      />
    </Suspense>
  );
}
