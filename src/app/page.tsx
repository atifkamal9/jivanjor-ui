import {
  Ecosystem,
  Hero,
  KnowledgeHub,
  ProductRange,
  Professional,
  RightChoice,
  Testimonial,
} from "@/components/home";
import { getServerActiveTemplateForPage, getServerPage } from "@/lib/server-api";
import { api } from "@/lib/api";
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
  let template: any = undefined;
  let pageData: any = undefined;

  try {
    const [t, p] = await Promise.all([
      getServerActiveTemplateForPage("home").catch(() => null),
      getServerPage("home").catch(() => null),
    ]);
    template = t;
    pageData = p;
  } catch (err) {
    console.error("Failed to load active homepage data from server-api:", err);
  }

  // Resilient fallback to Axios client methods if server-api returned null
  if (!pageData) {
    try {
      const [p, pages] = await Promise.all([
        api.getPageById("home").catch(() => null),
        api.getPages().catch(() => []),
      ]);
      pageData = p || pages.find((pg: any) => pg.slug === "home" || pg.id === "home");
    } catch (err) {
      console.error("Failed to fallback load pageData:", err);
    }
  }

  if (!template) {
    try {
      template = await api.getActiveTemplateForPage("home").catch(() => null);
    } catch (err) {
      console.error("Failed to fallback load template:", err);
    }
  }

  const safeParseSections = (data: any) => {
    if (!data) return undefined;
    if (typeof data === "object") return data;
    if (typeof data === "string") {
      try {
        return JSON.parse(data);
      } catch {
        return undefined;
      }
    }
    return undefined;
  };

  const rawPageSections = safeParseSections(pageData?.sections);
  const rawTemplateSections =
    safeParseSections(template?.rawSections) || safeParseSections(template?.sections);

  // Custom page configuration saved from Admin > Dynamic Page takes precedence
  const sections = {
    ...(rawTemplateSections || {}),
    ...(rawPageSections || {}),
  };
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
