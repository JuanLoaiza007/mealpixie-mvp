"use client";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign } from "lucide-react";
import { MotionCard } from "@/components/ui/features/common/MotionCard";

/**
 * Displays a styled card with price information and affordability level for a given item.
 *
 * @component
 * @param {Object} props - The props for the PriceCard component.
 * @param {{ name: string, price: string | number, expensiveLevel: string }} props.field - The data object representing the item's name, price, and price category. Required.
 *
 * @remarks
 * - Uses Framer Motion for enter, hover, and tap animations.
 * - Renders UI components from a design system including Card, Badge, and Lucide icons.
 *
 * @returns {JSX.Element} A card element containing item name, price, and affordability badge with animations.
 *
 * @example
 * <PriceCard
 *   field={{
 *     name: "Almond Milk",
 *     price: "$3.49",
 *     expensiveLevel: "Moderate"
 *   }}
 * />
 */
export function PriceCard({ field }) {
  return (
    <MotionCard className="flex flex-col h-full shadow-md border border-border">
      <CardHeader className="flex flex-row items-center justify-between gap-3 pb-2">
        <div className="flex items-center gap-3">
          <DollarSign className="w-4 h-4 text-orange-600" />
          <CardTitle className="text-base text-foreground">
            {field.name.charAt(0).toUpperCase() + field.name.slice(1)}
          </CardTitle>
        </div>
        <Badge variant="success">{field.expensiveLevel}</Badge>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        <p>
          <span className="font-semibold text-foreground">Valor:</span>{" "}
          {field.price}
        </p>
      </CardContent>
    </MotionCard>
  );
}
