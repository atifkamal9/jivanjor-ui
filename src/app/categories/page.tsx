import { api, Category } from "@/lib/api";
import { Suspense } from "react";
import { Hero, MainCategories, RightChoice } from "@/components/categories";
import JsonLdScript from "@/components/seo/JsonLdScript";
import { getResolvedSeoAndSchema, FallbackSeoData } from "@/lib/seo-helper";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

const CATEGORIES_HUB_FALLBACK: FallbackSeoData = {
  pageSchemaType: "CollectionPage",
  title: "Browse Woodworking Adhesive Categories | Jivanjor",
  description:
    "Explore Jivanjor's specialized adhesive categories: Super Premium, Speciality, Regular, Waterproof Grade, and Wood Ancillaries.",
  canonical: "https://jivanjor.com/categories",
  breadcrumbs: [
    { name: "Home", url: "https://jivanjor.com/" },
    { name: "Categories", url: "https://jivanjor.com/categories" },
  ],
  itemList: [
    {
      name: "Super Premium Adhesives",
      url: "https://jivanjor.com/categories/super-premium",
    },
    {
      name: "Speciality Adhesives",
      url: "https://jivanjor.com/categories/speciality",
    },
    {
      name: "Regular Adhesives",
      url: "https://jivanjor.com/categories/regular",
    },
    {
      name: "Waterproof Grade Adhesives",
      url: "https://jivanjor.com/categories/waterproof",
    },
    {
      name: "Wood Ancillaries",
      url: "https://jivanjor.com/categories/wood-ancillaries",
    },
  ],
};

export async function generateMetadata(): Promise<Metadata> {
  const { metadata } = await getResolvedSeoAndSchema(
    "static",
    "categories",
    CATEGORIES_HUB_FALLBACK,
    ["categories", "categories-hub"]
  );
  return metadata;
}

export default async function Categories() {
  let templateData: any = undefined;
  let categoriesList: Category[] = [];

  try {
    const [template, cats] = await Promise.all([
      api.getActiveTemplateForPage("categories").catch(() => null),
      api.getCategories().catch(() => []),
    ]);
    templateData = template;
    categoriesList = cats.filter((c) => c.isVisible !== false && !c.hideInMenu);
  } catch (err) {
    console.error("Failed to fetch active categories template:", err);
  }
  const sections = templateData?.rawSections || templateData?.sections || {};

  const dynamicItemList =
    categoriesList.length > 0
      ? categoriesList.map((c) => ({
          name: c.name,
          url: `https://jivanjor.com/categories/${c.slug}`,
        }))
      : CATEGORIES_HUB_FALLBACK.itemList;

  const fallback: FallbackSeoData = {
    ...CATEGORIES_HUB_FALLBACK,
    itemList: dynamicItemList,
  };

  const { schemaConfig } = await getResolvedSeoAndSchema(
    "static",
    "categories",
    fallback,
    ["categories", "categories-hub"]
  );

  return (
    <main className="min-h-screen relative bg-background font-google-sans overflow-x-clip">
      <JsonLdScript config={schemaConfig} />
      <Suspense fallback={<div className="min-h-screen" />}>
        <Hero />
        <MainCategories />
      </Suspense>
      <RightChoice data={sections.rightChoice || sections.findAdhesive} />
    </main>
  );
}
