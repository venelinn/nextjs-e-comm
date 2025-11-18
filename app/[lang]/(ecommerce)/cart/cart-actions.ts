"use server";
import { getProductItemsByIds } from "@/utils/content";
import { getContentfulLocale } from "@/utils/localization";

/**
 * Server Action to fetch product details for a list of IDs.
 * This is called directly by the Client Component (CartClient).
 */
export async function fetchCartItemsServer(ids: string[], lang: string) {
  if (!ids?.length) return [];

  const contentfulLocale = getContentfulLocale(lang);

  const products = await getProductItemsByIds(ids, contentfulLocale);

  return products.map((p: any) => ({
    id: p.id,
    title: p.heading?.heading,
    price: p.price,
    media: p.media?.[0] ?? null,
  }));
}
