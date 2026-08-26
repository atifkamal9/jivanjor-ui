"use client";

import Image from "next/image";
import ContactForm, { ContactFormProps } from "@/components/contact/ContactForm";
import { Heading, Subtitle, Title, Paragraph } from "@/components/ui";

interface ReachLeftProps {
  data?: {
    title?: string;
    desc?: string;
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
  const title = data?.title || "Become A Jivanjor Dealer";
  const desc =
    data?.desc ||
    "Jivanjor gives dealers access to a wide adhesive portfolio, professional market demand and the support needed to serve contractors, carpenters and end users with confidence.";
  const displayCards = data?.cards || defaultCards;

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
      <Subtitle className="max-w-175 text-center md:text-start">
        {desc}
      </Subtitle>
      {/* Feature Cards Box */}
      <Heading className="text-center md:text-start px-10 md:px-0">
        {title}
      </Heading>
      <div className="w-full bg-linear-to-r from-[#772571] to-[#E7071C] text-white rounded-[20px] p-10 md:p-12 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center justify-center">
          {displayCards.map((card, index) => (
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
      defaultQueryType="Dealer Enrolment"
      formType="DEALER"
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
