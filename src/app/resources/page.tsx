import { Hero, Categories, RightChoice } from "@/components/resources";

export default function Resources() {
  return (
    <main className="min-h-screen relative bg-background font-google-sans overflow-x-clip">
      <Hero />
      <Categories />
      <RightChoice />
    </main>
  );
}
