"use client";

import { useEffect, useState } from "react";
import { api, BlogPost } from "@/lib/api";
import { BlogHero, BlogContent } from "@/components/blog";
import { RelatedArticle } from "@/components/blog/BlogContent";

interface BlogPostClientProps {
  slug: string;
}

const DEFAULT_BLOG_POSTS: BlogPost[] = [
  {
    id: "def-1",
    title: "How to Fix Trapped Air Bubbles Under Laminates for Good",
    slug: "how-to-fix-trapped-air-bubbles-under-laminates-for-good",
    content: "Bubbles in laminate applications rarely happen by chance; they are the direct result of trapped air or moisture expanding beneath the surface.",
    category: "Application Tips",
    tags: ["Laminates", "Adhesives"],
    author: "Jivanjor Product Experts",
    image: "/images/blog/Rectangle 140.png",
    publish_date: "2026-07-01",
  },
  {
    id: "def-2",
    title: "How to Properly Acclimatize Wood and Laminates Before Bonding",
    slug: "how-to-properly-acclimatize-wood-and-laminates-before-bonding",
    category: "Application Tips",
    tags: ["Woodworking", "Tips"],
    author: "Jivanjor Product Experts",
    content: "Wood and laminates are hygroscopic materials that expand and contract. Learn how proper acclimatization prevents warped panels.",
    image: "/images/blog/Rectangle 142.png",
    publish_date: "2026-07-01",
  },
  {
    id: "def-3",
    title: "Choosing the Right Notched Trowel for Consistent Adhesive Spread",
    slug: "choosing-the-right-notched-trowel-for-consistent-adhesive-spread",
    category: "Application Tips",
    tags: ["Tools", "Application"],
    author: "Jivanjor Product Experts",
    content: "Using the correct notch size ensures an even glue film, reducing excess moisture and minimizing the risk of laminate bubbling.",
    image: "/images/blog/Rectangle 141.png",
    publish_date: "2026-07-01",
  },
  {
    id: "def-4",
    title: "Best Practices for Center-to-Edge Pressing in Plywood Applications",
    slug: "best-practices-for-center-to-edge-pressing-in-plywood-applications",
    category: "Application Tips",
    tags: ["Plywood", "Pressing"],
    author: "Jivanjor Product Experts",
    content: "A step-by-step guide to using J-rollers and pressing blocks to systematically force out trapped air during bonding.",
    image: "/images/blog/Rectangle 143.png",
    publish_date: "2026-07-01",
  },
];

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
        const dbPosts = await api.getBlogPosts().catch(() => []);
        const allPosts = Array.isArray(dbPosts) && dbPosts.length > 0 ? dbPosts : DEFAULT_BLOG_POSTS;

        const normalizedSlug = slug.toLowerCase().trim();
        const found = allPosts.find(
          (p) =>
            p.slug === slug ||
            (p.slug || "").toLowerCase() === normalizedSlug ||
            p.title.toLowerCase().replace(/\s+/g, "-") === normalizedSlug ||
            p.id === slug
        ) || DEFAULT_BLOG_POSTS.find(
          (p) =>
            p.slug === slug ||
            (p.slug || "").toLowerCase() === normalizedSlug ||
            p.title.toLowerCase().replace(/\s+/g, "-") === normalizedSlug
        );

        if (found) {
          setPostData(found);

          let candidatePosts = allPosts.filter(
            (p) =>
              p.id !== found.id &&
              p.slug !== found.slug &&
              p.title.toLowerCase().trim() !== found.title.toLowerCase().trim()
          );

          if (candidatePosts.length < 3) {
            const extraDefaults = DEFAULT_BLOG_POSTS.filter(
              (d) =>
                d.id !== found.id &&
                d.slug !== found.slug &&
                d.title.toLowerCase().trim() !== found.title.toLowerCase().trim() &&
                !candidatePosts.some(
                  (cp) => cp.slug === d.slug || cp.title.toLowerCase().trim() === d.title.toLowerCase().trim()
                )
            );
            candidatePosts = [...candidatePosts, ...extraDefaults];
          }

          const mappedRelated: RelatedArticle[] = candidatePosts.slice(0, 3).map((p) => ({
            title: p.title,
            desc: p.content
              ? p.content.replace(/<[^>]*>/g, "").slice(0, 150) + "..."
              : "",
            image: p.image || "/images/blog/Rectangle 142.png",
            slug: p.slug || p.title.toLowerCase().replace(/\s+/g, "-"),
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
