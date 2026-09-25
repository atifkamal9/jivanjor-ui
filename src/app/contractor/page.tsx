import { ContractorLayout } from "@/components/contractor";
import { api } from "@/lib/api";
import { getServerActiveTemplateForPage } from "@/lib/server-api";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  let matchedSeo = undefined;
  try {
    const [seos, pages] = await Promise.all([
      api.getSeoMetadata(),
      api.getPages()
    ]);
    const contractorPage = pages.find(p => p.slug === "contractor");
    matchedSeo = seos.find((s) =>
      s.page_type === "static" &&
      (s.page_id === "CONTRACTOR_PAGE" || s.page_id === "contractor" || (contractorPage && s.page_id === contractorPage.id))
    );
  } catch (err) {
    console.error("Failed to load SEO metadata for contractor page:", err);
  }

  const title = matchedSeo?.meta_title || "Contractor Connect | Jivanjor";
  const description = matchedSeo?.meta_description || "Build your business with India's trusted adhesive partner. Download Jivanjor Achievers Club App.";
  const canonical = matchedSeo?.canonical_url || "https://jivanjor.vercel.app/contractor";

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

export default async function ContractorPage() {
  let template = undefined;
  try {
    template = await getServerActiveTemplateForPage("contractor");
  } catch (err) {
    console.error("Failed to load active contractor template from server:", err);
  }

  const sections = template?.rawSections || {};

  return <ContractorLayout data={sections} />;
}
