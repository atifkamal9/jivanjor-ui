import { PartnerLayout } from "@/components/partner";
import { getServerActiveTemplateForPage } from "@/lib/server-api";
import { Metadata } from "next";
import JsonLdScript from "@/components/seo/JsonLdScript";
import { getResolvedSeoAndSchema } from "@/lib/seo-helper";

export const dynamic = "force-dynamic";

const PARTNER_FALLBACK = {
  pageSchemaType: "WebPage" as const,
  title: "Become a Jivanjor Dealer | Jivanjor",
  description:
    "Build your dealership with a growing distribution network. Join the Jivanjor partner network today.",
  canonical: "https://jivanjor.com/partner",
  breadcrumbs: [
    { name: "Home", url: "https://jivanjor.com/" },
    { name: "Become a Jivanjor Dealer", url: "https://jivanjor.com/partner" },
  ],
};

export async function generateMetadata(): Promise<Metadata> {
  const { metadata } = await getResolvedSeoAndSchema("static", "partner", PARTNER_FALLBACK);
  return metadata;
}

export default async function PartnerPage() {
  let template = undefined;
  try {
    template = await getServerActiveTemplateForPage("partner");
  } catch (err) {
    console.error("Failed to load active partner template from server:", err);
  }

  const sections = template?.rawSections || {};
  const { schemaConfig } = await getResolvedSeoAndSchema("static", "partner", PARTNER_FALLBACK);

  return (
    <>
      <JsonLdScript config={schemaConfig} />
      <PartnerLayout data={sections} />
    </>
  );
}
