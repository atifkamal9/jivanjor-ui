"use client";

import Image from "next/image";
import ContactForm, { ContactFormProps } from "@/components/contact/ContactForm";
import { Heading, Subtitle, Title, Paragraph } from "@/components/ui";

interface ReachLeftProps {
  data?: {
    title?: string;
    appText?: string;
    promoImage?: string;
    playStoreLink?: string;
    cards?: { title: string; desc: string; icon: string }[];
  };
}

const defaultCards = [
  {
    title: "Reliable Product Range",
    desc: "Work with adhesives made for superior performance across every woodworking need.",
    icon: "/images/about/Ad-product.svg",
  },
  {
    title: "Trade-Focused Support",
    desc: "Get product information, application guidance and support to recommend with confidence.",
    icon: "/images/about/Spanner.svg",
  },
  {
    title: "Business Growth Opportunity",
    desc: "Connect with a growing adhesive brand that supports contractors, carpenters and channel partners across markets.",
    icon: "/images/contractor/Positive-dynamics.svg",
  },
];

export function ReachLeft({ data }: ReachLeftProps) {
  const title =
    data?.title ||
    "Step into the realm of Champions and Unlock a world of limitless advantages.";
  const appText =
    data?.appText ||
    "Download the Jivanjor Achievers Club App to enrol, access contractor benefits, track rewards and stay connected.";
  const promoImage =
    data?.promoImage || "/images/contractor/contractor-app-promo.png";
  const playStoreLink = data?.playStoreLink || "https://play.google.com/store";
  const cards = data?.cards || defaultCards;

  const renderIcon = (icon: any) => {
    if (typeof icon === "string") {
      const isInvert = icon.includes("Ad-product") || icon.includes("Spanner");
      return (
        <Image
          src={icon}
          className={`aspect-square w-10 h-10 ${isInvert ? "invert brightness-0" : ""}`}
          height={40}
          width={40}
          alt="icon"
        />
      );
    }
    return icon;
  };

  return (
    <div className="flex flex-col space-y-6 text-[#222]">
      <Heading className="text-center md:text-start leading-tight">
        {title}
      </Heading>
      {/* Top section: Text, Download button and Promo Image */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        {/* App text */}
        <div className="hidden md:block col-span-7 max-w-md space-y-4">
          <Subtitle className="leading-relaxed">{appText}</Subtitle>
          <div>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={playStoreLink}
              className="inline-block transition-transform hover:scale-105"
            >
              <Image
                src="/images/contractor/google-play-badge.png"
                alt="Get it on Google Play"
                width={150}
                height={45}
                className="object-contain"
              />
            </a>
          </div>
        </div>

        {/* Promo Image */}
        <div className="md:col-span-5 relative w-full h-51 md:h-55 rounded-[20px] overflow-hidden shadow-md">
          <Image
            fill
            src={promoImage}
            alt="Jivanjor Achievers Club App"
            className="object-cover"
          />
        </div>

        <div className="flex flex-col items-center text-center md:hidden space-y-4 max-w-85 mx-auto">
          <Subtitle className="leading-relaxed">{appText}</Subtitle>
          <div>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={playStoreLink}
              className="inline-block transition-transform hover:scale-105"
            >
              <Image
                src="/images/contractor/google-play-badge.png"
                alt="Get it on Google Play"
                width={150}
                height={45}
                className="object-contain"
              />
            </a>
          </div>
        </div>
      </div>

      {/* Feature Cards Box */}
      <div className="w-full bg-linear-to-r from-[#E7071C] to-[#772571] text-white rounded-[20px] p-10 md:p-12 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center justify-center">
          {cards.map((card, index) => (
            <div
              key={index}
              className="flex flex-1 flex-col items-center text-center transition-all duration-300 max-w-60.5"
            >
              <div className="flex items-center justify-center mb-4 md:mb-5">
                {renderIcon(card.icon)}
              </div>
              <Title as="h3" className="mb-2.5 md:mb-5 text-white">
                {card.title}
              </Title>
              <Paragraph className="opacity-90 text-white">{card.desc}</Paragraph>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ReachForm(props: ContactFormProps = {}) {
  return (
    <ContactForm
      defaultQueryType="Contractor Connect App"
      formType="CONTRACTOR"
      {...props}
    />
  );
}

export default function Reach() {
  return (
    <section className="relative max-w-360 mx-auto w-full px-5 lg:px-8 hd:px-12 3xl:px-8 pt-5 lg:pt-14">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
        {/* Left Column */}
        <div className="lg:col-span-8">
          <ReachLeft />
        </div>

        {/* Right Column (Sticky Form) */}
        <div className="lg:col-span-4 lg:sticky lg:top-28 lg:self-start z-30">
          <ReachForm />
        </div>
      </div>
    </section>
  );
}
