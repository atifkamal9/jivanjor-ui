import Link from "next/link";
import Image from "next/image";
import { Heading, Title, Paragraph } from "@/components/ui";

interface KnowledgeHubProps {
  data?: {
    enabled?: boolean;
    hideSection?: boolean;
    title?: string;
    subtitle?: string;
    blogTitle?: string;
    blogText?: string;
    blogDescription?: string;
    blogCtaText?: string;
    blogCtaLink?: string;
    items?: Array<{
      title?: string;
      summary?: string;
      imageUrl?: string;
      image?: string;
      mobileImage?: string;
      link?: string;
    }>;
  };
}

function mapKnowledgeImage(index: number) {
  const images = [
    "/images/Rectangle 69.png",
    "/images/Rectangle 70.png",
    "/images/Rectangle 71.png",
    "/images/Rectangle 72.png",
    "/images/Rectangle 73.png",
    "/images/Rectangle 74.png",
  ];
  return images[index % images.length];
}

export default function KnowledgeHub({ data }: KnowledgeHubProps) {
  if (!data || data.enabled === false || data.hideSection === true) {
    return null;
  }

  const title = data?.title || "Knowledge Base & Guides";
  const items = data?.items || [];
  const blogTitle = data?.blogTitle || "Latest Blogs";
  const blogText =
    data?.blogText ||
    data?.blogDescription ||
    "Hear from the carpenters, contractors and dealers who rely on Jivanjor for real projects.";
  const blogCtaText = data?.blogCtaText || "Learn More";
  const blogCtaLink = data?.blogCtaLink || "/blog";

  const defaultCards = [
    {
      title: "Choosing the Right Adhesive",
      image: "/images/Rectangle 69.png",
      mobileImage: "/images/Rectangle 72.png",
      link: "/blog?category=Choosing%20The%20Right%20Adhesive",
    },
    {
      title: "Application Tips",
      image: "/images/Rectangle 70.png",
      mobileImage: "/images/Rectangle 73.png",
      link: "/blog?category=Application%20Tips",
    },
    {
      title: "Fix Common Issues",
      image: "/images/Rectangle 71.png",
      mobileImage: "/images/Rectangle 74.png",
      link: "/blog?category=Fix%20Common%20Issues",
    },
  ];

  const cards =
    items && items.length > 0
      ? items.map((item, idx) => ({
        title: item.title || "",
        image: item.image || item.imageUrl || mapKnowledgeImage(idx),
        mobileImage:
          item.mobileImage || item.image || item.imageUrl || mapKnowledgeImage(idx),
        link: item.link || "#",
      }))
      : defaultCards;

  return (
    <section className="relative py-8 md:py-12 overflow-hidden">
      <div className="mx-auto max-w-360 justify-center leading-normal px-5 lg:px-8 hd:px-12 3xl:px-8 w-full">
        <Heading className="font-amethysta font-normal leading-normal text-center">{title}</Heading>
        <div className="flex flex-col gap-6 py-6">
          {cards.map((c, idx) => (
            <div
              key={`${c.title}-${idx}`}
              className="bg-surface overflow-hidden rounded-[20px]"
            >
              <div className="flex flex-col md:flex-row">
                <div className="flex flex-col items-center text-center md:items-start md:text-start w-full md:w-1/2 p-6 md:px-16 md:py-10 space-y-3">
                  <Title className="font-google-sans font-medium max-w-50 xd:max-w-64 px-7.5 sm:px-0">
                    {c.title}
                  </Title>
                  <Link
                    href={c.link}
                    className="active-gradient-border-surface inline-flex items-center justify-center cursor-pointer font-medium text-center text-sm rounded-full px-4 py-1 text-primary hover:bg-primary/5 transition-colors"
                  >
                    Learn More
                  </Link>
                </div>
                <div className="hidden md:block relative flex-1 min-w-100 xl:min-w-179 min-h-90">
                  <Image
                    fill
                    src={c.image}
                    alt={c.title}
                    className="object-cover rounded-[20px]"
                  />
                </div>
                <div className="md:hidden relative flex-1 min-w-59 min-h-38">
                  <Image
                    fill
                    src={c.mobileImage}
                    alt={c.title}
                    className="object-cover rounded-[20px]"
                  />
                </div>
              </div>
            </div>
          ))}
          {/* Blog Card */}
          <div className="bg-surface relative overflow-hidden rounded-[20px] w-full">
            <div className="flex flex-col md:flex-row w-full">
              <div className="flex flex-col items-center text-center md:items-start md:text-start w-full md:w-1/2 px-8 md:px-16 py-8 md:py-10 space-y-4">
                <Title className="font-google-sans font-medium max-w-56">
                  {blogTitle}
                </Title>
                <div className="absolute bottom-0 left-0 pointer-events-none w-60 h-40 md:w-120 md:h-70">
                  <Image
                    fill
                    alt="watermark"
                    src="/images/watermark-blog.png"
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="relative flex flex-col items-center text-center md:items-start md:text-start flex-1 w-full md:w-1/2 min-h-fit md:min-h-80 px-6 py-6 md:py-12 md:px-0 md:pr-10 space-y-4">
                <Paragraph className="max-w-124 font-google-sans text-foreground/80">
                  {blogText}
                </Paragraph>
                <Link
                  href={blogCtaLink}
                  className="inline-flex items-center justify-center font-medium min-w-35 px-5 py-2 rounded-[20px] text-sm bg-linear-to-br from-[#FF0009] to-[#772571] text-white hover:opacity-90 transition-opacity text-center cursor-pointer"
                >
                  {blogCtaText}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
