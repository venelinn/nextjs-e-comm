"use client";

import Link from "next/link";
import { Button } from "@/components/Button";
import { useCart } from "@/components/Ecommerce/context/cartContext";
import { useEnrichedCart } from "@/components/Ecommerce/hooks/useEnrichedCart";
import { QuantityControl } from "@/components/Ecommerce/QuantityControl";

export default function CartClient({ lang }: { lang: string }) {
  const { cartCount, removeItem } = useCart();

  const { enrichedItems, totalPrice, isEmpty } = useEnrichedCart(lang);

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
        <h1 className="text-3xl font-bold tracking-tight mb-6">Shopping Cart</h1>

        <ul className="divide-y divide-gray-200 border-t border-b border-gray-200">
          {enrichedItems.map((item) => (
            <li key={item.id} className="flex py-6">
              <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                {/* <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover object-center" /> */}
              </div>

              <div className="ml-4 flex flex-1 flex-col">
                <div className="flex justify-between font-medium">
                  <h3>
                    <Link href={`/products/${item.id}`}>{item.title}</Link>
                  </h3>
                  <p className="ml-4">${(item.price * item.quantity).toFixed(2)}</p>
                </div>

                <div className="flex flex-1 items-end justify-between text-sm">
                  <QuantityControl id={item.id} />

                  <button type="button" onClick={() => removeItem(item.id)}>
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="lg:col-span-1">
        <div className="sticky top-24 rounded-lg border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-medium">Order summary</h2>

          <dl className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <dt className="text-sm">Subtotal</dt>
              <dd className="text-sm font-medium">${totalPrice.toFixed(2)}</dd>
            </div>

            <div className="flex items-center justify-between border-t border-gray-200 pt-4">
              <dt className="text-base font-medium">Order total</dt>
              <dd className="text-base font-medium">${totalPrice.toFixed(2)}</dd>
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
