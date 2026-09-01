import { api } from "@/lib/api";
import { Suspense } from "react";
import { Hero, MainCategories, RightChoice } from "@/components/categories";

export default async function Categories() {
  let templateData: any = undefined;
  try {
    templateData = await api.getActiveTemplateForPage("categories").catch(() => null);
  } catch (err) {
    console.error("Failed to fetch active categories template:", err);
  }
  const sections = templateData?.rawSections || templateData?.sections || {};

  return (
    <main className="min-h-screen relative bg-background font-google-sans overflow-x-clip">
      <Suspense fallback={<div className="min-h-screen" />}>
        <Hero />
        <MainCategories />
      </Suspense>
      <RightChoice data={sections.rightChoice || sections.findAdhesive} />
    </main>
  );
}
