// app/[lang]/(ecommerce)/product/[id]/page.tsx

import { ProductCard, type ProductCardProps } from "@/components/Ecommerce/Cards";
import { getContentItem } from "@/utils/content";
import { getContentfulLocale } from "@/utils/localization";

export default async function ProductDetailPage({ params }: { params: Promise<{ lang: string; id: string }> }) {
  // FIX: Destructure safely inside the function body to satisfy Next.js runtime checks.
  const { lang, id } = await params;
  const contentfulLocale = getContentfulLocale(lang);

  // Use the full contentfulLocale for fetching data
  const rawProduct = await getContentItem("product", id, contentfulLocale);

  if (!rawProduct) return <div>Product not found</div>;

  const product: ProductCardProps = {
    id: String(rawProduct.id),
    content: rawProduct.description || rawProduct.content, // Fallback handling
    price: String(rawProduct.price),
    image: rawProduct.media?.[0],
    control: true,

    // ProductCard requires 'heading', so we map 'title' to 'heading' on the card props:
    heading: Object(rawProduct.heading),
  };

  return <ProductCard {...product} />;
}
