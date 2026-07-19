import { api } from "@/lib/api";
import { ApplicationsLayout } from "@/components/applications";

export const dynamic = "force-dynamic";

export default async function ApplicationsPage() {
  let template = null;
  try {
    template = await api.getActiveTemplateForPage("applications");
  } catch (err) {
    console.error("Failed to load active template for page applications:", err);
  }

  const sections = template?.rawSections || template?.sections || null;

  return <ApplicationsLayout data={sections} />;
}
