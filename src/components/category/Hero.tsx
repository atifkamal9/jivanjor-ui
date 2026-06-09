import React from "react";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="">
      <div className="w-full h-67 relative">
        <Image
          src="/images/category-hero.png"
          fill
          alt="Category Hero"
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>
    </section>
  );
}
