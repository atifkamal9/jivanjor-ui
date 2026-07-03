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
      <div className="xl:hidden">
        <ReachForm />
      </div>
      {/* Main Grid Wrapper */}
      <div className="max-w-360 mx-auto w-full px-5 lg:px-8 py-10 lg:py-16">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 xl:gap-14 items-start">
          {/* Left Column (App, Stats, Testimonials) */}
          <div className="xl:col-span-8 flex flex-col space-y-12 xl:space-y-18">
            <ReachLeft />
            <Presence />
            <Professionals />
          </div>

          {/* Right Column (Sticky Form) */}
          <div className="hidden xl:block xl:col-span-4 w-full xl:sticky xl:top-28 xl:self-start z-30">
            <ReachForm />
          </div>
        </div>
      </div>
      <RightChoice />
    </main>
  );
}
