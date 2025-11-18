"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/Button";
import { useCart } from "@/components/Ecommerce/context/cartContext";
import { Heading, type HeadingProps } from "@/components/Headings";
import { getOptimizedImage } from "@/utils/common";
import { renderRichTextContent } from "@/utils/RichText";
import { QuantityControl } from "../QuantityControl/QuantityControl";
import styles from "./ProductCard.module.scss";

export type ProductCardImage = {
  src?: string;
  width?: number;
  height?: number;
  alt?: string;
};

export type ProductCardProps = {
  id: string;
  heading: HeadingProps;
  content?: any;
  image?: ProductCardImage | null;
  price?: string;
  url?: string;
  control?: boolean;
};

export const ProductCard = ({ id, heading, control, content, image, price, url = "/products" }: ProductCardProps) => {
  const optimized = image ? getOptimizedImage(image, 800, "100") : null;
  const imageUrl = optimized?.url ?? image?.src ?? "";
  const width = optimized?.width ?? undefined;
  const height = optimized?.height ?? undefined;

  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    if (!id) return;
    const numericPrice = parseFloat(price || "0") || 0;

    // Optional safety check:
    if (numericPrice === 0 && price !== "0") {
      console.warn(`Invalid or zero price passed to cart for ID ${id}. Received: ${price}`);
      // Return or use a default error price if desired
    }

    // 3. Call addItem with the correct numericPrice
    addItem({ id, quantity: 1 });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className={styles.card}>
      {image && (
        <Link href={`${url}/${id}`} passHref>
          <Image src={imageUrl} alt={image?.alt ?? ""} width={width} height={height} />
        </Link>
      )}
      <div className={styles.card__content}>
        <Link href={`${url}/${id}`} passHref>
          <Heading as={heading?.as} size={heading?.size} className={styles.module__heading}>
            {heading?.heading}
          </Heading>
        </Link>

        {content && renderRichTextContent(content)}
        {control && <QuantityControl id={id} />}
        {price && (
          <div className={styles.card__actions}>
            <p className="text-sm text-gray-500 flex-grow">{price}</p>
            <Button
              variant="primary"
              size="sm"
              onClick={handleAdd}
              disabled={added}
              label={added ? "Added ✓" : "Add"}
            />
          </div>
        )}
      </div>
    </div>
  );
};
