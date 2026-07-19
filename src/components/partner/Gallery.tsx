import Image from "next/image";
import { MoveUpRight } from "lucide-react";

interface GalleryItem {
  title?: string;
  description?: string;
  link?: string;
  imageUrl?: string;
  image?: string;
}

interface GalleryProps {
  data?: {
    title?: string;
    desc?: string;
    items?: GalleryItem[];
  };
}

export default function Gallery({ data }: GalleryProps = {}) {
  const title = data?.title || "Growing Through a Strong Dealer Network";
  const desc = data?.desc || "Jivanjor continues to grow through a strong network of dealers, channel partners, contractors and woodworking professionals across India’s adhesive market.";
  
  const items = data?.items || [];
  
  const techTitle = items?.[0]?.title || "Technical Resources";
  const techLink = items?.[0]?.link || "#";

  const img1 = items?.[1]?.imageUrl || items?.[1]?.image || "/images/dealer/Rectangle 30.png";
  const img2 = items?.[2]?.imageUrl || items?.[2]?.image || "/images/dealer/Rectangle 34.png";
  const img3 = items?.[3]?.imageUrl || items?.[3]?.image || "/images/dealer/Rectangle 35.png";
  const img4 = items?.[4]?.imageUrl || items?.[4]?.image || "/images/dealer/Rectangle 37.png";
  const img5 = items?.[5]?.imageUrl || items?.[5]?.image || "/images/dealer/Rectangle 79.png";

  return (
    <section className="space-y-4">
      <div className="flex flex-col space-y-4 max-w-3xl text-center md:text-left">
        <h2 className="font-amethysta text-3xl sm:text-4xl lg:text-5xl max-w-full md:max-w-xl px-6 md:px-0">
          {title}
        </h2>
        <p className="text-lg lg:text-2xl px-9 md:px-0">
          {desc}
        </p>
      </div>
      
      {/* Desktop view */}
      <div className="hidden lg:grid grid-cols-3 gap-4 w-full">
        <div className="col-span-2 rounded-2xl h-80 relative">
          <Image
            src={img1}
            fill
            className="object-cover rounded-2xl"
            alt="Dealer Network 1"
          />
        </div>
        <div className="col-span-1 rounded-2xl h-80 relative">
          <Image
            src={img2}
            fill
            className="object-cover rounded-2xl"
            alt="Dealer Network 2"
          />
        </div>
      </div>
      <div className="hidden lg:grid grid-cols-3 gap-4 w-full">
        <div className="col-span-1 rounded-2xl h-80 relative">
          <Image
            src={img3}
            fill
            className="object-cover rounded-2xl"
            alt="Dealer Network 3"
          />
        </div>
        <div className="col-span-2 rounded-2xl h-80 relative">
          <Image
            src={img4}
            fill
            className="object-cover rounded-2xl"
            alt="Dealer Network 4"
          />
        </div>
      </div>

      {/* Mobile view */}
      <div className="grid grid-flow-col grid-rows-3 grid-cols-3 gap-2 lg:hidden">
        <div className="rounded-2xl relative min-h-24">
          <Image
            src={img3}
            fill
            className="object-cover rounded-2xl"
            alt="Dealer Network 3 Mobile"
          />
        </div>
        <div className="col-span-2 rounded-2xl relative min-h-24">
          <Image
            src={img5}
            fill
            className="object-cover rounded-2xl"
            alt="Dealer Network 5 Mobile"
          />
        </div>
        <a
          href={techLink}
          className="relative bg-[#232323] rounded-2xl min-h-30 block"
        >
          <p className="absolute inset-3.5 sm:inset-6 flex items-end text-base sm:text-xl text-white">
            {techTitle}
          </p>
          <MoveUpRight
            size={24}
            className="absolute top-2.5 right-2.5 sm:top-6 sm:right-6 text-white"
          />
        </a>
        <div className="col-span-2 rounded-2xl relative min-h-24">
          <Image
            src={img4}
            fill
            className="object-cover rounded-2xl"
            alt="Dealer Network 4 Mobile"
          />
        </div>
        <div className="col-span-2 rounded-2xl relative min-h-24">
          <Image
            src={img1}
            fill
            className="object-cover rounded-2xl"
            alt="Dealer Network 1 Mobile"
          />
        </div>
        <div className="rounded-2xl relative min-h-24">
          <Image
            src={img2}
            fill
            className="object-cover rounded-2xl"
            alt="Dealer Network 2 Mobile"
          />
        </div>
      </div>
    </section>
  );
}
