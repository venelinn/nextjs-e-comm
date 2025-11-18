"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/Button";
import { useCart } from "@/components/Ecommerce/context/cartContext";
import { QuantityControl } from "@/components/Ecommerce/QuantityControl";
import { fetchCartItemsServer } from "./cart-actions";

export default function CartClient({ lang }: { lang: string }) {
  const { items, cartCount, removeItem } = useCart();
  // items = [{ id, quantity }]

  const [productData, setProductData] = useState<any[]>([]);

  // 🔥 Fetch product info based only on IDs
  useEffect(() => {
    if (items.length === 0) {
      setProductData([]);
      return;
    }

    const ids = items.map((i) => i.id);

    fetchCartItemsServer(ids, lang).then((res) => {
      setProductData(res); // res = array of product objects
    });
  }, [items, lang]);

  // 🔗 Merge quantity into product data
  const enrichedItems = useMemo(() => {
    return productData.map((p) => {
      const cartItem = items.find((i) => i.id === p.id);
      return {
        ...p,
        quantity: cartItem?.quantity || 1,
      };
    });
  }, [productData, items]);

  // 💰 Calculate total price
  const totalPrice = useMemo(() => {
    return enrichedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [enrichedItems]);

  // Empty cart UI
  if (cartCount === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-semibold">Your cart is empty</h2>
        <Link
          href="/products"
          className="mt-4 inline-block rounded-md bg-indigo-600 px-5 py-3 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
      <div className="lg:col-span-2">
        <h1>Shopping Cart</h1>

        <ul className="divide-y divide-gray-200 border-t border-b border-gray-200">
          {enrichedItems.map((item) => (
            <li key={item.id} className="flex py-6">
              <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover object-center" />
              </div>

              <div className="ml-4 flex flex-1 flex-col">
                <div className="flex justify-between text-base font-medium text-gray-900">
                  <h3>
                    <Link href={`/products/${item.id}`}>{item.title}</Link>
                  </h3>
                  <p className="ml-4">${(item.price * item.quantity).toFixed(2)}</p>
                </div>

                <div className="flex flex-1 items-end justify-between text-sm">
                  <QuantityControl id={item.id} />
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="font-medium text-indigo-600 hover:text-indigo-500 flex items-center"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="lg:col-span-1">
        <div className="sticky top-24 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-medium text-gray-900">Order summary</h2>

          <dl className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <dt className="text-sm text-gray-600">Subtotal</dt>
              <dd className="text-sm font-medium text-gray-900">${totalPrice.toFixed(2)}</dd>
            </div>

            <div className="flex items-center justify-between border-t border-gray-200 pt-4">
              <dt className="text-base font-medium text-gray-900">Order total</dt>
              <dd className="text-base font-medium text-gray-900">${totalPrice.toFixed(2)}</dd>
            </div>
          </dl>

          <div className="mt-6">
            <Button href="/checkout" variant="primary" label="Proceed to Checkout" />
          </div>
        </div>
      </div>
    </div>
  );
}
