import { Metadata } from "next";
import { api, BlogPost } from "@/lib/api";
import BlogPostClient from "./BlogPostClient";
import JsonLdScript from "@/components/seo/JsonLdScript";
import { getResolvedSeoAndSchema, FallbackSeoData } from "@/lib/seo-helper";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const dbPosts = await api.getBlogPosts().catch(() => []);
    const post = dbPosts.find(
      (p) =>
        p.slug?.toLowerCase() === slug.toLowerCase() ||
        p.title.toLowerCase().replace(/\s+/g, "-") === slug.toLowerCase() ||
        p.id === slug
    );

    const postTitle = post?.title || slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
    const canonical = `https://jivanjor.com/blog/${post?.slug || slug}`;
    const description =
      post?.tldr ||
      (post?.content
        ? post.content.replace(/<[^>]*>/g, "").slice(0, 150) + "..."
        : `Read ${postTitle} on the Jivanjor Woodworking Knowledge Hub.`);

    const fallback: FallbackSeoData = {
      pageSchemaType: "WebPage",
      title: `${postTitle} | Jivanjor Blog`,
      description,
      canonical,
      image: post?.image,
      breadcrumbs: [
        { name: "Home", url: "https://jivanjor.com/" },
        { name: "Blog", url: "https://jivanjor.com/blog" },
        { name: postTitle, url: canonical },
      ],
    };

    const { metadata } = await getResolvedSeoAndSchema(
      "blog",
      post?.id || slug,
      fallback,
      [post?.id, post?.slug, post?.title, slug]
    );
    return metadata;
  } catch (err) {
    console.error("Failed to generate metadata for blog post:", err);
    return {
      title: "Blog Article | Jivanjor",
      alternates: {
        canonical: `https://jivanjor.com/blog/${slug}`,
      },
    };
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;

  let post: BlogPost | undefined = undefined;
  try {
    const dbPosts = await api.getBlogPosts().catch(() => []);
    post = dbPosts.find(
      (p) =>
        p.slug?.toLowerCase() === slug.toLowerCase() ||
        p.title.toLowerCase().replace(/\s+/g, "-") === slug.toLowerCase() ||
        p.id === slug
    );
  } catch (e) {
    console.error("Failed to fetch blog post in SSR:", e);
  }

  const postTitle = post?.title || slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  const canonical = `https://jivanjor.com/blog/${post?.slug || slug}`;
  const description =
    post?.tldr ||
    (post?.content
      ? post.content.replace(/<[^>]*>/g, "").slice(0, 150) + "..."
      : `Read ${postTitle} on the Jivanjor Woodworking Knowledge Hub.`);

  const fallback: FallbackSeoData = {
    pageSchemaType: "WebPage",
    title: `${postTitle} | Jivanjor Blog`,
    description,
    canonical,
    image: post?.image,
    breadcrumbs: [
      { name: "Home", url: "https://jivanjor.com/" },
      { name: "Blog", url: "https://jivanjor.com/blog" },
      { name: postTitle, url: canonical },
    ],
  };

  const { schemaConfig } = await getResolvedSeoAndSchema(
    "blog",
    post?.id || slug,
    fallback,
    [post?.id, post?.slug, post?.title, slug]
  );

  return (
    <>
      <JsonLdScript config={schemaConfig} />
      <BlogPostClient slug={slug} />
    </>
  );
}
