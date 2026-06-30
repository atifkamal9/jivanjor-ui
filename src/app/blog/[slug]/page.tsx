import { BlogHero, BlogContent } from "@/components/blog";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogDetail({ params }: PageProps) {
  const { slug } = await params;

  return (
    <main className="min-h-screen relative bg-background font-google-sans overflow-x-clip pb-10">
      <BlogHero />
      <BlogContent />
    </main>
  );
}
