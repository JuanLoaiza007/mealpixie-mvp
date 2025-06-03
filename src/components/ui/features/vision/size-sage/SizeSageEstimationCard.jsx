// components/ui/features/vision/size-sage/SizeSageEstimationCard.jsx
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

/**
 * Displays the estimated dimensions and volume of an object, including an optional explanation message.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.referenceObject - The name of the reference object (e.g., "coin"). Required.
 * @param {{ length_cm: number, width_cm: number, height_cm: number }} props.dimensions - Object containing length, width, and height in centimeters. Required.
 * @param {number} props.estimatedVolume_cm3 - Estimated volume in cubic centimeters. Required.
 * @param {string} [props.message] - Optional message providing additional context or explanation. Optional.
 *
 * @remarks
 * The component uses optional chaining and nullish coalescing to safely access `dimensions` and `estimatedVolume_cm3`.
 * It uses the `Card`, `CardHeader`, `CardTitle`, and `CardContent` components from the UI library for layout and styling.
 *
 * @returns {JSX.Element} A styled card displaying the reference object, dimensions, and estimated volume.
 *
 * @example
 * <SizeSageEstimationCard
 *   referenceObject="credit card"
 *   dimensions={{ length_cm: 8.5, width_cm: 5.5, height_cm: 0.1 }}
 *   estimatedVolume_cm3={0.47}
 *   message="Approximation based on visual estimation."
 * />
 */
export function SizeSageEstimationCard({
  referenceObject,
  dimensions,
  estimatedVolume_cm3,
  message,
}) {
  // Protegemos el acceso a las propiedades para no fallar si dimensions es undefined.
  const length = dimensions?.length_cm ?? 0;
  const width = dimensions?.width_cm ?? 0;
  const height = dimensions?.height_cm ?? 0;
  const volume = estimatedVolume_cm3 ?? 0;

  return (
    <Card className="border-gray-300">
      <CardHeader>
        <CardTitle>Estimación de Tamaño y Volumen</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {message && (
          <p className="text-gray-700">
            {message}
          </p>
        )}

        <div className="bg-gray-100 rounded-lg p-4">
          <h4 className="text-base font-semibold text-orange-500 mb-2">
            Objeto de Referencia
          </h4>
          <p className="text-gray-800">{referenceObject || "N/A"}</p>
        </div>

        <div className="bg-gray-100 rounded-lg p-4">
          <h4 className="text-base font-semibold text-orange-500 mb-2">
            Dimensiones (cm)
          </h4>
          <ul className="list-disc list-inside text-gray-800">
            <li>Largo: {length.toFixed(2)} cm</li>
            <li>Ancho: {width.toFixed(2)} cm</li>
            <li>Alto: {height.toFixed(2)} cm</li>
          </ul>
        </div>

        <div className="bg-gray-100 rounded-lg p-4">
          <h4 className="text-base font-semibold text-orange-500 mb-2">
            Volumen Estimado
          </h4>
          <p className="text-2xl font-bold text-gray-900">
            {volume.toFixed(2)} cm³
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
