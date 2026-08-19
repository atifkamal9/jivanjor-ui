import { api } from "@/lib/api";
import {
  CategoryDetailClient,
  RightChoice,
} from "@/components/categories";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function Categories({ params }: PageProps) {
  const { slug } = await params;

  let categoryData: any = undefined;
  let parentCategoryData: any = undefined;
  let templateData: any = undefined;
  try {
    const [cats, template] = await Promise.all([
      api.getCategories(),
      api.getActiveTemplateForPage("categories").catch(() => null)
    ]);
    categoryData = cats.find((c) => c.slug === slug && c.isVisible !== false && !c.hideInMenu);
    if (categoryData && categoryData.parent_category) {
      parentCategoryData = cats.find((c) => c.id === categoryData.parent_category && c.isVisible !== false && !c.hideInMenu);
      if (!parentCategoryData) {
        categoryData = undefined;
      }
    }
    templateData = template;
  } catch (err) {
    console.error("Failed to fetch category details in SSR:", err);
  }

  const sections = templateData?.rawSections || templateData?.sections || {};

  const researchSection = categoryData ? {
    title: categoryData.researchTitle || sections.research?.title,
    desc: categoryData.researchDescription || sections.research?.desc,
    ctaText: categoryData.researchCtaText || sections.research?.ctaText,
    ctaLink: categoryData.researchCtaLink || sections.research?.ctaLink,
    image1: categoryData.researchImage1 || sections.research?.images?.[0],
    image2: categoryData.researchImage2 || sections.research?.images?.[1],
  } : (sections.research || sections);

  const categoryRightChoice = categoryData?.rightChoiceTitle ? {
    title: categoryData.rightChoiceTitle,
    subtitle: categoryData.rightChoiceSubtitle,
    ctaText: categoryData.rightChoiceCtaText,
    ctaLink: categoryData.rightChoiceCtaLink,
  } : (categoryData?.rightChoice || sections.rightChoice || sections.findAdhesive);

  return (
    <main className="min-h-screen relative bg-background font-google-sans overflow-x-clip">
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
