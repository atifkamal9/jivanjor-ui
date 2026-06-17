import Image from "next/image";
import Gallery from "./Gallery";

interface EcosystemProps {
  data?: {
    title?: string;
    subtitle?: string;
    items?: any[];
  };
  ctaData?: {
    title?: string;
    subtitle?: string;
    ctaText?: string;
    ctaLink?: string;
  };
}

export default function Ecosystem({ data, ctaData }: EcosystemProps) {
  const title = data?.title || "Built Around India’s Woodworking Professionals";
  const subtitle = data?.subtitle || "Jivanjor continues to grow through the trust of carpenters, contractors, dealers and channel partners across India’s woodworking ecosystem.";
  
  const ctaTitle = ctaData?.title || "Grow Your Business With a Trusted Adhesive";
  const ctaSubtitle = ctaData?.subtitle || "Work with a growing brand trusted by woodworking professionals, dealers and channel partners.";
  const ctaText = ctaData?.ctaText || "Partner With Us";
  const ctaLink = ctaData?.ctaLink || "#";

  return (
    <section className="relative bg-surface pt-20">
      <div className="mx-auto max-w-360 justify-center px-6">
        <div className="mx-auto max-w-4xl space-y-6 text-center w-full">
          <h2 className="font-amethysta text-4xl md:text-5xl lg:text-6xl">
            {title}
          </h2>
          <p className="text-2xl font-google-sans leading-normal">
            {subtitle}
          </p>
        </div>
        <Gallery items={data?.items} />
      </div>
      <div className="relative p-10 my-10 bg-linear-to-r from-[#FF0009] to-[#772571] text-white">
        {/* watermark */}
        <div className="absolute bottom-0 right-0 pointer-events-none">
          <Image
            src="/images/watermark.png"
            alt="watermark"
            width={900}
            height={450}
            className="w-full"
          />
        </div>
        <div className="mx-auto max-w-360 justify-center space-y-6 ">
          <h2 className="font-amethysta text-4xl md:text-[42px]">
            {ctaTitle}
          </h2>
          <div className="flex flex-col items-start justify-between lg:flex-row gap-4">
            <p className="text-2xl max-w-xl font-google-sans leading-normal">
              {ctaSubtitle}
            </p>
            <a href={ctaLink} className="inline-flex items-center justify-center font-medium text-base rounded-full min-w-50 px-6 py-2 border border-spacing-1.5 border-white text-center hover:bg-white/10 transition-colors">
              {ctaText}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
