import Image from "next/image";

interface KnowledgeHubProps {
  data?: {
    title?: string;
    subtitle?: string;
    items?: Array<{
      title?: string;
      summary?: string;
      imageUrl?: string;
      image?: string;
      link?: string;
    }>;
  };
}

function mapKnowledgeImage(index: number) {
  const images = [
    "/images/Rectangle 69.png",
    "/images/Rectangle 70.png",
    "/images/Rectangle 71.png",
  ];
  return images[index % images.length];
}

export default function KnowledgeHub({ data }: KnowledgeHubProps) {
  const title = data?.title || "Knowledge Base & Guides";
  const items = data?.items || [];

  const defaultCards = [
    {
      title: "Choosing the Right Adhesive",
      image: "/images/Rectangle 69.png",
      link: "#",
    },
    {
      title: "Application Tips",
      image: "/images/Rectangle 70.png",
      link: "#",
    },
    {
      title: "Fix Common Issues",
      image: "/images/Rectangle 71.png",
      link: "#",
    },
  ];

  const cards = items && items.length > 0
    ? items.map((item, idx) => ({
        title: item.title || "",
        image: item.imageUrl || item.image || mapKnowledgeImage(idx),
        link: item.link || "#",
      }))
    : defaultCards;

  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-6xl justify-center px-6">
        <h2 className="font-amethysta font-normal text-center text-4xl md:text-5xl lg:text-6xl">
          {title}
        </h2>
        {data?.subtitle && (
          <p className="mt-4 text-center text-xl text-foreground/80 font-google-sans max-w-3xl mx-auto">
            {data.subtitle}
          </p>
        )}
        <div className="flex flex-col gap-6 py-12">
          {cards.map((c, idx) => (
            <div
              key={`${c.title}-${idx}`}
              className="bg-surface overflow-hidden rounded-3xl"
            >
              <div className="flex flex-col md:flex-row">
                <div className="flex flex-col items-start w-full md:w-1/2 p-10 space-y-4">
                  <h3 className="font-semibold text-4xl md:text-5xl max-w-96">
                    {c.title}
                  </h3>
                  <a href={c.link} className="inline-flex items-center justify-center cursor-pointer font-medium text-center text-xs rounded-full px-4 py-1 border border-spacing-1.5 border-primary text-primary hover:bg-primary/5 transition-colors">
                    Learn More
                  </a>
                </div>
                <div className="relative flex-1 min-h-80">
                  <Image
                    fill
                    src={c.image}
                    alt={c.title}
                    className="object-cover rounded-3xl"
                  />
                </div>
              </div>
            </div>
          ))}
          {/* Blog Card */}
          <div className="bg-surface relative overflow-hidden rounded-3xl">
            <div className="flex flex-col md:flex-row">
              <div className="flex flex-col items-start w-full md:w-1/2 p-10 space-y-4">
                <h3 className="font-semibold text-4xl md:text-5xl">
                  Latest Blogs
                </h3>
                <div className="absolute bottom-0 left-0 pointer-events-none">
                  <Image
                    src="/images/watermark-blog.png"
                    alt="watermark"
                    width={500}
                    height={320}
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="relative flex flex-col items-start flex-1 min-h-80 px-10 md:py-10 md:px-0 md:pr-10 space-y-4">
                <p className="text-xl max-w-124 font-google-sans leading-normal text-foreground/80">
                  Hear from the carpenters, contractors and dealers who rely on
                  Jivanjor for real projects. Hear from the carpenters,
                  contractors and dealers who rely on Jivanjor for real
                  projects.
                </p>
                <a href="/blogs" className="inline-flex items-center justify-center font-medium min-w-35 px-4 py-2 rounded-3xl text-sm bg-linear-to-tr from-[#FF0009] to-[#772571] text-white hover:opacity-90 transition-opacity text-center">
                  Learn More
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
