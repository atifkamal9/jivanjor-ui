import { BlogHero, BlogContent } from "@/components/blog";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogDetail({ params }: PageProps) {
  const { slug } = await params;

  // Emulating retrieval of dates from backend database
  const publishDate = "2026-07-01";
  const lastUpdated = "2026-07-09";

  return (
    <main className="min-h-screen relative bg-background font-google-sans overflow-x-clip pb-10">
      <BlogHero />
      <BlogContent publishDate={publishDate} lastUpdated={lastUpdated} />
    </main>
  );
}
