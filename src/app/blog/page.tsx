import { api } from "@/lib/api";
import { BlogLayout, BlogHero, BlogContent } from "@/components/blog";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ article?: string }>;
}

export default async function BlogPage({ searchParams }: PageProps) {
  const { article } = await searchParams;

  if (article) {
    // Render the default blog post details
    const publishDate = "2026-07-01";
    const lastUpdated = "2026-07-09";

    return (
      <main className="min-h-screen relative bg-background font-google-sans overflow-x-clip pb-10">
        <BlogHero />
        <BlogContent publishDate={publishDate} lastUpdated={lastUpdated} />
      </main>
    );
  }

  let template = null;
  try {
    template = await api.getActiveTemplateForPage("blog");
  } catch (err) {
    console.error("Failed to load active template for blog page:", err);
  }

  const sections = template?.rawSections || template?.sections || null;

  return <BlogLayout data={sections} />;
}
