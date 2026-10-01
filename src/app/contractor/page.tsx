import { ContractorLayout } from "@/components/contractor";
import { getServerActiveTemplateForPage } from "@/lib/server-api";
import { Metadata } from "next";
import JsonLdScript from "@/components/seo/JsonLdScript";
import { getResolvedSeoAndSchema } from "@/lib/seo-helper";

export const dynamic = "force-dynamic";

const CONTRACTOR_FALLBACK = {
  pageSchemaType: "WebPage" as const,
  title: "Jivanjor Contractor Connect | Jivanjor",
  description:
    "Build your business with India's trusted adhesive partner. Download Jivanjor Achievers Club App.",
  canonical: "https://jivanjor.com/contractor",
  breadcrumbs: [
    { name: "Home", url: "https://jivanjor.com/" },
    { name: "Jivanjor Contractor Connect", url: "https://jivanjor.com/contractor" },
  ],
};

export async function generateMetadata(): Promise<Metadata> {
  const { metadata } = await getResolvedSeoAndSchema("static", "contractor", CONTRACTOR_FALLBACK);
  return metadata;
}

export default async function ContractorPage() {
  let template = undefined;
  try {
    template = await getServerActiveTemplateForPage("contractor");
  } catch (err) {
    console.error("Failed to load active contractor template from server:", err);
  }

  const sections = template?.rawSections || {};
  const { schemaConfig } = await getResolvedSeoAndSchema("static", "contractor", CONTRACTOR_FALLBACK);

  return (
    <>
      <JsonLdScript config={schemaConfig} />
      <ContractorLayout data={sections} />
    </>
  );
}
