import Image from "next/image";
import { PlusCircle } from "lucide-react";

interface RightChoiceProps {
  data?: {
    title?: string;
    subtitle?: string;
    items?: Array<{
      name?: string;
      title?: string;
      link?: string;
    }>;
  };
}

function mapAdhesiveIcon(index: number) {
  const icons = [
    "/images/image 4.svg",
    "/images/image 5.svg",
    "/images/image 6.svg",
    "/images/image 7.svg",
    "/images/image 8.svg",
    "/images/image 9.svg",
  ];
  return icons[index % icons.length];
}

export default function RightChoice({ data }: RightChoiceProps) {
  const title = data?.title || "Find The Right Adhesive";
  const items = data?.items || [];

  const defaultAdhesiveTypes = [
    { icon: "/icons/chair.png", title: "Furniture and Woodwork", link: "#" },
    {
      icon: "/icons/cabinet.png",
      title: "Kitchen Cabinets & Storage",
      link: "#",
    },
    {
      icon: "/icons/woodfloor.png",
      title: "Laminates & Surface Finishings",
      link: "#",
    },
    {
      icon: "/icons/wooden plank.png",
      title: "Moisture-Prone Woodwork",
      link: "#",
    },
    {
      icon: "/icons/checklist.png",
      title: "PVC, Acrylic & Edge Finishing",
      link: "#",
    },
    {
      icon: "/icons/house.png",
      title: "Home Repairs & Special Fixing",
      link: "#",
    },
  ];

  const types =
    items && items.length > 0
      ? items.map((item, idx) => ({
        icon: mapAdhesiveIcon(idx),
        title: item.name || item.title || "",
        link: item.link || "#",
      }))
      : defaultAdhesiveTypes;

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-r from-[#772571] to-[#FF0009] h-21 lg:hidden" />
      <div className="absolute inset-0 top-21 lg:top-0">
        <Image
          src="/images/Rectangle 5.png"
          className="hidden lg:block object-fill"
          alt="Right Choice"
          priority
          fill
        />
        <Image
          src="/images/Rectangle 5 (1).png"
          className="object-fill lg:hidden"
          alt="Right Choice"
          priority
          fill
        />
        <div className="absolute hidden lg:block inset-0 bg-linear-to-b from-[#FF0009] to-[#772571] w-5" />
      </div>
      <div className="flex flex-col items-center justify-between lg:flex-row relative mx-auto min-h-screen max-w-360 px-6 py-25 lg:px-12">
        <div className="max-w-xl text-center md:text-start py-12 lg:pb-80">
          <h2 className="font-amethysta text-4xl md:text-5xl lg:text-6xl text-white">
            {title}
          </h2>
          {data?.subtitle && (
            <p className="mt-4 text-lg text-white/80 font-google-sans leading-normal">
              {data.subtitle}
            </p>
          )}
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 justify-items-center justify-center">
          {types.map((type) => (
            <a
              href={type.link}
              key={type.title}
              className="flex flex-col items-center justify-between text-center group cursor-pointer bg-white hover:bg-linear-to-br from-[#FF0009] to-[#772571] w-43 md:w-48 h-42 md:h-51 p-4 md:p-5 rounded-2xl"
            >
              <div className="flex flex-col items-center space-y-2 max-w-36">
                <Image
                  src={type.icon}
                  alt={type.title}
                  className="aspect-square bg-transparent! invert group-hover:invert-0!"
                  height={48}
                  width={48}
                />
                <p className="font-medium text-base lg:text-lg group-hover:text-white">
                  {type.title}
                </p>
              </div>
              <div className="">
                <PlusCircle
                  size={24}
                  className="text-primary group-hover:hidden"
                />
                <button className="cursor-pointer font-medium text-center text-xs rounded-full px-4 py-1 border-2 border-white text-white hidden group-hover:block">
                  Learn More
                </button>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
