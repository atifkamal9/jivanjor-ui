import Hero from "./Hero";
import List from "./List";
import { RightChoice } from "@/components/categories";

interface BlogLayoutData {
  hero?: {
    title?: string;
    subtitle?: string;
    desktopImage?: string;
  };
  list?: {
    categories?: { name: string; icon: string }[];
    posts?: { title: string; desc: string; image: string; category: string; slug?: string }[];
  };
}

interface BlogLayoutProps {
  data?: BlogLayoutData | null;
}

export default function BlogLayout({ data }: BlogLayoutProps) {
  const hero = data?.hero;
  const list = data?.list;

  return (
    <main className="min-h-screen relative bg-background font-google-sans overflow-x-clip">
      <Hero
        title={hero?.title}
        subtitle={hero?.subtitle}
        desktopImage={hero?.desktopImage}
      />
      <List
        categories={list?.categories}
        posts={list?.posts}
      />
      <RightChoice />
    </main>
  );
}
