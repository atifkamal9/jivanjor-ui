import { Hero, Reach, Presence, Professionals } from "@/components/contractor";
import { RightChoice } from "@/components/categories";

export default function ContractorPage() {
  return (
    <main className="min-h-screen relative bg-background font-google-sans overflow-x-clip">
      <Hero />
      <Reach />
      <Presence />
      <Professionals />
      <RightChoice />
    </main>
  );
}
