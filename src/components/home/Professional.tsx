import Image from "next/image";
import { Heading } from "@/components/ui";

interface ProfessionalProps {
  data?: {
    title?: string;
    subtitle?: string;
    items?: Array<{
      title?: string;
      name?: string;
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
  const title = data?.title || "Why Professional Trust Jivanjor";
  const items = data?.items || [];

  const defaultFeatures = [
    { icon: "/images/Asterisk.png", title: "Consistent Quality" },
    { icon: "/images/Up-and-down.png", title: "Ease of Application" },
    { icon: "/images/Connection-point.png", title: "Range of Products" },
    { icon: "/images/Tag.png", title: "Preferred by Experts" },
  ];

  const features =
    items && items.length > 0
      ? items.map((item, idx) => ({
          icon: mapFeatureIcon(idx),
          title: item.title || item.name || "",
        }))
      : defaultFeatures;

  return (
    <section className="mx-auto max-w-360 text-center px-5 mt-8 md:mt-12">
      <Heading className="mb-0 md:mb-7.5">{title}</Heading>
      <div className="grid grid-cols-2 lg:grid-cols-4 items-center justify-center bg-transparent lg:bg-surface gap-12 p-8 lg:pt-12 pb-16! lg:px-20 rounded-2xl">
        {features.map((f) => (
          <div
            key={f.title}
            className="flex flex-col items-center mx-auto space-y-4 max-w-40"
          >
            <Image src={f.icon} alt={f.title} width={40} height={40} />
            <h3 className="font-amethysta text-xl lg:text-3xl leading-normal">
              {f.title}
            </h3>
          </div>
        ))}
      </div>
      <div className="-mt-6">
        <Image
          src="/images/Professional.png"
          alt="Professional using Jivanjor adhesive"
          width={1200}
          height={800}
          priority
          className="hidden lg:block w-full h-auto object-cover rounded-2xl"
        />
        <Image
          src="/images/Professional-mobile.png"
          alt="Professional using Jivanjor adhesive"
          width={1200}
          height={800}
          priority
          className="block lg:hidden w-full h-auto object-cover rounded-2xl"
        />
      </div>
    </section>
  );
}
