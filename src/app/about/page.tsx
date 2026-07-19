import AboutUs from "@/components/about/AboutUs";
import { api } from "@/lib/api";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  let matchedSeo = undefined;
  try {
    const [seos, pages] = await Promise.all([
      api.getSeoMetadata(),
      api.getPages()
    ]);
    const aboutPage = pages.find(p => p.slug === "about");
    matchedSeo = seos.find((s) =>
      s.page_type === "static" &&
      (s.page_id === "ABOUT_PAGE" || s.page_id === "about" || (aboutPage && s.page_id === aboutPage.id))
    );
  } catch (err) {
    console.error("Failed to load SEO metadata for about page:", err);
  }

  const title = matchedSeo?.meta_title || "About Us | Jivanjor";
  const description = matchedSeo?.meta_description || "Learn more about Jivanjor, our woodworking adhesives, innovation and commitment to sustainability.";
  const canonical = matchedSeo?.canonical_url || "https://jivanjor.vercel.app/about";

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      images: matchedSeo?.image ? [{ url: matchedSeo.image }] : undefined,
    }
  };
}

export default async function AboutPage() {
  let template = undefined;
  try {
    template = await api.getActiveTemplateForPage("about");
  } catch (err) {
    console.error("Failed to load active about template from server:", err);
  }

  const sections = template?.rawSections || {};

  return <AboutUs data={sections} />;
}
