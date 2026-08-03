"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { RightChoice } from "@/components/categories";
import Hero from "./Hero";
import List from "./List";
import RelatedProducts from "./RelatedProducts";
import FQAs from "./FAQs";

interface ApplicationsLayoutProps {
  data?: any;
  pageSlug?: string;
  pageTitle?: string;
  pageDescription?: string;
}

function ApplicationsLayoutContent({
  data,
  pageSlug,
  pageTitle,
  pageDescription,
}: ApplicationsLayoutProps) {
  const searchParams = useSearchParams();
  const isArticleView = Boolean(searchParams.get("article"));

  if (isArticleView) {
    return (
      <main className="min-h-screen relative bg-background font-google-sans overflow-x-clip">
        <List
          description={data?.list?.description || data?.list?.subtitle}
          pageDescription={pageDescription}
          items={data?.list?.items}
          pageSlug={pageSlug}
          pageTitle={pageTitle}
        />
      </main>
    );
  }

  if (!data) {
    return (
      <main className="min-h-screen relative bg-background font-google-sans overflow-x-clip">
        <Hero title={pageTitle} />
        <List pageSlug={pageSlug} pageTitle={pageTitle} pageDescription={pageDescription} />
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
        title={data.hero?.title || pageTitle}
        breadcrumb={data.hero?.breadcrumb}
        image={data.hero?.media?.[0]}
      />
      <List
        description={data.list?.description || data.list?.subtitle}
        pageDescription={pageDescription}
        items={data.list?.items}
        pageSlug={pageSlug}
        pageTitle={pageTitle}
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

export default function ApplicationsLayout(props: ApplicationsLayoutProps) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <ApplicationsLayoutContent {...props} />
    </Suspense>
  );
}
