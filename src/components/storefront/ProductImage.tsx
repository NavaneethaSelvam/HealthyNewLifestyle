"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type ProductImageProps = {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
} & (
  | { fill: true; width?: never; height?: never }
  | { fill?: false; width: number; height: number }
);

export function ProductImage({
  src,
  alt,
  className,
  sizes,
  priority,
  ...dimensions
}: ProductImageProps) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (failed) {
    return (
      <div
        className="hnl-product-image-placeholder"
        role="img"
        aria-label={`${alt} image pending`}
      >
        <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
          <path
            d="M8 36c9-1 19-9 24-24 8 15 8 24 1 29-8 5-18 2-25-5Z"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M12 38c7-8 12-14 19-22"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="1.5"
          />
        </svg>
        <span>Image pending</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      className={className}
      sizes={sizes}
      priority={priority}
      onError={() => setFailed(true)}
      {...dimensions}
    />
  );
}
