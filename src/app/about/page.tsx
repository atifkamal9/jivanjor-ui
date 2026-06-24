import { Metadata } from "next";
import AboutUs from "@/components/about";

export const metadata: Metadata = {
  title: "About Us | Jivanjor",
  description: "Learn more about Jivanjor, our promise of stronger bonds, research & innovation, sustainability practices, market presence, and television commercials.",
};

export default function AboutPage() {
  return <AboutUs />;
}
