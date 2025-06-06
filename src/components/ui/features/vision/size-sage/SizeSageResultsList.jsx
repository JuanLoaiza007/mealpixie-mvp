// components/ui/features/vision/size-sage/SizeSageResultsList.jsx
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { SizeSageResultItem } from "@/components/ui/features/vision/size-sage/SizeSageResultItem";

/**
 * Displays a list of estimated volume results in a card with a total volume summary.
 *
 * @component
 *
 * @param {Object[]} props.results - An array of result objects representing individual item dimensions and volume.
 * @param {string} props.results[].object - The name or identifier of the object.
 * @param {string} props.results[].item - The item description or label.
 * @param {number} props.results[].largo_cm - The length of the item in centimeters.
 * @param {number} props.results[].ancho_cm - The width of the item in centimeters.
 * @param {number} props.results[].alto_cm - The height of the item in centimeters.
 * @param {number} props.results[].volumen_cm3 - The calculated volume of the item in cubic centimeters.
 * @param {boolean} [props.results.required=true] - Indicates that the `results` prop is required to render the component.
 *
 * @remarks
 * - Returns `null` if the `results` array is empty or undefined.
 * - Calculates the total volume using `Array.prototype.reduce` to sum up all `volumen_cm3` values.
 *
 * @returns {JSX.Element|null} A `<Card>` containing a grid of `<SizeSageResultItem>` components and a summary of the total volume, or `null` if no results are provided.
 *
 * @example
 * ```jsx
 * const sampleResults = [
 *   {
 *     object: "Box",
 *     item: "Electronics",
 *     largo_cm: 30,
 *     ancho_cm: 20,
 *     alto_cm: 15,
 *     volumen_cm3: 9000,
 *   },
 *   {
 *     object: "Container",
 *     item: "Books",
 *     largo_cm: 25,
 *     ancho_cm: 20,
 *     alto_cm: 30,
 *     volumen_cm3: 15000,
 *   },
 * ];
 *
 * <SizeSageResultsList results={sampleResults} />
 * ```
 */
export function SizeSageResultsList({ results }) {
  if (!results || results.length === 0) return null;

  // Calcular la suma total de todos los volumenes_cm3
  const totalVolume = results.reduce(
    (sum, r) => sum + (r.volumen_cm3 || 0),
    0
  );

  return (
    <Card className="border-gray-300">
      <CardHeader>
        <CardTitle>Volumen estimado</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Grid de resultados individuales */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {results.map((r, idx) => (
            <SizeSageResultItem
              key={idx}
              object={r.object}
              item={r.item}
              largo_cm={r.largo_cm}
              ancho_cm={r.ancho_cm}
              alto_cm={r.alto_cm}
              volumen_cm3={r.volumen_cm3}
            />
          ))}
        </div>

        {/* Total de volumenes */}
        <div className="bg-gray-100 rounded-lg p-4">
          <h4 className="text-base font-semibold text-orange-500 mb-2">
            Volumen total
          </h4>
          <p className="text-xl font-bold text-gray-900">
            {totalVolume.toFixed(2)} cm³
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
