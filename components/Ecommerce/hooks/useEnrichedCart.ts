"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchCartItemsServer } from "@/app/[lang]/(ecommerce)/cart/cart-actions";
import { useCart } from "../context/cartContext";
import { mergeCartItems } from "../utils/mergeCartItems";

export function useEnrichedCart(lang: string) {
  const { items } = useCart();

  const [productData, setProductData] = useState<any[]>([]);

  // Fetch product info
  useEffect(() => {
    if (items.length === 0) {
      setProductData([]);
      return;
    }

    const ids = items.map((i) => i.id);

    fetchCartItemsServer(ids, lang).then((res) => {
      setProductData(res);
    });
  }, [items, lang]);

  // Merge cart quantities + product details
  const enrichedItems = useMemo(() => {
    return mergeCartItems(items, productData);
  }, [items, productData]);

  // Total price
  const totalPrice = useMemo(() => {
    return enrichedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [enrichedItems]);

  return {
    enrichedItems,
    totalPrice,
    isEmpty: items.length === 0,
  };
}
