import { Content, Hero } from "@/components/privacy";
import { api } from "@/lib/api";
import { Metadata } from "next";
import JsonLdScript from "@/components/seo/JsonLdScript";
import { getResolvedSeoAndSchema, FallbackSeoData } from "@/lib/seo-helper";

export const dynamic = "force-dynamic";

const PRIVACY_FALLBACK: FallbackSeoData = {
  pageSchemaType: "WebPage",
  title: "Jivanjor Privacy Policy | Jivanjor",
  description:
    "Read Jivanjor's privacy policy and data protection practices.",
  canonical: "https://jivanjor.com/privacy",
};

export async function generateMetadata(): Promise<Metadata> {
  const { metadata } = await getResolvedSeoAndSchema(
    "static",
    "privacy",
    PRIVACY_FALLBACK
  );
  return metadata;
}

export default async function PrivacyPage() {
  let template = undefined;
  try {
    template = await api.getActiveTemplateForPage("privacy");
  } catch (err) {
    console.error("Failed to load active privacy template from server:", err);
  }

  const sections = template?.rawSections || {};
  const { schemaConfig } = await getResolvedSeoAndSchema(
    "static",
    "privacy",
    PRIVACY_FALLBACK
  );

  return (
    <main className="min-h-screen relative bg-background font-google-sans overflow-x-clip">
      <JsonLdScript config={schemaConfig} />
      <Hero data={sections.hero} />
      <Content data={sections.content} />
    </main>
  );
}
