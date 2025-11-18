import type { CartItem } from "../context/cartContext";
import type { ProductDetails } from "../types/product";

export function mergeCartItems(cartItems: CartItem[], productDetails: ProductDetails[]) {
  const map = new Map(productDetails.map((p) => [p.id, p]));

  return cartItems.map((cartItem) => {
    const details = map.get(cartItem.id);

    return {
      ...cartItem,
      ...details, // adds title, price, media, etc.
      price: details?.price ?? 0,
    };
  });
}
