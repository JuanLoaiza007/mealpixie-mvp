// components/ui/features/vision/size-sage/SizeSageResultItem.jsx
import React from "react";
import { MotionCard } from "@/components/ui/features/common/MotionCard";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
    <MotionCard className="flex flex-col p-4 space-y-2 gap-0">
      <CardHeader className={"gap-0"}>
        <CardTitle>⭐ {item}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription
          className={`flex flex-col text-sm text-gray-900 gap-2`}
        >
          <p className="text-md font-semibold">
            <span>Referencia:</span> {object}
          </p>
          <div className="flex flex-col gap-2 text-sm">
            <span>Largo:{largo_cm.toFixed(2)} cm </span>
            <span>Ancho:{ancho_cm.toFixed(2)} cm </span>
            <span>Alto: {alto_cm.toFixed(2)} cm </span>
          </div>
          <p className="text-md font-bold ">
            Volumen: {volumen_cm3.toFixed(2)} cm³
          </p>
        </CardDescription>
      </CardContent>
    </MotionCard>
  );
}
