import Link from "next/link";
import { ChevronRight } from "lucide-react";

export interface BlogHeroProps {
  title?: string;
  category?: string;
}

export default function BlogHero({ title, category }: BlogHeroProps) {
  const displayCategory = category || "Application Tips";
  const displayTitle = title || "Mastering Laminate Bonding: Preventing Bubbles in High-Humidity Environments";
  
  // Use shorter title for breadcrumb if possible, or truncate it
  const breadcrumbTitle = title || "Preventing Laminate Bubbling";

  return (
    <section className="flex flex-col justify-between max-w-360 mx-auto my-4 px-5 gap-4 z-50">
      <div className="flex items-center gap-1.5 text-xs sm:text-sm md:text-lg font-medium">
        <Link href="/" className="hover:opacity-80 transition-opacity">
          {/* Home Solid Icon */}
          <svg className="w-4.5 h-4.5 text-black dark:text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
          </svg>
        </Link>
        {/* Chevron separator */}
        <div className="hidden items-center md:flex gap-1.5">
          <ChevronRight size={16} />
          <Link href="/blog" className="hover:text-[#ff0009] transition-colors">
            <span className="">Knowledge Hub</span>
          </Link>
        </div>
        <ChevronRight size={16} />
        <Link href={`/blog?category=${encodeURIComponent(displayCategory)}`} className="hover:text-[#ff0009] transition-colors">
          <span className="">{displayCategory}</span>
        </Link>
        <ChevronRight size={16} />
        <span className="text-gray-400 line-clamp-1 max-w-[200px] sm:max-w-xs md:max-w-md">{breadcrumbTitle}</span>
      </div>
      <h2 className="font-amethysta text-2xl sm:text-3xl max-w-80 md:max-w-188">
        {displayTitle}
      </h2>
    </section>
  );
}
