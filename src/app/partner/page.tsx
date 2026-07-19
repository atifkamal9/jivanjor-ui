import { PartnerLayout } from "@/components/partner";
import { api } from "@/lib/api";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  let matchedSeo = undefined;
  try {
    const [seos, pages] = await Promise.all([
      api.getSeoMetadata(),
      api.getPages()
    ]);
    const partnerPage = pages.find(p => p.slug === "partner");
    matchedSeo = seos.find((s) =>
      s.page_type === "static" &&
      (s.page_id === "PARTNER_PAGE" || s.page_id === "partner" || (partnerPage && s.page_id === partnerPage.id))
    );
  } catch (err) {
    console.error("Failed to load SEO metadata for partner page:", err);
  }

  const title = matchedSeo?.meta_title || "Become a Dealer | Jivanjor";
  const description = matchedSeo?.meta_description || "Build your dealership with a growing distribution network. Join the Jivanjor partner network today.";
  const canonical = matchedSeo?.canonical_url || "https://jivanjor.vercel.app/partner";

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

export default async function PartnerPage() {
  let template = undefined;
  try {
    template = await api.getActiveTemplateForPage("partner");
  } catch (err) {
    console.error("Failed to load active partner template from server:", err);
  }

  const sections = template?.rawSections || {};

  return <PartnerLayout data={sections} />;
}
