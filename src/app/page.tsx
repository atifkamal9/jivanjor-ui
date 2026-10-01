import {
  Ecosystem,
  Hero,
  KnowledgeHub,
  ProductRange,
  Professional,
  RightChoice,
  Testimonial,
} from "@/components/home";
import { getServerActiveTemplateForPage } from "@/lib/server-api";
import JsonLdScript from "@/components/seo/JsonLdScript";
import { getResolvedSeoAndSchema } from "@/lib/seo-helper";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

const HOME_FALLBACK = {
  pageSchemaType: "WebPage" as const,
  title: "Jivanjor - Premium Woodworking Adhesives & Bonding Solutions",
  description:
    "Leading manufacturer of premium wood adhesives, waterproofing, and specialized bonding solutions in India.",
  canonical: "https://jivanjor.com/",
};

export async function generateMetadata(): Promise<Metadata> {
  const { metadata } = await getResolvedSeoAndSchema("home", "home", HOME_FALLBACK);
  return metadata;
}

export default async function Home() {
  let template = undefined;
  try {
    template = await getServerActiveTemplateForPage("home");
  } catch (err) {
    console.error("Failed to load active homepage template from server:", err);
  }

  const sections = template?.rawSections || {};
  const { schemaConfig } = await getResolvedSeoAndSchema("home", "home", HOME_FALLBACK);

  return (
    <div className="font-google-sans min-h-screen bg-background text-foreground">
      <JsonLdScript config={schemaConfig} />
      <Hero data={sections.hero} />
      <ProductRange data={sections.productRange || sections.adhesiveRange} />
      <RightChoice data={sections.findAdhesive} />
      <Professional data={sections.whyTrustUs} />
      <Ecosystem data={sections.showcaseGrid} ctaData={sections.ctaPromo} />
      <Testimonial data={sections.testimonials} />
      <KnowledgeHub data={sections.knowledgeBase} />
    </div>
  );
}
