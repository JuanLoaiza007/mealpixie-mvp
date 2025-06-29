"use client";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollText } from "lucide-react";
import { MotionCard } from "@/components/ui/features/common/MotionCard";

/**
 * Displays the total price inside a styled animated card component.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {string | number} props.total - The total price to display. Required.
 *
 * @remarks
 * - Uses `framer-motion` for animation effects on hover and tap.
 * - Renders a styled card layout with Lucide icon and text content.
 *
 * @returns {JSX.Element} A card element displaying the total price with animation and styling.
 *
 * @example
 * <TotalPriceCard total="$24,000 COP" />
 */
export function TotalPriceCard({ total }) {
  return (
    <MotionCard className="flex flex-col h-full shadow-md border border-border">
      <CardHeader className="flex flex-row items-center justify-between gap-3 pb-2">
        <div className="flex items-center gap-3">
          <ScrollText className="w-4 h-4" />
          <CardTitle className="text-base text-foreground">
            Valor Total
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        <p>{total}</p>
      </CardContent>
    </MotionCard>
  );
}
