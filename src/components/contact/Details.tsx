import { Phone, Mail, Clock, MapPin } from "lucide-react";
import Image from "next/image";
import { ContactSection } from "@/lib/api";
import { Heading, Title, Paragraph } from "@/components/ui";

const defaultSections: ContactSection[] = [
  {
    title: "Customer Support",
    details: [
      {
        label: "Phone",
        value: "1800-XXX-XXX",
        icon: "/images/Phone-call.svg",
      },
      {
        label: "Email",
        value: "support@jivanjor.com",
        icon: "/images/Mail-one.svg",
      },
      {
        label: "Hours",
        value: "Mon-Sat, 9:00 AM – 6:00 PM",
        icon: "/images/Alarm-clock.svg",
      },
    ],
  },
  {
    title: "Corporate Headquarters",
    details: [
      {
        label: "Address",
        value: "1234, Address Street",
        icon: "/images/Pin.svg",
      },
      {
        label: "Hours",
        value: "Mon-Sat, 9:00 AM – 6:00 PM",
        icon: "/images/Alarm-clock.svg",
      },
    ],
  },
];

interface DetailsProps {
  mainHeading?: string;
  sections?: ContactSection[];
}

export default function Details({
  mainHeading = "We are always happy to assist you.",
  sections = defaultSections,
}: DetailsProps) {
  const displaySections = sections && sections.length > 0 ? sections : defaultSections;

  const renderIcon = (iconStr: string, label: string) => {
    if (!iconStr) {
      return <Phone className="w-6 h-6 text-[#772571]" />;
    }
    if (iconStr.startsWith("/") || iconStr.startsWith("http")) {
      return (
        <Image
          src={iconStr}
          className="aspect-square object-contain"
          alt={label || "Icon"}
          width={30}
          height={30}
        />
      );
    }
    const lower = iconStr.toLowerCase();
    if (lower.includes("phone")) return <Phone className="w-6 h-6 text-[#772571]" />;
    if (lower.includes("mail") || lower.includes("email")) return <Mail className="w-6 h-6 text-[#772571]" />;
    if (lower.includes("clock") || lower.includes("hour") || lower.includes("time")) return <Clock className="w-6 h-6 text-[#772571]" />;
    if (lower.includes("pin") || lower.includes("address") || lower.includes("map")) return <MapPin className="w-6 h-6 text-[#772571]" />;
    return <Phone className="w-6 h-6 text-[#772571]" />;
  };

  return (
    <section className="flex flex-col items-center lg:items-start text-center lg:text-start max-w-xl px-5 space-y-5 text-[#222]">
      {/* Title */}
      <Heading className="text-[28px] sm:text-3xl lg:text-[38px]">
        {mainHeading || "We are always happy to assist you."}
      </Heading>
      <main className="flex flex-col my-6 gap-8 w-full">
        {displaySections.map((section, idx) => (
          <div key={idx} className="flex flex-col space-y-4">
            <Title className="font-google-sans font-bold text-xl lg:text-2xl text-left">
              {section.title}
            </Title>
            <div className="flex flex-col gap-4">
              {section.details && section.details.map((item, itemIdx) => (
                <div
                  key={itemIdx}
                  className="flex items-start text-lg lg:text-2xl w-full"
                >
                  {/* Icon */}
                  <div className="flex items-center w-6.5 h-6.5 pr-2 shrink-0">
                    {renderIcon(item.icon, item.label)}
                  </div>
                  {/* Label & Value Container */}
                  <div className="flex flex-row flex-1 text-left">
                    <span className="w-24 sm:w-32 lg:w-36 font-normal shrink-0">
                      {item.label}
                    </span>
                    <span className="flex-1 font-normal">{item.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </main>
    </section>
  );
}
