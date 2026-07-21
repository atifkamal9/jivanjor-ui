import { api } from "@/lib/api";
import { BlogLayout } from "@/components/blog";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function BlogPage({ searchParams }: PageProps) {
  const { category } = await searchParams;

  let template = null;
  try {
    template = await api.getActiveTemplateForPage("blog");
  } catch (err) {
    console.error("Failed to load active template for blog page:", err);
  }

  const sections = template?.rawSections || template?.sections || null;

  return <BlogLayout data={sections} initialCategory={category} />;
}
