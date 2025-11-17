"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/Button";
import { useCart } from "@/context/cartContext";
import { getOptimizedImage } from "../../utils/common";
import { renderRichTextContent } from "../../utils/RichText";
import { Heading } from "../Headings";
import styles from "./PrimaryCard.module.scss";

export type PrimaryCardImage = {
  src?: string;
  width?: number;
  height?: number;
  alt?: string;
};

export type PrimaryCardProps = {
  id: string;
  heading: { heading: string; as?: any; size?: any };
  content?: any;
  image?: PrimaryCardImage | null;
  price?: string;
};

export const PrimaryCard = ({ id, heading, content, image, price }: PrimaryCardProps) => {
  const optimized = image ? getOptimizedImage(image, 800, "100") : null;
  const url = optimized?.url ?? image?.src ?? "";
  const width = optimized?.width ?? undefined;
  const height = optimized?.height ?? undefined;

  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    if (!id) return;
    addItem({ id, quantity: 1 });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className={styles.card}>
      {image && <Image src={url} alt={image?.alt ?? ""} width={width} height={height} />}
      <div className={styles.card__content}>
        {price ? (
          <Link href={`/products/${id}`} passHref>
            <Heading as={heading?.as} size={heading?.size} className={styles.module__heading}>
              {heading?.heading}
            </Heading>
          </Link>
        ) : (
          <Heading as={heading?.as} size={heading?.size} className={styles.module__heading}>
            {heading?.heading}
          </Heading>
        )}
        {content && renderRichTextContent(content)}
        {price && (
          <div className={styles.card__actions}>
            <p className="text-sm text-gray-500 flex-grow">{price}</p>
            <Button outlined size="sm" onClick={handleAdd} disabled={added} label={added ? "Added ✓" : "Add"} />
          </div>
        )}
      </div>
    </div>
  );
};
