import Image from "next/image";

export default function RightChoice() {
  return (
    <section className="">
      <div className="relative mb-10 lg:mb-12 bg-linear-to-r from-[#FF0009] to-[#772571] text-white">
        {/* watermark */}
        <div className="hidden lg:block absolute top-px bottom-0 left-0 pointer-events-none">
          <Image
            src="/images/watermark-1.png"
            alt="watermark"
            width={840}
            height={440}
            className="w-full h-full object-cover object-center"
          />
        </div>
        <div className="absolute bottom-0 right-0 pointer-events-none lg:hidden">
          <Image
            src="/images/watermark-choice.png"
            alt="watermark"
            width={840}
            height={440}
            className="w-full h-full object-cover object-center"
          />
        </div>
        <div className="flex flex-col justify-center text-center md:text-start mx-auto max-w-360 space-y-6 py-24 px-5 lg:px-8 lg:py-14">
          <h2 className="font-amethysta text-[34px] md:text-[44px]">
            Need Help Choosing the Right Adhesive?
          </h2>
          <div className="flex flex-col items-center md:items-start justify-between lg:flex-row gap-8">
            <p className="text-2xl max-w-3xl font-google-sans">
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

// Product page will not be directly opened from the homepage cards, so we can use this component to direct users to the product page for more details and information about the product range. This will be placed at the bottom of the product page, after all the product details, features, specifications, etc.
