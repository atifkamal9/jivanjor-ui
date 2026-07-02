import {
  Hero,
  ReachLeft,
  ReachForm,
  Presence,
  Professionals,
} from "@/components/contractor";
import { RightChoice } from "@/components/categories";

export default function ContractorPage() {
  return (
    <main className="min-h-screen relative bg-background font-google-sans overflow-x-clip">
      <Hero />
      {/* Main Grid Wrapper */}
      <div className="max-w-360 mx-auto w-full px-5 lg:px-8 py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          {/* Left Column (App, Stats, Testimonials) */}
          <div className="lg:col-span-8 flex flex-col space-y-12 lg:space-y-18">
            <ReachLeft />
            <Presence />
            <Professionals />
          </div>

          {/* Right Column (Sticky Form) */}
          <div className="lg:col-span-4 w-full lg:sticky lg:top-28 lg:self-start z-30">
            <ReachForm />
          </div>
        </div>
      </div>

      <RightChoice />
    </main>
  );
}
