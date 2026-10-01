import { Hero, Categories } from "@/components/resources";
import { RightChoice } from "@/components/categories";
import JsonLdScript from "@/components/seo/JsonLdScript";
import { getResolvedSeoAndSchema, FallbackSeoData } from "@/lib/seo-helper";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

const RESOURCES_FALLBACK: FallbackSeoData = {
  pageSchemaType: "CollectionPage",
  title: "Jivanjor Technical Resources | Jivanjor",
  description:
    "Download technical data sheets, brochures, certificates, and application manuals for Jivanjor woodworking adhesives.",
  canonical: "https://jivanjor.com/resources",
  breadcrumbs: [
    { name: "Home", url: "https://jivanjor.com/" },
    { name: "Technical Resources", url: "https://jivanjor.com/resources" },
  ],
};

export async function generateMetadata(): Promise<Metadata> {
  const { metadata } = await getResolvedSeoAndSchema(
    "static",
    "resources",
    RESOURCES_FALLBACK
  );
  return metadata;
}

export default async function Resources() {
  const { schemaConfig } = await getResolvedSeoAndSchema(
    "static",
    "resources",
    RESOURCES_FALLBACK
  );

  return (
    <main className="min-h-screen relative bg-background font-google-sans overflow-x-clip">
      <JsonLdScript config={schemaConfig} />
      <Hero />
      <Categories />
      <RightChoice />
    </main>
  );
}
