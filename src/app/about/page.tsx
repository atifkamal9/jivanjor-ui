import AboutUs from "@/components/about/AboutUs";
import { getServerActiveTemplateForPage } from "@/lib/server-api";
import { Metadata } from "next";
import JsonLdScript from "@/components/seo/JsonLdScript";
import { getResolvedSeoAndSchema } from "@/lib/seo-helper";

export const dynamic = "force-dynamic";

const ABOUT_FALLBACK = {
  pageSchemaType: "AboutPage" as const,
  title: "A Trusted Name in Woodworking Adhesives | Jivanjor",
  description:
    "Learn more about Jivanjor, our woodworking adhesives, innovation and commitment to sustainability.",
  canonical: "https://jivanjor.com/about",
  breadcrumbs: [
    { name: "Home", url: "https://jivanjor.com/" },
    { name: "A Trusted Name in Woodworking Adhesives", url: "https://jivanjor.com/about" },
  ],
};

export async function generateMetadata(): Promise<Metadata> {
  const { metadata } = await getResolvedSeoAndSchema("static", "about", ABOUT_FALLBACK);
  return metadata;
}

export default async function AboutPage() {
  let template = undefined;
  try {
    template = await getServerActiveTemplateForPage("about");
  } catch (err) {
    console.error("Failed to load active about template from server:", err);
  }

  const sections = template?.rawSections || {};
  const { schemaConfig } = await getResolvedSeoAndSchema("static", "about", ABOUT_FALLBACK);

  return (
    <>
      <JsonLdScript config={schemaConfig} />
      <AboutUs data={sections} />
    </>
  );
}
