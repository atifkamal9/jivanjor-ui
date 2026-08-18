import Image from "next/image";
import Gallery from "./Gallery";
import { Heading } from "@/components/ui";

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
  const subtitle =
    data?.subtitle ||
    "Jivanjor continues to grow through the trust of carpenters, contractors, dealers and channel partners across India’s woodworking ecosystem.";

  const ctaTitle =
    ctaData?.title || "Grow Your Business With a Trusted Adhesive";
  const ctaSubtitle =
    ctaData?.subtitle ||
    "Work with a growing brand trusted by woodworking professionals, dealers and channel partners.";
  const ctaText = ctaData?.ctaText || "Partner With Us";
  const ctaLink = ctaData?.ctaLink || "#";

  return (
    <section className="relative bg-surface mt-8 sm:mt-12 leading-normal">
      <div className="mx-auto max-w-360 justify-center px-5 pt-4">
        <div className="mx-auto space-y-4 md:space-y-6 text-center w-full px-4 py-6">
          <Heading className="max-w-2xl mx-auto text-center`">{title}</Heading>
          <p className="text-lg md:text-2xl font-google-sans min-w-xs max-w-3xl mx-auto text-center">
            {subtitle}
          </p>
          <a
            href={ctaLink}
            className="md:hidden inline-flex items-center justify-center font-medium min-w-35 px-6 py-2 rounded-3xl text-sm bg-linear-to-br from-[#FF0009] to-[#772571] text-white hover:opacity-90 transition-opacity text-center"
          >
            {ctaText}
          </a>
        </div>
        <Gallery items={data?.items} images={(data as any)?.images} />
      </div>
      <div className="hidden xl:block relative p-12.5 bg-linear-to-r from-[#FF0009] to-[#772571] text-white">
        {/* watermark */}
        <div className="absolute bottom-0 right-0 max-w-[1140px] min-w-[500px] h-full pointer-events-none">
          <Image
            src="/images/watermark-choice.svg"
            alt="watermark"
            width={900}
            height={480}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="mx-auto max-w-360 justify-center px-6 space-y-6">
          <h2 className="font-amethysta text-3xl md:text-[34px]">{ctaTitle}</h2>
          <div className="flex flex-col items-start justify-between lg:flex-row gap-4">
            <p className="text-xl max-w-xl font-google-sans">{ctaSubtitle}</p>
            <a
              href={ctaLink}
              className="inline-flex items-center justify-center font-medium text-base rounded-full min-w-50 px-6 py-2 border border-spacing-1.5 border-white text-center hover:bg-white/10 transition-colors"
            >
              {ctaText}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
