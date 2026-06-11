import Image from "next/image";

export default function RightChoice() {
  return (
    <section className="">
      <div className="relative my-10 bg-linear-to-r from-[#FF0009] to-[#772571] text-white">
        {/* watermark */}
        <div className="absolute bottom-0 left-0 pointer-events-none">
          <Image
            src="/images/watermark-1.png"
            alt="watermark"
            width={840}
            height={440}
            className="w-full h-full object-cover object-center"
          />
        </div>
        <div className="mx-auto max-w-7xl justify-center space-y-6 p-10">
          <h2 className="font-amethysta text-4xl md:text-[42px]">
            Need Help Choosing the Right Adhesive?
          </h2>
          <div className="flex flex-col items-start justify-between lg:flex-row gap-4">
            <p className="text-2xl max-w-3xl font-google-sans leading-relaxed">
              Share your woodwork needs, product query or application concerns.
              Our team will help you find the right Jivanjor solution.
            </p>
            <a
              href={`ctaLink`}
              className="inline-flex items-center justify-center font-medium text-base rounded-full min-w-50 px-6 py-2 bg-white text-foreground text-center transition-colors hover:scale-105"
            >
              Submit Your Query
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
