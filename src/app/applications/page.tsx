import { RightChoice } from "@/components/categories";
import { FQAs, Hero, List, RelatedProducts } from "@/components/applications";

export default function ApplicationsPage() {
  return (
    <main className="min-h-screen relative bg-background font-google-sans overflow-x-clip">
      <Hero />
      <List />
      <RelatedProducts />
      <FQAs />
      <div className="hidden md:block">
        <RightChoice />
      </div>
    </main>
  );
}
