// components/ui/features/vision/size-sage/SizeSageResultItem.jsx
import React from "react";

/**
 * Displays measurement results for a detected item with a reference object.
 *
 * @component
 *
 * @param {string} object - The reference object used for scale comparison (e.g., "Coin", "Hand", "Plate"). Required.
 * @param {string} item - The name of the detected food item (e.g., "Chicken", "Apple"). Required.
 * @param {number} largo_cm - The length of the item in centimeters. Required.
 * @param {number} ancho_cm - The width of the item in centimeters. Required.
 * @param {number} alto_cm - The height of the item in centimeters. Required.
 * @param {number} volumen_cm3 - The calculated volume of the item in cubic centimeters. Required.
 *
 * @remarks
 * This is a stateless functional component and does not cause any side effects. It uses React hooks implicitly through JSX rendering.
 *
 * @returns {JSX.Element} A styled container displaying the item's name, reference object, dimensions (length, width, height), and volume in cubic centimeters.
 *
 * @example
 * ```jsx
 * <SizeSageResultItem
 *   object="Plate"
 *   item="Apple"
 *   largo_cm={8.50}
 *   ancho_cm={8.50}
 *   alto_cm={7.00}
 *   volumen_cm3={500.75}
 * />
 * ```
 */
export function SizeSageResultItem({
  object,
  item,
  largo_cm = 0,
  ancho_cm = 0,
  alto_cm = 0,
  volumen_cm3 = 0,
}) {
  return (
    <div className="flex flex-col justify-center items-start bg-gray-100 rounded-lg p-4 space-y-2">
      <h4 className="text-base font-semibold text-orange-500">
        {item}
      </h4>
      <p className="text-sm text-gray-700">
        <span className="font-medium">Referencia:</span> {object}
      </p>
      <div className="text-gray-800">
        <p>
          <span className="font-medium">Largo:</span> {largo_cm.toFixed(2)} cm
        </p>
        <p>
          <span className="font-medium">Ancho:</span> {ancho_cm.toFixed(2)} cm
        </p>
        <p>
          <span className="font-medium">Alto:</span> {alto_cm.toFixed(2)} cm
        </p>
      </div>
      <p className="text-lg font-bold text-gray-900">
        Volumen: {volumen_cm3.toFixed(2)} cm³
      </p>
    </div>
  );
}
