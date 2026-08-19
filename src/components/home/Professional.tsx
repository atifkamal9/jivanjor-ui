import Image from "next/image";
import { Heading, Title } from "@/components/ui";

interface ProfessionalProps {
  data?: {
    title?: string;
    bgImage?: string;
    image?: string;
    bgImageMobile?: string;
    imageMobile?: string;
    items?: Array<{
      title?: string;
      name?: string;
      icon?: string;
    }>;
  };
}

function mapFeatureIcon(index: number) {
  const icons = [
    "/images/Asterisk.png",
    "/images/Up-and-down.png",
    "/images/Connection-point.png",
    "/images/Tag.png",
  ];
  return icons[index % icons.length];
}

export default function Professional({ data }: ProfessionalProps) {
  const title = data?.title || "Why Professionals Trust Jivanjor";
  const bgImage = data?.bgImage || data?.image || "/images/Professional.png";
  const bgImageMobile = data?.bgImageMobile || data?.imageMobile || "/images/Professional-mobile.png";
  const items = data?.items || [];

  const defaultFeatures = [
    { icon: "/images/Asterisk.png", title: "Consistent Quality" },
    { icon: "/images/Up-and-down.png", title: "Ease of Application" },
    { icon: "/images/Connection-point.png", title: "Range of Products" },
    { icon: "/images/Tag.png", title: "Preferred by Experts" },
  ];

  const features =
    items && items.length > 0
      ? items.slice(0, 4).map((item, idx) => ({
        icon: item.icon && item.icon.trim() !== "" ? item.icon : mapFeatureIcon(idx),
        title: item.title || item.name || defaultFeatures[idx % 4].title,
      }))
      : defaultFeatures;

  return (
    <section className="mx-auto max-w-360 text-center px-5 mt-8 md:mt-12">
      <Heading className="font-normal leading-normal mb-0 md:mb-7.5">{title}</Heading>
      <div className="grid grid-cols-2 lg:grid-cols-4 items-center justify-center bg-transparent lg:bg-surface gap-12 p-8 lg:pt-12 pb-16! lg:px-20 rounded-2xl">
        {features.map((f, idx) => (
          <div
            key={`${f.title}-${idx}`}
            className="flex flex-col items-center mx-auto space-y-4 max-w-40"
          >
            <div className="w-10 h-10 relative flex items-center justify-center">
              <Image src={f.icon} alt={f.title} width={40} height={40} className="object-contain" unoptimized />
            </div>
            <Title className="!text-lg 2xl:!text-2xl leading-normal">
              {f.title}
            </Title>
          </div>
        ))}
      </div>
      <div className="-mt-6">
        <Image
          src={bgImage}
          alt="Professional using Jivanjor adhesive"
          width={1200}
          height={800}
          priority
          unoptimized
          className="hidden lg:block w-full h-auto object-cover rounded-2xl"
        />
        <Image
          src={bgImageMobile}
          alt="Professional using Jivanjor adhesive mobile"
          width={1200}
          height={800}
          priority
          unoptimized
          className="block lg:hidden w-full h-auto object-cover rounded-2xl"
        />
      </div>
    </section>
  );
}
