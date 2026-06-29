import { Hero, List } from "@/components/blog";
import { RightChoice } from "@/components/categories";

export default function BlogPage() {
  return (
    <main className="min-h-screen relative bg-background font-google-sans overflow-x-clip">
      <Hero />
      <List />
      <RightChoice />
    </main>
  );
}
