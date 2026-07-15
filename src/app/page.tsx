import {
  Ecosystem,
  Hero,
  KnowledgeHub,
  ProductRange,
  Professional,
  RightChoice,
  Testimonial,
} from "@/components/home";
import { api } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function Home() {
  let template = undefined;
  try {
    template = await api.getActiveTemplateForPage("home");
  } catch (err) {
    console.error("Failed to load active homepage template from server:", err);
  }

  const sections = template?.rawSections || {};

  return (
    <div className="font-google-sans min-h-screen bg-background text-foreground">
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
