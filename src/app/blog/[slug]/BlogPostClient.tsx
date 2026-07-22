"use client";

import { useEffect, useState } from "react";
import { api, BlogPost } from "@/lib/api";
import { BlogHero, BlogContent } from "@/components/blog";
import { RelatedArticle } from "@/components/blog/BlogContent";

interface BlogPostClientProps {
  slug: string;
}

export default function BlogPostClient({ slug }: BlogPostClientProps) {
  const [postData, setPostData] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<RelatedArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function loadPostData() {
      try {
        setLoading(true);
        setError(false);
        const dbPosts = await api.getBlogPosts();
        const found = dbPosts.find(
          (p) => p.slug === slug || p.title.toLowerCase().replace(/\s/g, "-") === slug
        );

        if (found) {
          setPostData(found);
          const otherPosts = dbPosts.filter(
            (p) => p.id !== found.id && p.slug !== slug
          );
          const mappedRelated: RelatedArticle[] = otherPosts.slice(0, 3).map((p) => ({
            title: p.title,
            desc: p.content
              ? p.content.replace(/<[^>]*>/g, "").slice(0, 150) + "..."
              : "",
            image: p.image || "/images/blog/Rectangle 142.png",
            slug: p.slug,
          }));
          setRelatedPosts(mappedRelated);
        } else {
          setPostData(null);
          setRelatedPosts([]);
        }
      } catch (err) {
        console.error("Failed to load blog post by slug:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    loadPostData();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <p className="mt-4 text-lg font-semibold text-foreground/60 font-google-sans">
          Loading blog details...
        </p>
      </div>
    );
  }

  const publishDate = postData?.publish_date || "";
  const lastUpdated = postData?.updated_at || postData?.updatedAt || postData?.publish_date || "";

  return (
    <main className="min-h-screen relative bg-background font-google-sans overflow-x-clip pb-10">
      <BlogHero title={postData?.title} category={postData?.category} />
      <BlogContent
        publishDate={publishDate}
        lastUpdated={lastUpdated}
        articleData={postData}
        relatedPosts={relatedPosts}
      />
    </main>
  );
}
