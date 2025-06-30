// features/vision/size-sage/SizeSageMessageCard.jsx
import React from "react";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MotionCard } from "@/components/ui/features/common/MotionCard";

/**
 * Displays a message indicating that a size estimation is not available.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.message - Message to display inside the card. Required.
 *
 * @remarks
 * Utilizes React and custom UI components such as MotionCard, CardHeader, CardTitle, and CardContent.
 *
 * @returns {JSX.Element} A card element with a title and a descriptive message.
 *
 * @example
 * <SizeSageMessageCard message="Unable to determine size from the provided image." />
 */
export function SizeSageMessageCard({ message }) {
  return (
    <MotionCard className="border-gray-300">
      <CardHeader>
        <CardTitle>Estimación no disponible</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700">{message}</p>
      </CardContent>
    </MotionCard>
  );
}
