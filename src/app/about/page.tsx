import { Metadata } from "next";
import AboutUs from "@/components/about";
import { api } from "@/lib/api";

export const metadata: Metadata = {
  title: "About Us | Jivanjor",
  description: "Learn more about Jivanjor, our promise of stronger bonds, research & innovation, sustainability practices, market presence, and television commercials.",
};

export const dynamic = "force-dynamic";

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

