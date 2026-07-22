import { Metadata } from "next";
import { api } from "@/lib/api";
import BlogPostClient from "./BlogPostClient";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const dbPosts = await api.getBlogPosts();
    const post = dbPosts.find(
      (p) => p.slug === slug || p.title.toLowerCase().replace(/\s/g, "-") === slug
    );
    if (!post) return {};

    const allSeo = await api.getSeoMetadata();
    const seo = allSeo.find((s) => s.page_type === "blog" && s.page_id === post.id);

    return {
      title: seo?.meta_title || `${post.title} | Jivanjor Blog`,
      description: seo?.meta_description || (post.content ? post.content.replace(/<[^>]*>/g, "").slice(0, 150) + "..." : undefined),
      alternates: {
        canonical: seo?.canonical_url || `https://jivanjor.com/blog/${post.slug}`,
      },
      openGraph: {
        title: seo?.meta_title || post.title,
        description: seo?.meta_description || (post.content ? post.content.replace(/<[^>]*>/g, "").slice(0, 150) + "..." : undefined),
        images: seo?.image || post.image ? [{ url: seo?.image || post.image || "" }] : undefined,
      },
    };
  } catch (err) {
    console.error("Failed to generate metadata for blog post:", err);
    return {};
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  return <BlogPostClient slug={slug} />;
}
