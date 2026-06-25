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

  const marketTitle = items?.[1]?.title || "Our Market Presence";
  const marketLink = items?.[1]?.link || "#";

  const endorseTitle = items?.[2]?.title || "Industry Endorsed";
  const endorseLink = items?.[2]?.link || "#";

  return (
    <section className="py-10 space-y-4">
      <div className="hidden lg:grid grid-cols-4 gap-4 w-full">
        <div className="col-span-2 rounded-2xl h-80">
          <Image
            src="/images/Rectangle 30.png"
            className="object-cover w-full h-full rounded-2xl"
            alt="Rectangle"
            width={1200}
            height={800}
          />
        </div>
        <a href={techLink} className="relative bg-[#232323] h-80 rounded-2xl block hover:bg-[#2e2e2e] transition-colors">
          <p className="absolute inset-4 flex items-end text-3xl text-white font-amethysta">
            {techTitle} <MoveUpRight size={40} className="ml-2 shrink-0" />
          </p>
        </a>
        <div className="rounded-2xl h-80">
          <Image
            src="/images/Rectangle 35.png"
            className="object-cover w-full h-full rounded-2xl"
            alt="Rectangle"
            width={1200}
            height={800}
          />
        </div>
      </div>
      <div className="hidden lg:grid grid-cols-4 gap-4 w-full">
        <div className="rounded-2xl h-80">
          <Image
            src="/images/Rectangle 79.png"
            className="object-cover w-full h-full rounded-2xl"
            alt="Rectangle"
            width={1200}
            height={800}
          />
        </div>
        <div className="space-y-4">
          <a href={marketLink} className="relative bg-[#232323] h-40 rounded-2xl block hover:bg-[#2e2e2e] transition-colors">
            <p className="absolute inset-4 flex items-end text-3xl text-white font-amethysta">
              {marketTitle} <MoveUpRight size={40} className="ml-2 shrink-0" />
            </p>
          </a>
          <div className="h-36 rounded-2xl">
            <Image
              src="/images/Rectangle 34.png"
              className="object-cover w-full h-full rounded-2xl"
              alt="Rectangle"
              width={1200}
              height={800}
            />
          </div>
        </div>
        <div className="col-span-2 rounded-2xl h-80">
          <Image
            src="/images/Rectangle 37.png"
            className="object-cover w-full h-full rounded-2xl"
            alt="Rectangle"
            width={1200}
            height={800}
          />
        </div>
      </div>
      {/* Mobile view */}
      <div className="grid lg:hidden grid-flow-col grid-rows-4 grid-cols-2 gap-4">
        <div className="rounded-2xl">
          <Image
            src="/images/Rectangle 30.png"
            className="object-cover w-full h-full rounded-2xl"
            alt="Rectangle"
            width={1200}
            height={800}
          />
        </div>
        <div className="row-span-2 rounded-2xl">
          <Image
            src="/images/Rectangle 35.png"
            className="object-cover w-full h-full rounded-2xl"
            alt="Rectangle"
            width={1200}
            height={800}
          />
        </div>
        <a href={techLink} className="relative bg-[#232323] rounded-2xl min-h-30 block">
          <p className="absolute inset-2.5 sm:inset-6 flex items-end text-xl sm:text-2xl md:text-4xl text-white font-amethysta">
            {techTitle}
          </p>
          <MoveUpRight
            size={40}
            className="absolute top-2.5 right-2.5 sm:top-6 sm:right-6 text-white"
          />
        </a>
        <div className="row-span-2 rounded-2xl">
          <Image
            src="/images/Rectangle 34 (1).png"
            className="object-cover w-full h-full rounded-2xl"
            alt="Rectangle"
            width={1200}
            height={800}
          />
        </div>
        <a href={marketLink} className="relative bg-[#232323] rounded-2xl min-h-30 block">
          <p className="absolute inset-2.5 sm:inset-6 flex items-end text-xl sm:text-2xl md:text-4xl text-white font-amethysta">
            {marketTitle}
          </p>
          <MoveUpRight
            size={40}
            className="absolute top-2.5 right-2.5 sm:top-6 sm:right-6 text-white"
          />
        </a>
        <div className="rounded-2xl">
          <Image
            src="/images/Rectangle 37.png"
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
