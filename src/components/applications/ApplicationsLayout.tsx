"use client";
import { RightChoice } from "@/components/categories";
import Hero from "./Hero";
import List from "./List";
import RelatedProducts from "./RelatedProducts";
import FQAs from "./FAQs";

interface ApplicationsLayoutProps {
  data?: any;
}

export default function ApplicationsLayout({ data }: ApplicationsLayoutProps) {
  if (!data) {
    return (
      <main className="min-h-screen relative bg-background font-google-sans overflow-x-clip">
        <Hero />
        <List />
        <RelatedProducts />
        <FQAs />
        <div className="hidden md:block">
          <RightChoice />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen relative bg-background font-google-sans overflow-x-clip">
      <Hero
        title={data.hero?.title}
        subtitle={data.hero?.breadcrumb}
        image={data.hero?.media?.[0]}
      />
      <List
        subtitle={data.list?.subtitle}
        items={data.list?.items}
      />
      <RelatedProducts
        title={data.relatedProducts?.title}
        items={data.relatedProducts?.items}
      />
      <FQAs
        title={data.faqs?.title}
        subtitle={data.faqs?.subtitle}
        items={data.faqs?.items}
      />
      <div className="hidden md:block">
        <RightChoice />
      </div>
    </main>
  );
}
