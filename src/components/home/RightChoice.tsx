import Image from "next/image";
import { Heading } from "@/components/ui";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

interface RightChoiceProps {
  data?: {
    title?: string;
    bgImage?: string;
    bgImageMobile?: string;
    items?: Array<{
      name?: string;
      title?: string;
      icon?: string;
      link?: string;
    }>;
  };
}

function mapAdhesiveIcon(index: number) {
  const icons = [
    "/icons/chair.png",
    "/icons/cabinet.png",
    "/icons/woodfloor.png",
    "/icons/wooden plank.png",
    "/icons/checklist.png",
    "/icons/house.png",
  ];
  return icons[index % icons.length];
}

export default function RightChoice({ data }: RightChoiceProps) {
  const title = data?.title || "Find The Right Adhesive";
  const bgImage = data?.bgImage || "/images/Rectangle 5.png";
  const bgImageMobile = data?.bgImageMobile || "/images/Rectangle 5 (1).png";
  const items = data?.items || [];

  const defaultAdhesiveTypes = [
    { icon: "/icons/chair.png", title: "Furniture and Woodwork", link: "/applications" },
    {
      icon: "/icons/cabinet.png",
      title: "Kitchen Cabinets & Storage",
      link: "/applications",
    },
    {
      icon: "/icons/woodfloor.png",
      title: "Laminates & Surface Finishings",
      link: "/applications",
    },
    {
      icon: "/icons/wooden plank.png",
      title: "Moisture-Prone Woodwork",
      link: "/applications",
    },
    {
      icon: "/icons/checklist.png",
      title: "PVC, Acrylic & Edge Finishing",
      link: "/applications",
    },
    {
      icon: "/icons/house.png",
      title: "Home Repairs & Special Fixing",
      link: "/applications",
    },
  ];

  const types =
    items && items.length > 0
      ? items.slice(0, 6).map((item, idx) => ({
        icon: item.icon && item.icon.trim() !== "" ? item.icon : mapAdhesiveIcon(idx),
        title: item.name || item.title || defaultAdhesiveTypes[idx % 6].title,
        link: item.link || "/applications",
      }))
      : defaultAdhesiveTypes;

  return (
    <section className="relative overflow-hidden min-h-217 lg:min-h-150">
      <div className="absolute inset-0 bg-linear-to-r from-[#772571] to-[#FF0009] h-21 lg:hidden" />
      <div className="absolute inset-0 top-21 lg:top-0">
        <Image
          src={bgImage}
          className="hidden lg:block object-fill"
          alt="Right Choice Background"
          priority
          unoptimized
          fill
        />
        <Image
          src={bgImageMobile}
          className="object-fill lg:hidden"
          alt="Right Choice Background Mobile"
          priority
          unoptimized
          fill
        />
        <div className="absolute hidden lg:block inset-0 bg-linear-to-b from-[#FF0009] to-[#772571] w-5" />
      </div>
      <div className="flex flex-col items-stretch justify-center xl:justify-between lg:flex-row self-stretch relative mx-auto max-w-360 px-1.5 sm:px-5 py-25">
        <div className="max-w-xl text-center lg:text-start pl-0 lg:pl-6 xl:pl-0 py-12 lg:p-0 mx-auto">
          <Heading className="text-white">{title}</Heading>
        </div>
        <div className="flex flex-wrap gap-4 justify-items-center justify-center max-w-full xl:max-w-153">
          {types.map((type, idx) => (
            <Link
              href={type.link || "/applications"}
              key={`${type.title}-${idx}`}
              className="relative flex flex-col items-center justify-between text-center group cursor-pointer bg-white w-43 md:w-48 h-42 md:h-51 p-4 md:p-5 rounded-2xl overflow-hidden transition-all duration-300 ease-out transform hover:-translate-y-1"
            >
              {/* Graceful Hover Gradient Overlay */}
              <div className="absolute inset-0 bg-linear-to-br from-[#FF0009] to-[#772571] opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out z-0" />

              <div className="flex flex-col items-center space-y-2 max-w-36 relative z-10">
                <Image
                  src={type.icon}
                  alt={type.title}
                  className="aspect-square bg-transparent! invert group-hover:invert-0! transition-all duration-300 object-contain"
                  height={48}
                  width={48}
                  unoptimized
                />
                <p className="font-medium text-base lg:text-lg group-hover:text-white transition-colors duration-300">
                  {type.title}
                </p>
              </div>
              <div className="relative z-10 w-full h-8 flex items-center justify-center">
                <PlusCircle
                  size={24}
                  className="text-primary absolute transition-all duration-300 ease-out group-hover:opacity-0 group-hover:scale-50 group-hover:rotate-90"
                />
                <button className="absolute cursor-pointer font-medium text-center text-xs rounded-full px-4 py-1.5 border-2 border-white text-white opacity-0 scale-75 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto transition-all duration-300 ease-out">
                  Learn More
                </button>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
