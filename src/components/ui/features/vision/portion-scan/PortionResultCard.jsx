"use client";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Utensils, Hash, Weight, Flame } from "lucide-react";
import { MotionCard } from "@/components/ui/features/common/MotionCard";

/**
 * Capitalizes the first letter of each word in a given string.
 *
 * @param {string} str — The input string to be formatted (required).
 * @returns {string} The formatted string with each word capitalized.
 *
 * @example
 * const name = formatName("john doe");
 * console.log(name); // "John Doe"
 */
const formatName = (str) => str.replace(/\b\w/g, (char) => char.toUpperCase());

/**
 * Renders a visual card displaying portion details such as count, estimated weight, and calories.
 *
 * @component
 *
 * @param {Object} props - Component props.
 * @param {Object} props.item - The portion item data to display. Required.
 * @param {string} props.item.name - Name of the food item. Required.
 * @param {number} props.item.count - Quantity of the item. Required.
 * @param {number} [props.item.estimatedWeightKg] - Estimated weight in kilograms. Optional.
 * @param {number} [props.item.estimatedCalories] - Estimated calories in kcal. Optional.
 *
 * @remarks
 * - Uses Framer Motion for entry and hover animations.
 * - Displays visual icons with data, styled using Lucide icons.
 * - Format function capitalizes the item name for better readability.
 *
 * @returns {JSX.Element} A motion-wrapped card displaying formatted portion information.
 *
 * @example
 * <PortionResultCard
 *   item={{
 *     name: "manzana",
 *     count: 2,
 *     estimatedWeightKg: 0.3,
 *     estimatedCalories: 150
 *   }}
 * />
 */

export function PortionResultCard({ item }) {
  return (
    <MotionCard className="h-full shadow-sm border border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-3">
          <Utensils className="w-5 h-5 text-orange-600" />
          <CardTitle>{formatName(item.name)}</CardTitle>
        </div>
        <span className="text-lg font-bold text-orange-700">
          × {item.count}
        </span>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground space-y-2">
        <p className="flex items-center gap-2">
          <Hash className="w-4 h-4 text-muted-foreground" />
          <span>
            <strong>Cantidad:</strong> {item.count}
          </span>
        </p>
        {item.estimatedWeightKg && (
          <p className="flex items-center gap-2">
            <Weight className="w-4 h-4 text-muted-foreground" />
            <span>
              <strong>Peso estimado:</strong>{" "}
              {item.estimatedWeightKg.toFixed(2)} kg
            </span>
          </p>
        )}
        {item.estimatedCalories && (
          <p className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-muted-foreground" />
            <span>
              <strong>Calorías estimadas:</strong> {item.estimatedCalories} kcal
            </span>
          </p>
        )}
      </CardContent>
    </MotionCard>
  );
}
