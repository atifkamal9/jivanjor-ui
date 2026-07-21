import Image from "next/image";
import { api } from "@/lib/api";
import {
  HeroCategory,
  ProductCategories,
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
    categoryData = cats.find((c) => c.slug === slug);
    if (categoryData && categoryData.parent_category) {
      parentCategoryData = cats.find((c) => c.id === categoryData.parent_category);
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

  return (
    <main className="min-h-screen relative bg-background font-google-sans overflow-x-clip">
      <HeroCategory category={categoryData} parentCategory={parentCategoryData} />
      <div className="relative w-full">
        {/* Watermark */}
        <Image
          src="/images/Watermark 9.png"
          alt="watermark"
          width={580}
          height={682}
          className="hidden lg:block absolute top-[22%] -right-2 pointer-events-none"
        />
        <ProductCategories category={slug} data={researchSection} />
      </div>
      <RightChoice />
    </main>
  );
}
