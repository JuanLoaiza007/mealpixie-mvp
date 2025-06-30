// components/ui/features/vision/fresh-sense/FreshSenseResultsList.jsx
import React from "react";
import { FreshSenseResultItem } from "@/components/ui/features/vision/fresh-sense/FreshSenseResultItem";
import { Utensils } from "lucide-react";
import { MotionCard } from "../../common/MotionCard";
import { CardHeader } from "@/components/ui/card";

/**
 * Renders a list of FreshSenseResultItem components for given vision analysis results.
 *
 * @component
 *
 * @param {Array<{item: string, assessment: string, emoji: string}>} props.results - An array of result objects, each containing the item name, its assessment, and an associated emoji; defaults to an empty array; optional.
 *
 * @remarks
 * This component returns null if the `results` array is empty or undefined.
 *
 * @returns {JSX.Element|null} A container with a header and a grid of FreshSenseResultItem components, or null if no results are provided.
 *
 * @example
 * ```jsx
 * import React from 'react';
 * import { FreshSenseResultsList } from 'components/ui/features/vision/fresh-sense/FreshSenseResultsList';
 *
 * const sampleResults = [
 *   { item: 'Tomato', assessment: 'fresh', emoji: '🍅' },
 *   { item: 'Lettuce', assessment: 'wilted', emoji: '🥬' },
 * ];
 *
 * function App() {
 *   return <FreshSenseResultsList results={sampleResults} />;
 * }
 * ```
 */
export function FreshSenseResultsList({ results }) {
  if (!results || results.length === 0) return null;

  return (
    <>
      <MotionCard>
        <CardHeader>
          <h2 className="text-base text-foreground font-bold flex item-center gap-2">
            <Utensils className="text-orange-600" />
            Ingredientes
          </h2>
        </CardHeader>
      </MotionCard>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {results.map((r, idx) => (
          <FreshSenseResultItem
            key={idx}
            item={r.item}
            assessment={r.assessment}
            icon={r.emoji}
          />
        ))}
      </div>
    </>
  );
}
