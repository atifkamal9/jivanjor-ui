import { Suspense } from "react";
import { api, Product, Category } from "@/lib/api";
import ProductClientView from "@/components/products/ProductClientView";
import ProductSkeleton from "@/components/products/ProductSkeleton";
import JsonLdScript from "@/components/seo/JsonLdScript";
import { getResolvedSeoAndSchema, FallbackSeoData } from "@/lib/seo-helper";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

interface ProductsPageProps {
  searchParams: Promise<{ product?: string }>;
}

const PRODUCTS_HUB_FALLBACK: FallbackSeoData = {
  pageSchemaType: "CollectionPage",
  title: "Jivanjor Woodworking Adhesive Products | Jivanjor",
  description:
    "Explore the complete range of Jivanjor woodworking adhesives, waterproofing solutions, and specialized bonding products.",
  canonical: "https://jivanjor.com/products",
  breadcrumbs: [
    { name: "Home", url: "https://jivanjor.com/" },
    { name: "Products", url: "https://jivanjor.com/products" },
  ],
  itemList: [
    {
      name: "Champion Super",
      url: "https://jivanjor.com/products?product=champion-super",
    },
    {
      name: "Aquabond",
      url: "https://jivanjor.com/products?product=aquabond",
    },
    {
      name: "Foambond",
      url: "https://jivanjor.com/products?product=foambond",
    },
    {
      name: "Watershield",
      url: "https://jivanjor.com/products?product=watershield",
    },
  ],
};

export async function generateMetadata({
  searchParams,
}: ProductsPageProps): Promise<Metadata> {
  const { product: productSlug } = (await searchParams) || {};

  if (productSlug) {
    try {
      const prods = await api.getProducts().catch(() => []);
      const matched = prods.find(
        (p) =>
          p.slug?.toLowerCase() === productSlug.toLowerCase() ||
          p.name.toLowerCase().replace(/\s+/g, "-") === productSlug.toLowerCase() ||
          p.id === productSlug
      );

      const resolvedSlug = matched?.slug || productSlug;
      const productName = matched?.name || resolvedSlug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
      const canonical = `https://jivanjor.com/products?product=${resolvedSlug}`;
      const fallback: FallbackSeoData = {
        pageSchemaType: "WebPage",
        title: `${productName} | Jivanjor`,
        description:
          matched?.description ||
          `Explore ${productName} premium wood adhesive by Jivanjor.`,
        canonical,
        breadcrumbs: [
          { name: "Home", url: "https://jivanjor.com/" },
          { name: "Products", url: "https://jivanjor.com/products" },
          { name: productName, url: canonical },
        ],
      };
      const { metadata } = await getResolvedSeoAndSchema(
        "product",
        matched?.id || productSlug,
        fallback,
        [matched?.id, matched?.slug, matched?.name, productSlug]
      );
      return metadata;
    } catch (e) {
      console.error("Failed to generate metadata for product:", e);
    }
  }

  const { metadata } = await getResolvedSeoAndSchema(
    "static",
    "products",
    PRODUCTS_HUB_FALLBACK,
    ["products", "products-hub"]
  );
  return metadata;
}

export default async function Products({ searchParams }: ProductsPageProps) {
  const { product: productSlug } = (await searchParams) || {};

  let prods: Product[] = [];
  let cats: Category[] = [];

  try {
    const [pList, cList] = await Promise.all([
      api.getProducts().catch(() => []),
      api.getCategories().catch(() => []),
    ]);
    prods = pList;
    cats = cList;
  } catch (err) {
    console.error("Failed to fetch products on server:", err);
  }

  const visibleCats = cats.filter((c) => c.isVisible !== false && !c.hideInMenu);
  const visibleCatIds = new Set(visibleCats.map((c) => c.id));
  const visibleProds = prods.filter(
    (p) => p.isVisible !== false && visibleCatIds.has(p.category_id)
  );

  let selectedProduct: Product | null = null;
  if (productSlug) {
    selectedProduct =
      visibleProds.find(
        (p) =>
          p.slug === productSlug ||
          p.name.toLowerCase().replace(/\s+/g, "-") === productSlug
      ) || null;
  }

  let selectedCategory: Category | null = null;
  if (selectedProduct) {
    selectedCategory =
      visibleCats.find((c) => c.id === selectedProduct?.category_id) || null;
  }

  let schemaConfig;

  if (selectedProduct) {
    const canonical = `https://jivanjor.com/products?product=${selectedProduct.slug}`;
    const productImageUrl = selectedProduct.image
      ? selectedProduct.image.startsWith("http")
        ? selectedProduct.image
        : `https://jivanjor.com${selectedProduct.image.startsWith("/") ? "" : "/"}${selectedProduct.image}`
      : undefined;

    const fallback: FallbackSeoData = {
      pageSchemaType: "WebPage",
      canonical,
      title: `${selectedProduct.name} | Jivanjor`,
      description:
        selectedProduct.description ||
        `Explore ${selectedProduct.name} premium wood adhesive by Jivanjor.`,
      breadcrumbs: [
        { name: "Home", url: "https://jivanjor.com/" },
        { name: "Products", url: "https://jivanjor.com/products" },
        { name: selectedProduct.name, url: canonical },
      ],
      product: {
        name: selectedProduct.name,
        description: selectedProduct.description || undefined,
        imageUrl: productImageUrl,
        url: canonical,
        category: selectedCategory?.name || "Woodworking Adhesive",
      },
    };

    const res = await getResolvedSeoAndSchema(
      "product",
      selectedProduct.id,
      fallback,
      [selectedProduct.id, selectedProduct.slug, selectedProduct.name, productSlug]
    );
    schemaConfig = res.schemaConfig;
  } else {
    const dynamicItemList =
      visibleProds.length > 0
        ? visibleProds.map((p) => ({
            name: p.name,
            url: `https://jivanjor.com/products?product=${p.slug}`,
          }))
        : PRODUCTS_HUB_FALLBACK.itemList;

    const fallback: FallbackSeoData = {
      ...PRODUCTS_HUB_FALLBACK,
      itemList: dynamicItemList,
    };

    const res = await getResolvedSeoAndSchema(
      "static",
      "products",
      fallback,
      ["products", "products-hub"]
    );
    schemaConfig = res.schemaConfig;
  }

  return (
    <>
      <JsonLdScript config={schemaConfig} />
      <Suspense fallback={<ProductSkeleton />}>
        <ProductClientView
          initialProduct={selectedProduct}
          initialCategory={selectedCategory}
          initialAllProducts={visibleProds}
        />
      </Suspense>
    </>
  );
}
