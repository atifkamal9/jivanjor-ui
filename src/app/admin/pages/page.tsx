"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { api, Page, PageTemplate, Product } from "@/lib/api";
import ImageUpload from "@/components/admin/ImageUpload";
import MediaUpload from "@/components/admin/MediaUpload";
import BlogRichEditor from "@/components/admin/BlogRichEditor";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Sparkles,
  FileText,
  LayoutTemplate,
  AlertCircle,
  ArrowLeft,
  Sliders,
  Layout,
  Grid,
  Shield,
  MessageSquare,
  Bookmark,
  Award,
  Layers,
  GripVertical,
  ChevronUp,
  ChevronDown
} from "lucide-react";

const isVideo = (url: string) =>
  /\.(mp4|webm|mov)(\?.*)?$/i.test(url) || url.includes("video");

const defaultHomeSections = {
  hero: {
    title: "Dependable Bonds for Indian Homes",
    actionButtons: {
      primary: { text: "Explore Products", actionPath: "#product-section" },
      secondary: { text: "About Jivanjor", actionPath: "/about" },
    },
    slides: [
      {
        id: "slide-1",
        type: "image",
        bgImage: "/images/hero.png",
        bgImagePhone: "/images/hero.png",
        videoUrl: "",
        cta1: { text: "Explore Products", link: "#product-section" },
        cta2: { text: "About Jivanjor", link: "/about" }
      },
      {
        id: "slide-2",
        type: "image",
        bgImage: "/images/hero (1).png",
        bgImagePhone: "/images/hero (1) mobile.png",
        videoUrl: "",
        cta1: { text: "Explore Products", link: "#product-section" },
        cta2: { text: "About Jivanjor", link: "/about" }
      },
      {
        id: "slide-3",
        type: "video",
        bgImage: "/images/video-thumbnail.png",
        bgImagePhone: "/images/video-thumbnail.png",
        videoUrl: "/videos/hero-background.mp4",
        cta1: { text: "Explore Products", link: "#product-section" },
        cta2: { text: "About Jivanjor", link: "/about" }
      }
    ],
  },
  productRange: {
    title: "A Complete Adhesive Range for Modern Woodworking",
    categories: [
      { id: "cat-1", name: "Super Premium", selectedProductIds: [] },
      { id: "cat-2", name: "Speciality", selectedProductIds: [] },
      { id: "cat-3", name: "Regular", selectedProductIds: [] },
      { id: "cat-4", name: "Waterproof Grade", selectedProductIds: [] },
      { id: "cat-5", name: "ECO", selectedProductIds: [] },
    ],
  },
  findAdhesive: {
    title: "Find The Right Adhesive",
    subtitle: "Select your application category to discover matched adhesives engineered for maximum hold.",
    items: [
      { name: "Furniture and Woodwork", link: "#" },
      { name: "Kitchen Cabinets & Storage", link: "#" },
      { name: "Laminates & Surface Finishings", link: "#" },
      { name: "Moisture-Prone Woodwork", link: "#" },
      { name: "PVC, Acrylic & Edge Finishing", link: "#" },
      { name: "Home Repairs & Special Fixing", link: "#" }
    ]
  },
  whyTrustUs: {
    title: "Why Professionals Trust Jivanjor",
    subtitle: "Over decades, builders and contractors have endorsed Jivanjor for quality, innovation, and support.",
    items: [
      { title: "Consistent Quality", description: "Every batch is rigorously tested in our labs to ensure matching bonding performance." },
      { title: "Ease of Application", description: "Engineered viscosity allows smooth, even spreading with minimal effort." },
      { title: "Range of Products", description: "A tailored product for every surface—from solid wood to rigid PVC and terrace concrete." },
      { title: "Preferred by Experts", description: "Loved by leading interior designers, architects, and professional carpentry guilds." }
    ]
  },
  showcaseGrid: {
    title: "Built Around India’s Woodworking Professionals",
    subtitle: "Jivanjor continues to grow through the trust of carpenters, contractors, dealers and channel partners across India’s woodworking ecosystem.",
    items: [
      { title: "Technical Resources", description: "Step-by-step tutorials, safety datasheets, and best practices for modern carpenter guilds.", link: "#" },
      { title: "Our Market Presence", description: "Available at 15,000+ retail outlets across India, backed by robust distribution networks.", link: "#" },
      { title: "Industry Endorsed", description: "Recognized by woodworking associations for superior chemical safety and durability.", link: "#" }
    ]
  },
  ctaPromo: {
    title: "Grow Your Business With a Trusted Adhesive",
    subtitle: "Work with a growing brand trusted by woodworking professionals, dealers and channel partners.",
    ctaText: "Partner With Us",
    ctaLink: "#"
  },
  testimonials: {
    title: "Trusted by People Who Know the Work",
    subtitle: "Hear from carpenters, contractors and dealers who rely on Jivanjor for real projects.",
    ctaText: "Partner With Us",
    ctaLink: "#",
    items: [
      {
        type: "video",
        name: "Mr. Imran Saifi",
        role: "Contractor Carpenter",
        videoUrl: "#",
        image: "/images/2.jpeg",
        showPlayButton: true,
      },
      {
        type: "video",
        name: "Mr. Imran Saifi",
        role: "Contractor Carpenter",
        image: "/images/1.jpeg",
        videoUrl: "#",
        showPlayButton: true,
      },
      {
        type: "text",
        name: "Mr. Imran Saifi",
        role: "Contractor Carpenter",
        quote: "Aquabond kitchen ka specialist hai.",
      },
      {
        type: "video",
        name: "Mr. Imran Saifi",
        role: "Contractor Carpenter",
        image: "/images/3.jpeg",
        videoUrl: "#",
        showPlayButton: true,
      },
      {
        type: "text",
        name: "Mr. Mosim Ali",
        role: "Contractor Carpenter",
        quote: "Jivanjor products are highly reliable and strong.",
      },
    ]
  },
  knowledgeBase: {
    title: "Knowledge Base & Guides",
    subtitle: "Explore insights, tips, and chemistry guides from our experts to optimize your bonding applications.",
    items: [
      { title: "Choosing the Right Adhesive", summary: "A masterclass on selecting between standard PVA, quick-drying fast bonds, and high-performance polyurethanes.", link: "#" },
      { title: "Application Tips", summary: "Pro tips for surface preparation, wood moisture content checks, clamping times, and curing environment controls.", link: "#" },
      { title: "Fix Common Issues", summary: "Learn how to easily prevent wood laminate bubbling, edge peeling, and joint cracking in high-humidity climates.", link: "#" }
    ]
  }
};

const defaultAboutSections = {
  hero: {
    title: "A Trusted Name in Woodworking Adhesives",
    desc: "Engineered for consistency. Built for the contractors and carpenters who shape India's woodwork.",
    actionButtons: {
      primary: { text: "Enquire Now", actionPath: "#about-query-section" }
    },
    media: [
      "/images/about/about-hero.png",
      "/images/about/about-hero-1.png"
    ]
  },
  promise: {
    title: "The Promise of Stronger Bonds",
    subtitle: "Jivanjor is built around the needs of woodworking professionals, channel partners and end users who look for dependable adhesive solutions.",
    items: [
      {
        title: "Quality-Led Products",
        desc: "Adhesive solutions built around consistent performance and practical use.",
        icon: "/images/about/Ad-product.svg"
      },
      {
        title: "Woodworking Focus",
        desc: "Products designed for furniture, interiors, laminates and everyday woodwork needs.",
        icon: "/images/about/Distribute-vertically.svg"
      },
      {
        title: "Trade Understanding",
        desc: "A brand connected with the professionals and partners who shape adhesive choices.",
        icon: "/images/about/Spanner.svg"
      },
      {
        title: "Application Confidence",
        desc: "Guidance, product information and support to help users choose and apply better.",
        icon: "/images/about/Worker.svg"
      }
    ]
  },
  innovation: {
    title: "Built on Innovation That Drives Performance",
    bgImage: "/images/about/about-innovation-bg.png",
    items: [
      {
        title: "Equipped R&D",
        desc: "A dedicated facility focused on adhesive development and product improvement."
      },
      {
        title: "Application Testing",
        desc: "Testing-led developments to support practical bonding and usage needs."
      },
      {
        title: "Advanced Chemistries",
        desc: "Research across adhesive technologies, wood finishes and performance-led formulations."
      }
    ],
    ctaText: "Explore Applications",
    ctaLink: "/applications"
  },
  responsibility: {
    title: "Recognised for Quality. Built with Responsibility.",
    subtitle: "Jivanjor’s product promise is supported by quality-led facilities, recognised environmental practices and a continued focus on responsible manufacturing.",
    badges: [
      { title: "GreenPro Awards 2023", src: "/images/about/badge-greenpro.png" },
      { title: "EcoVadis Awards 2023", src: "/images/about/badge-ecovadis.png" },
      { title: "Chairman's Annual Award 24-25", src: "/images/about/badge-chairman.png" },
      { title: "ISO 9001 Compliant Facilities", src: "/images/about/badge-iso-9001.png" },
      { title: "ISO 14001 Compliant Facilities", src: "/images/about/badge-iso-14001.png" }
    ],
    sustainability: {
      title: "A Responsible Approach to Manufacturing",
      subtitle: "JACPL follows a long-term sustainability approach focused on protecting the environment, managing resources responsibly and reducing the impact of business operations.",
      image: "/images/about/windmill.png",
      items: [
        { title: "Use Resources Carefully", desc: "Practices focused on saving natural resources and energy." },
        { title: "Reduce Waste and Pollutants", desc: "Efforts to reduce industrial waste and environmental pollutants from business operations." },
        { title: "Lower Substances of Concern", desc: "Efforts to reduce industrial waste and environmental pollutants from business operations." },
        { title: "Act with Environmental Awareness", desc: "Encouraging conversation-minded practices across the organisation." }
      ]
    }
  },
  presence: {
    title: "A Presence Built Through Trust",
    subtitle: "Jivanjor brings together product performance and professional know-how to support the work that happens before the final finish, inside workshops, homes and everyday interiors.",
    items: [
      { value: "Pan-India", label: "Market Presence", icon: "/images/about/presence.svg" },
      { value: "27,000+", label: "Distribution Touchpoints", icon: "/images/about/distribution.svg" },
      { value: "275K+", label: "Trusting Woodworking Professionals", icon: "/images/about/professionals.svg" },
      { value: "8 High-Tech", label: "Manufacturing Facilities", icon: "/images/about/facilities.svg" },
      { value: "20+", label: "Product Variants", icon: "/images/about/variants.svg" }
    ],
    ctaExplore: { text: "Explore Products", actionPath: "/products" },
    ctaPartner: { text: "Partner With Us", actionPath: "/partner" }
  },
  tvcs: {
    title: "A Brand That Holds It All Together",
    subtitle: "Jivanjor brings together product performance and professional know-how to support the work that happens before the final finish, inside workshops, homes and everyday interiors.",
    items: [
      { id: "allrounder", title: "Jivanjor AllRounder - Jud Gaya Toh Jud Gaya", thumbnail: "/images/about/about-video-1.png", youtubeId: "5F7y8l18Nrc" },
      { id: "champion", title: "Jivanjor Champion - Multi-purpose Adhesive", thumbnail: "/images/about/about-video-2.png", youtubeId: "11mQhW3Zntk" }
    ]
  }
};

const defaultProductSections = {
  hero: {
    title: "Premium Carpentry Adhesive Specs",
    desc: "Detailed technical sheets, packaging sizes, application steps, and key specifications.",
    actionButtons: {
      primary: { text: "Download TDS", actionPath: "#" },
      secondary: { text: "Request Sample", actionPath: "/contact" }
    },
    media: [
      "/images/hero (1).png"
    ]
  },
  specifications: {
    title: "Technical Specifications",
    subtitle: "Accurate specifications tested under standardized laboratory conditions.",
    items: [
      { label: "Adhesive Base", value: "Polyvinyl Acetate (PVA) Emulsion" },
      { label: "Viscosity", value: "200 to 250 Poise at 30°C" },
      { label: "Coverage", value: "Approx. 8-10 sq.m per kg" },
      { label: "Clamping Time", value: "2 to 3 hours under normal humidity" }
    ]
  },
  features: {
    title: "Key Performance Features",
    subtitle: "Why Jivanjor outperforms ordinary carpentry glues.",
    items: [
      { title: "Extra Sticky Grab", description: "Prevents sliding of laminate sheets during initial alignment." },
      { title: "Micro-Polymer Crosslinking", description: "Deep wood fiber penetration for unbreakable bonds." },
      { title: "Anti-Bubble Action", description: "Formulated to minimize bubbles under laminate surfaces." }
    ]
  },
  applicationGuide: {
    title: "Step-by-Step Application Guide",
    subtitle: "Follow these simple steps for professional bonding results.",
    items: [
      { title: "Surface Preparation", description: "Ensure both wood and laminate surfaces are clean, dry, and free from grease or dust.", image: "/images/Champion Super.png" },
      { title: "Adhesive Spreading", description: "Spread Jivanjor adhesive evenly using a spreader or brush on one surface.", image: "/images/Aquabond.png" },
      { title: "Pressing & Clamping", description: "Align the laminate on the wood and press firmly. Clamp for at least 2 hours.", image: "/images/Foambond.png" }
    ]
  },
  faqs: {
    title: "Troubleshooting & FAQs",
    subtitle: "Common application questions answered by Jivanjor engineers.",
    items: [
      { question: "What is the recommended clamping duration?", answer: "We recommend clamping for 2 to 3 hours. Full curing takes 24 hours." },
      { question: "Can it be used on exterior doors?", answer: "Yes, our waterproof Aquabond grade is highly recommended for exterior doors." }
    ]
  }
};

const defaultCategorySections = {
  hero: {
    title: "Woodworking Applications",
    desc: "Explore specific adhesives engineered for laminates, solid wood, edge banding, and high-moisture environments.",
    actionButtons: {
      primary: { text: "Selector Tool", actionPath: "#category-showcase" },
      secondary: { text: "Guides", actionPath: "/resources" }
    },
    media: [
      "/images/hero.png"
    ]
  },
  categoriesShowcase: {
    title: "Application Sub-Categories",
    subtitle: "Navigate through specialized category segments to find custom formulas.",
    items: [
      { name: "Laminates & Veneers", description: "Water-based glues with high coverage and zero bubbling.", image: "/images/Champion Super.png", link: "#" },
      { name: "PVC Edge Banding", description: "Fast setting glues designed to bond wood panels with plastic edge strips.", image: "/images/Aquabond.png", link: "#" }
    ]
  },
  applicationsGrid: {
    title: "Common Construction & Assembly Areas",
    subtitle: "Where Jivanjor adhesives are applied daily by Indian carpenters.",
    items: [
      { title: "Modular Kitchen Cabinets", description: "Demands moisture-proof Aquabond grade to resist steam and humidity.", image: "/images/Foambond.png" },
      { title: "Solid Wood Joints", description: "Requires high-viscosity Champion Super for high-stress tenon joints.", image: "/images/Watershield.png" }
    ]
  },
  substrates: {
    title: "Substrates Compatibility Matrix",
    subtitle: "Check substrate compatibility rating for modern interior woodworking boards.",
    items: [
      { name: "Plywood to Laminate", suitability: "Excellent", comment: "Highly recommended with all Jivanjor grades." },
      { name: "MDF to Acrylic Sheet", suitability: "Good", comment: "Use Foambond or specialized edge formulations." }
    ]
  }
};

const defaultApplicationsSections = {
  hero: {
    title: "Furniture & Woodwork Adhesive Solutions",
    breadcrumb: "Application Tips",
    media: [
      "/images/applications/Rectangle 2.png"
    ]
  },
  list: {
    title: "Woodworking Applications List",
    subtitle: "Browse specialized application areas and get bonding advice.",
    items: [
      {
        title: "Furniture Assembly & Joinery",
        desc: "For tables, chairs, cabinets, frames and other wood-to-wood bonding needs.",
        image: "/images/applications/Rectangle 150.png"
      },
      {
        title: "Lamination & Veneering",
        desc: "For bonding laminates, veneers and decorative surfaces to plywood, MDF or boards.",
        image: "/images/applications/Rectangle 151.png"
      },
      {
        title: "Edge Banding & Finishing",
        desc: "For clean edges, surface finishing and exposed board sides.",
        image: "/images/applications/Rectangle 152.png"
      },
      {
        title: "Wooden Cabinets & Storage Units",
        desc: "For wardrobes, shelves, drawers, modular storage and daily-use furniture.",
        image: "/images/applications/Rectangle 153.png"
      },
      {
        title: "Repair & Restoration",
        desc: "For fixing gaps, loose joints, damaged parts and small woodwork repairs.",
        image: "/images/applications/Rectangle 154.png"
      },
      {
        title: "Small Assembly & Detail Work",
        desc: "For quick fixes, smaller wooden parts and intricate woodwork applications.",
        image: "/images/applications/Rectangle 155.png"
      }
    ]
  },
  relatedProducts: {
    title: "Related Products",
    items: [
      {
        title: "Champion Super",
        description: "Provides a superior bond and strength, while being non-hazardous.",
        image: "/images/Champion Super.png",
        color: "bg-[#0083CB]"
      },
      {
        title: "Aquabond",
        description: "Heatproof and waterproof adhesive made with Cross Linking Polymer",
        image: "/images/Aquabond.png",
        color: "bg-[#077937]"
      },
      {
        title: "Foambond",
        description: "Great for upholstery, it connects foam, resin, leather, fabrics and metal.",
        image: "/images/Foambond.png",
        color: "bg-[#F57F26]"
      },
      {
        title: "Watershield",
        description: "Provides excellent water-resistance. Its superior flow makes it smooth and easy to apply.",
        image: "/images/Watershield.png",
        color: "bg-[#0498AA]"
      }
    ]
  },
  faqs: {
    title: "FAQs",
    subtitle: "Find quick answers about product use, coverage, setting time, pack sizes and technical details.",
    items: [
      {
        question: "Which adhesive should I use for furniture and woodwork?",
        answer: "The right adhesive depends on the surface, type of furniture work, expected strength and application condition."
      },
      {
        question: "Can Jivanjor adhesives be used for plywood and boards?",
        answer: "Yes, Jivanjor offers a range of adhesives specifically formulated for plywood, MDF and boards."
      }
    ]
  }
};

const defaultBlogSections = {
  hero: {
    title: "Practical Guidance for Woodwork and Adhesives",
    subtitle: "Knowledge Hub",
    desktopImage: "/images/blog/blog-hero.png"
  },
  list: {
    categories: [
      { name: "Latest Blogs", icon: "/images/blog/image 47.svg" },
      { name: "Application Tips", icon: "/images/blog/image 43.svg" },
      { name: "Choosing The Right Adhesive", icon: "/images/blog/Check-correct.svg" },
      { name: "Fix Common Issues", icon: "/images/blog/image 48.svg" }
    ],
    posts: []
  }
};

const defaultContractorSections = {
  hero: {
    title: "Build Your Business with India's Trusted Adhesive Partner",
    media: [
      "/images/contractor/Rectangle 2.png"
    ]
  },
  reachLeft: {
    title: "Step into the realm of Champions and Unlock a world of limitless advantages.",
    appText: "Download the Jivanjor Achievers Club App to enrol, access contractor benefits, track rewards and stay connected.",
    promoImage: "/images/contractor/contractor-app-promo.png",
    playStoreLink: "https://play.google.com/store",
    cards: [
      {
        title: "Reliable Product Range",
        desc: "Work with adhesives made for superior performance across every woodworking need.",
        icon: "/images/about/Ad-product.svg"
      },
      {
        title: "Trade-Focused Support",
        desc: "Get product information, application guidance and support to recommend with confidence.",
        icon: "/images/about/Spanner.svg"
      },
      {
        title: "Business Growth Opportunity",
        desc: "Connect with a growing adhesive brand that supports contractors, carpenters and channel partners across markets.",
        icon: "/images/contractor/Positive-dynamics.svg"
      }
    ]
  },
  presence: {
    title: "A Presence Built Through Trust",
    items: [
      { value: "Pan-India", label: "Market Presence", icon: "/images/about/presence.svg" },
      { value: "27,000+", label: "Distribution Touchpoints", icon: "/images/about/distribution.svg" },
      { value: "275K+", label: "Trusting Woodworking Professionals", icon: "/images/about/professionals.svg" },
      { value: "8 High-Tech", label: "Manufacturing Facilities", icon: "/images/about/facilities.svg" },
      { value: "20+", label: "Product Variants", icon: "/images/about/variants.svg" }
    ]
  },
  professionals: {
    title: "Built Around India’s Woodworking Professionals",
    desc: "Jivanjor continues to grow through the trust of carpenters, contractors, dealers and channel partners across India’s woodworking ecosystem.",
    testimonials: [
      {
        type: "video",
        name: "Mr. Imran Saifi",
        role: "Contractor Carpenter",
        image: "/images/contractor/testimonial-1.png",
        showPlayButton: true
      },
      {
        type: "video",
        name: "Mr. Imran Saifi",
        role: "Contractor Carpenter",
        image: "/images/contractor/testimonial-2.png",
        showPlayButton: true
      },
      {
        type: "text",
        name: "Mr. Imran Saifi",
        role: "Contractor Carpenter",
        quote: "Aquabond kitchen ka specialist hai."
      },
      {
        type: "video",
        name: "Mr. Imran Saifi",
        role: "Contractor Carpenter",
        image: "/images/contractor/testimonial-1.png",
        showPlayButton: true
      },
      {
        type: "text",
        name: "Mr. Mosim Ali",
        role: "Contractor Carpenter",
        quote: "Jivanjor products are highly reliable and strong."
      }
    ]
  }
};

const defaultPartnerSections = {
  hero: {
    title: "Build Your Dealership with a Growing Distribution Network",
    media: [
      "/images/dealer/Rectangle 2.png"
    ]
  },
  reachLeft: {
    title: "Become A Jivanjor Dealer",
    desc: "Jivanjor gives dealers access to a wide adhesive portfolio, professional market demand and the support needed to serve contractors, carpenters and end users with confidence.",
    cards: [
      {
        title: "Reliable Product Range",
        desc: "Work with adhesives made for superior performance across every woodworking need.",
        icon: "/images/about/Ad-product.svg"
      },
      {
        title: "Trade-Focused Support",
        desc: "Get product information, application guidance and support to recommend with confidence.",
        icon: "/images/about/Spanner.svg"
      },
      {
        title: "Business Growth Opportunity",
        desc: "Connect with a growing adhesive brand that supports contractors, carpenters and channel partners across markets.",
        icon: "/images/contractor/Positive-dynamics.svg"
      }
    ]
  },
  presence: {
    title: "A Presence Built Through Trust",
    items: [
      { value: "Pan-India", label: "Market Presence", icon: "/images/about/presence.svg" },
      { value: "27,000+", label: "Distribution Touchpoints", icon: "/images/about/distribution.svg" },
      { value: "275K+", label: "Trusting Woodworking Professionals", icon: "/images/about/professionals.svg" },
      { value: "8 High-Tech", label: "Manufacturing Facilities", icon: "/images/about/facilities.svg" },
      { value: "20+", label: "Product Variants", icon: "/images/about/variants.svg" }
    ]
  },
  gallery: {
    title: "Growing Through a Strong Dealer Network",
    desc: "Jivanjor continues to grow through a strong network of dealers, channel partners, contractors and woodworking professionals across India’s adhesive market.",
    items: [
      { title: "Technical Resources", link: "#", imageUrl: "/images/dealer/Rectangle 35.png" },
      { title: "Market Presence", link: "#", imageUrl: "/images/dealer/Rectangle 79.png" },
      { title: "Dealer Meet", link: "#", imageUrl: "/images/dealer/Rectangle 37.png" },
      { title: "Store Showcase", link: "#", imageUrl: "/images/dealer/Rectangle 30.png" },
      { title: "Warehousing", link: "#", imageUrl: "/images/dealer/Rectangle 34.png" }
    ]
  }
};

const defaultPrivacySections = {
  hero: {
    title: "Privacy Policy",
    desc: "Understand how we collect, use, and protect your information at Jivanjor."
  },
  content: {
    text: `Bubbles in laminate applications rarely happen by chance; they are the direct result of trapped air or moisture expanding beneath the surface. When pressing decorative laminates onto MDF or commercial ply, microscopic pockets of air can become trapped if the adhesive is spread unevenly.

In standard environments, a high-quality adhesive can sometimes absorb minor imperfections. However, when working in environments with fluctuating temperatures, the air within these trapped pockets expands, creating enough upward pressure to lift the laminate from the substrate, resulting in visible bubbles.

How Humidity Affects Curing Time

Wood and laminates are hygroscopic, meaning they naturally absorb and release moisture based on the surrounding environment. During monsoon seasons or in coastal regions, the moisture content in commercial plywood can spike significantly. When a water-based synthetic resin (PVA) is applied to damp wood, the curing process slows down.

The water within the adhesive takes longer to evaporate, extending the open time but weakening the initial grab. If pressure is released too early, the laminate can shift or lift, allowing air to enter the joint before the bond reaches its full structural integrity.

Three Application Rules for Flawless Laminates

To achieve a perfectly flat, secure bond on every project, contractors should standardize the following practices:

- Substrate Acclimatization: Never apply laminates to plywood that has just been brought in from the rain or high humidity. Allow both the substrate and the laminate to acclimatize in the working environment for at least 24 to 48 hours before bonding.
- The Right Spread Rate: Using a finely notched trowel is non-negotiable. A notched trowel ensures an even, consistent film of adhesive. Applying too much glue "just to be safe" actually increases the risk of bubbling, as excess moisture becomes trapped under the impermeable laminate.
- Center-to-Edge Pressing: Once the laminate is placed, use a J-roller or a firm block. Always apply heavy pressure starting from the absolute center of the board and work your way outward to the edges. This systematically forces any trapped air out before the edges are sealed.

The Role of Adhesive Formulation

Technique can only take you so far; the chemical makeup of your adhesive dictates your margin of error.

For high-stakes decorative surfaces, professionals should rely on specialist formulations rather than generic woodworking glues. Products like Jivanjor Lamino are specifically engineered with anti-bubble technology and water-resistant properties. Its specific viscosity prevents the easy entrapment of air during the spreading process, ensuring a smooth, premium finish every time.

For projects requiring rapid turnarounds without sacrificing coverage, stepping up to Jivanjor Supremo ensures a high-strength bond that sets rapidly, mitigating the risks associated with extended curing times in unpredictable weather.`
  }
};

const getFrontendUrl = (page: Page | { slug: string }, activeTemplate?: PageTemplate) => {
  if (!activeTemplate) return `/${page.slug}`;
  const rawData = activeTemplate.rawSections || activeTemplate.sections || {};
  const type = rawData.layoutType || "home";

  if (type === "about") {
    return page.slug === "about" ? "/about" : `/about/${page.slug}`;
  }
  if (type === "products") {
    return page.slug === "products" ? "/products" : `/products/${page.slug}`;
  }
  if (type === "categories") {
    return page.slug === "categories" ? "/categories" : `/categories/${page.slug}`;
  }
  if (type === "applications") {
    return page.slug === "applications" ? "/applications" : `/applications/${page.slug}`;
  }
  if (type === "blog") {
    return page.slug === "blog" ? "/blog" : `/blog/${page.slug}`;
  }
  if (type === "contractor") {
    return page.slug === "contractor" ? "/contractor" : `/contractor/${page.slug}`;
  }
  if (type === "partner") {
    return page.slug === "partner" ? "/partner" : `/partner/${page.slug}`;
  }
  if (type === "privacy") {
    return page.slug === "privacy" ? "/privacy" : `/privacy/${page.slug}`;
  }
  if (type === "home") {
    return page.slug === "home" ? "/" : `/${page.slug}`;
  }
  return `/${page.slug}`;
};

export default function PagesPage() {
  const [pages, setPages] = useState<Page[]>([]);
  const [templates, setTemplates] = useState<PageTemplate[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("general");

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    activeTemplateId: "" as string | null,
    sections: null as any,
  });

  const [seos, setSeos] = useState<any[]>([]);
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
  const [seoMetaTitle, setSeoMetaTitle] = useState("");
  const [seoMetaDescription, setSeoMetaDescription] = useState("");
  const [seoCanonicalUrl, setSeoCanonicalUrl] = useState("");
  const [seoImage, setSeoImage] = useState("");
  const [existingSeoId, setExistingSeoId] = useState<string | null>(null);

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Subpages Drag & Drop Reordering state
  const [draggedSubpageId, setDraggedSubpageId] = useState<string | null>(null);

  const handleSubpageDragStart = (e: React.DragEvent, id: string) => {
    setDraggedSubpageId(id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleSubpageDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleSubpageDrop = async (e: React.DragEvent, targetPage: Page, groupSubpages: Page[]) => {
    e.preventDefault();
    if (!draggedSubpageId || draggedSubpageId === targetPage.id) return;

    const sourceIndex = groupSubpages.findIndex((p) => p.id === draggedSubpageId);
    const targetIndex = groupSubpages.findIndex((p) => p.id === targetPage.id);
    if (sourceIndex < 0 || targetIndex < 0) return;

    const reordered = [...groupSubpages];
    const [moved] = reordered.splice(sourceIndex, 1);
    reordered.splice(targetIndex, 0, moved);

    const updatedPages = pages.map((p) => {
      const foundIdx = reordered.findIndex((item) => item.id === p.id);
      if (foundIdx !== -1) {
        const rawSec = typeof p.sections === "string" ? JSON.parse(p.sections || "{}") : (p.sections || {});
        return {
          ...p,
          sections: {
            ...rawSec,
            navOrder: foundIdx + 1,
          },
        };
      }
      return p;
    });

    setPages(updatedPages);
    setDraggedSubpageId(null);

    const currentIdx = reordered.findIndex((p) => p.id === editingId);
    if (currentIdx !== -1) {
      setFormData((prev: any) => ({
        ...prev,
        sections: {
          ...prev.sections,
          navOrder: currentIdx + 1,
        },
      }));
    }

    try {
      await Promise.all(
        reordered.map((page, idx) => {
          const rawSec = typeof page.sections === "string" ? JSON.parse(page.sections || "{}") : (page.sections || {});
          return api.savePage({
            ...page,
            sections: {
              ...rawSec,
              navOrder: idx + 1,
            },
          });
        })
      );
    } catch (err) {
      console.error("Failed to save reordered subpages navOrder", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [pagesList, tempsList, seosList, productsList] = await Promise.all([
        api.getPages(),
        api.getTemplates(),
        api.getSeoMetadata(),
        api.getProducts().catch(() => [])
      ]);
      setPages(pagesList);
      setTemplates(tempsList);
      setSeos(seosList);
      setAvailableProducts(productsList);
    } catch (err) {
      console.error("Failed to load pages/templates", err);
    } finally {
      setLoading(false);
    }
  };

  const handleTitleChange = (title: string) => {
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    setFormData((prev) => ({
      ...prev,
      title,
      slug: prev.slug === "home" ? "home" : slug,
    }));
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      title: "",
      slug: "",
      description: "",
      activeTemplateId: null,
      sections: null,
    });
    setSeoMetaTitle("");
    setSeoMetaDescription("");
    setSeoCanonicalUrl("https://jivanjor.com");
    setSeoImage("");
    setExistingSeoId(null);
    setActiveTab("general");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (page: Page) => {
    setEditingId(page.id);

    // Identify selected template layout type and bootstrap defaults
    let pageSections = page.sections;
    if (page.activeTemplateId) {
      const selectedTemp = templates.find((t) => t.id === page.activeTemplateId);
      if (selectedTemp) {
        const rawData = page.sections || selectedTemp.rawSections || selectedTemp.sections || {};
        const type = rawData.layoutType || "home";

        if (type === "about") {
          pageSections = {
            layoutType: "about",
            hero: { ...defaultAboutSections.hero, ...rawData.hero },
            promise: { ...defaultAboutSections.promise, ...rawData.promise },
            innovation: { ...defaultAboutSections.innovation, ...rawData.innovation },
            responsibility: { ...defaultAboutSections.responsibility, ...rawData.responsibility },
            presence: { ...defaultAboutSections.presence, ...rawData.presence },
            tvcs: { ...defaultAboutSections.tvcs, ...rawData.tvcs }
          };
        } else if (type === "products") {
          pageSections = {
            layoutType: "products",
            hero: { ...defaultProductSections.hero, ...rawData.hero },
            specifications: { ...defaultProductSections.specifications, ...rawData.specifications },
            features: { ...defaultProductSections.features, ...rawData.features },
            applicationGuide: { ...defaultProductSections.applicationGuide, ...rawData.applicationGuide },
            faqs: { ...defaultProductSections.faqs, ...rawData.faqs }
          };
        } else if (type === "categories") {
          pageSections = {
            layoutType: "categories",
            hero: { ...defaultCategorySections.hero, ...rawData.hero },
            categoriesShowcase: { ...defaultCategorySections.categoriesShowcase, ...rawData.categoriesShowcase },
            applicationsGrid: { ...defaultCategorySections.applicationsGrid, ...rawData.applicationsGrid },
            substrates: { ...defaultCategorySections.substrates, ...rawData.substrates }
          };
        } else if (type === "applications") {
          pageSections = {
            layoutType: "applications",
            hero: { ...defaultApplicationsSections.hero, ...rawData.hero },
            list: { ...defaultApplicationsSections.list, ...rawData.list },
            relatedProducts: { ...defaultApplicationsSections.relatedProducts, ...rawData.relatedProducts },
            faqs: { ...defaultApplicationsSections.faqs, ...rawData.faqs }
          };
        } else if (type === "blog") {
          pageSections = {
            layoutType: "blog",
            hero: { ...defaultBlogSections.hero, ...rawData.hero },
            list: { ...defaultBlogSections.list, ...rawData.list }
          };
        } else if (type === "contractor") {
          pageSections = {
            layoutType: "contractor",
            hero: { ...defaultContractorSections.hero, ...rawData.hero },
            reachLeft: { ...defaultContractorSections.reachLeft, ...rawData.reachLeft },
            presence: { ...defaultContractorSections.presence, ...rawData.presence },
            professionals: { ...defaultContractorSections.professionals, ...rawData.professionals }
          };
        } else if (type === "partner") {
          pageSections = {
            layoutType: "partner",
            hero: { ...defaultPartnerSections.hero, ...rawData.hero },
            reachLeft: { ...defaultPartnerSections.reachLeft, ...rawData.reachLeft },
            presence: { ...defaultPartnerSections.presence, ...rawData.presence },
            gallery: { ...defaultPartnerSections.gallery, ...rawData.gallery }
          };
        } else if (type === "privacy") {
          pageSections = {
            layoutType: "privacy",
            hero: { ...defaultPrivacySections.hero, ...rawData.hero },
            content: { ...defaultPrivacySections.content, ...rawData.content }
          };
        } else {
          const rawHero = rawData.hero || {};
          let heroSlides = rawHero.slides;
          if (!Array.isArray(heroSlides) || heroSlides.length === 0) {
            if (Array.isArray(rawHero.media) && rawHero.media.length > 0) {
              heroSlides = rawHero.media.map((url: string, idx: number) => {
                const isVid = isVideo(url);
                return {
                  id: `slide-${idx + 1}`,
                  type: isVid ? "video" : "image",
                  bgImage: isVid ? "/images/video-thumbnail.png" : url,
                  bgImagePhone: isVid ? "/images/video-thumbnail.png" : url,
                  videoUrl: isVid ? url : "",
                  cta1: rawHero.actionButtons?.primary ? { text: rawHero.actionButtons.primary.text, link: rawHero.actionButtons.primary.actionPath } : { text: "Explore Products", link: "#product-section" },
                  cta2: rawHero.actionButtons?.secondary ? { text: rawHero.actionButtons.secondary.text, link: rawHero.actionButtons.secondary.actionPath } : { text: "About Jivanjor", link: "/about" },
                };
              });
            } else {
              heroSlides = [...defaultHomeSections.hero.slides];
            }
          }

          const rawPR = rawData.productRange || {};
          let prCategories = rawPR.categories;
          if (!Array.isArray(prCategories) || prCategories.length === 0) {
            prCategories = [...defaultHomeSections.productRange.categories];
          }

          pageSections = {
            layoutType: "home",
            hero: {
              title: rawHero.title || defaultHomeSections.hero.title,
              actionButtons: rawHero.actionButtons || defaultHomeSections.hero.actionButtons,
              slides: heroSlides
            },
            productRange: {
              title: rawPR.title || defaultHomeSections.productRange.title,
              categories: prCategories
            },
            findAdhesive: { ...defaultHomeSections.findAdhesive, ...rawData.findAdhesive },
            whyTrustUs: { ...defaultHomeSections.whyTrustUs, ...rawData.whyTrustUs },
            showcaseGrid: { ...defaultHomeSections.showcaseGrid, ...rawData.showcaseGrid },
            ctaPromo: { ...defaultHomeSections.ctaPromo, ...rawData.ctaPromo },
            testimonials: { ...defaultHomeSections.testimonials, ...rawData.testimonials },
            knowledgeBase: { ...defaultHomeSections.knowledgeBase, ...rawData.knowledgeBase }
          };
        }
      }
    }

    setFormData({
      title: page.title,
      slug: page.slug,
      description: page.description || "",
      activeTemplateId: page.activeTemplateId || null,
      sections: pageSections || null,
    });

    const matchedSeo = seos.find((s) =>
      s.page_type === "static" &&
      (s.page_id === page.id ||
        s.page_id === page.slug ||
        (page.slug === "home" && s.page_id === "HOME_PAGE") ||
        (page.slug === "about" && s.page_id === "ABOUT_PAGE"))
    );
    if (matchedSeo) {
      setExistingSeoId(matchedSeo.id);
      setSeoMetaTitle(matchedSeo.meta_title);
      setSeoMetaDescription(matchedSeo.meta_description);
      setSeoCanonicalUrl(matchedSeo.canonical_url);
      setSeoImage(matchedSeo.image || "");
    } else {
      setExistingSeoId(null);
      setSeoMetaTitle("");
      setSeoMetaDescription("");
      setSeoCanonicalUrl(`https://jivanjor.com/${page.slug === "home" ? "" : page.slug}`);
      setSeoImage("");
    }

    setActiveTab("general");
    setIsModalOpen(true);
  };

  const handleTemplateChange = (templateId: string | null) => {
    let pageSections = null;
    if (templateId) {
      const selectedTemp = templates.find((t) => t.id === templateId);
      if (selectedTemp) {
        const rawData = selectedTemp.rawSections || selectedTemp.sections || {};
        const type = rawData.layoutType || "home";

        if (type === "about") {
          pageSections = {
            layoutType: "about",
            hero: { ...defaultAboutSections.hero, ...rawData.hero },
            promise: { ...defaultAboutSections.promise, ...rawData.promise },
            innovation: { ...defaultAboutSections.innovation, ...rawData.innovation },
            responsibility: { ...defaultAboutSections.responsibility, ...rawData.responsibility },
            presence: { ...defaultAboutSections.presence, ...rawData.presence },
            tvcs: { ...defaultAboutSections.tvcs, ...rawData.tvcs }
          };
        } else if (type === "products") {
          pageSections = {
            layoutType: "products",
            hero: { ...defaultProductSections.hero, ...rawData.hero },
            specifications: { ...defaultProductSections.specifications, ...rawData.specifications },
            features: { ...defaultProductSections.features, ...rawData.features },
            applicationGuide: { ...defaultProductSections.applicationGuide, ...rawData.applicationGuide },
            faqs: { ...defaultProductSections.faqs, ...rawData.faqs }
          };
        } else if (type === "categories") {
          pageSections = {
            layoutType: "categories",
            hero: { ...defaultCategorySections.hero, ...rawData.hero },
            categoriesShowcase: { ...defaultCategorySections.categoriesShowcase, ...rawData.categoriesShowcase },
            applicationsGrid: { ...defaultCategorySections.applicationsGrid, ...rawData.applicationsGrid },
            substrates: { ...defaultCategorySections.substrates, ...rawData.substrates }
          };
        } else if (type === "applications") {
          pageSections = {
            layoutType: "applications",
            hero: { ...defaultApplicationsSections.hero, ...rawData.hero },
            list: { ...defaultApplicationsSections.list, ...rawData.list },
            relatedProducts: { ...defaultApplicationsSections.relatedProducts, ...rawData.relatedProducts },
            faqs: { ...defaultApplicationsSections.faqs, ...rawData.faqs }
          };
        } else if (type === "blog") {
          pageSections = {
            layoutType: "blog",
            hero: { ...defaultBlogSections.hero, ...rawData.hero },
            list: { ...defaultBlogSections.list, ...rawData.list }
          };
        } else if (type === "contractor") {
          pageSections = {
            layoutType: "contractor",
            hero: { ...defaultContractorSections.hero, ...rawData.hero },
            reachLeft: { ...defaultContractorSections.reachLeft, ...rawData.reachLeft },
            presence: { ...defaultContractorSections.presence, ...rawData.presence },
            professionals: { ...defaultContractorSections.professionals, ...rawData.professionals }
          };
        } else if (type === "partner") {
          pageSections = {
            layoutType: "partner",
            hero: { ...defaultPartnerSections.hero, ...rawData.hero },
            reachLeft: { ...defaultPartnerSections.reachLeft, ...rawData.reachLeft },
            presence: { ...defaultPartnerSections.presence, ...rawData.presence },
            gallery: { ...defaultPartnerSections.gallery, ...rawData.gallery }
          };
        } else if (type === "privacy") {
          pageSections = {
            layoutType: "privacy",
            hero: { ...defaultPrivacySections.hero, ...rawData.hero },
            content: { ...defaultPrivacySections.content, ...rawData.content }
          };
        } else {
          const rawHero = rawData.hero || {};
          let heroSlides = rawHero.slides;
          if (!Array.isArray(heroSlides) || heroSlides.length === 0) {
            if (Array.isArray(rawHero.media) && rawHero.media.length > 0) {
              heroSlides = rawHero.media.map((url: string, idx: number) => {
                const isVid = isVideo(url);
                return {
                  id: `slide-${idx + 1}`,
                  type: isVid ? "video" : "image",
                  bgImage: isVid ? "/images/video-thumbnail.png" : url,
                  bgImagePhone: isVid ? "/images/video-thumbnail.png" : url,
                  videoUrl: isVid ? url : "",
                  cta1: rawHero.actionButtons?.primary ? { text: rawHero.actionButtons.primary.text, link: rawHero.actionButtons.primary.actionPath } : { text: "Explore Products", link: "#product-section" },
                  cta2: rawHero.actionButtons?.secondary ? { text: rawHero.actionButtons.secondary.text, link: rawHero.actionButtons.secondary.actionPath } : { text: "About Jivanjor", link: "/about" },
                };
              });
            } else {
              heroSlides = [...defaultHomeSections.hero.slides];
            }
          }

          const rawPR = rawData.productRange || {};
          let prCategories = rawPR.categories;
          if (!Array.isArray(prCategories) || prCategories.length === 0) {
            prCategories = [...defaultHomeSections.productRange.categories];
          }

          pageSections = {
            layoutType: "home",
            hero: {
              title: rawHero.title || defaultHomeSections.hero.title,
              actionButtons: rawHero.actionButtons || defaultHomeSections.hero.actionButtons,
              slides: heroSlides
            },
            productRange: {
              title: rawPR.title || defaultHomeSections.productRange.title,
              categories: prCategories
            },
            findAdhesive: { ...defaultHomeSections.findAdhesive, ...rawData.findAdhesive },
            whyTrustUs: { ...defaultHomeSections.whyTrustUs, ...rawData.whyTrustUs },
            showcaseGrid: { ...defaultHomeSections.showcaseGrid, ...rawData.showcaseGrid },
            ctaPromo: { ...defaultHomeSections.ctaPromo, ...rawData.ctaPromo },
            testimonials: { ...defaultHomeSections.testimonials, ...rawData.testimonials },
            knowledgeBase: { ...defaultHomeSections.knowledgeBase, ...rawData.knowledgeBase }
          };
        }
      }
    }

    setFormData((prev) => ({
      ...prev,
      activeTemplateId: templateId,
      sections: pageSections,
    }));
    setActiveTab("general");
  };

  const handleResetToTemplateDefaults = () => {
    if (!formData.activeTemplateId) return;
    if (!confirm("Are you sure you want to discard your customizations and reset this page's sections content to template defaults?")) return;

    const selectedTemp = templates.find((t) => t.id === formData.activeTemplateId);
    if (selectedTemp) {
      const rawData = selectedTemp.rawSections || selectedTemp.sections || {};
      const type = rawData.layoutType || "home";

      let resetSections: any = null;
      if (type === "about") {
        resetSections = {
          layoutType: "about",
          hero: { ...defaultAboutSections.hero, ...rawData.hero },
          promise: { ...defaultAboutSections.promise, ...rawData.promise },
          innovation: { ...defaultAboutSections.innovation, ...rawData.innovation },
          responsibility: { ...defaultAboutSections.responsibility, ...rawData.responsibility },
          presence: { ...defaultAboutSections.presence, ...rawData.presence },
          tvcs: { ...defaultAboutSections.tvcs, ...rawData.tvcs }
        };
      } else if (type === "products") {
        resetSections = {
          layoutType: "products",
          hero: { ...defaultProductSections.hero, ...rawData.hero },
          specifications: { ...defaultProductSections.specifications, ...rawData.specifications },
          features: { ...defaultProductSections.features, ...rawData.features },
          applicationGuide: { ...defaultProductSections.applicationGuide, ...rawData.applicationGuide },
          faqs: { ...defaultProductSections.faqs, ...rawData.faqs }
        };
      } else if (type === "categories") {
        resetSections = {
          layoutType: "categories",
          hero: { ...defaultCategorySections.hero, ...rawData.hero },
          categoriesShowcase: { ...defaultCategorySections.categoriesShowcase, ...rawData.categoriesShowcase },
          applicationsGrid: { ...defaultCategorySections.applicationsGrid, ...rawData.applicationsGrid },
          substrates: { ...defaultCategorySections.substrates, ...rawData.substrates }
        };
      } else if (type === "applications") {
        resetSections = {
          layoutType: "applications",
          hero: { ...defaultApplicationsSections.hero, ...rawData.hero },
          list: { ...defaultApplicationsSections.list, ...rawData.list },
          relatedProducts: { ...defaultApplicationsSections.relatedProducts, ...rawData.relatedProducts },
          faqs: { ...defaultApplicationsSections.faqs, ...rawData.faqs }
        };
      } else if (type === "blog") {
        resetSections = {
          layoutType: "blog",
          hero: { ...defaultBlogSections.hero, ...rawData.hero },
          list: { ...defaultBlogSections.list, ...rawData.list }
        };
      } else if (type === "contractor") {
        resetSections = {
          layoutType: "contractor",
          hero: { ...defaultContractorSections.hero, ...rawData.hero },
          reachLeft: { ...defaultContractorSections.reachLeft, ...rawData.reachLeft },
          presence: { ...defaultContractorSections.presence, ...rawData.presence },
          professionals: { ...defaultContractorSections.professionals, ...rawData.professionals }
        };
      } else if (type === "partner") {
        resetSections = {
          layoutType: "partner",
          hero: { ...defaultPartnerSections.hero, ...rawData.hero },
          reachLeft: { ...defaultPartnerSections.reachLeft, ...rawData.reachLeft },
          presence: { ...defaultPartnerSections.presence, ...rawData.presence },
          gallery: { ...defaultPartnerSections.gallery, ...rawData.gallery }
        };
      } else if (type === "privacy") {
        resetSections = {
          layoutType: "privacy",
          hero: { ...defaultPrivacySections.hero, ...rawData.hero },
          content: { ...defaultPrivacySections.content, ...rawData.content }
        };
      } else {
        const rawHero = rawData.hero || {};
        let heroSlides = rawHero.slides;
        if (!Array.isArray(heroSlides) || heroSlides.length === 0) {
          if (Array.isArray(rawHero.media) && rawHero.media.length > 0) {
            heroSlides = rawHero.media.map((url: string, idx: number) => {
              const isVid = isVideo(url);
              return {
                id: `slide-${idx + 1}`,
                type: isVid ? "video" : "image",
                bgImage: isVid ? "/images/video-thumbnail.png" : url,
                bgImagePhone: isVid ? "/images/video-thumbnail.png" : url,
                videoUrl: isVid ? url : "",
                cta1: rawHero.actionButtons?.primary ? { text: rawHero.actionButtons.primary.text, link: rawHero.actionButtons.primary.actionPath } : { text: "Explore Products", link: "#product-section" },
                cta2: rawHero.actionButtons?.secondary ? { text: rawHero.actionButtons.secondary.text, link: rawHero.actionButtons.secondary.actionPath } : { text: "About Jivanjor", link: "/about" },
              };
            });
          } else {
            heroSlides = [...defaultHomeSections.hero.slides];
          }
        }
        const rawPR = rawData.productRange || {};
        let prCategories = rawPR.categories;
        if (!Array.isArray(prCategories) || prCategories.length === 0) {
          prCategories = [...defaultHomeSections.productRange.categories];
        }

        resetSections = {
          layoutType: "home",
          hero: {
            title: rawHero.title || defaultHomeSections.hero.title,
            actionButtons: rawHero.actionButtons || defaultHomeSections.hero.actionButtons,
            slides: heroSlides
          },
          productRange: {
            title: rawPR.title || defaultHomeSections.productRange.title,
            categories: prCategories
          },
          findAdhesive: { ...defaultHomeSections.findAdhesive, ...rawData.findAdhesive },
          whyTrustUs: { ...defaultHomeSections.whyTrustUs, ...rawData.whyTrustUs },
          showcaseGrid: { ...defaultHomeSections.showcaseGrid, ...rawData.showcaseGrid },
          ctaPromo: { ...defaultHomeSections.ctaPromo, ...rawData.ctaPromo },
          testimonials: { ...defaultHomeSections.testimonials, ...rawData.testimonials },
          knowledgeBase: { ...defaultHomeSections.knowledgeBase, ...rawData.knowledgeBase }
        };
      }

      setFormData((prev) => ({
        ...prev,
        sections: resetSections,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const savedPage = await api.savePage({
        id: editingId || undefined,
        ...formData,
      });

      const targetPageId = savedPage.slug === "home" ? "HOME_PAGE" : (savedPage.id || savedPage.slug);
      await api.saveSeoMetadata({
        id: existingSeoId || undefined,
        page_type: "static",
        page_id: targetPageId,
        meta_title: seoMetaTitle || savedPage.title,
        meta_description: seoMetaDescription || savedPage.description || "",
        canonical_url: seoCanonicalUrl || `https://jivanjor.com/${savedPage.slug === "home" ? "" : savedPage.slug}`,
        image: seoImage || undefined,
      });

      setIsModalOpen(false);
      await loadData();
    } catch (err) {
      console.error("Failed to save page", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deletePage(id);
      setDeleteConfirmId(null);
      await loadData();
    } catch (err) {
      console.error("Failed to delete page", err);
    }
  };

  // State Update Helpers for dynamic sections
  const updateSectionField = (sectionKey: string, fieldKey: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      sections: {
        ...prev.sections,
        [sectionKey]: {
          ...prev.sections?.[sectionKey],
          [fieldKey]: value,
        },
      },
    }));
  };

  const updateNestedField = (sectionKey: string, subKey: string, fieldKey: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      sections: {
        ...prev.sections,
        [sectionKey]: {
          ...prev.sections?.[sectionKey],
          [subKey]: {
            ...prev.sections?.[sectionKey]?.[subKey],
            [fieldKey]: value,
          },
        },
      },
    }));
  };

  const updateItemField = (sectionKey: string, idx: number, fieldKey: string, value: any) => {
    setFormData((prev: any) => {
      const items = [...(prev.sections?.[sectionKey]?.items || [])];
      items[idx] = { ...items[idx], [fieldKey]: value };
      return {
        ...prev,
        sections: {
          ...prev.sections,
          [sectionKey]: {
            ...prev.sections?.[sectionKey],
            items,
          },
        },
      };
    });
  };

  const updateNestedItemField = (sectionKey: string, idx: number, subKey: string, fieldKey: string, value: any) => {
    setFormData((prev: any) => {
      const items = [...(prev.sections?.[sectionKey]?.items || [])];
      items[idx] = {
        ...items[idx],
        [subKey]: {
          ...items[idx]?.[subKey],
          [fieldKey]: value
        }
      };
      return {
        ...prev,
        sections: {
          ...prev.sections,
          [sectionKey]: {
            ...prev.sections?.[sectionKey],
            items,
          },
        },
      };
    });
  };

  const addItem = (sectionKey: string, defaultItem: any) => {
    setFormData((prev: any) => {
      const items = [...(prev.sections?.[sectionKey]?.items || []), defaultItem];
      return {
        ...prev,
        sections: {
          ...prev.sections,
          [sectionKey]: {
            ...prev.sections?.[sectionKey],
            items,
          },
        },
      };
    });
  };

  const removeItem = (sectionKey: string, idx: number) => {
    setFormData((prev: any) => {
      const items = (prev.sections?.[sectionKey]?.items || []).filter((_: any, i: number) => i !== idx);
      return {
        ...prev,
        sections: {
          ...prev.sections,
          [sectionKey]: {
            ...prev.sections?.[sectionKey],
            items,
          },
        },
      };
    });
  };

  // Filter Pages
  const filteredPages = pages
    .filter((p) => {
      const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(search.toLowerCase()));
      return matchesSearch;
    })
    .sort((a, b) => {
      const dateA = new Date(a.updatedAt || a.updated_at || a.createdAt || a.created_at || 0).getTime();
      const dateB = new Date(b.updatedAt || b.updated_at || b.createdAt || b.created_at || 0).getTime();
      return dateB - dateA;
    });

  const layoutType = formData.activeTemplateId ? (formData.sections?.layoutType || "home") : "";
  const currentLayoutType = formData.sections?.layoutType || (formData.activeTemplateId ? templates.find(t => t.id === formData.activeTemplateId)?.slug : "");

  const siblingSubpages: Page[] = pages
    .filter((p) => {
      if (!currentLayoutType) return true;
      try {
        const sec = typeof p.sections === "string" ? JSON.parse(p.sections || "{}") : (p.sections || {});
        return p.slug === currentLayoutType || sec?.layoutType === currentLayoutType;
      } catch {
        return p.slug === currentLayoutType;
      }
    })
    .sort((a, b) => {
      const secA = typeof a.sections === "string" ? JSON.parse(a.sections || "{}") : (a.sections || {});
      const secB = typeof b.sections === "string" ? JSON.parse(b.sections || "{}") : (b.sections || {});
      if (secA.navOrder != null && secB.navOrder != null) return secA.navOrder - secB.navOrder;
      if (secA.navOrder != null) return -1;
      if (secB.navOrder != null) return 1;
      return a.title.localeCompare(b.title);
    });

  // Build Dynamic tabs list based on Layout Type
  const tabsList = [
    { id: "general", label: "General Properties", icon: Sliders },
    { id: "seo", label: "SEO Metadata", icon: Search },
    ...(layoutType === "about"
      ? [
        { id: "hero", label: "Hero Banner", icon: Layout },
        { id: "promise", label: "Stronger Bonds Promise", icon: Shield },
        { id: "innovation", label: "Research & Innovation", icon: Sparkles },
        { id: "responsibility", label: "Quality & Responsibility", icon: Award },
        { id: "presence", label: "Market Presence", icon: Grid },
        { id: "tvcs", label: "Brand TVCs", icon: MessageSquare },
      ]
      : layoutType === "products"
        ? [
          { id: "hero", label: "Hero Banner", icon: Layout },
          { id: "specifications", label: "Technical Specs", icon: Sliders },
          { id: "features", label: "Key Features", icon: Shield },
          { id: "applicationGuide", label: "Application Steps", icon: Grid },
          { id: "faqs", label: "Troubleshooting FAQs", icon: Award },
        ]
        : layoutType === "categories"
          ? [
            { id: "hero", label: "Hero Banner", icon: Layout },
            { id: "categoriesShowcase", label: "Sub-Categories Showcase", icon: Grid },
            { id: "applicationsGrid", label: "Common Areas Grid", icon: FileText },
            { id: "substrates", label: "Substrates Matrix", icon: Shield },
          ]
          : layoutType === "applications"
            ? [
              { id: "hero", label: "Hero Banner", icon: Layout },
              { id: "list", label: "Applications List", icon: Grid },
              { id: "relatedProducts", label: "Related Products", icon: Layers },
              { id: "faqs", label: "FAQs Accordion", icon: Award },
            ]
            : layoutType === "blog"
              ? [
                { id: "hero", label: "Hero Banner", icon: Layout },
                { id: "list", label: "Browse Categories", icon: FileText },
              ]
              : layoutType === "contractor"
                ? [
                  { id: "hero", label: "Hero Banner", icon: Layout },
                  { id: "reachLeft", label: "App & Features Setup", icon: FileText },
                  { id: "presence", label: "Market Presence", icon: Grid },
                  { id: "professionals", label: "Testimonials", icon: Bookmark },
                ]
                : layoutType === "partner"
                  ? [
                    { id: "hero", label: "Hero Banner", icon: Layout },
                    { id: "reachLeft", label: "Dealer Features Setup", icon: FileText },
                    { id: "presence", label: "Market Presence", icon: Grid },
                    { id: "gallery", label: "Dealer Network Gallery", icon: Grid },
                  ]
                  : layoutType === "privacy"
                    ? [
                      { id: "hero", label: "Hero Banner", icon: Layout },
                      { id: "content", label: "Document Content Editor", icon: FileText },
                    ]
                    : layoutType === "home"
                      ? [
                        { id: "hero", label: "Hero Banner", icon: Layout },
                        { id: "productRange", label: "Products Range", icon: Grid },
                        { id: "findAdhesive", label: "Right Choice Categories", icon: Search },
                        { id: "whyTrustUs", label: "Trust Factors", icon: Shield },
                        { id: "showcaseGrid", label: "Resource Grid", icon: FileText },
                        { id: "ctaPromo", label: "CTA Promotion", icon: MessageSquare },
                        { id: "testimonials", label: "Testimonials", icon: Bookmark },
                        { id: "knowledgeBase", label: "Knowledge Articles", icon: Award },
                      ]
                      : [])
  ];

  // Pagination
  const totalPages = Math.ceil(filteredPages.length / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPages = filteredPages.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <AdminLayout>
      {!isModalOpen ? (
        <div className="space-y-6 animate-[fadeIn_0.2s_ease-out]">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-foreground">
                Dynamic Pages
              </h1>
              <p className="text-sm font-semibold text-foreground/45 uppercase tracking-wider">
                Manage custom dynamic pages and mapped layout template hubs
              </p>
            </div>
            <button
              onClick={handleOpenAdd}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary hover:opacity-90 text-white font-bold text-sm shadow-md shadow-primary/10 cursor-pointer transition-all self-start sm:self-auto"
            >
              <Plus className="h-5 w-5" />
              <span>Create Dynamic Page</span>
            </button>
          </div>

          {/* Filters Panel */}
          <div className="bg-background border border-border p-4 rounded-2xl shadow-sm transition-colors duration-300">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-3.5 h-4.5 w-4.5 text-foreground/40" />
              <input
                type="text"
                placeholder="Search dynamic pages..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20 dark:focus:border-primary"
              />
            </div>
          </div>

          {/* Database Table */}
          <div className="bg-background border border-border rounded-3xl overflow-hidden shadow-sm transition-colors duration-300">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border bg-surface/55">
                    <th className="p-5 text-xs font-bold text-foreground/45 uppercase tracking-wider">Page Pathway</th>
                    <th className="p-5 text-xs font-bold text-foreground/45 uppercase tracking-wider">Active Layout Template</th>
                    <th className="p-5 text-xs font-bold text-foreground/45 uppercase tracking-wider">Description</th>
                    <th className="p-5 text-xs font-bold text-foreground/45 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="p-10 text-center text-sm font-semibold text-foreground/40 bg-surface/5">
                        <div className="flex flex-col items-center gap-3">
                          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                          <span>Retrieving dynamic pages from database...</span>
                        </div>
                      </td>
                    </tr>
                  ) : currentPages.length > 0 ? (
                    currentPages.map((page) => {
                      const activeTemplate = templates.find((t) => t.id === page.activeTemplateId);
                      return (
                        <tr key={page.id} className="hover:bg-surface/30 transition-colors">
                          <td className="p-5">
                            <div className="flex items-center gap-3">
                              <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                                <FileText className="h-5 w-5" />
                              </div>
                              <div>
                                <p className="font-extrabold text-sm text-foreground">{page.title}</p>
                                <p className="text-[10px] text-foreground/45 font-bold tracking-wider">/{page.slug}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-5">
                            {activeTemplate ? (
                              <div className="flex flex-col gap-1">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-green-600 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/30 self-start">
                                  <LayoutTemplate className="h-3.5 w-3.5 shrink-0 text-green-600" />
                                  <span>{activeTemplate.name}</span>
                                </span>
                              </div>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-surface text-foreground/40 border border-border self-start">
                                <AlertCircle className="h-3.5 w-3.5 text-foreground/30 shrink-0" />
                                <span>No Layout Mapped (Draft)</span>
                              </span>
                            )}
                          </td>
                          <td className="p-5 text-sm text-foreground/60 max-w-xs truncate">
                            {page.description || "No description provided."}
                          </td>
                          <td className="p-5 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleOpenEdit(page)}
                                className="p-2 rounded-lg bg-surface hover:bg-primary/10 text-foreground/60 hover:text-primary transition-all cursor-pointer border border-border"
                                title="Edit page"
                              >
                                <Edit2 className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => setDeleteConfirmId(page.id)}
                                className="p-2 rounded-lg bg-surface hover:bg-primary/10 text-foreground/60 hover:text-primary transition-all cursor-pointer border border-border"
                                title="Delete page"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={4} className="p-10 text-center text-sm font-semibold text-foreground/40 bg-surface/5">
                        No custom dynamic pages created.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-surface/20">
                <span className="text-xs font-bold text-foreground/45 uppercase tracking-wider">
                  Page {currentPage} of {totalPages}
                </span>
                <div className="flex gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-bold border border-border text-foreground hover:bg-surface disabled:opacity-40 cursor-pointer"
                  >
                    Previous
                  </button>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-bold border border-border text-foreground hover:bg-surface disabled:opacity-40 cursor-pointer"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        // ==================== FULL-PAGE SECTION FORM WORKSPACE ====================
        <div className="space-y-6 animate-[fadeIn_0.2s_ease-out] flex flex-col min-h-[80vh]">
          {/* Header Workspace Title Bar */}
          <div className="flex items-center gap-3 border-b border-border pb-5 shrink-0">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="p-2 rounded-xl bg-surface hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-955/20 text-foreground/60 dark:text-zinc-400 border border-border cursor-pointer transition-all"
              title="Discard changes"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl font-black text-foreground flex items-center gap-2">
                <Layers className="h-6 w-6 text-primary" />
                <span>{editingId ? "Dynamic Page Layout Studio" : "Configure Custom Dynamic Page"}</span>
              </h1>
              <p className="text-sm font-semibold text-foreground/45 uppercase tracking-wider">
                Establish custom configurations and edit layout section contents specifically for this page
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex-1 flex flex-col lg:flex-row gap-6">
            {/* Sidebar tabs */}
            <div className="w-full lg:w-1/4 flex flex-col gap-1.5 shrink-0 bg-surface/30 p-3 border border-border rounded-2xl h-fit">
              {tabsList.map((tab) => {
                const TabIcon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-left text-sm font-bold transition-all cursor-pointer border ${activeTab === tab.id
                      ? "bg-primary text-white border-primary shadow-sm"
                      : "bg-background/40 hover:bg-surface text-foreground/80 border-border"
                      }`}
                  >
                    <TabIcon className={`h-4.5 w-4.5 ${activeTab === tab.id ? "text-white" : "text-primary"}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}

              {formData.activeTemplateId && (
                <button
                  type="button"
                  onClick={handleResetToTemplateDefaults}
                  className="flex items-center justify-center gap-2 mt-4 px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 dark:bg-red-955/20 dark:hover:bg-red-955/35 dark:border-red-900/40 text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  Reset to Defaults
                </button>
              )}
            </div>

            {/* Input Canvas Panels */}
            <div className="flex-1 bg-background border border-border p-6 rounded-3xl shadow-sm min-h-[60vh] flex flex-col justify-between">
              <div className="space-y-6">
                {activeTab === "general" && (
                  <div className="space-y-6 animate-[fadeIn_0.15s_ease-out]">
                    <div className="flex items-center gap-2 border-b border-border pb-3">
                      <Sliders className="h-5 w-5 text-primary" />
                      <h3 className="text-base font-extrabold text-foreground">General Properties</h3>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">
                        Page Title Name
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        placeholder="e.g. Partner Portal Consultation"
                        className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20 dark:focus:border-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2 flex items-center justify-between">
                        <span>Page Slug Path Reference</span>
                        {formData.slug === "home" && (
                          <span className="text-[10px] text-primary font-bold uppercase tracking-wider animate-[fadeIn_0.2s_ease-out]">
                            Fixed / Landing Page
                          </span>
                        )}
                      </label>
                      <input
                        type="text"
                        required
                        disabled={formData.slug === "home"}
                        value={formData.slug}
                        onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, "") }))}
                        placeholder="partner-portal"
                        className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20 dark:focus:border-primary disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                      />
                      {formData.slug === "home" && (
                        <p className="mt-1.5 text-[11px] font-semibold text-primary animate-[fadeIn_0.2s_ease-out]">
                          ⚠️ The home page pathway is locked and cannot be modified.
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">
                        Page Description & Details
                      </label>
                      <textarea
                        rows={4}
                        value={formData.description}
                        onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                        placeholder="Write the general outline or target intent of this custom dynamic layout..."
                        className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20 dark:focus:border-primary resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">
                        Active Layout Template
                      </label>
                      {templates.length > 0 ? (
                        <select
                          value={formData.activeTemplateId || ""}
                          onChange={(e) => handleTemplateChange(e.target.value || null)}
                          className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20 dark:focus:border-primary text-foreground cursor-pointer"
                        >
                          <option value="">-- No Active Template (Draft Mode) --</option>
                          {templates.map((t) => (
                            <option key={t.id} value={t.id}>
                              {t.name} ({t.slug})
                            </option>
                          ))}
                        </select>
                      ) : (
                        <div className="p-4 bg-surface/30 border border-border rounded-xl text-xs text-foreground/50 font-semibold flex items-center gap-2">
                          <LayoutTemplate className="h-4.5 w-4.5 text-foreground/45" />
                          <span>No layout templates assembled in the system yet. Build one in the Templates Manager first.</span>
                        </div>
                      )}
                    </div>

                    {/* Navbar Display Order & Drag-and-Drop Subpages Reordering */}
                    {formData.sections?.layoutType && formData.sections.layoutType !== "home" && (
                      <div className="p-5 border border-border bg-surface/20 rounded-2xl space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Layers className="h-4.5 w-4.5 text-primary shrink-0" />
                            <span className="text-xs font-black uppercase text-foreground/45 tracking-wider">
                              Navbar Subpages Reordering
                            </span>
                          </div>
                          <span className="text-[10px] font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full uppercase tracking-wider">
                            {formData.sections.layoutType} section
                          </span>
                        </div>

                        <p className="text-xs text-foreground/50 font-medium leading-relaxed">
                          Drag and drop subpages below to reorder their display sequence in the top Navbar mega-menu for this section.
                        </p>

                        {siblingSubpages.length > 0 ? (
                          <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
                            {siblingSubpages.map((sub, idx) => {
                              const isCurrent = sub.id === editingId || sub.title === formData.title;
                              return (
                                <div
                                  key={sub.id || idx}
                                  draggable
                                  onDragStart={(e) => handleSubpageDragStart(e, sub.id)}
                                  onDragOver={handleSubpageDragOver}
                                  onDrop={(e) => handleSubpageDrop(e, sub, siblingSubpages)}
                                  className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-grab active:cursor-grabbing ${isCurrent
                                    ? "bg-primary/10 border-primary/40 shadow-xs"
                                    : "bg-background/80 hover:bg-surface border-border"
                                    } ${draggedSubpageId === sub.id ? "opacity-30 border-dashed border-primary" : ""}`}
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="p-1 rounded hover:bg-surface text-foreground/40 hover:text-foreground transition-colors" title="Drag to reorder">
                                      <GripVertical className="h-4 w-4 shrink-0" />
                                    </div>
                                    <span className="h-6 w-6 rounded-md bg-surface flex items-center justify-center text-[11px] font-extrabold text-foreground/70 border border-border">
                                      #{idx + 1}
                                    </span>
                                    <div>
                                      <p className="font-bold text-xs text-foreground flex items-center gap-2">
                                        <span>{sub.title}</span>
                                        {isCurrent && (
                                          <span className="text-[9px] font-black uppercase tracking-wider text-primary bg-primary/15 px-2 py-0.5 rounded-full">
                                            This Page
                                          </span>
                                        )}
                                      </p>
                                      <p className="text-[10px] text-foreground/45 font-semibold">
                                        /{sub.slug}
                                      </p>
                                    </div>
                                  </div>

                                  <span className="text-[10px] font-extrabold text-foreground/50 bg-surface px-2.5 py-1 rounded-md border border-border">
                                    Order #{idx + 1}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="p-4 bg-background border border-dashed border-border rounded-xl text-xs text-foreground/50 font-semibold text-center">
                            No sibling subpages found. Create more pages with the "{formData.sections.layoutType}" layout template to enable reordering.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "seo" && (
                  <div className="space-y-6 animate-[fadeIn_0.15s_ease-out]">
                    <div className="flex items-center gap-2 border-b border-border pb-3">
                      <Search className="h-5 w-5 text-primary" />
                      <h3 className="text-base font-extrabold text-foreground">SEO Metadata Settings</h3>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2 flex justify-between items-center">
                        <span>Meta Title</span>
                        <span className={`text-[10px] font-bold ${seoMetaTitle.length > 60 || seoMetaTitle.length < 50 ? "text-amber-500" : "text-green-500"}`}>
                          {seoMetaTitle.length} / 60 chars (Recommended: 50-60)
                        </span>
                      </label>
                      <input
                        type="text"
                        value={seoMetaTitle}
                        onChange={(e) => setSeoMetaTitle(e.target.value)}
                        placeholder="Premium White Glue Carpentry Adhesives | Jivanjor"
                        className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2 flex justify-between items-center">
                        <span>Meta Description</span>
                        <span className={`text-[10px] font-bold ${seoMetaDescription.length > 160 || seoMetaDescription.length < 120 ? "text-amber-500" : "text-green-500"}`}>
                          {seoMetaDescription.length} / 160 chars (Recommended: 120-160)
                        </span>
                      </label>
                      <textarea
                        rows={4}
                        value={seoMetaDescription}
                        onChange={(e) => setSeoMetaDescription(e.target.value)}
                        placeholder="Discover Jivanjor white carpentry glues formulated with polymer innovations..."
                        className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20 resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">
                        Canonical URL
                      </label>
                      <input
                        type="text"
                        value={seoCanonicalUrl}
                        onChange={(e) => setSeoCanonicalUrl(e.target.value)}
                        placeholder="https://jivanjor.com/..."
                        className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20"
                      />
                    </div>

                    <ImageUpload
                      label="SEO Feature Image (Open Graph)"
                      value={seoImage}
                      onChange={(url) => setSeoImage(url)}
                      folder="seo"
                    />

                    {/* Google Snippet Search Engine Live Preview */}
                    <div className="p-5 border border-border bg-surface/20 rounded-2xl space-y-3">
                      <span className="text-[10px] font-black uppercase text-foreground/45 tracking-wider">Search Engine Result Preview</span>
                      <div className="p-4 bg-background border border-border rounded-xl font-sans text-left space-y-1 max-w-xl shadow-inner">
                        {seoImage ? (
                          <div className="flex gap-4">
                            <div className="flex-1 space-y-1 min-w-0">
                              <div className="text-xs text-foreground/40 truncate">
                                {seoCanonicalUrl || "https://jivanjor.com"}
                              </div>
                              <div className="text-base text-[#1a0dab] dark:text-[#8ab4f8] font-medium hover:underline cursor-pointer truncate">
                                {seoMetaTitle || "Please specify a Meta Title..."}
                              </div>
                              <p className="text-xs text-foreground/60 leading-normal line-clamp-2">
                                {seoMetaDescription || "Please write a Meta Description page overview snippet..."}
                              </p>
                            </div>
                            <div className="w-16 h-16 rounded-xl bg-surface border border-border overflow-hidden shrink-0 flex items-center justify-center">
                              <img src={seoImage} alt="SEO Preview" className="w-full h-full object-cover" />
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="text-xs text-foreground/40 truncate">
                              {seoCanonicalUrl || "https://jivanjor.com"}
                            </div>
                            <div className="text-base text-[#1a0dab] dark:text-[#8ab4f8] font-medium hover:underline cursor-pointer truncate">
                              {seoMetaTitle || "Please specify a Meta Title..."}
                            </div>
                            <p className="text-xs text-foreground/60 leading-normal line-clamp-2">
                              {seoMetaDescription || "Please write a Meta Description page overview snippet..."}
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "hero" && formData.sections?.hero && formData.sections.layoutType !== "blog" && layoutType !== "privacy" && (
                  <div className="space-y-6 animate-[fadeIn_0.15s_ease-out]">
                    <div className="flex items-center gap-2 border-b border-border pb-3">
                      <Layout className="h-5 w-5 text-primary" />
                      <h3 className="text-base font-extrabold text-foreground">Global Hero Settings</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">
                          Hero Banner Title Text
                        </label>
                        <input
                          type="text"
                          value={formData.sections.hero.title || ""}
                          onChange={(e) => updateSectionField("hero", "title", e.target.value)}
                          placeholder="Dependable Bonds for Indian Homes"
                          className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary focus:bg-background"
                        />
                      </div>
                    </div>

                    {/* Hero Action Buttons */}
                    <div className="p-5 border border-border bg-surface/20 rounded-2xl space-y-4">
                      <h4 className="text-xs font-black uppercase text-primary tracking-wider">Default CTA Action Buttons Setup</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Primary Button */}
                        <div className="space-y-3">
                          <span className="text-[10px] font-black uppercase text-foreground/45 tracking-wider">Primary Call-to-action</span>
                          <input
                            type="text"
                            value={formData.sections.hero.actionButtons?.primary?.text || ""}
                            onChange={(e) => updateNestedField("hero", "actionButtons", "primary", { ...formData.sections.hero.actionButtons?.primary, text: e.target.value })}
                            placeholder="Button Text"
                            className="w-full px-4 py-2 bg-background border border-border rounded-xl text-xs outline-none focus:border-primary"
                          />
                          <input
                            type="text"
                            value={formData.sections.hero.actionButtons?.primary?.actionPath || ""}
                            onChange={(e) => updateNestedField("hero", "actionButtons", "primary", { ...formData.sections.hero.actionButtons?.primary, actionPath: e.target.value })}
                            placeholder="Action Path (e.g. #product-section)"
                            className="w-full px-4 py-2 bg-background border border-border rounded-xl text-xs outline-none focus:border-primary"
                          />
                        </div>
                        {/* Secondary Button */}
                        <div className="space-y-3">
                          <span className="text-[10px] font-black uppercase text-foreground/45 tracking-wider">Secondary Call-to-action</span>
                          <input
                            type="text"
                            value={formData.sections.hero.actionButtons?.secondary?.text || ""}
                            onChange={(e) => updateNestedField("hero", "actionButtons", "secondary", { ...formData.sections.hero.actionButtons?.secondary, text: e.target.value })}
                            placeholder="Button Text"
                            className="w-full px-4 py-2 bg-background border border-border rounded-xl text-xs outline-none focus:border-primary"
                          />
                          <input
                            type="text"
                            value={formData.sections.hero.actionButtons?.secondary?.actionPath || ""}
                            onChange={(e) => updateNestedField("hero", "actionButtons", "secondary", { ...formData.sections.hero.actionButtons?.secondary, actionPath: e.target.value })}
                            placeholder="Action Path (e.g. /about)"
                            className="w-full px-4 py-2 bg-background border border-border rounded-xl text-xs outline-none focus:border-primary"
                          />
                        </div>
                      </div>
                    </div>

                    {layoutType === "about" ? (
                      <div className="space-y-6 border-t border-border pt-6 mt-4">
                        <div className="p-4 bg-primary/5 border border-primary/20 rounded-2xl text-xs font-bold text-primary leading-relaxed">
                          💡 INFO: The watermark background image is static. The about template requires exactly 2 images: one optimized for desktop screens and one optimized for mobile screens.
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider">
                              Desktop Hero Image (Desktop Banner)
                            </label>
                            <ImageUpload
                              value={formData.sections.hero.media?.[0] || ""}
                              onChange={(url) => {
                                const newMedia = [...(formData.sections.hero.media || [])];
                                newMedia[0] = url;
                                updateSectionField("hero", "media", newMedia);
                              }}
                              folder="templates"
                            />
                            <span className="text-[10px] text-foreground/40 font-medium">Recommended aspect ratio: 16:9 (e.g. 1920x1080)</span>
                          </div>
                          <div className="space-y-2">
                            <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider">
                              Mobile Hero Image (Mobile Banner)
                            </label>
                            <ImageUpload
                              value={formData.sections.hero.media?.[1] || ""}
                              onChange={(url) => {
                                const newMedia = [...(formData.sections.hero.media || [])];
                                newMedia[1] = url;
                                updateSectionField("hero", "media", newMedia);
                              }}
                              folder="templates"
                            />
                            <span className="text-[10px] text-foreground/40 font-medium">Recommended aspect ratio: 4:5 or 9:16 (e.g. 750x1334)</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6 border-t border-border pt-6 mt-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-base font-extrabold text-foreground">Hero Banners Manager (Slideshow)</h3>
                            <p className="text-xs text-foreground/50 font-medium mt-0.5">
                              Add multiple hero banners with individual image/video types, mobile/desktop imagery, video links, custom CTAs, and order management.
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const currentSlides = [...(formData.sections.hero.slides || [])];
                              currentSlides.push({
                                id: `slide-${Date.now()}`,
                                type: "image",
                                bgImage: "/images/hero.png",
                                bgImagePhone: "/images/hero.png",
                                videoUrl: "",
                                cta1: { text: "Explore Products", link: "#product-section" },
                                cta2: { text: "About Jivanjor", link: "/about" }
                              });
                              updateSectionField("hero", "slides", currentSlides);
                            }}
                            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:opacity-90 transition cursor-pointer shadow-xs shrink-0"
                          >
                            <Plus className="h-4 w-4" />
                            <span>Add Hero Banner</span>
                          </button>
                        </div>

                        {/* Banner Slides List */}
                        <div className="space-y-4">
                          {((formData.sections.hero.slides || []) as any[]).map((slide: any, sIdx: number) => {
                            const isVid = slide.type === "video";
                            return (
                              <div key={slide.id || sIdx} className="p-5 border border-border bg-surface/30 rounded-2xl space-y-4 relative">
                                <div className="flex items-center justify-between pb-3 border-b border-border">
                                  <div className="flex items-center gap-3">
                                    <span className="px-2.5 py-1 bg-primary/10 text-primary rounded-lg text-xs font-black">
                                      Banner #{sIdx + 1}
                                    </span>
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${isVid ? "bg-purple-500/10 text-purple-600" : "bg-blue-500/10 text-blue-600"}`}>
                                      {isVid ? "Video Banner" : "Image Banner"}
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-1.5">
                                    {/* Move Up */}
                                    <button
                                      type="button"
                                      disabled={sIdx === 0}
                                      onClick={() => {
                                        const currentSlides = [...(formData.sections.hero.slides || [])];
                                        if (sIdx > 0) {
                                          const item = currentSlides.splice(sIdx, 1)[0];
                                          currentSlides.splice(sIdx - 1, 0, item);
                                          updateSectionField("hero", "slides", currentSlides);
                                        }
                                      }}
                                      className="p-1.5 rounded-lg border border-border hover:bg-surface disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                                      title="Move Up"
                                    >
                                      <ChevronUp className="h-4 w-4 text-foreground/70" />
                                    </button>

                                    {/* Move Down */}
                                    <button
                                      type="button"
                                      disabled={sIdx === (formData.sections.hero.slides || []).length - 1}
                                      onClick={() => {
                                        const currentSlides = [...(formData.sections.hero.slides || [])];
                                        if (sIdx < currentSlides.length - 1) {
                                          const item = currentSlides.splice(sIdx, 1)[0];
                                          currentSlides.splice(sIdx + 1, 0, item);
                                          updateSectionField("hero", "slides", currentSlides);
                                        }
                                      }}
                                      className="p-1.5 rounded-lg border border-border hover:bg-surface disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                                      title="Move Down"
                                    >
                                      <ChevronDown className="h-4 w-4 text-foreground/70" />
                                    </button>

                                    {/* Delete Slide */}
                                    {(formData.sections.hero.slides || []).length > 1 && (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const currentSlides = (formData.sections.hero.slides || []).filter((_: any, i: number) => i !== sIdx);
                                          updateSectionField("hero", "slides", currentSlides);
                                        }}
                                        className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-600 border border-red-500/20 transition cursor-pointer ml-1"
                                        title="Delete Banner"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </button>
                                    )}
                                  </div>
                                </div>

                                {/* Type Switcher */}
                                <div className="space-y-1.5">
                                  <label className="block text-xs font-bold text-foreground/60 uppercase tracking-wider">
                                    Banner Type
                                  </label>
                                  <div className="flex items-center gap-3">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const currentSlides = [...(formData.sections.hero.slides || [])];
                                        currentSlides[sIdx] = { ...currentSlides[sIdx], type: "image" };
                                        updateSectionField("hero", "slides", currentSlides);
                                      }}
                                      className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer border ${!isVid ? "bg-primary text-white border-primary" : "bg-background text-foreground/70 border-border"}`}
                                    >
                                      🖼️ Image Banner
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const currentSlides = [...(formData.sections.hero.slides || [])];
                                        currentSlides[sIdx] = { ...currentSlides[sIdx], type: "video" };
                                        updateSectionField("hero", "slides", currentSlides);
                                      }}
                                      className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer border ${isVid ? "bg-primary text-white border-primary" : "bg-background text-foreground/70 border-border"}`}
                                    >
                                      🎥 Video Banner
                                    </button>
                                  </div>
                                </div>

                                {/* Media Inputs depending on type */}
                                {isVid ? (
                                  <div className="space-y-4 pt-2">
                                    <div className="space-y-2">
                                      <label className="block text-xs font-bold text-foreground/60 uppercase tracking-wider">
                                        Video Link / File URL
                                      </label>
                                      <MediaUpload
                                        value={slide.videoUrl || ""}
                                        onChange={(url) => {
                                          const currentSlides = [...(formData.sections.hero.slides || [])];
                                          currentSlides[sIdx] = { ...currentSlides[sIdx], videoUrl: url };
                                          updateSectionField("hero", "slides", currentSlides);
                                        }}
                                        folder="templates"
                                        accept="video"
                                      />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div className="space-y-2">
                                        <label className="block text-xs font-bold text-foreground/60 uppercase tracking-wider">
                                          Fallback Desktop Image
                                        </label>
                                        <ImageUpload
                                          value={slide.bgImage || ""}
                                          onChange={(url) => {
                                            const currentSlides = [...(formData.sections.hero.slides || [])];
                                            currentSlides[sIdx] = { ...currentSlides[sIdx], bgImage: url };
                                            updateSectionField("hero", "slides", currentSlides);
                                          }}
                                          folder="templates"
                                          aspect="banner"
                                          size="default"
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <label className="block text-xs font-bold text-foreground/60 uppercase tracking-wider">
                                          Fallback Mobile Image
                                        </label>
                                        <ImageUpload
                                          value={slide.bgImagePhone || ""}
                                          onChange={(url) => {
                                            const currentSlides = [...(formData.sections.hero.slides || [])];
                                            currentSlides[sIdx] = { ...currentSlides[sIdx], bgImagePhone: url };
                                            updateSectionField("hero", "slides", currentSlides);
                                          }}
                                          folder="templates"
                                          aspect="square"
                                          size="default"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                    <div className="space-y-2">
                                      <label className="block text-xs font-bold text-foreground/60 uppercase tracking-wider">
                                        Desktop Image
                                      </label>
                                      <ImageUpload
                                        value={slide.bgImage || ""}
                                        onChange={(url) => {
                                          const currentSlides = [...(formData.sections.hero.slides || [])];
                                          currentSlides[sIdx] = { ...currentSlides[sIdx], bgImage: url };
                                          updateSectionField("hero", "slides", currentSlides);
                                        }}
                                        folder="templates"
                                        aspect="banner"
                                        size="default"
                                      />
                                      <span className="text-[10px] text-foreground/40 font-medium">Recommended: 16:9 (e.g. 1920x1080)</span>
                                    </div>
                                    <div className="space-y-2">
                                      <label className="block text-xs font-bold text-foreground/60 uppercase tracking-wider">
                                        Mobile Image
                                      </label>
                                      <ImageUpload
                                        value={slide.bgImagePhone || ""}
                                        onChange={(url) => {
                                          const currentSlides = [...(formData.sections.hero.slides || [])];
                                          currentSlides[sIdx] = { ...currentSlides[sIdx], bgImagePhone: url };
                                          updateSectionField("hero", "slides", currentSlides);
                                        }}
                                        folder="templates"
                                        aspect="square"
                                        size="default"
                                      />
                                      <span className="text-[10px] text-foreground/40 font-medium">Recommended: 4:5 or 9:16 (e.g. 750x1334)</span>
                                    </div>
                                  </div>
                                )}

                                {/* Per-banner Call-to-action Buttons */}
                                <div className="pt-3 border-t border-border/60 space-y-3">
                                  <span className="text-[11px] font-extrabold uppercase text-foreground/70 tracking-wider">
                                    Individual Banner CTAs (Call-To-Actions)
                                  </span>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* CTA 1 */}
                                    <div className="space-y-2 bg-background/60 p-3 rounded-xl border border-border">
                                      <span className="text-[10px] font-bold uppercase text-primary">CTA 1 (Primary)</span>
                                      <input
                                        type="text"
                                        value={slide.cta1?.text ?? ""}
                                        onChange={(e) => {
                                          const currentSlides = [...(formData.sections.hero.slides || [])];
                                          currentSlides[sIdx] = { ...currentSlides[sIdx], cta1: { ...currentSlides[sIdx].cta1, text: e.target.value } };
                                          updateSectionField("hero", "slides", currentSlides);
                                        }}
                                        placeholder="e.g. Explore Products"
                                        className="w-full px-3 py-1.5 bg-background border border-border rounded-lg text-xs outline-none focus:border-primary"
                                      />
                                      <input
                                        type="text"
                                        value={slide.cta1?.link ?? ""}
                                        onChange={(e) => {
                                          const currentSlides = [...(formData.sections.hero.slides || [])];
                                          currentSlides[sIdx] = { ...currentSlides[sIdx], cta1: { ...currentSlides[sIdx].cta1, link: e.target.value } };
                                          updateSectionField("hero", "slides", currentSlides);
                                        }}
                                        placeholder="e.g. #product-section"
                                        className="w-full px-3 py-1.5 bg-background border border-border rounded-lg text-xs outline-none focus:border-primary"
                                      />
                                    </div>

                                    {/* CTA 2 */}
                                    <div className="space-y-2 bg-background/60 p-3 rounded-xl border border-border">
                                      <span className="text-[10px] font-bold uppercase text-primary">CTA 2 (Secondary)</span>
                                      <input
                                        type="text"
                                        value={slide.cta2?.text ?? ""}
                                        onChange={(e) => {
                                          const currentSlides = [...(formData.sections.hero.slides || [])];
                                          currentSlides[sIdx] = { ...currentSlides[sIdx], cta2: { ...currentSlides[sIdx].cta2, text: e.target.value } };
                                          updateSectionField("hero", "slides", currentSlides);
                                        }}
                                        placeholder="e.g. About Jivanjor"
                                        className="w-full px-3 py-1.5 bg-background border border-border rounded-lg text-xs outline-none focus:border-primary"
                                      />
                                      <input
                                        type="text"
                                        value={slide.cta2?.link ?? ""}
                                        onChange={(e) => {
                                          const currentSlides = [...(formData.sections.hero.slides || [])];
                                          currentSlides[sIdx] = { ...currentSlides[sIdx], cta2: { ...currentSlides[sIdx].cta2, link: e.target.value } };
                                          updateSectionField("hero", "slides", currentSlides);
                                        }}
                                        placeholder="e.g. /about"
                                        className="w-full px-3 py-1.5 bg-background border border-border rounded-lg text-xs outline-none focus:border-primary"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Homepage Layout Only Tabs */}
                {activeTab === "productRange" && formData.sections?.productRange && (
                  <div className="space-y-6 animate-[fadeIn_0.15s_ease-out]">
                    <div className="flex items-center gap-2 border-b border-border pb-3">
                      <Grid className="h-5 w-5 text-primary" />
                      <h3 className="text-base font-extrabold text-foreground">Product Range Section Settings</h3>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">
                        Section Main Heading
                      </label>
                      <input
                        type="text"
                        value={formData.sections.productRange.title || ""}
                        onChange={(e) => updateSectionField("productRange", "title", e.target.value)}
                        placeholder="A Complete Adhesive Range for Modern Woodworking"
                        className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary focus:bg-background"
                      />
                    </div>

                    {/* Categories Setup (Max 5 categories, Max 10 products per category) */}
                    <div className="space-y-6 border-t border-border pt-6 mt-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-base font-extrabold text-foreground">Categories Setup (Max 5 Categories)</h3>
                          <p className="text-xs text-foreground/50 font-medium mt-0.5">
                            Configure up to 5 categories for the section tabs. For each category section, select up to 10 products.
                          </p>
                        </div>
                        <button
                          type="button"
                          disabled={(formData.sections.productRange.categories || []).length >= 5}
                          onClick={() => {
                            const currentCats = [...(formData.sections.productRange.categories || [])];
                            if (currentCats.length >= 5) return;
                            currentCats.push({
                              id: `cat-${Date.now()}`,
                              name: `Category ${currentCats.length + 1}`,
                              selectedProductIds: [],
                            });
                            updateSectionField("productRange", "categories", currentCats);
                          }}
                          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer shadow-xs shrink-0"
                        >
                          <Plus className="h-4 w-4" />
                          <span>Add Category ({(formData.sections.productRange.categories || []).length}/5)</span>
                        </button>
                      </div>

                      {/* Categories List */}
                      <div className="space-y-4">
                        {((formData.sections.productRange.categories || []) as any[]).map((cat: any, cIdx: number) => {
                          const selectedIds: string[] = cat.selectedProductIds || [];

                          return (
                            <div key={cat.id || cIdx} className="p-5 border border-border bg-surface/30 rounded-2xl space-y-4">
                              <div className="flex items-center justify-between pb-3 border-b border-border">
                                <div className="flex items-center gap-3">
                                  <span className="px-2.5 py-1 bg-primary/10 text-primary rounded-lg text-xs font-black">
                                    Category #{cIdx + 1}
                                  </span>
                                  <span className="text-xs font-bold text-foreground">
                                    {cat.name || `Category ${cIdx + 1}`}
                                  </span>
                                </div>

                                <div className="flex items-center gap-1.5">
                                  {/* Move Up */}
                                  <button
                                    type="button"
                                    disabled={cIdx === 0}
                                    onClick={() => {
                                      const currentCats = [...(formData.sections.productRange.categories || [])];
                                      if (cIdx > 0) {
                                        const item = currentCats.splice(cIdx, 1)[0];
                                        currentCats.splice(cIdx - 1, 0, item);
                                        updateSectionField("productRange", "categories", currentCats);
                                      }
                                    }}
                                    className="p-1.5 rounded-lg border border-border hover:bg-surface disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                                    title="Move Up"
                                  >
                                    <ChevronUp className="h-4 w-4 text-foreground/70" />
                                  </button>

                                  {/* Move Down */}
                                  <button
                                    type="button"
                                    disabled={cIdx === (formData.sections.productRange.categories || []).length - 1}
                                    onClick={() => {
                                      const currentCats = [...(formData.sections.productRange.categories || [])];
                                      if (cIdx < currentCats.length - 1) {
                                        const item = currentCats.splice(cIdx, 1)[0];
                                        currentCats.splice(cIdx + 1, 0, item);
                                        updateSectionField("productRange", "categories", currentCats);
                                      }
                                    }}
                                    className="p-1.5 rounded-lg border border-border hover:bg-surface disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                                    title="Move Down"
                                  >
                                    <ChevronDown className="h-4 w-4 text-foreground/70" />
                                  </button>

                                  {/* Delete Category */}
                                  {(formData.sections.productRange.categories || []).length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const currentCats = (formData.sections.productRange.categories || []).filter((_: any, i: number) => i !== cIdx);
                                        updateSectionField("productRange", "categories", currentCats);
                                      }}
                                      className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-600 border border-red-500/20 transition cursor-pointer ml-1"
                                      title="Delete Category"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                  )}
                                </div>
                              </div>

                              {/* Category Name Input */}
                              <div>
                                <label className="block text-xs font-bold text-foreground/60 uppercase tracking-wider mb-1.5">
                                  Category Title / Tab Name
                                </label>
                                <input
                                  type="text"
                                  value={cat.name || ""}
                                  onChange={(e) => {
                                    const currentCats = [...(formData.sections.productRange.categories || [])];
                                    currentCats[cIdx] = { ...currentCats[cIdx], name: e.target.value };
                                    updateSectionField("productRange", "categories", currentCats);
                                  }}
                                  placeholder="e.g. Super Premium"
                                  className="w-full px-4 py-2 bg-background border border-border rounded-xl text-xs outline-none focus:border-primary"
                                />
                              </div>

                              {/* Selected Products checklist for this category (Max 10) */}
                              <div className="space-y-2 pt-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-[11px] font-extrabold uppercase text-foreground/70 tracking-wider">
                                    Selected Products for "{cat.name || `Category ${cIdx + 1}`}"
                                  </span>
                                  <span className={`text-[11px] font-bold ${selectedIds.length >= 10 ? "text-amber-500 font-extrabold" : "text-foreground/50"}`}>
                                    {selectedIds.length} / 10 Products Max
                                  </span>
                                </div>

                                {availableProducts.length === 0 ? (
                                  <div className="p-3 border border-dashed border-border rounded-xl text-center text-xs text-foreground/60">
                                    No products found in Products Module.
                                  </div>
                                ) : (
                                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-60 overflow-y-auto p-1">
                                    {availableProducts.map((prod) => {
                                      const isSelected = selectedIds.includes(prod.id) || selectedIds.includes(prod.slug);

                                      const toggleProd = () => {
                                        let updated: string[];
                                        if (isSelected) {
                                          updated = selectedIds.filter((id: string) => id !== prod.id && id !== prod.slug);
                                        } else {
                                          if (selectedIds.length >= 10) {
                                            alert(`Maximum 10 products allowed for "${cat.name}". Please deselect a product before adding more.`);
                                            return;
                                          }
                                          updated = [...selectedIds, prod.id];
                                        }
                                        const currentCats = [...(formData.sections.productRange.categories || [])];
                                        currentCats[cIdx] = { ...currentCats[cIdx], selectedProductIds: updated };
                                        updateSectionField("productRange", "categories", currentCats);
                                      };

                                      return (
                                        <div
                                          key={prod.id}
                                          onClick={toggleProd}
                                          className={`p-2.5 rounded-xl border flex items-center gap-2.5 cursor-pointer transition-all ${
                                            isSelected
                                              ? "border-primary bg-primary/10 shadow-xs"
                                              : "border-border bg-background/50 hover:border-foreground/20"
                                          }`}
                                        >
                                          <input
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={toggleProd}
                                            className="h-3.5 w-3.5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer shrink-0"
                                          />
                                          {prod.image && (
                                            <div className="w-8 h-8 relative shrink-0">
                                              <Image
                                                src={prod.image}
                                                alt={prod.name}
                                                fill
                                                unoptimized
                                                className="object-contain"
                                              />
                                            </div>
                                          )}
                                          <div className="min-w-0 flex-1">
                                            <div className="text-xs font-bold text-foreground truncate">{prod.name}</div>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "findAdhesive" && formData.sections?.findAdhesive && (
                  <div className="space-y-6 animate-[fadeIn_0.15s_ease-out]">
                    <div className="flex items-center gap-2 border-b border-border pb-3">
                      <Search className="h-5 w-5 text-primary" />
                      <h3 className="text-base font-extrabold text-foreground">Right Choice Categories</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">
                          Section Heading
                        </label>
                        <input
                          type="text"
                          value={formData.sections.findAdhesive.title}
                          onChange={(e) => updateSectionField("findAdhesive", "title", e.target.value)}
                          placeholder="Find The Right Adhesive"
                          className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary focus:bg-background"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">
                          Section Subtitle
                        </label>
                        <textarea
                          rows={2}
                          value={formData.sections.findAdhesive.subtitle || ""}
                          onChange={(e) => updateSectionField("findAdhesive", "subtitle", e.target.value)}
                          placeholder="Select your application category..."
                          className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary focus:bg-background resize-none"
                        />
                      </div>
                    </div>

                    {/* Categories Links */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase text-foreground/45 tracking-wider">Application Pathways Categories</span>
                        <button
                          type="button"
                          onClick={() => addItem("findAdhesive", { name: "New Category Pathway", link: "#" })}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary text-[10px] font-black uppercase rounded-lg cursor-pointer"
                        >
                          <Plus className="h-3.5 w-3.5" /> Add Category Link
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {formData.sections.findAdhesive.items?.map((item: any, idx: number) => (
                          <div key={idx} className="p-4 border border-border bg-surface/30 rounded-2xl relative flex flex-col gap-2">
                            <button
                              type="button"
                              onClick={() => removeItem("findAdhesive", idx)}
                              className="absolute top-3 right-3 p-1.5 hover:bg-red-500/10 text-red-500 rounded-lg cursor-pointer transition-colors border border-border bg-background"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                            <span className="text-[9px] font-black uppercase bg-primary/10 text-primary px-2 py-0.5 rounded-full w-fit">Link #{idx + 1}</span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                              <input
                                type="text"
                                value={item.name}
                                onChange={(e) => updateItemField("findAdhesive", idx, "name", e.target.value)}
                                placeholder="Category Name"
                                className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-xs font-semibold"
                              />
                              <input
                                type="text"
                                value={item.link || ""}
                                onChange={(e) => updateItemField("findAdhesive", idx, "link", e.target.value)}
                                placeholder="Link Target (e.g. #)"
                                className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-xs"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "whyTrustUs" && formData.sections?.whyTrustUs && (
                  <div className="space-y-6 animate-[fadeIn_0.15s_ease-out]">
                    <div className="flex items-center gap-2 border-b border-border pb-3">
                      <Shield className="h-5 w-5 text-primary" />
                      <h3 className="text-base font-extrabold text-foreground">Why Professionals Trust Jivanjor</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">
                          Section Heading
                        </label>
                        <input
                          type="text"
                          value={formData.sections.whyTrustUs.title}
                          onChange={(e) => updateSectionField("whyTrustUs", "title", e.target.value)}
                          placeholder="Why Professionals Trust Jivanjor"
                          className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary focus:bg-background"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">
                          Section Subtitle
                        </label>
                        <textarea
                          rows={2}
                          value={formData.sections.whyTrustUs.subtitle || ""}
                          onChange={(e) => updateSectionField("whyTrustUs", "subtitle", e.target.value)}
                          placeholder="Over decades, builders have endorsed..."
                          className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary focus:bg-background resize-none"
                        />
                      </div>
                    </div>

                    {/* Trust Items */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase text-foreground/45 tracking-wider">Trust Factors Checklist</span>
                        <button
                          type="button"
                          onClick={() => addItem("whyTrustUs", { title: "Consistent Quality", description: "Batch checked..." })}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary text-[10px] font-black uppercase rounded-lg cursor-pointer"
                        >
                          <Plus className="h-3.5 w-3.5" /> Add Trust Factor
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {formData.sections.whyTrustUs.items?.map((item: any, idx: number) => (
                          <div key={idx} className="p-4 border border-border bg-surface/30 rounded-2xl relative space-y-3">
                            <button
                              type="button"
                              onClick={() => removeItem("whyTrustUs", idx)}
                              className="absolute top-3 right-3 p-1.5 hover:bg-red-500/10 text-red-500 rounded-lg cursor-pointer transition-colors border border-border bg-background"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                            <span className="text-[9px] font-black uppercase bg-primary/10 text-primary px-2 py-0.5 rounded-full w-fit">Item #{idx + 1}</span>
                            <div>
                              <input
                                type="text"
                                value={item.title}
                                onChange={(e) => updateItemField("whyTrustUs", idx, "title", e.target.value)}
                                placeholder="Factor Title"
                                className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-xs font-semibold mb-2"
                              />
                              <textarea
                                rows={2}
                                value={item.description}
                                onChange={(e) => updateItemField("whyTrustUs", idx, "description", e.target.value)}
                                placeholder="Factor Description"
                                className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-xs resize-none"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "showcaseGrid" && formData.sections?.showcaseGrid && (
                  <div className="space-y-6 animate-[fadeIn_0.15s_ease-out]">
                    <div className="flex items-center gap-2 border-b border-border pb-3">
                      <FileText className="h-5 w-5 text-primary" />
                      <h3 className="text-base font-extrabold text-foreground">Resource Showcase Grid</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">
                          Section Heading
                        </label>
                        <input
                          type="text"
                          value={formData.sections.showcaseGrid.title}
                          onChange={(e) => updateSectionField("showcaseGrid", "title", e.target.value)}
                          placeholder="Built Around India's Woodworking Professionals"
                          className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary focus:bg-background"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">
                          Section Subtitle
                        </label>
                        <textarea
                          rows={2}
                          value={formData.sections.showcaseGrid.subtitle || ""}
                          onChange={(e) => updateSectionField("showcaseGrid", "subtitle", e.target.value)}
                          placeholder="Jivanjor continues to grow..."
                          className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary focus:bg-background resize-none"
                        />
                      </div>
                    </div>

                    {/* Showcase Items */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase text-foreground/45 tracking-wider">Showcase Grid Cards</span>
                        <button
                          type="button"
                          onClick={() => addItem("showcaseGrid", { title: "Technical Resources", description: "Pro guides...", link: "#" })}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary text-[10px] font-black uppercase rounded-lg cursor-pointer"
                        >
                          <Plus className="h-3.5 w-3.5" /> Add Showcase Card
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {formData.sections.showcaseGrid.items?.map((item: any, idx: number) => (
                          <div key={idx} className="p-4 border border-border bg-surface/30 rounded-2xl relative space-y-3">
                            <button
                              type="button"
                              onClick={() => removeItem("showcaseGrid", idx)}
                              className="absolute top-3 right-3 p-1.5 hover:bg-red-500/10 text-red-500 rounded-lg cursor-pointer transition-colors border border-border bg-background"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                            <span className="text-[9px] font-black uppercase bg-primary/10 text-primary px-2 py-0.5 rounded-full w-fit">Card #{idx + 1}</span>
                            <div>
                              <input
                                type="text"
                                value={item.title}
                                onChange={(e) => updateItemField("showcaseGrid", idx, "title", e.target.value)}
                                placeholder="Card Title"
                                className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-xs font-semibold mb-2"
                              />
                              <textarea
                                rows={2}
                                value={item.description}
                                onChange={(e) => updateItemField("showcaseGrid", idx, "description", e.target.value)}
                                placeholder="Card Description"
                                className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-xs mb-2 resize-none"
                              />
                              <input
                                type="text"
                                value={item.link || ""}
                                onChange={(e) => updateItemField("showcaseGrid", idx, "link", e.target.value)}
                                placeholder="Link Target (e.g. #)"
                                className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-xs"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "ctaPromo" && formData.sections?.ctaPromo && (
                  <div className="space-y-6 animate-[fadeIn_0.15s_ease-out]">
                    <div className="flex items-center gap-2 border-b border-border pb-3">
                      <MessageSquare className="h-5 w-5 text-primary" />
                      <h3 className="text-base font-extrabold text-foreground">CTA Promotion Banner</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">
                          Banner Heading Text
                        </label>
                        <input
                          type="text"
                          value={formData.sections.ctaPromo.title}
                          onChange={(e) => updateSectionField("ctaPromo", "title", e.target.value)}
                          placeholder="Grow Your Business With a Trusted Adhesive"
                          className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary focus:bg-background"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">
                          Banner Subtitle/Description
                        </label>
                        <textarea
                          rows={2}
                          value={formData.sections.ctaPromo.subtitle || ""}
                          onChange={(e) => updateSectionField("ctaPromo", "subtitle", e.target.value)}
                          placeholder="Work with a growing brand..."
                          className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary focus:bg-background resize-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">
                          CTA Button Text
                        </label>
                        <input
                          type="text"
                          value={formData.sections.ctaPromo.ctaText || ""}
                          onChange={(e) => updateSectionField("ctaPromo", "ctaText", e.target.value)}
                          placeholder="Partner With Us"
                          className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary focus:bg-background"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">
                          CTA Button Action Path/URL
                        </label>
                        <input
                          type="text"
                          value={formData.sections.ctaPromo.ctaLink || ""}
                          onChange={(e) => updateSectionField("ctaPromo", "ctaLink", e.target.value)}
                          placeholder="e.g. /contact"
                          className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary focus:bg-background"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "testimonials" && formData.sections?.testimonials && (
                  <div className="space-y-6 animate-[fadeIn_0.15s_ease-out]">
                    <div className="flex items-center gap-2 border-b border-border pb-3">
                      <Bookmark className="h-5 w-5 text-primary" />
                      <h3 className="text-base font-extrabold text-foreground">Testimonials Section</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">
                          Section Title
                        </label>
                        <input
                          type="text"
                          value={formData.sections.testimonials.title || ""}
                          onChange={(e) => updateSectionField("testimonials", "title", e.target.value)}
                          placeholder="Trusted by People Who Know the Work"
                          className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary focus:bg-background"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">
                          Section Subtitle
                        </label>
                        <textarea
                          rows={2}
                          value={formData.sections.testimonials.subtitle || ""}
                          onChange={(e) => updateSectionField("testimonials", "subtitle", e.target.value)}
                          placeholder="Hear from carpenters..."
                          className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary focus:bg-background resize-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">
                          CTA Action Button Text
                        </label>
                        <input
                          type="text"
                          value={formData.sections.testimonials.ctaText || ""}
                          onChange={(e) => updateSectionField("testimonials", "ctaText", e.target.value)}
                          placeholder="Partner With Us"
                          className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary focus:bg-background"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">
                          CTA Action Link Path
                        </label>
                        <input
                          type="text"
                          value={formData.sections.testimonials.ctaLink || ""}
                          onChange={(e) => updateSectionField("testimonials", "ctaLink", e.target.value)}
                          placeholder="#"
                          className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary focus:bg-background"
                        />
                      </div>
                    </div>

                    {/* Testimonials list */}
                    <div className="space-y-4 pt-4 border-t border-border">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase text-foreground/45 tracking-wider">Testimonials Carousel Cards</span>
                        <button
                          type="button"
                          onClick={() => addItem("testimonials", { type: "video", name: "Author Name", role: "Contractor Carpenter", videoUrl: "", image: "", showPlayButton: true, quote: "" })}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary text-[10px] font-black uppercase rounded-lg cursor-pointer"
                        >
                          <Plus className="h-3.5 w-3.5" /> Add Testimonial
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {(formData.sections.testimonials.items || []).map((item: any, idx: number) => (
                          <div key={idx} className="p-4 border border-border bg-surface/30 rounded-2xl relative space-y-3">
                            <button
                              type="button"
                              onClick={() => removeItem("testimonials", idx)}
                              className="absolute top-3 right-3 p-1.5 hover:bg-red-500/10 text-red-500 rounded-lg cursor-pointer border border-border bg-background"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                            <span className="text-[9px] font-black uppercase bg-primary/10 text-primary px-2 py-0.5 rounded-full w-fit">Testimonial #{idx + 1}</span>

                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-[10px] font-bold text-foreground/50 uppercase tracking-wider mb-1">Card Type</label>
                                <select
                                  value={item.type || "text"}
                                  onChange={(e) => updateItemField("testimonials", idx, "type", e.target.value)}
                                  className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-xs text-foreground outline-none cursor-pointer"
                                >
                                  <option value="text">Text Quote Card</option>
                                  <option value="video">Video Card</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold text-foreground/50 uppercase tracking-wider mb-1">Author Name</label>
                                <input
                                  type="text"
                                  value={item.name || ""}
                                  onChange={(e) => updateItemField("testimonials", idx, "name", e.target.value)}
                                  className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-xs font-semibold"
                                  placeholder="Mr. Imran Saifi"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 gap-2">
                              <div>
                                <label className="block text-[10px] font-bold text-foreground/50 uppercase tracking-wider mb-1">Author Role</label>
                                <input
                                  type="text"
                                  value={item.role || ""}
                                  onChange={(e) => updateItemField("testimonials", idx, "role", e.target.value)}
                                  className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-xs"
                                  placeholder="Contractor Carpenter"
                                />
                              </div>
                            </div>

                            {item.type === "video" ? (
                              <div className="space-y-3 border-t border-border/50 pt-2">
                                <div>
                                  <label className="block text-[10px] font-bold text-foreground/50 uppercase tracking-wider mb-1">Video URL (YouTube or Direct MP4 Link)</label>
                                  <input
                                    type="text"
                                    value={item.videoUrl || ""}
                                    onChange={(e) => updateItemField("testimonials", idx, "videoUrl", e.target.value)}
                                    placeholder="https://www.youtube.com/watch?v=..."
                                    className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-xs"
                                  />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  <div>
                                    <label className="block text-[10px] font-bold text-foreground/50 uppercase tracking-wider mb-1">Thumbnail Image</label>
                                    <ImageUpload
                                      value={item.image || ""}
                                      onChange={(url) => updateItemField("testimonials", idx, "image", url)}
                                      folder="templates"
                                      size="compact"
                                      aspect="video"
                                    />
                                  </div>
                                  <div className="flex items-center gap-2 pt-4 pl-2">
                                    <input
                                      type="checkbox"
                                      id={`homeShowPlayButton-${idx}`}
                                      checked={item.showPlayButton !== false}
                                      onChange={(e) => updateItemField("testimonials", idx, "showPlayButton", e.target.checked)}
                                      className="h-4 w-4 text-primary focus:ring-primary border-border rounded"
                                    />
                                    <label htmlFor={`homeShowPlayButton-${idx}`} className="text-xs text-foreground/75 font-semibold cursor-pointer select-none">
                                      Show Play Button
                                    </label>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="border-t border-border/50 pt-2 space-y-2">
                                <div>
                                  <label className="block text-[10px] font-bold text-foreground/50 uppercase tracking-wider mb-1">Quote Description</label>
                                  <textarea
                                    rows={2}
                                    value={item.quote || ""}
                                    onChange={(e) => updateItemField("testimonials", idx, "quote", e.target.value)}
                                    placeholder="Aquabond kitchen ka specialist hai."
                                    className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-xs resize-none"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[10px] font-bold text-foreground/50 uppercase tracking-wider mb-1">Optional Avatar Image</label>
                                  <ImageUpload
                                    value={item.image || ""}
                                    onChange={(url) => updateItemField("testimonials", idx, "image", url)}
                                    folder="templates"
                                    size="compact"
                                    aspect="square"
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "knowledgeBase" && formData.sections?.knowledgeBase && (
                  <div className="space-y-6 animate-[fadeIn_0.15s_ease-out]">
                    <div className="flex items-center gap-2 border-b border-border pb-3">
                      <Award className="h-5 w-5 text-primary" />
                      <h3 className="text-base font-extrabold text-foreground">Knowledge Articles Section</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">
                          Section Title
                        </label>
                        <input
                          type="text"
                          value={formData.sections.knowledgeBase.title}
                          onChange={(e) => updateSectionField("knowledgeBase", "title", e.target.value)}
                          placeholder="Knowledge Base & Guides"
                          className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary focus:bg-background"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">
                          Section Subtitle
                        </label>
                        <textarea
                          rows={2}
                          value={formData.sections.knowledgeBase.subtitle || ""}
                          onChange={(e) => updateSectionField("knowledgeBase", "subtitle", e.target.value)}
                          placeholder="Explore insights..."
                          className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary focus:bg-background resize-none"
                        />
                      </div>
                    </div>

                    {/* Articles items */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase text-foreground/45 tracking-wider">Featured Guides/Articles</span>
                        <button
                          type="button"
                          onClick={() => addItem("knowledgeBase", { title: "New Guide Article", summary: "Learn about...", link: "#", image: "", mobileImage: "" })}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary text-[10px] font-black uppercase rounded-lg cursor-pointer"
                        >
                          <Plus className="h-3.5 w-3.5" /> Add Guide Link
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {formData.sections.knowledgeBase.items?.map((item: any, idx: number) => (
                          <div key={idx} className="p-4 border border-border bg-surface/30 rounded-2xl relative space-y-3">
                            <button
                              type="button"
                              onClick={() => removeItem("knowledgeBase", idx)}
                              className="absolute top-3 right-3 p-1.5 hover:bg-red-500/10 text-red-500 rounded-lg cursor-pointer transition-colors border border-border bg-background animate-pulse-subtle"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                            <span className="text-[9px] font-black uppercase bg-primary/10 text-primary px-2 py-0.5 rounded-full w-fit">Article #{idx + 1}</span>
                            <div>
                              <input
                                type="text"
                                value={item.title}
                                onChange={(e) => updateItemField("knowledgeBase", idx, "title", e.target.value)}
                                placeholder="Article Title"
                                className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-xs font-semibold mb-2"
                              />
                              <div className="grid grid-cols-2 gap-2 mb-2">
                                <div className="space-y-1">
                                  <span className="block text-[9px] font-bold text-foreground/45 uppercase tracking-wider">Desktop Image</span>
                                  <ImageUpload
                                    value={item.image || ""}
                                    onChange={(url) => updateItemField("knowledgeBase", idx, "image", url)}
                                    folder="pages"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <span className="block text-[9px] font-bold text-foreground/45 uppercase tracking-wider">Mobile/Tablet Image</span>
                                  <ImageUpload
                                    value={item.mobileImage || ""}
                                    onChange={(url) => updateItemField("knowledgeBase", idx, "mobileImage", url)}
                                    folder="pages"
                                  />
                                </div>
                              </div>
                              <textarea
                                rows={2}
                                value={item.summary}
                                onChange={(e) => updateItemField("knowledgeBase", idx, "summary", e.target.value)}
                                placeholder="Article Summary"
                                className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-xs mb-2 resize-none"
                              />
                              <input
                                type="text"
                                value={item.link || ""}
                                onChange={(e) => updateItemField("knowledgeBase", idx, "link", e.target.value)}
                                placeholder="Link Target (e.g. #)"
                                className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-xs"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* About Layout Tabs */}
                {activeTab === "promise" && formData.sections?.promise && (
                  <div className="space-y-6 animate-[fadeIn_0.15s_ease-out]">
                    <div className="flex items-center gap-2 border-b border-border pb-3">
                      <Shield className="h-5 w-5 text-primary" />
                      <h3 className="text-base font-extrabold text-foreground">Stronger Bonds Promise</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">
                          Promise Section Heading
                        </label>
                        <input
                          type="text"
                          value={formData.sections.promise.title || ""}
                          onChange={(e) => updateSectionField("promise", "title", e.target.value)}
                          placeholder="The Promise of Stronger Bonds"
                          className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">
                          Promise Section Subtitle
                        </label>
                        <textarea
                          rows={2}
                          value={formData.sections.promise.subtitle || ""}
                          onChange={(e) => updateSectionField("promise", "subtitle", e.target.value)}
                          placeholder="Jivanjor is built around the needs..."
                          className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary resize-none"
                        />
                      </div>
                    </div>

                    {/* Promise Cards list */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase text-foreground/45 tracking-wider">Promise Feature Cards</span>
                        <button
                          type="button"
                          onClick={() => addItem("promise", { title: "New Quality Pillar", desc: "Description...", icon: "/images/about/Ad-product.svg" })}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary text-[10px] font-black uppercase rounded-lg cursor-pointer"
                        >
                          <Plus className="h-3.5 w-3.5" /> Add Promise Card
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {formData.sections.promise.items?.map((item: any, idx: number) => (
                          <div key={idx} className="p-4 border border-border bg-surface/30 rounded-2xl relative space-y-3">
                            <button
                              type="button"
                              onClick={() => removeItem("promise", idx)}
                              className="absolute top-3 right-3 p-1.5 hover:bg-red-500/10 text-red-500 rounded-lg cursor-pointer transition-colors border border-border bg-background"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                            <span className="text-[9px] font-black uppercase bg-primary/10 text-primary px-2 py-0.5 rounded-full w-fit">Card #{idx + 1}</span>
                            <div>
                              <input
                                type="text"
                                value={item.title || ""}
                                onChange={(e) => updateItemField("promise", idx, "title", e.target.value)}
                                placeholder="Card Title"
                                className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-xs font-semibold mb-2"
                              />
                              <textarea
                                rows={2}
                                value={item.desc || ""}
                                onChange={(e) => updateItemField("promise", idx, "desc", e.target.value)}
                                placeholder="Card Description"
                                className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-xs mb-2 resize-none"
                              />
                              <div className="space-y-1">
                                <span className="block text-[10px] font-bold text-foreground/45 uppercase tracking-wider">Icon Image</span>
                                <ImageUpload
                                  value={item.icon || ""}
                                  onChange={(url) => updateItemField("promise", idx, "icon", url)}
                                  folder="templates"
                                  size="compact"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "innovation" && formData.sections?.innovation && (
                  <div className="space-y-6 animate-[fadeIn_0.15s_ease-out]">
                    <div className="flex items-center gap-2 border-b border-border pb-3">
                      <Sparkles className="h-5 w-5 text-primary" />
                      <h3 className="text-base font-extrabold text-foreground font-google-sans">Research & Innovation</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">
                          Innovation Section Title
                        </label>
                        <input
                          type="text"
                          value={formData.sections.innovation.title || ""}
                          onChange={(e) => updateSectionField("innovation", "title", e.target.value)}
                          placeholder="Built on Innovation That Drives Performance"
                          className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary"
                        />
                      </div>
                      <div className="md:col-span-2 space-y-1">
                        <span className="block text-xs font-bold text-foreground/50 uppercase tracking-wider">Background Lab Image</span>
                        <ImageUpload
                          value={formData.sections.innovation.bgImage || ""}
                          onChange={(url) => updateSectionField("innovation", "bgImage", url)}
                          folder="templates"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">
                          Explore CTA Text
                        </label>
                        <input
                          type="text"
                          value={formData.sections.innovation.ctaText || ""}
                          onChange={(e) => updateSectionField("innovation", "ctaText", e.target.value)}
                          placeholder="Explore Applications"
                          className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">
                          Explore CTA Link
                        </label>
                        <input
                          type="text"
                          value={formData.sections.innovation.ctaLink || ""}
                          onChange={(e) => updateSectionField("innovation", "ctaLink", e.target.value)}
                          placeholder="/applications"
                          className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary"
                        />
                      </div>
                    </div>

                    {/* Innovation Cards */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase text-foreground/45 tracking-wider">Innovation Pillars</span>
                        <button
                          type="button"
                          onClick={() => addItem("innovation", { title: "New Chemistry Standard", desc: "Description detail..." })}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary text-[10px] font-black uppercase rounded-lg cursor-pointer"
                        >
                          <Plus className="h-3.5 w-3.5" /> Add Pillar
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {formData.sections.innovation.items?.map((item: any, idx: number) => (
                          <div key={idx} className="p-4 border border-border bg-surface/30 rounded-2xl relative space-y-2">
                            <button
                              type="button"
                              onClick={() => removeItem("innovation", idx)}
                              className="absolute top-3 right-3 p-1.5 hover:bg-red-500/10 text-red-500 rounded-lg cursor-pointer transition-colors border border-border bg-background"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                            <span className="text-[9px] font-black uppercase bg-primary/10 text-primary px-2 py-0.5 rounded-full w-fit">Pillar #{idx + 1}</span>
                            <div>
                              <input
                                type="text"
                                value={item.title || ""}
                                onChange={(e) => updateItemField("innovation", idx, "title", e.target.value)}
                                placeholder="Pillar Title"
                                className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-xs font-semibold mb-2"
                              />
                              <textarea
                                rows={3}
                                value={item.desc || ""}
                                onChange={(e) => updateItemField("innovation", idx, "desc", e.target.value)}
                                placeholder="Description"
                                className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-xs resize-none"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "responsibility" && formData.sections?.responsibility && (
                  <div className="space-y-6 animate-[fadeIn_0.15s_ease-out]">
                    <div className="flex items-center gap-2 border-b border-border pb-3">
                      <Award className="h-5 w-5 text-primary" />
                      <h3 className="text-base font-extrabold text-foreground font-google-sans">Quality & Responsibility</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">
                          Responsibility Main Heading
                        </label>
                        <input
                          type="text"
                          value={formData.sections.responsibility.title || ""}
                          onChange={(e) => updateSectionField("responsibility", "title", e.target.value)}
                          placeholder="Recognised for Quality. Built with Responsibility."
                          className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">
                          Responsibility Description Subtitle
                        </label>
                        <textarea
                          rows={2}
                          value={formData.sections.responsibility.subtitle || ""}
                          onChange={(e) => updateSectionField("responsibility", "subtitle", e.target.value)}
                          placeholder="Jivanjor’s product promise is supported..."
                          className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary resize-none"
                        />
                      </div>
                    </div>

                    {/* Swiper Badges list */}
                    <div className="p-5 border border-border bg-surface/20 rounded-2xl space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-black uppercase text-primary tracking-wider">Awards & Certification Badges</h4>
                        <button
                          type="button"
                          onClick={() => addItem("responsibility", { title: "New Award 2026", src: "/images/about/badge-greenpro.png" })}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary text-[10px] font-black uppercase rounded-lg cursor-pointer"
                        >
                          <Plus className="h-3.5 w-3.5" /> Add Badge
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {formData.sections.responsibility.badges?.map((item: any, idx: number) => (
                          <div key={idx} className="p-4 bg-background border border-border rounded-xl relative space-y-3">
                            <button
                              type="button"
                              onClick={() => removeItem("responsibility", idx)}
                              className="absolute top-3 right-3 p-1.5 hover:bg-red-500/10 text-red-500 rounded-lg cursor-pointer transition-colors border border-border bg-background"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                            <span className="text-[9px] font-black uppercase bg-primary/10 text-primary px-2 py-0.5 rounded-full w-fit">Badge #{idx + 1}</span>
                            <div>
                              <input
                                type="text"
                                value={item.title || ""}
                                onChange={(e) => updateItemField("responsibility", idx, "title", e.target.value)}
                                placeholder="Badge Title"
                                className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-xs font-semibold mb-2"
                              />
                              <div className="space-y-1">
                                <span className="block text-[10px] font-bold text-foreground/45 uppercase tracking-wider">Badge Image</span>
                                <ImageUpload
                                  value={item.src || ""}
                                  onChange={(url) => updateItemField("responsibility", idx, "src", url)}
                                  folder="templates"
                                  size="compact"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Sustainability Card */}
                    <div className="p-5 border border-border bg-surface/20 rounded-2xl space-y-4">
                      <h4 className="text-xs font-black uppercase text-primary tracking-wider font-google-sans">Responsible Manufacturing card</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <label className="block text-[10px] font-bold text-foreground/45 uppercase tracking-wider mb-2">
                            Sustainability Card Title
                          </label>
                          <input
                            type="text"
                            value={formData.sections.responsibility.sustainability?.title || ""}
                            onChange={(e) => updateNestedField("responsibility", "sustainability", "title", e.target.value)}
                            placeholder="A Responsible Approach to Manufacturing"
                            className="w-full px-3 py-2 bg-background border border-border rounded-xl text-xs font-semibold"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-[10px] font-bold text-foreground/45 uppercase tracking-wider mb-2">
                            Sustainability Subtitle
                          </label>
                          <textarea
                            rows={2}
                            value={formData.sections.responsibility.sustainability?.subtitle || ""}
                            onChange={(e) => updateNestedField("responsibility", "sustainability", "subtitle", e.target.value)}
                            placeholder="JACPL follows a long-term sustainability..."
                            className="w-full px-3 py-2 bg-background border border-border rounded-xl text-xs resize-none"
                          />
                        </div>
                        <div className="md:col-span-2 space-y-1">
                          <span className="block text-[10px] font-bold text-foreground/45 uppercase tracking-wider">Illustration / Photo</span>
                          <ImageUpload
                            value={formData.sections.responsibility.sustainability?.image || ""}
                            onChange={(url) => updateNestedField("responsibility", "sustainability", "image", url)}
                            folder="templates"
                          />
                        </div>
                      </div>

                      {/* Leaves items practices list */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between border-t border-border pt-4">
                          <span className="text-[10px] font-black uppercase text-foreground/45 tracking-wider">Environmental Practices (Leaves list)</span>
                          <button
                            type="button"
                            onClick={() => {
                              const currItems = formData.sections.responsibility.sustainability?.items || [];
                              const newItems = [...currItems, { title: "Save Energy", desc: "Energy checks..." }];
                              updateNestedField("responsibility", "sustainability", "items", newItems);
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary text-[10px] font-black uppercase rounded-lg cursor-pointer"
                          >
                            <Plus className="h-3.5 w-3.5" /> Add Practice item
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {formData.sections.responsibility.sustainability?.items?.map((item: any, itemIdx: number) => (
                            <div key={itemIdx} className="p-3 bg-background border border-border rounded-xl relative space-y-2">
                              <button
                                type="button"
                                onClick={() => {
                                  const currItems = formData.sections.responsibility.sustainability?.items || [];
                                  const newItems = currItems.filter((_: any, i: number) => i !== itemIdx);
                                  updateNestedField("responsibility", "sustainability", "items", newItems);
                                }}
                                className="absolute top-2 right-2 p-1.5 hover:bg-red-500/10 text-red-500 rounded-lg cursor-pointer transition-colors border border-border bg-background"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                              <span className="text-[9px] font-black uppercase bg-green-100 text-green-700 px-2 py-0.5 rounded-full w-fit">Item #{itemIdx + 1}</span>
                              <input
                                type="text"
                                value={item.title || ""}
                                onChange={(e) => {
                                  const currItems = [...(formData.sections.responsibility.sustainability?.items || [])];
                                  currItems[itemIdx] = { ...currItems[itemIdx], title: e.target.value };
                                  updateNestedField("responsibility", "sustainability", "items", currItems);
                                }}
                                placeholder="Practice Title"
                                className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-xs font-semibold"
                              />
                              <textarea
                                rows={2}
                                value={item.desc || ""}
                                onChange={(e) => {
                                  const currItems = [...(formData.sections.responsibility.sustainability?.items || [])];
                                  currItems[itemIdx] = { ...currItems[itemIdx], desc: e.target.value };
                                  updateNestedField("responsibility", "sustainability", "items", currItems);
                                }}
                                placeholder="Practice Description"
                                className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-xs resize-none"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "presence" && formData.sections?.presence && (
                  <div className="space-y-6 animate-[fadeIn_0.15s_ease-out]">
                    <div className="flex items-center gap-2 border-b border-border pb-3">
                      <Grid className="h-5 w-5 text-primary" />
                      <h3 className="text-base font-extrabold text-foreground">Market Presence</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">
                          Presence Section Heading
                        </label>
                        <input
                          type="text"
                          value={formData.sections.presence.title || ""}
                          onChange={(e) => updateSectionField("presence", "title", e.target.value)}
                          placeholder="A Presence Built Through Trust"
                          className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">
                          Presence Section Subtitle
                        </label>
                        <textarea
                          rows={2}
                          value={formData.sections.presence.subtitle || ""}
                          onChange={(e) => updateSectionField("presence", "subtitle", e.target.value)}
                          placeholder="Jivanjor brings together product performance..."
                          className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary resize-none"
                        />
                      </div>
                    </div>

                    {/* Stats List */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase text-foreground/45 tracking-wider">Statistics Cards</span>
                        <button
                          type="button"
                          onClick={() => addItem("presence", { value: "100+", label: "Stat Label", icon: "/images/about/presence.svg" })}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary text-[10px] font-black uppercase rounded-lg cursor-pointer"
                        >
                          <Plus className="h-3.5 w-3.5" /> Add Stat Card
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {formData.sections.presence.items?.map((item: any, idx: number) => (
                          <div key={idx} className="p-4 border border-border bg-surface/30 rounded-2xl relative space-y-3">
                            <button
                              type="button"
                              onClick={() => removeItem("presence", idx)}
                              className="absolute top-3 right-3 p-1.5 hover:bg-red-500/10 text-red-500 rounded-lg cursor-pointer transition-colors border border-border bg-background"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                            <span className="text-[9px] font-black uppercase bg-primary/10 text-primary px-2 py-0.5 rounded-full w-fit">Stat #{idx + 1}</span>
                            <div>
                              <input
                                type="text"
                                value={item.value || ""}
                                onChange={(e) => updateItemField("presence", idx, "value", e.target.value)}
                                placeholder="Stat Value (e.g. 27,000+)"
                                className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-xs font-bold mb-2"
                              />
                              <input
                                type="text"
                                value={item.label || ""}
                                onChange={(e) => updateItemField("presence", idx, "label", e.target.value)}
                                placeholder="Stat Label"
                                className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-xs font-semibold mb-2"
                              />
                              <div className="space-y-1">
                                <span className="block text-[10px] font-bold text-foreground/45 uppercase tracking-wider">Icon Image</span>
                                <ImageUpload
                                  value={item.icon || ""}
                                  onChange={(url) => updateItemField("presence", idx, "icon", url)}
                                  folder="templates"
                                  size="compact"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* CTAs */}
                    <div className="p-5 border border-border bg-surface/20 rounded-2xl space-y-4">
                      <h4 className="text-xs font-black uppercase text-primary tracking-wider font-google-sans">CTA Action Buttons Setup</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Explore button */}
                        <div className="space-y-3">
                          <span className="text-[10px] font-black uppercase text-foreground/45 tracking-wider">Explore Products CTA</span>
                          <input
                            type="text"
                            value={formData.sections.presence.ctaExplore?.text || ""}
                            onChange={(e) => updateNestedField("presence", "ctaExplore", "text", e.target.value)}
                            placeholder="Button Text"
                            className="w-full px-4 py-2 bg-background border border-border rounded-xl text-xs outline-none focus:border-primary"
                          />
                          <input
                            type="text"
                            value={formData.sections.presence.ctaExplore?.actionPath || ""}
                            onChange={(e) => updateNestedField("presence", "ctaExplore", "actionPath", e.target.value)}
                            placeholder="Action Path (e.g. /products)"
                            className="w-full px-4 py-2 bg-background border border-border rounded-xl text-xs outline-none focus:border-primary"
                          />
                        </div>
                        {/* Partner button */}
                        <div className="space-y-3">
                          <span className="text-[10px] font-black uppercase text-foreground/45 tracking-wider">Partner With Us CTA</span>
                          <input
                            type="text"
                            value={formData.sections.presence.ctaPartner?.text || ""}
                            onChange={(e) => updateNestedField("presence", "ctaPartner", "text", e.target.value)}
                            placeholder="Button Text"
                            className="w-full px-4 py-2 bg-background border border-border rounded-xl text-xs outline-none focus:border-primary"
                          />
                          <input
                            type="text"
                            value={formData.sections.presence.ctaPartner?.actionPath || ""}
                            onChange={(e) => updateNestedField("presence", "ctaPartner", "actionPath", e.target.value)}
                            placeholder="Action Path (e.g. /partner)"
                            className="w-full px-4 py-2 bg-background border border-border rounded-xl text-xs outline-none focus:border-primary"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "tvcs" && formData.sections?.tvcs && (
                  <div className="space-y-6 animate-[fadeIn_0.15s_ease-out]">
                    <div className="flex items-center gap-2 border-b border-border pb-3">
                      <MessageSquare className="h-5 w-5 text-primary" />
                      <h3 className="text-base font-extrabold text-foreground">Brand TVCs commercials</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">
                          TVCs Section Heading
                        </label>
                        <input
                          type="text"
                          value={formData.sections.tvcs.title || ""}
                          onChange={(e) => updateSectionField("tvcs", "title", e.target.value)}
                          placeholder="A Brand That Holds It All Together"
                          className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">
                          TVCs Section Subtitle
                        </label>
                        <textarea
                          rows={2}
                          value={formData.sections.tvcs.subtitle || ""}
                          onChange={(e) => updateSectionField("tvcs", "subtitle", e.target.value)}
                          placeholder="Jivanjor brings together product performance..."
                          className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary resize-none"
                        />
                      </div>
                    </div>

                    {/* TVC commercial videos list */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase text-foreground/45 tracking-wider">Commercial Videos</span>
                        <button
                          type="button"
                          onClick={() => addItem("tvcs", { id: "commercial", title: "New Commercial Video", thumbnail: "/images/about/about-video-1.png", youtubeId: "5F7y8l18Nrc" })}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary text-[10px] font-black uppercase rounded-lg cursor-pointer"
                        >
                          <Plus className="h-3.5 w-3.5" /> Add Video
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {formData.sections.tvcs.items?.map((item: any, idx: number) => (
                          <div key={idx} className="p-4 border border-border bg-surface/30 rounded-2xl relative space-y-3">
                            <button
                              type="button"
                              onClick={() => removeItem("tvcs", idx)}
                              className="absolute top-3 right-3 p-1.5 hover:bg-red-500/10 text-red-500 rounded-lg cursor-pointer transition-colors border border-border bg-background"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                            <span className="text-[9px] font-black uppercase bg-primary/10 text-primary px-2 py-0.5 rounded-full w-fit">Video #{idx + 1}</span>
                            <div>
                              <input
                                type="text"
                                value={item.title || ""}
                                onChange={(e) => updateItemField("tvcs", idx, "title", e.target.value)}
                                placeholder="Video Title"
                                className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-xs font-semibold mb-2"
                              />
                              <input
                                type="text"
                                value={item.youtubeId || ""}
                                onChange={(e) => updateItemField("tvcs", idx, "youtubeId", e.target.value)}
                                placeholder="YouTube Video ID (e.g. 5F7y8l18Nrc)"
                                className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-xs mb-2"
                              />
                              <div className="space-y-1">
                                <span className="block text-[10px] font-bold text-foreground/45 uppercase tracking-wider">Thumbnail Image</span>
                                <ImageUpload
                                  value={item.thumbnail || ""}
                                  onChange={(url) => updateItemField("tvcs", idx, "thumbnail", url)}
                                  folder="templates"
                                  size="compact"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Product Layout Only Tabs */}
                {activeTab === "specifications" && formData.sections?.specifications && (
                  <div className="space-y-6 animate-[fadeIn_0.15s_ease-out]">
                    <div className="flex items-center gap-2 border-b border-border pb-3">
                      <Sliders className="h-5 w-5 text-primary" />
                      <h3 className="text-base font-extrabold text-foreground">Technical Specifications</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">
                          Section Title
                        </label>
                        <input
                          type="text"
                          value={formData.sections.specifications.title}
                          onChange={(e) => updateSectionField("specifications", "title", e.target.value)}
                          placeholder="Technical Specifications"
                          className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">
                          Section Description/Subtitle
                        </label>
                        <input
                          type="text"
                          value={formData.sections.specifications.subtitle || ""}
                          onChange={(e) => updateSectionField("specifications", "subtitle", e.target.value)}
                          placeholder="Accurate specifications tested under normal lab conditions..."
                          className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary"
                        />
                      </div>
                    </div>

                    {/* Specifications key-value table */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase text-foreground/45 tracking-wider">Specifications properties</span>
                        <button
                          type="button"
                          onClick={() => addItem("specifications", { label: "Adhesive Viscosity", value: "220 Poise" })}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary text-[10px] font-black uppercase rounded-lg cursor-pointer"
                        >
                          <Plus className="h-3.5 w-3.5" /> Add Property row
                        </button>
                      </div>

                      <div className="space-y-3 bg-surface/10 p-4 border border-border rounded-2xl">
                        {formData.sections.specifications.items?.map((item: any, idx: number) => (
                          <div key={idx} className="flex gap-4 items-center">
                            <span className="text-xs text-foreground/40 font-bold shrink-0">#{idx + 1}</span>
                            <input
                              type="text"
                              value={item.label}
                              onChange={(e) => updateItemField("specifications", idx, "label", e.target.value)}
                              placeholder="Property (e.g. Viscosity)"
                              className="flex-1 px-3 py-1.5 bg-background border border-border rounded-xl text-xs font-bold"
                            />
                            <input
                              type="text"
                              value={item.value}
                              onChange={(e) => updateItemField("specifications", idx, "value", e.target.value)}
                              placeholder="Value (e.g. 200 Poise)"
                              className="flex-1 px-3 py-1.5 bg-background border border-border rounded-xl text-xs font-medium"
                            />
                            <button
                              type="button"
                              onClick={() => removeItem("specifications", idx)}
                              className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg cursor-pointer transition-colors border border-border bg-background"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "features" && formData.sections?.features && (
                  <div className="space-y-6 animate-[fadeIn_0.15s_ease-out]">
                    <div className="flex items-center gap-2 border-b border-border pb-3">
                      <Shield className="h-5 w-5 text-primary" />
                      <h3 className="text-base font-extrabold text-foreground">Performance Features</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">
                          Features Heading Title
                        </label>
                        <input
                          type="text"
                          value={formData.sections.features.title}
                          onChange={(e) => updateSectionField("features", "title", e.target.value)}
                          placeholder="Key Performance Features"
                          className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">
                          Features Subtitle
                        </label>
                        <input
                          type="text"
                          value={formData.sections.features.subtitle || ""}
                          onChange={(e) => updateSectionField("features", "subtitle", e.target.value)}
                          placeholder="Why Jivanjor outperforms ordinary carpentry glues..."
                          className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary"
                        />
                      </div>
                    </div>

                    {/* Features checklist cards */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase text-foreground/45 tracking-wider">Product features features</span>
                        <button
                          type="button"
                          onClick={() => addItem("features", { title: "Extra Sticky Grab", description: "Align laminates easily..." })}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary text-[10px] font-black uppercase rounded-lg cursor-pointer"
                        >
                          <Plus className="h-3.5 w-3.5" /> Add Feature Card
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {formData.sections.features.items?.map((item: any, idx: number) => (
                          <div key={idx} className="p-4 border border-border bg-surface/30 rounded-2xl relative space-y-3">
                            <button
                              type="button"
                              onClick={() => removeItem("features", idx)}
                              className="absolute top-3 right-3 p-1.5 hover:bg-red-500/10 text-red-500 rounded-lg cursor-pointer transition-colors border border-border bg-background"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                            <span className="text-[9px] font-black uppercase bg-primary/10 text-primary px-2 py-0.5 rounded-full w-fit">Feature #{idx + 1}</span>
                            <div>
                              <input
                                type="text"
                                value={item.title}
                                onChange={(e) => updateItemField("features", idx, "title", e.target.value)}
                                placeholder="Feature Title"
                                className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-xs font-semibold mb-2"
                              />
                              <textarea
                                rows={2}
                                value={item.description}
                                onChange={(e) => updateItemField("features", idx, "description", e.target.value)}
                                placeholder="Feature Details Description"
                                className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-xs resize-none"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "applicationGuide" && formData.sections?.applicationGuide && (
                  <div className="space-y-6 animate-[fadeIn_0.15s_ease-out]">
                    <div className="flex items-center gap-2 border-b border-border pb-3">
                      <Grid className="h-5 w-5 text-primary" />
                      <h3 className="text-base font-extrabold text-foreground">Step-by-Step Application Guide</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">
                          Guide Title Main Heading
                        </label>
                        <input
                          type="text"
                          value={formData.sections.applicationGuide.title}
                          onChange={(e) => updateSectionField("applicationGuide", "title", e.target.value)}
                          placeholder="Step-by-Step Application Guide"
                          className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">
                          Guide Subtitle details
                        </label>
                        <input
                          type="text"
                          value={formData.sections.applicationGuide.subtitle || ""}
                          onChange={(e) => updateSectionField("applicationGuide", "subtitle", e.target.value)}
                          placeholder="Follow these simple steps for professional results..."
                          className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary"
                        />
                      </div>
                    </div>

                    {/* Guide Steps list */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase text-foreground/45 tracking-wider">Application Steps Workflow</span>
                        <button
                          type="button"
                          onClick={() => addItem("applicationGuide", { title: "Next Prep Step", description: "Ensure surface dry...", image: "/images/Champion Super.png" })}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary text-[10px] font-black uppercase rounded-lg cursor-pointer"
                        >
                          <Plus className="h-3.5 w-3.5" /> Add Guide Step
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {formData.sections.applicationGuide.items?.map((item: any, idx: number) => (
                          <div key={idx} className="p-4 border border-border bg-surface/30 rounded-2xl relative space-y-3">
                            <button
                              type="button"
                              onClick={() => removeItem("applicationGuide", idx)}
                              className="absolute top-3 right-3 p-1.5 hover:bg-red-500/10 text-red-500 rounded-lg cursor-pointer transition-colors border border-border bg-background"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                            <span className="text-[9px] font-black uppercase bg-primary/10 text-primary px-2 py-0.5 rounded-full w-fit">Step #{idx + 1}</span>
                            <div>
                              <input
                                type="text"
                                value={item.title}
                                onChange={(e) => updateItemField("applicationGuide", idx, "title", e.target.value)}
                                placeholder="Step Title"
                                className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-xs font-semibold mb-2"
                              />
                              <textarea
                                rows={2}
                                value={item.description}
                                onChange={(e) => updateItemField("applicationGuide", idx, "description", e.target.value)}
                                placeholder="Step Guidelines detail..."
                                className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-xs mb-2 resize-none"
                              />
                              <div className="space-y-1">
                                <span className="block text-[10px] font-bold text-foreground/45 uppercase tracking-wider">Illustration Image</span>
                                <ImageUpload
                                  value={item.image || ""}
                                  onChange={(url) => updateItemField("applicationGuide", idx, "image", url)}
                                  folder="templates"
                                  size="compact"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "faqs" && formData.sections?.faqs && (
                  <div className="space-y-6 animate-[fadeIn_0.15s_ease-out]">
                    <div className="flex items-center gap-2 border-b border-border pb-3">
                      <Award className="h-5 w-5 text-primary" />
                      <h3 className="text-base font-extrabold text-foreground">Troubleshooting & FAQs</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">
                          FAQ Section Title
                        </label>
                        <input
                          type="text"
                          value={formData.sections.faqs.title}
                          onChange={(e) => updateSectionField("faqs", "title", e.target.value)}
                          placeholder="Troubleshooting & FAQs"
                          className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">
                          FAQ Section Subtitle
                        </label>
                        <input
                          type="text"
                          value={formData.sections.faqs.subtitle || ""}
                          onChange={(e) => updateSectionField("faqs", "subtitle", e.target.value)}
                          placeholder="Common application questions answered..."
                          className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary"
                        />
                      </div>
                    </div>

                    {/* FAQ Q&A cards */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase text-foreground/45 tracking-wider">Troubleshooting FAQ cards</span>
                        <button
                          type="button"
                          onClick={() => addItem("faqs", { question: "What is the clamping time?", answer: "Normally 2 to 3 hours." })}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary text-[10px] font-black uppercase rounded-lg cursor-pointer"
                        >
                          <Plus className="h-3.5 w-3.5" /> Add Q&A Item
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {formData.sections.faqs.items?.map((item: any, idx: number) => (
                          <div key={idx} className="p-4 border border-border bg-surface/30 rounded-2xl relative space-y-3">
                            <button
                              type="button"
                              onClick={() => removeItem("faqs", idx)}
                              className="absolute top-3 right-3 p-1.5 hover:bg-red-500/10 text-red-500 rounded-lg cursor-pointer transition-colors border border-border bg-background"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                            <span className="text-[9px] font-black uppercase bg-primary/10 text-primary px-2 py-0.5 rounded-full w-fit">FAQ #{idx + 1}</span>
                            <div>
                              <input
                                type="text"
                                value={item.question}
                                onChange={(e) => updateItemField("faqs", idx, "question", e.target.value)}
                                placeholder="Question Text"
                                className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-xs font-semibold mb-2"
                              />
                              <textarea
                                rows={2}
                                value={item.answer}
                                onChange={(e) => updateItemField("faqs", idx, "answer", e.target.value)}
                                placeholder="Detailed Answer description..."
                                className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-xs resize-none"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Categories Layout Only Tabs */}
                {activeTab === "categoriesShowcase" && formData.sections?.categoriesShowcase && (
                  <div className="space-y-6 animate-[fadeIn_0.15s_ease-out]">
                    <div className="flex items-center gap-2 border-b border-border pb-3">
                      <Grid className="h-5 w-5 text-primary" />
                      <h3 className="text-base font-extrabold text-foreground">Application Sub-Categories Showcase</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">
                          Showcase Main Heading
                        </label>
                        <input
                          type="text"
                          value={formData.sections.categoriesShowcase.title}
                          onChange={(e) => updateSectionField("categoriesShowcase", "title", e.target.value)}
                          placeholder="Application Sub-Categories"
                          className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">
                          Showcase Subtitle
                        </label>
                        <input
                          type="text"
                          value={formData.sections.categoriesShowcase.subtitle || ""}
                          onChange={(e) => updateSectionField("categoriesShowcase", "subtitle", e.target.value)}
                          placeholder="Navigate through specialized category segments..."
                          className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary"
                        />
                      </div>
                    </div>

                    {/* Sub-category showcase cards */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase text-foreground/45 tracking-wider">Sub-category cards</span>
                        <button
                          type="button"
                          onClick={() => addItem("categoriesShowcase", { name: "Laminates & Veneers", description: "Water-based glues...", image: "/images/Champion Super.png", link: "#" })}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary text-[10px] font-black uppercase rounded-lg cursor-pointer"
                        >
                          <Plus className="h-3.5 w-3.5" /> Add Category Card
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {formData.sections.categoriesShowcase.items?.map((item: any, idx: number) => (
                          <div key={idx} className="p-4 border border-border bg-surface/30 rounded-2xl relative space-y-3">
                            <button
                              type="button"
                              onClick={() => removeItem("categoriesShowcase", idx)}
                              className="absolute top-3 right-3 p-1.5 hover:bg-red-500/10 text-red-500 rounded-lg cursor-pointer transition-colors border border-border bg-background"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                            <span className="text-[9px] font-black uppercase bg-primary/10 text-primary px-2 py-0.5 rounded-full w-fit">Card #{idx + 1}</span>
                            <div>
                              <input
                                type="text"
                                value={item.name}
                                onChange={(e) => updateItemField("categoriesShowcase", idx, "name", e.target.value)}
                                placeholder="Subcategory Name"
                                className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-xs font-semibold mb-2"
                              />
                              <textarea
                                rows={2}
                                value={item.description}
                                onChange={(e) => updateItemField("categoriesShowcase", idx, "description", e.target.value)}
                                placeholder="Subcategory description detail..."
                                className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-xs mb-2 resize-none"
                              />
                              <input
                                type="text"
                                value={item.link || ""}
                                onChange={(e) => updateItemField("categoriesShowcase", idx, "link", e.target.value)}
                                placeholder="Link Target (e.g. /products?cat=laminates)"
                                className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-xs mb-2"
                              />
                              <div className="space-y-1">
                                <span className="block text-[10px] font-bold text-foreground/45 uppercase tracking-wider">Showcase Image</span>
                                <ImageUpload
                                  value={item.image || ""}
                                  onChange={(url) => updateItemField("categoriesShowcase", idx, "image", url)}
                                  folder="templates"
                                  size="compact"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "applicationsGrid" && formData.sections?.applicationsGrid && (
                  <div className="space-y-6 animate-[fadeIn_0.15s_ease-out]">
                    <div className="flex items-center gap-2 border-b border-border pb-3">
                      <FileText className="h-5 w-5 text-primary" />
                      <h3 className="text-base font-extrabold text-foreground">Common Assembly & Applications Areas</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">
                          Grid Heading Title
                        </label>
                        <input
                          type="text"
                          value={formData.sections.applicationsGrid.title}
                          onChange={(e) => updateSectionField("applicationsGrid", "title", e.target.value)}
                          placeholder="Common Construction & Assembly Areas"
                          className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">
                          Grid Description details
                        </label>
                        <input
                          type="text"
                          value={formData.sections.applicationsGrid.subtitle || ""}
                          onChange={(e) => updateSectionField("applicationsGrid", "subtitle", e.target.value)}
                          placeholder="Where Jivanjor adhesives are applied daily..."
                          className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary"
                        />
                      </div>
                    </div>

                    {/* Applications cards lists */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase text-foreground/45 tracking-wider">Assembly grids</span>
                        <button
                          type="button"
                          onClick={() => addItem("applicationsGrid", { title: "Kitchen Assembly", description: "Demands moisture proof...", image: "/images/Champion Super.png" })}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary text-[10px] font-black uppercase rounded-lg cursor-pointer"
                        >
                          <Plus className="h-3.5 w-3.5" /> Add Assembly Card
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {formData.sections.applicationsGrid.items?.map((item: any, idx: number) => (
                          <div key={idx} className="p-4 border border-border bg-surface/30 rounded-2xl relative space-y-3">
                            <button
                              type="button"
                              onClick={() => removeItem("applicationsGrid", idx)}
                              className="absolute top-3 right-3 p-1.5 hover:bg-red-500/10 text-red-500 rounded-lg cursor-pointer transition-colors border border-border bg-background"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                            <span className="text-[9px] font-black uppercase bg-primary/10 text-primary px-2 py-0.5 rounded-full w-fit">Area #{idx + 1}</span>
                            <div>
                              <input
                                type="text"
                                value={item.title}
                                onChange={(e) => updateItemField("applicationsGrid", idx, "title", e.target.value)}
                                placeholder="Area Name"
                                className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-xs font-semibold mb-2"
                              />
                              <textarea
                                rows={2}
                                value={item.description}
                                onChange={(e) => updateItemField("applicationsGrid", idx, "description", e.target.value)}
                                placeholder="Substrate requirements description..."
                                className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-xs mb-2 resize-none"
                              />
                              <div className="space-y-1">
                                <span className="block text-[10px] font-bold text-foreground/45 uppercase tracking-wider">Area Image</span>
                                <ImageUpload
                                  value={item.image || ""}
                                  onChange={(url) => updateItemField("applicationsGrid", idx, "image", url)}
                                  folder="templates"
                                  size="compact"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "substrates" && formData.sections?.substrates && (
                  <div className="space-y-6 animate-[fadeIn_0.15s_ease-out]">
                    <div className="flex items-center gap-2 border-b border-border pb-3">
                      <Shield className="h-5 w-5 text-primary" />
                      <h3 className="text-base font-extrabold text-foreground font-google-sans">Substrates Compatibility Matrix</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">
                          Section Matrix Title
                        </label>
                        <input
                          type="text"
                          value={formData.sections.substrates.title}
                          onChange={(e) => updateSectionField("substrates", "title", e.target.value)}
                          placeholder="Substrates Compatibility Matrix"
                          className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">
                          Section Description Subtitle
                        </label>
                        <input
                          type="text"
                          value={formData.sections.substrates.subtitle || ""}
                          onChange={(e) => updateSectionField("substrates", "subtitle", e.target.value)}
                          placeholder="Check substrate compatibility ratings..."
                          className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary"
                        />
                      </div>
                    </div>

                    {/* Substrates list rows */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase text-foreground/45 tracking-wider">Substrate Boards Rows</span>
                        <button
                          type="button"
                          onClick={() => addItem("substrates", { name: "Plywood to Laminate", suitability: "Excellent", comment: "Perfect bonding grab." })}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary text-[10px] font-black uppercase rounded-lg cursor-pointer"
                        >
                          <Plus className="h-3.5 w-3.5" /> Add Substrate board
                        </button>
                      </div>

                      <div className="space-y-3 bg-surface/10 p-4 border border-border rounded-2xl">
                        {formData.sections.substrates.items?.map((item: any, idx: number) => (
                          <div key={idx} className="p-4 bg-background border border-border rounded-xl space-y-3 relative">
                            <button
                              type="button"
                              onClick={() => removeItem("substrates", idx)}
                              className="absolute top-3 right-3 p-1.5 hover:bg-red-500/10 text-red-500 rounded-lg cursor-pointer transition-colors border border-border bg-background"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                            <span className="text-[9px] font-black uppercase bg-primary/10 text-primary px-2 py-0.5 rounded-full w-fit">Row #{idx + 1}</span>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              <input
                                type="text"
                                value={item.name}
                                onChange={(e) => updateItemField("substrates", idx, "name", e.target.value)}
                                placeholder="Substrate (e.g. MDF to Acrylic)"
                                className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-xs font-bold"
                              />
                              <select
                                value={item.suitability}
                                onChange={(e) => updateItemField("substrates", idx, "suitability", e.target.value)}
                                className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-xs font-semibold text-foreground cursor-pointer"
                              >
                                <option value="Excellent">Excellent Compatibility</option>
                                <option value="Good">Good Compatibility</option>
                                <option value="Fair">Fair Compatibility</option>
                                <option value="Poor">Poor / Unsupported</option>
                              </select>
                              <input
                                type="text"
                                value={item.comment || ""}
                                onChange={(e) => updateItemField("substrates", idx, "comment", e.target.value)}
                                placeholder="Recommendations details comments..."
                                className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-xs font-medium"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ── Applications List Tab ── */}
                {activeTab === "list" && formData.sections?.list && formData.sections.layoutType === "applications" && (
                  <div className="space-y-6 animate-[fadeIn_0.15s_ease-out]">
                    <div className="flex items-center gap-2 border-b border-border pb-3">
                      <Grid className="h-5 w-5 text-primary" />
                      <h3 className="text-base font-extrabold text-foreground font-google-sans">Applications List</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">
                          Section Title
                        </label>
                        <input
                          type="text"
                          value={formData.sections.list.title || ""}
                          onChange={(e) => updateSectionField("list", "title", e.target.value)}
                          placeholder="Woodworking Applications List"
                          className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">
                          Section Subtitle
                        </label>
                        <textarea
                          rows={2}
                          value={formData.sections.list.subtitle || ""}
                          onChange={(e) => updateSectionField("list", "subtitle", e.target.value)}
                          placeholder="Section description..."
                          className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary resize-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase text-foreground/45 tracking-wider">Application Cards</span>
                        <button
                          type="button"
                          onClick={() => addItem("list", { title: "New Application", desc: "Description here", image: "/images/applications/Rectangle 150.png" })}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary text-[10px] font-black uppercase rounded-lg cursor-pointer"
                        >
                          <Plus className="h-3.5 w-3.5" /> Add Application Card
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {formData.sections.list.items?.map((item: any, idx: number) => (
                          <div key={idx} className="p-4 border border-border bg-surface/30 rounded-2xl relative space-y-3">
                            <button
                              type="button"
                              onClick={() => removeItem("list", idx)}
                              className="absolute top-3 right-3 p-1.5 hover:bg-red-500/10 text-red-500 rounded-lg cursor-pointer transition-colors border border-border bg-background"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                            <span className="text-[9px] font-black uppercase bg-primary/10 text-primary px-2 py-0.5 rounded-full w-fit">Card #{idx + 1}</span>
                            <div>
                              <input
                                type="text"
                                value={item.title || ""}
                                onChange={(e) => updateItemField("list", idx, "title", e.target.value)}
                                placeholder="Application Title"
                                className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-xs font-semibold mb-2"
                              />
                              <textarea
                                rows={2}
                                value={item.desc || ""}
                                onChange={(e) => updateItemField("list", idx, "desc", e.target.value)}
                                placeholder="Description"
                                className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-xs mb-2 resize-none"
                              />
                              <div className="space-y-1">
                                <span className="block text-[10px] font-bold text-foreground/45 uppercase tracking-wider">Card Image</span>
                                <ImageUpload
                                  value={item.image || ""}
                                  onChange={(url) => updateItemField("list", idx, "image", url)}
                                  folder="templates"
                                  size="compact"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ── Related Products Tab ── */}
                {activeTab === "relatedProducts" && formData.sections?.relatedProducts && formData.sections.layoutType === "applications" && (
                  <div className="space-y-6 animate-[fadeIn_0.15s_ease-out]">
                    <div className="flex items-center gap-2 border-b border-border pb-3">
                      <Layers className="h-5 w-5 text-primary" />
                      <h3 className="text-base font-extrabold text-foreground font-google-sans">Related Products</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">
                          Section Title
                        </label>
                        <input
                          type="text"
                          value={formData.sections.relatedProducts.title || ""}
                          onChange={(e) => updateSectionField("relatedProducts", "title", e.target.value)}
                          placeholder="Related Products"
                          className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase text-foreground/45 tracking-wider">Product Cards</span>
                        <button
                          type="button"
                          onClick={() => addItem("relatedProducts", { title: "New Product", description: "Provides a superior bond...", image: "/images/Champion Super.png", color: "bg-[#0083CB]" })}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary text-[10px] font-black uppercase rounded-lg cursor-pointer"
                        >
                          <Plus className="h-3.5 w-3.5" /> Add Product Card
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {formData.sections.relatedProducts.items?.map((item: any, idx: number) => (
                          <div key={idx} className="p-4 border border-border bg-surface/30 rounded-2xl relative space-y-3">
                            <button
                              type="button"
                              onClick={() => removeItem("relatedProducts", idx)}
                              className="absolute top-3 right-3 p-1.5 hover:bg-red-500/10 text-red-500 rounded-lg cursor-pointer transition-colors border border-border bg-background"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                            <span className="text-[9px] font-black uppercase bg-primary/10 text-primary px-2 py-0.5 rounded-full w-fit">Product #{idx + 1}</span>
                            <div>
                              <input
                                type="text"
                                value={item.title || ""}
                                onChange={(e) => updateItemField("relatedProducts", idx, "title", e.target.value)}
                                placeholder="Product Title"
                                className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-xs font-semibold mb-2"
                              />
                              <textarea
                                rows={2}
                                value={item.description || ""}
                                onChange={(e) => updateItemField("relatedProducts", idx, "description", e.target.value)}
                                placeholder="Description"
                                className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-xs mb-2 resize-none"
                              />
                              <input
                                type="text"
                                value={item.color || ""}
                                onChange={(e) => updateItemField("relatedProducts", idx, "color", e.target.value)}
                                placeholder="bg-[#0083CB]"
                                className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-xs font-semibold mb-2"
                              />
                              <div className="space-y-1">
                                <span className="block text-[10px] font-bold text-foreground/45 uppercase tracking-wider">Product Image</span>
                                <ImageUpload
                                  value={item.image || ""}
                                  onChange={(url) => updateItemField("relatedProducts", idx, "image", url)}
                                  folder="templates"
                                  size="compact"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ── Applications FAQs Tab ── */}
                {activeTab === "faqs" && formData.sections?.faqs && formData.sections.layoutType === "applications" && (
                  <div className="space-y-6 animate-[fadeIn_0.15s_ease-out]">
                    <div className="flex items-center gap-2 border-b border-border pb-3">
                      <Award className="h-5 w-5 text-primary" />
                      <h3 className="text-base font-extrabold text-foreground font-google-sans">FAQs Accordion</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">
                          Section Title
                        </label>
                        <input
                          type="text"
                          value={formData.sections.faqs.title || ""}
                          onChange={(e) => updateSectionField("faqs", "title", e.target.value)}
                          placeholder="FAQs"
                          className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">
                          Section Subtitle
                        </label>
                        <textarea
                          rows={2}
                          value={formData.sections.faqs.subtitle || ""}
                          onChange={(e) => updateSectionField("faqs", "subtitle", e.target.value)}
                          placeholder="Find quick answers..."
                          className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary resize-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase text-foreground/45 tracking-wider">Troubleshooting FAQ cards</span>
                        <button
                          type="button"
                          onClick={() => addItem("faqs", { question: "New Question?", answer: "Answer here." })}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary text-[10px] font-black uppercase rounded-lg cursor-pointer"
                        >
                          <Plus className="h-3.5 w-3.5" /> Add Q&A Item
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {formData.sections.faqs.items?.map((item: any, idx: number) => (
                          <div key={idx} className="p-4 border border-border bg-surface/30 rounded-2xl relative space-y-3">
                            <button
                              type="button"
                              onClick={() => removeItem("faqs", idx)}
                              className="absolute top-3 right-3 p-1.5 hover:bg-red-500/10 text-red-500 rounded-lg cursor-pointer transition-colors border border-border bg-background"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                            <span className="text-[9px] font-black uppercase bg-primary/10 text-primary px-2 py-0.5 rounded-full w-fit">FAQ #{idx + 1}</span>
                            <div>
                              <input
                                type="text"
                                value={item.question || ""}
                                onChange={(e) => updateItemField("faqs", idx, "question", e.target.value)}
                                placeholder="Question Text"
                                className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-xs font-semibold mb-2"
                              />
                              <textarea
                                rows={2}
                                value={item.answer || ""}
                                onChange={(e) => updateItemField("faqs", idx, "answer", e.target.value)}
                                placeholder="Detailed Answer description..."
                                className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-xs resize-none"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ── Blog Hero Tab ── */}
                {activeTab === "hero" && formData.sections?.hero && formData.sections.layoutType === "blog" && (
                  <div className="space-y-6 animate-[fadeIn_0.15s_ease-out]">
                    <div className="flex items-center gap-2 border-b border-border pb-3">
                      <Layout className="h-5 w-5 text-primary" />
                      <h3 className="text-base font-extrabold text-foreground">Blog Hero Banner</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">Hero Title</label>
                        <input
                          type="text"
                          value={formData.sections.hero.title || ""}
                          onChange={(e) => updateSectionField("hero", "title", e.target.value)}
                          placeholder="Practical Guidance for Woodwork and Adhesives"
                          className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">Breadcrumb / Subtitle Label</label>
                        <input
                          type="text"
                          value={formData.sections.hero.subtitle || ""}
                          onChange={(e) => updateSectionField("hero", "subtitle", e.target.value)}
                          placeholder="Knowledge Hub"
                          className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary"
                        />
                      </div>
                      <div className="md:col-span-2 space-y-1">
                        <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">Desktop Hero Image</label>
                        <ImageUpload
                          value={formData.sections.hero.desktopImage || ""}
                          onChange={(url) => updateSectionField("hero", "desktopImage", url)}
                          folder="templates"
                          size="default"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* ── Privacy Hero Tab ── */}
                {activeTab === "hero" && formData.sections?.hero && layoutType === "privacy" && (
                  <div className="space-y-6 animate-[fadeIn_0.15s_ease-out]">
                    <div className="flex items-center gap-2 border-b border-border pb-3">
                      <Layout className="h-5 w-5 text-primary" />
                      <h3 className="text-base font-extrabold text-foreground">Privacy Hero Banner Settings</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">Hero Title</label>
                        <input
                          type="text"
                          value={formData.sections.hero.title || ""}
                          onChange={(e) => updateSectionField("hero", "title", e.target.value)}
                          placeholder="Privacy Policy"
                          className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">Hero Description</label>
                        <textarea
                          rows={3}
                          value={formData.sections.hero.desc || ""}
                          onChange={(e) => updateSectionField("hero", "desc", e.target.value)}
                          placeholder="Understand how we collect, use, and protect your information at Jivanjor."
                          className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary resize-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* ── Blog List / Categories & Posts Tab ── */}
                {activeTab === "list" && formData.sections?.list && formData.sections.layoutType === "blog" && (
                  <div className="space-y-6 animate-[fadeIn_0.15s_ease-out]">
                    <div className="flex items-center gap-2 border-b border-border pb-3">
                      <FileText className="h-5 w-5 text-primary" />
                      <h3 className="text-base font-extrabold text-foreground">Browse Categories</h3>
                    </div>

                    {/* Categories */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase text-foreground/45 tracking-wider">Browse Categories</span>
                        <button
                          type="button"
                          onClick={() => {
                            const cats = [...(formData.sections.list?.categories || []), { name: "New Category", icon: "/images/blog/image 47.svg" }];
                            updateSectionField("list", "categories", cats);
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary text-[10px] font-black uppercase rounded-lg cursor-pointer"
                        >
                          <Plus className="h-3.5 w-3.5" /> Add Category
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {(formData.sections.list?.categories || []).map((cat: any, idx: number) => (
                          <div key={idx} className="p-4 border border-border bg-surface/30 rounded-2xl relative space-y-3">
                            <button
                              type="button"
                              onClick={() => {
                                const cats = (formData.sections.list?.categories || []).filter((_: any, i: number) => i !== idx);
                                updateSectionField("list", "categories", cats);
                              }}
                              className="absolute top-3 right-3 p-1.5 hover:bg-red-500/10 text-red-500 rounded-lg cursor-pointer border border-border bg-background"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                            <span className="text-[9px] font-black uppercase bg-primary/10 text-primary px-2 py-0.5 rounded-full w-fit">Category #{idx + 1}</span>
                            <input
                              type="text"
                              value={cat.name || ""}
                              onChange={(e) => {
                                const cats = [...(formData.sections.list?.categories || [])];
                                cats[idx] = { ...cats[idx], name: e.target.value };
                                updateSectionField("list", "categories", cats);
                              }}
                              placeholder="Category Name"
                              className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-xs font-semibold"
                            />
                            <div className="space-y-1">
                              <span className="block text-[10px] font-bold text-foreground/45 uppercase tracking-wider">Category Icon</span>
                              <ImageUpload
                                value={cat.icon || ""}
                                onChange={(url) => {
                                  const cats = [...(formData.sections.list?.categories || [])];
                                  cats[idx] = { ...cats[idx], icon: url };
                                  updateSectionField("list", "categories", cats);
                                }}
                                folder="templates"
                                size="compact"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                )}

                {/* ── Contractor ReachLeft / App & Features Setup Tab ── */}
                {activeTab === "reachLeft" && formData.sections?.reachLeft && layoutType === "contractor" && (
                  <div className="space-y-6 animate-[fadeIn_0.15s_ease-out]">
                    <div className="flex items-center gap-2 border-b border-border pb-3">
                      <FileText className="h-5 w-5 text-primary" />
                      <h3 className="text-base font-extrabold text-foreground">App &amp; Features Setup</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">
                          Main Title Heading
                        </label>
                        <input
                          type="text"
                          value={formData.sections.reachLeft.title || ""}
                          onChange={(e) => updateSectionField("reachLeft", "title", e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">
                          App Download Text (Description)
                        </label>
                        <textarea
                          rows={2}
                          value={formData.sections.reachLeft.appText || ""}
                          onChange={(e) => updateSectionField("reachLeft", "appText", e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary resize-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">
                          App Play Store Link URL
                        </label>
                        <input
                          type="text"
                          value={formData.sections.reachLeft.playStoreLink || ""}
                          onChange={(e) => updateSectionField("reachLeft", "playStoreLink", e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">
                          Promo App Banner Image
                        </label>
                        <ImageUpload
                          value={formData.sections.reachLeft.promoImage || ""}
                          onChange={(url) => updateSectionField("reachLeft", "promoImage", url)}
                          folder="templates"
                        />
                      </div>
                    </div>

                    {/* Cards setup */}
                    <div className="space-y-4 pt-4 border-t border-border">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase text-foreground/45 tracking-wider">Features Cards</span>
                        <button
                          type="button"
                          onClick={() => addItem("reachLeft", { title: "New Feature", desc: "Feature details...", icon: "/images/about/Ad-product.svg" })}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary text-[10px] font-black uppercase rounded-lg cursor-pointer"
                        >
                          <Plus className="h-3.5 w-3.5" /> Add Card
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {(formData.sections.reachLeft.cards || []).map((card: any, idx: number) => (
                          <div key={idx} className="p-4 border border-border bg-surface/30 rounded-2xl relative space-y-3">
                            <button
                              type="button"
                              onClick={() => removeItem("reachLeft", idx)}
                              className="absolute top-3 right-3 p-1.5 hover:bg-red-500/10 text-red-500 rounded-lg cursor-pointer border border-border bg-background"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                            <span className="text-[9px] font-black uppercase bg-primary/10 text-primary px-2 py-0.5 rounded-full w-fit">Card #{idx + 1}</span>
                            <input
                              type="text"
                              value={card.title || ""}
                              onChange={(e) => updateItemField("reachLeft", idx, "title", e.target.value)}
                              placeholder="Title"
                              className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-xs font-semibold mb-2"
                            />
                            <textarea
                              rows={2}
                              value={card.desc || ""}
                              onChange={(e) => updateItemField("reachLeft", idx, "desc", e.target.value)}
                              placeholder="Description"
                              className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-xs resize-none mb-2"
                            />
                            <div>
                              <span className="block text-[10px] font-bold text-foreground/45 uppercase tracking-wider mb-1">Icon Path</span>
                              <ImageUpload
                                value={card.icon || ""}
                                onChange={(url) => updateItemField("reachLeft", idx, "icon", url)}
                                folder="templates"
                                size="compact"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ── Partner ReachLeft / Dealer Features Setup Tab ── */}
                {activeTab === "reachLeft" && formData.sections?.reachLeft && layoutType === "partner" && (
                  <div className="space-y-6 animate-[fadeIn_0.15s_ease-out]">
                    <div className="flex items-center gap-2 border-b border-border pb-3">
                      <FileText className="h-5 w-5 text-primary" />
                      <h3 className="text-base font-extrabold text-foreground">Dealer Features Setup</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">
                          Main Title Heading
                        </label>
                        <input
                          type="text"
                          value={formData.sections.reachLeft.title || ""}
                          onChange={(e) => updateSectionField("reachLeft", "title", e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">
                          Description Subtitle
                        </label>
                        <textarea
                          rows={3}
                          value={formData.sections.reachLeft.desc || ""}
                          onChange={(e) => updateSectionField("reachLeft", "desc", e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary resize-none"
                        />
                      </div>
                    </div>

                    {/* Cards setup */}
                    <div className="space-y-4 pt-4 border-t border-border">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase text-foreground/45 tracking-wider">Features Cards</span>
                        <button
                          type="button"
                          onClick={() => addItem("reachLeft", { title: "New Feature", desc: "Feature details...", icon: "/images/about/Ad-product.svg" })}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary text-[10px] font-black uppercase rounded-lg cursor-pointer"
                        >
                          <Plus className="h-3.5 w-3.5" /> Add Card
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {(formData.sections.reachLeft.cards || []).map((card: any, idx: number) => (
                          <div key={idx} className="p-4 border border-border bg-surface/30 rounded-2xl relative space-y-3">
                            <button
                              type="button"
                              onClick={() => removeItem("reachLeft", idx)}
                              className="absolute top-3 right-3 p-1.5 hover:bg-red-500/10 text-red-500 rounded-lg cursor-pointer border border-border bg-background"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                            <span className="text-[9px] font-black uppercase bg-primary/10 text-primary px-2 py-0.5 rounded-full w-fit">Card #{idx + 1}</span>
                            <input
                              type="text"
                              value={card.title || ""}
                              onChange={(e) => updateItemField("reachLeft", idx, "title", e.target.value)}
                              placeholder="Title"
                              className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-xs font-semibold mb-2"
                            />
                            <textarea
                              rows={2}
                              value={card.desc || ""}
                              onChange={(e) => updateItemField("reachLeft", idx, "desc", e.target.value)}
                              placeholder="Description"
                              className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-xs resize-none mb-2"
                            />
                            <div>
                              <span className="block text-[10px] font-bold text-foreground/45 uppercase tracking-wider mb-1">Icon Path</span>
                              <ImageUpload
                                value={card.icon || ""}
                                onChange={(url) => updateItemField("reachLeft", idx, "icon", url)}
                                folder="templates"
                                size="compact"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ── Contractor Testimonials Tab ── */}
                {activeTab === "professionals" && formData.sections?.professionals && (
                  <div className="space-y-6 animate-[fadeIn_0.15s_ease-out]">
                    <div className="flex items-center gap-2 border-b border-border pb-3">
                      <Bookmark className="h-5 w-5 text-primary" />
                      <h3 className="text-base font-extrabold text-foreground">Woodworking Professionals Testimonials</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">
                          Testimonial Section Heading
                        </label>
                        <input
                          type="text"
                          value={formData.sections.professionals.title || ""}
                          onChange={(e) => updateSectionField("professionals", "title", e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">
                          Section Description Subtitle
                        </label>
                        <textarea
                          rows={2}
                          value={formData.sections.professionals.desc || ""}
                          onChange={(e) => updateSectionField("professionals", "desc", e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary resize-none"
                        />
                      </div>
                    </div>

                    {/* Testimonials list */}
                    <div className="space-y-4 pt-4 border-t border-border">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase text-foreground/45 tracking-wider">Testimonials Carousel Cards</span>
                        <button
                          type="button"
                          onClick={() => addItem("professionals", { type: "text", name: "Name", role: "Role", quote: "Feedback..." })}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary text-[10px] font-black uppercase rounded-lg cursor-pointer"
                        >
                          <Plus className="h-3.5 w-3.5" /> Add Testimonial
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {(formData.sections.professionals.testimonials || []).map((item: any, idx: number) => (
                          <div key={idx} className="p-4 border border-border bg-surface/30 rounded-2xl relative space-y-3">
                            <button
                              type="button"
                              onClick={() => removeItem("professionals", idx)}
                              className="absolute top-3 right-3 p-1.5 hover:bg-red-500/10 text-red-500 rounded-lg cursor-pointer border border-border bg-background"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                            <span className="text-[9px] font-black uppercase bg-primary/10 text-primary px-2 py-0.5 rounded-full w-fit">Testimonial #{idx + 1}</span>

                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-[10px] font-bold text-foreground/50 uppercase tracking-wider mb-1">Card Type</label>
                                <select
                                  value={item.type || "text"}
                                  onChange={(e) => updateItemField("professionals", idx, "type", e.target.value)}
                                  className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-xs text-foreground outline-none cursor-pointer border-border"
                                >
                                  <option value="text">Text Quote Card</option>
                                  <option value="video">Video Card</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold text-foreground/50 uppercase tracking-wider mb-1">Author Name</label>
                                <input
                                  type="text"
                                  value={item.name || ""}
                                  onChange={(e) => updateItemField("professionals", idx, "name", e.target.value)}
                                  className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-xs font-semibold border-border"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 gap-2">
                              <div>
                                <label className="block text-[10px] font-bold text-foreground/50 uppercase tracking-wider mb-1">Author Role</label>
                                <input
                                  type="text"
                                  value={item.role || ""}
                                  onChange={(e) => updateItemField("professionals", idx, "role", e.target.value)}
                                  className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-xs border-border"
                                />
                              </div>
                            </div>

                            {item.type === "video" ? (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 border-t border-border/50 pt-2">
                                <div>
                                  <label className="block text-[10px] font-bold text-foreground/50 uppercase tracking-wider mb-1">Thumbnail Image</label>
                                  <ImageUpload
                                    value={item.image || ""}
                                    onChange={(url) => updateItemField("professionals", idx, "image", url)}
                                    folder="templates"
                                    size="compact"
                                  />
                                </div>
                                <div className="flex items-center gap-2 pt-4 pl-2">
                                  <input
                                    type="checkbox"
                                    id={`showPlayButton-${idx}`}
                                    checked={!!item.showPlayButton}
                                    onChange={(e) => updateItemField("professionals", idx, "showPlayButton", e.target.checked)}
                                    className="h-4 w-4 text-primary focus:ring-primary border-border rounded"
                                  />
                                  <label htmlFor={`showPlayButton-${idx}`} className="text-xs text-foreground/75 font-semibold cursor-pointer select-none">
                                    Show Play Button
                                  </label>
                                </div>
                              </div>
                            ) : (
                              <div className="border-t border-border/50 pt-2">
                                <label className="block text-[10px] font-bold text-foreground/50 uppercase tracking-wider mb-1">Quote Description</label>
                                <textarea
                                  rows={2}
                                  value={item.quote || ""}
                                  onChange={(e) => updateItemField("professionals", idx, "quote", e.target.value)}
                                  className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-xs resize-none"
                                />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ── Partner Gallery Tab ── */}
                {activeTab === "gallery" && formData.sections?.gallery && (
                  <div className="space-y-6 animate-[fadeIn_0.15s_ease-out]">
                    <div className="flex items-center gap-2 border-b border-border pb-3">
                      <Grid className="h-5 w-5 text-primary" />
                      <h3 className="text-base font-extrabold text-foreground">Dealer Network Gallery</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">
                          Gallery Section Heading
                        </label>
                        <input
                          type="text"
                          value={formData.sections.gallery.title || ""}
                          onChange={(e) => updateSectionField("gallery", "title", e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">
                          Gallery Description Subtitle
                        </label>
                        <textarea
                          rows={2}
                          value={formData.sections.gallery.desc || ""}
                          onChange={(e) => updateSectionField("gallery", "desc", e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary resize-none"
                        />
                      </div>
                    </div>

                    {/* Gallery items list */}
                    <div className="space-y-4 pt-4 border-t border-border">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase text-foreground/45 tracking-wider">Dealer Network Gallery Cards (First item maps to Resource Box, remaining 5 to grid photos)</span>
                        <button
                          type="button"
                          onClick={() => addItem("gallery", { title: "Technical Resources", link: "#", imageUrl: "/images/dealer/Rectangle 35.png" })}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary text-[10px] font-black uppercase rounded-lg cursor-pointer"
                        >
                          <Plus className="h-3.5 w-3.5" /> Add Gallery Card
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {(formData.sections.gallery.items || []).map((item: any, idx: number) => (
                          <div key={idx} className="p-4 border border-border bg-surface/30 rounded-2xl relative space-y-3">
                            <button
                              type="button"
                              onClick={() => removeItem("gallery", idx)}
                              className="absolute top-3 right-3 p-1.5 hover:bg-red-500/10 text-red-500 rounded-lg cursor-pointer border border-border bg-background"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                            <span className="text-[9px] font-black uppercase bg-primary/10 text-primary px-2 py-0.5 rounded-full w-fit">
                              {idx === 0 ? "Resource Box Item #1" : `Grid Photo Card #${idx}`}
                            </span>

                            <input
                              type="text"
                              value={item.title || ""}
                              onChange={(e) => updateItemField("gallery", idx, "title", e.target.value)}
                              placeholder="Title / Label (e.g. Technical Resources)"
                              className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-xs font-semibold mb-2"
                            />

                            {idx === 0 && (
                              <input
                                type="text"
                                value={item.link || ""}
                                onChange={(e) => updateItemField("gallery", idx, "link", e.target.value)}
                                placeholder="Link URL (e.g. #)"
                                className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-xs mb-2"
                              />
                            )}

                            <div>
                              <span className="block text-[10px] font-bold text-foreground/45 uppercase tracking-wider mb-1">Image</span>
                              <ImageUpload
                                value={item.imageUrl || item.image || ""}
                                onChange={(url) => {
                                  updateItemField("gallery", idx, "imageUrl", url);
                                  updateItemField("gallery", idx, "image", url);
                                }}
                                folder="templates"
                                size="compact"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ── Privacy Document Editor Tab ── */}
                {activeTab === "content" && formData.sections?.content && layoutType === "privacy" && (
                  <div className="space-y-6 animate-[fadeIn_0.15s_ease-out]">
                    <div className="flex items-center gap-2 border-b border-border pb-3">
                      <FileText className="h-5 w-5 text-primary" />
                      <h3 className="text-base font-extrabold text-foreground">Document Content Editor</h3>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">
                        Privacy Policy Content (Rich text formatted with headings, paragraphs, lists, and links)
                      </label>
                      <BlogRichEditor
                        title="Privacy Policy Editor"
                        value={formData.sections.content.text || ""}
                        onChange={(content) => updateSectionField("content", "text", content)}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Form submit/cancel bar */}
              <div className="flex items-center justify-end gap-3 pt-6 border-t border-border mt-6 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-3 rounded-xl text-sm font-bold border border-border text-foreground hover:bg-surface cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl text-sm font-bold bg-primary hover:opacity-90 text-white shadow-md shadow-primary/10 cursor-pointer"
                >
                  {editingId ? "Save Custom Page" : "Configure Page"}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* ==================== DELETE CONFIRM DIALOG ==================== */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-background border border-border w-full max-w-md rounded-3xl overflow-hidden shadow-2xl p-6 space-y-4 animate-[modalShow_0.15s_ease-out]">
            <h3 className="text-lg font-black text-foreground">
              Confirm Cascading Deletion
            </h3>
            <p className="text-sm text-foreground/60 leading-normal font-medium">
              Are you absolutely sure you want to delete this dynamic page?
            </p>
            <div className="p-3 bg-red-50 dark:bg-red-950/20 text-[11px] font-bold text-red-600 rounded-xl leading-normal border border-red-100 dark:border-red-950/30">
              ⚠️ WARNING: Deleting this page will trigger cascading deletions, permanently removing all attached layouts, sections, and template configurations from the database!
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold border border-border text-foreground hover:bg-surface cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-primary text-white cursor-pointer"
              >
                Delete Everything
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
