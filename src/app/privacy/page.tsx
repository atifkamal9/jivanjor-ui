import { Content, Hero } from "@/components/privacy";
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
    const privacyPage = pages.find(p => p.slug === "privacy");
    matchedSeo = seos.find((s) =>
      s.page_type === "static" &&
      (s.page_id === "PRIVACY_PAGE" || s.page_id === "privacy" || (privacyPage && s.page_id === privacyPage.id))
    );
  } catch (err) {
    console.error("Failed to load SEO metadata for privacy page:", err);
  }

  const title = matchedSeo?.meta_title || "Privacy Policy | Jivanjor";
  const description = matchedSeo?.meta_description || "Read Jivanjor's privacy policy and data protection practices.";
  const canonical = matchedSeo?.canonical_url || "https://jivanjor.vercel.app/privacy";

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

export default async function PrivacyPage() {
  let template = undefined;
  try {
    template = await api.getActiveTemplateForPage("privacy");
  } catch (err) {
    console.error("Failed to load active privacy template from server:", err);
  }

  const sections = template?.rawSections || {};

  return (
    <main className="min-h-screen relative bg-background font-google-sans overflow-x-clip">
      <Hero data={sections.hero} />
      <Content data={sections.content} />
    </main>
  );
}
