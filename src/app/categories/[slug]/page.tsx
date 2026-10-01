import { api, Product, Category } from "@/lib/api";
import {
  CategoryDetailClient,
  RightChoice,
} from "@/components/categories";
import JsonLdScript from "@/components/seo/JsonLdScript";
import { getResolvedSeoAndSchema, FallbackSeoData } from "@/lib/seo-helper";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const cats = await api.getCategories().catch(() => []);
    const cat = cats.find((c) => c.slug === slug);
    const catName = cat?.name || "Product Category";
    const canonical = `https://jivanjor.com/categories/${slug}`;

    const fallback: FallbackSeoData = {
      pageSchemaType: "CollectionPage",
      title: `${catName} | Jivanjor`,
      description: cat?.description || `Explore ${catName} range of woodworking adhesives by Jivanjor.`,
      canonical,
      breadcrumbs: [
        { name: "Home", url: "https://jivanjor.com/" },
        { name: "Categories", url: "https://jivanjor.com/categories" },
        { name: catName, url: canonical },
      ],
    };

    const { metadata } = await getResolvedSeoAndSchema(
      "category",
      cat?.id || slug,
      fallback
    );
    return metadata;
  } catch (err) {
    console.error("Failed to generate category metadata:", err);
    return {
      title: "Product Category | Jivanjor",
      alternates: {
        canonical: `https://jivanjor.com/categories/${slug}`,
      },
    };
  }
}

export default async function Categories({ params }: PageProps) {
  const { slug } = await params;

  let categoryData: any = undefined;
  let parentCategoryData: any = undefined;
  let templateData: any = undefined;
  let categoryProducts: Product[] = [];

  try {
    const [cats, prods, template] = await Promise.all([
      api.getCategories().catch(() => []),
      api.getProducts().catch(() => []),
      api.getActiveTemplateForPage("categories").catch(() => null),
    ]);
    categoryData = cats.find(
      (c) => c.slug === slug && c.isVisible !== false && !c.hideInMenu
    );
    if (categoryData && categoryData.parent_category) {
      parentCategoryData = cats.find(
        (c) =>
          c.id === categoryData.parent_category &&
          c.isVisible !== false &&
          !c.hideInMenu
      );
      if (!parentCategoryData) {
        categoryData = undefined;
      }
    }
    if (categoryData) {
      categoryProducts = prods.filter(
        (p) => p.category_id === categoryData.id && p.isVisible !== false
      );
    }
    templateData = template;
  } catch (err) {
    console.error("Failed to fetch category details in SSR:", err);
  }

  const sections = templateData?.rawSections || templateData?.sections || {};

  const researchSection = categoryData
    ? {
        title: categoryData.researchTitle || sections.research?.title,
        desc: categoryData.researchDescription || sections.research?.desc,
        ctaText: categoryData.researchCtaText || sections.research?.ctaText,
        ctaLink: categoryData.researchCtaLink || sections.research?.ctaLink,
        image1: categoryData.researchImage1 || sections.research?.images?.[0],
        image2: categoryData.researchImage2 || sections.research?.images?.[1],
      }
    : sections.research || sections;

  const categoryRightChoice = categoryData?.rightChoiceTitle
    ? {
        title: categoryData.rightChoiceTitle,
        subtitle: categoryData.rightChoiceSubtitle,
        ctaText: categoryData.rightChoiceCtaText,
        ctaLink: categoryData.rightChoiceCtaLink,
      }
    : categoryData?.rightChoice ||
      sections.rightChoice ||
      sections.findAdhesive;

  const canonicalUrl = `https://jivanjor.com/categories/${slug}`;
  const categoryTitle = categoryData?.name || "Product Category";
  const categoryDescription =
    categoryData?.description ||
    "Browse adhesives by category and performance rating.";

  const itemList = categoryProducts.map((p) => ({
    name: p.name,
    url: `https://jivanjor.com/products?product=${p.slug}`,
  }));

  const fallback: FallbackSeoData = {
    pageSchemaType: "CollectionPage",
    canonical: canonicalUrl,
    title: `${categoryTitle} | Jivanjor`,
    description: categoryDescription,
    breadcrumbs: [
      { name: "Home", url: "https://jivanjor.com/" },
      { name: "Categories", url: "https://jivanjor.com/categories" },
      { name: categoryTitle, url: canonicalUrl },
    ],
    itemList: itemList.length > 0 ? itemList : undefined,
  };

  const { schemaConfig } = await getResolvedSeoAndSchema(
    "category",
    categoryData?.id || slug,
    fallback
  );

  return (
    <main className="min-h-screen relative bg-background font-google-sans overflow-x-clip">
      <JsonLdScript config={schemaConfig} />
      <CategoryDetailClient
        initialCategory={categoryData}
        initialParentCategory={parentCategoryData}
        slug={slug}
        data={researchSection}
      />
      <RightChoice data={categoryRightChoice} />
    </main>
  );
}
