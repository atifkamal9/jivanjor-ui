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
  items?: GalleryItem[];
}

export default function Gallery({ items }: GalleryProps) {
  const techTitle = items?.[0]?.title || "Technical Resources";
  const techLink = items?.[0]?.link || "#";

  return (
    <section className="space-y-4">
      <div className="flex flex-col space-y-4 max-w-3xl text-center md:text-left">
        <h2 className="font-amethysta text-3xl sm:text-4xl lg:text-5xl max-w-full md:max-w-xl px-6 md:px-0">
          Growing Through a Strong Dealer Network
        </h2>
        <p className="text-lg lg:text-2xl px-9 md:px-0">
          Jivanjor continues to grow through a strong network of dealers,
          channel partners, contractors and woodworking professionals across
          India’s adhesive market.
        </p>
      </div>
      <div className="hidden lg:grid grid-cols-3 gap-4 w-full">
        <div className="col-span-2 rounded-2xl h-80">
          <Image
            src="/images/dealer/Rectangle 30.png"
            className="object-cover w-full h-full rounded-2xl"
            alt="Rectangle"
            width={1200}
            height={800}
          />
        </div>
        <div className="col-span-1 rounded-2xl h-80">
          <Image
            src="/images/dealer/Rectangle 34.png"
            className="object-cover w-full h-full rounded-2xl"
            alt="Rectangle"
            width={1200}
            height={800}
          />
        </div>
      </div>
      <div className="hidden lg:grid grid-cols-3 gap-4 w-full">
        <div className="col-span-1 rounded-2xl h-80">
          <Image
            src="/images/dealer/Rectangle 35.png"
            className="object-cover w-full h-full rounded-2xl"
            alt="Rectangle"
            width={1200}
            height={800}
          />
        </div>
        <div className="col-span-2 rounded-2xl h-80">
          <Image
            src="/images/dealer/Rectangle 37.png"
            className="object-cover w-full h-full rounded-2xl"
            alt="Rectangle"
            width={1200}
            height={800}
          />
        </div>
      </div>
      {/* Mobile view */}
      <div className="grid grid-flow-col grid-rows-3 grid-cols-3 gap-2 lg:hidden">
        <div className="rounded-2xl">
          <Image
            src="/images/dealer/Rectangle 35.png"
            className="object-cover w-full h-full rounded-2xl"
            alt="Rectangle"
            width={1200}
            height={800}
          />
        </div>
        <div className="col-span-2 rounded-2xl">
          <Image
            src="/images/dealer/Rectangle 79.png"
            className="object-cover w-full h-full rounded-2xl"
            alt="Rectangle"
            width={1200}
            height={800}
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
        <div className="col-span-2 rounded-2xl">
          <Image
            src="/images/dealer/Rectangle 37.png"
            className="object-cover w-full h-full rounded-2xl"
            alt="Rectangle"
            width={1200}
            height={800}
          />
        </div>
        <div className="col-span-2 rounded-2xl">
          <Image
            src="/images/dealer/Rectangle 30.png"
            className="object-cover w-full h-full rounded-2xl"
            alt="Rectangle"
            width={1200}
            height={800}
          />
        </div>
        <div className="rounded-2xl">
          <Image
            src="/images/dealer/Rectangle 34.png"
            className="object-cover w-full h-full rounded-2xl"
            alt="Rectangle"
            width={1200}
            height={800}
          />
        </div>
      </div>
    </section>
  );
}
