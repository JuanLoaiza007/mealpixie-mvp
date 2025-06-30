import { Card } from "@/components/ui/card";
import Image from "next/image";
import React from "react";

const ImagePreviewCard = ({
  imageUrl,
  alt,
  styles,
  children,
  className,
  onClick,
}) => {
  const defaultCardStyles =
    "w-full h-64 md:w-60 md:h-60 lg:w-80 lg:h-80 rounded-md mx-auto overflow-hidden relative flex items-center justify-center border-6 border-slate-200 p-0 select-none";
  const defaultImageStyles = "object-cover w-full h-full";

  const cardClassName = styles?.card
    ? `${defaultCardStyles} ${styles.card} ${className || ""}`
    : `${defaultCardStyles} ${className || ""}`;
  const imageClassName = styles?.image
    ? `${defaultImageStyles} ${styles.image}`
    : defaultImageStyles;

  return (
    <Card className={cardClassName} onClick={onClick}>
      {imageUrl && (
        <Image src={imageUrl} alt={alt} className={imageClassName} fill />
      )}
      {children}
    </Card>
  );
};

export default ImagePreviewCard;
