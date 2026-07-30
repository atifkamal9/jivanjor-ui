import { Hero, Categories } from "@/components/resources";
import { RightChoice } from "@/components/categories";

export default function Resources() {
  return (
    <main className="min-h-screen relative bg-background font-google-sans overflow-x-clip">
      <Hero />
      <Categories />
      <RightChoice />
    </main>
  );
}
