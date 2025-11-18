"use client";

import React, { useEffect, useState } from "react";
import { useCart } from "@/components/Ecommerce/context/cartContext";

export const QuantityControl = ({ id }: { id: string }) => {
  const { items, updateQuantity, addItem } = useCart();

  // avoid SSR hydration mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const item = items.find((i) => i.id === id);
  const current = item?.quantity ?? 1;

  const [quantity, setQuantity] = useState<number>(current);

  // sync AFTER mount
  useEffect(() => {
    if (mounted) {
      setQuantity(current);
    }
  }, [current, mounted]);

  const decrease = () => {
    const next = Math.max(1, quantity - 1);
    setQuantity(next);
    if (!item) addItem({ id, quantity: next });
    else updateQuantity(id, next);
  };

  const increase = () => {
    const next = quantity + 1;
    setQuantity(next);
    if (!item) addItem({ id, quantity: next });
    else updateQuantity(id, next);
  };

  // ❗ IMPORTANT: don't render quantity until mounted
  if (!mounted) {
    return (
      <div className="flex items-center rounded-md border border-gray-300 opacity-0">
        <button type="button" className="p-2">
          -
        </button>
        <span className="px-4">0</span>
        <button type="button" className="p-2">
          +
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center rounded-md border border-gray-300">
      <button type="button" onClick={decrease} className="p-2">
        -
      </button>
      <span className="px-4 text-base font-medium">{quantity}</span>
      <button type="button" onClick={increase} className="p-2">
        +
      </button>
    </div>
  );
};
