import Image from "next/image";
import { ContactForm, Details, Hero } from "@/components/contact";

export default function ContactPage() {
  return (
    <main className="min-h-screen relative bg-background font-google-sans overflow-x-clip lg:mb-33">
      <Hero />
      <div className="lg:hidden md:mt-10">
        <ContactForm />
      </div>
      {/* Main Grid Wrapper */}
      <div className="max-w-360 mx-auto w-full px-5 lg:px-8 py-10 lg:py-13">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-8 lg:gap-14">
          {/* Left Column (App, Stats, Testimonials) */}
          <div className="flex flex-col w-full lg:w-1/2 space-y-12 lg:space-y-18">
            <Details />
          </div>

          {/* Right Column (Sticky Form) */}
          <div className="hidden lg:flex w-1/2 lg:sticky lg:top-22 lg:self-start z-30">
            <ContactForm />
          </div>
        </div>
      </div>
      {/* Watermark */}
      <div className="hidden lg:block absolute translate-x-[-15%] -bottom-50 left-0 pointer-events-none min-h-120 min-w-3xl max-w-4xl">
        <Image
          fill
          alt="watermark"
          src="/images/watermark-contact.svg"
          className="object-contain h-full w-full"
        />
      </div>
    </main>
  );
}
