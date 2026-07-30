import Image from "next/image";
import { MoveUpRight } from "lucide-react";

interface GalleryItem {
  title?: string;
  link?: string;
}

interface GalleryImages {
  img1Desktop?: string;
  img1Mobile?: string;
  img2Desktop?: string;
  img2Mobile?: string;
  img3Desktop?: string;
  img3Mobile?: string;
  img4Desktop?: string;
  img4Mobile?: string;
  img5Desktop?: string;
  img5Mobile?: string;
}

interface GalleryProps {
  items?: GalleryItem[];
  images?: GalleryImages;
}

export default function Gallery({ items, images }: GalleryProps) {
  const techTitle = items?.[0]?.title || "Technical Resources";
  const techLink = items?.[0]?.link || "/resources";

  const marketTitle = items?.[1]?.title || "Our Market Presence";
  const marketLink = items?.[1]?.link || "/applications";

  const img1Desk = images?.img1Desktop || "/images/Rectangle 30.png";
  const img1Mob = images?.img1Mobile || "/images/Rectangle 30.png";

  const img2Desk = images?.img2Desktop || "/images/Rectangle 35.png";
  const img2Mob = images?.img2Mobile || "/images/Rectangle 35.png";

  const img3Desk = images?.img3Desktop || "/images/Rectangle 79.png";
  const img3Mob = images?.img3Mobile || "/images/Rectangle 79.png";

  const img4Desk = images?.img4Desktop || "/images/Rectangle 34.png";
  const img4Mob = images?.img4Mobile || "/images/Rectangle 34 (1).png";

  const img5Desk = images?.img5Desktop || "/images/Rectangle 37.png";
  const img5Mob = images?.img5Mobile || "/images/Rectangle 37.png";

  return (
    <section className="pb-6 space-y-4">
      {/* Desktop View */}
      <div className="hidden lg:grid grid-cols-4 gap-4 w-full">
        <div className="col-span-2 rounded-2xl h-80 relative overflow-hidden">
          <Image
            src={img1Desk}
            className="object-cover w-full h-full rounded-2xl"
            alt="Gallery Image 1"
            width={1200}
            height={800}
            unoptimized
          />
        </div>
        <a
          href={techLink}
          className="relative bg-[#232323] h-80 rounded-2xl block hover:bg-[#2e2e2e] transition-colors group p-6"
        >
          <p className="absolute inset-6 flex items-end text-3xl text-white font-amethysta">
            {techTitle} <MoveUpRight size={40} className="ml-2 shrink-0 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </p>
        </a>
        <div className="rounded-2xl h-80 relative overflow-hidden">
          <Image
            src={img2Desk}
            className="object-cover w-full h-full rounded-2xl"
            alt="Gallery Image 2"
            width={1200}
            height={800}
            unoptimized
          />
        </div>
      </div>

      <div className="hidden lg:grid grid-cols-4 gap-4 w-full">
        <div className="rounded-2xl h-80 relative overflow-hidden">
          <Image
            src={img3Desk}
            className="object-cover w-full h-full rounded-2xl"
            alt="Gallery Image 3"
            width={1200}
            height={800}
            unoptimized
          />
        </div>
        <div className="space-y-4">
          <a
            href={marketLink}
            className="relative bg-[#232323] h-40 rounded-2xl block hover:bg-[#2e2e2e] transition-colors group p-6"
          >
            <p className="absolute inset-4 flex items-end text-2xl xl:text-3xl text-white font-amethysta">
              {marketTitle} <MoveUpRight size={36} className="ml-2 shrink-0 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </p>
          </a>
          <div className="h-36 rounded-2xl relative overflow-hidden">
            <Image
              src={img4Desk}
              className="object-cover w-full h-full rounded-2xl"
              alt="Gallery Image 4"
              width={1200}
              height={800}
              unoptimized
            />
          </div>
        </div>
        <div className="col-span-2 rounded-2xl h-80 relative overflow-hidden">
          <Image
            src={img5Desk}
            className="object-cover w-full h-full rounded-2xl"
            alt="Gallery Image 5"
            width={1200}
            height={800}
            unoptimized
          />
        </div>
      </div>

      {/* Mobile view */}
      <div className="grid lg:hidden grid-flow-col grid-rows-4 grid-cols-2 gap-4">
        <div className="rounded-2xl relative overflow-hidden">
          <Image
            src={img1Mob}
            className="object-cover w-full h-full rounded-2xl"
            alt="Gallery Image 1 Mobile"
            width={1200}
            height={800}
            unoptimized
          />
        </div>
        <div className="row-span-2 rounded-2xl relative overflow-hidden">
          <Image
            src={img2Mob}
            className="object-cover w-full h-full rounded-2xl"
            alt="Gallery Image 2 Mobile"
            width={1200}
            height={800}
            unoptimized
          />
        </div>
        <a
          href={techLink}
          className="relative bg-[#232323] rounded-2xl min-h-30 block p-4"
        >
          <p className="absolute inset-2.5 sm:inset-6 flex items-end text-xl sm:text-2xl md:text-4xl text-white font-amethysta">
            {techTitle}
          </p>
          <MoveUpRight
            size={36}
            className="absolute top-2.5 right-2.5 sm:top-6 sm:right-6 text-white"
          />
        </a>
        <div className="row-span-2 rounded-2xl relative overflow-hidden">
          <Image
            src={img4Mob}
            className="object-cover w-full h-full rounded-2xl"
            alt="Gallery Image 4 Mobile"
            width={1200}
            height={800}
            unoptimized
          />
        </div>
        <a
          href={marketLink}
          className="relative bg-[#232323] rounded-2xl min-h-30 block p-4"
        >
          <p className="absolute inset-2.5 sm:inset-6 flex items-end text-xl sm:text-2xl md:text-4xl text-white font-amethysta">
            {marketTitle}
          </p>
          <MoveUpRight
            size={36}
            className="absolute top-2.5 right-2.5 sm:top-6 sm:right-6 text-white"
          />
        </a>
        <div className="rounded-2xl relative overflow-hidden">
          <Image
            src={img5Mob}
            className="object-cover w-full h-full rounded-2xl"
            alt="Gallery Image 5 Mobile"
            width={1200}
            height={800}
            unoptimized
          />
        </div>
      </div>
    </section>
  );
}
