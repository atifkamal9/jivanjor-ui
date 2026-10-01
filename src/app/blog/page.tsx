import { api, BlogPost } from "@/lib/api";
import { BlogLayout } from "@/components/blog";
import JsonLdScript from "@/components/seo/JsonLdScript";
import { getResolvedSeoAndSchema, FallbackSeoData } from "@/lib/seo-helper";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ category?: string }>;
}

const BLOG_HUB_FALLBACK: FallbackSeoData = {
  pageSchemaType: "CollectionPage",
  title: "Woodworking Adhesive Knowledge Hub | Jivanjor",
  description:
    "Read expert advice, application guides, and industry insights on woodworking adhesives and carpentry.",
  canonical: "https://jivanjor.com/blog",
  breadcrumbs: [
    { name: "Home", url: "https://jivanjor.com/" },
    { name: "Blog", url: "https://jivanjor.com/blog" },
  ],
};

export async function generateMetadata(): Promise<Metadata> {
  const { metadata } = await getResolvedSeoAndSchema("static", "blog", BLOG_HUB_FALLBACK);
  return metadata;
}

export default async function BlogPage({ searchParams }: PageProps) {
  const { category } = await searchParams;

  let template = null;
  let blogsList: BlogPost[] = [];
  try {
    const [t, posts] = await Promise.all([
      api.getActiveTemplateForPage("blog").catch(() => null),
      api.getBlogPosts().catch(() => []),
    ]);
    template = t;
    blogsList = posts;
  } catch (err) {
    console.error("Failed to load active template for blog page:", err);
  }

  const sections = template?.rawSections || template?.sections || null;

  const itemList =
    blogsList.length > 0
      ? blogsList.slice(0, 10).map((b) => ({
          name: b.title,
          url: `https://jivanjor.com/blog/${b.slug}`,
        }))
      : undefined;

  const fallback: FallbackSeoData = {
    ...BLOG_HUB_FALLBACK,
    itemList,
  };

  const { schemaConfig } = await getResolvedSeoAndSchema("static", "blog", fallback);

  return (
    <>
      <JsonLdScript config={schemaConfig} />
      <BlogLayout data={sections} initialCategory={category} />
    </>
  );
}
