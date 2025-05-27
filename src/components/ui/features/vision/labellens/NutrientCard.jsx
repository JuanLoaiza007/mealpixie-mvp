"use client";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getIconForField } from "./nutrientIcons";
import { getImpactLevel } from "./impactLevel";

/**
 * Displays a card summarizing nutritional information for a specific nutrient, including its value, explanation, and health impact.
 *
 * @component
 * @param {Object} props - The props object.
 * @param {Object} props.field - Nutrient data object. Required.
 * @param {string} props.field.name - Name of the nutrient. Required.
 * @param {string|number} props.field.value - Measured value of the nutrient. Required.
 * @param {string} props.field.explanation - Brief explanation of the nutrient. Required.
 * @param {string} [props.field.healthImpact] - Description of the nutrient's health impact. Optional.
 * @param {string} [props.field.impactLevel] - Internal impact level used for determining badge color/label. Optional.
 * @remarks
 * Uses Framer Motion for entrance and interaction animations. Dynamically selects an icon and impact badge based on nutrient type and health data.
 * @returns {JSX.Element} A card element with labeled nutrient details and a visual health impact indicator.
 * @example
 * <NutrientCard 
 *   field={{
 *     name: "Sodio",
 *     value: "120mg",
 *     explanation: "El sodio es un mineral esencial para la función muscular y nerviosa.",
 *     healthImpact: "Alto contenido puede elevar la presión arterial.",
 *     impactLevel: "high"
 *   }}
 * />
 */
export function NutrientCard({ field }) {
  const impact = getImpactLevel(field.impactLevel || field.healthImpact);

  return (
    <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ scale: 1.03, boxShadow: "0 8px 24px rgba(0,0,0,0.08)" }}
    whileTap={{ scale: 0.97 }}
    transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <Card className="flex flex-col h-full shadow-md border border-border">
        <CardHeader className="flex flex-row items-center justify-between gap-3 pb-2">
          <div className="flex items-center gap-3">
            {getIconForField(field.name)}
            <CardTitle className="text-base text-foreground">{field.name}</CardTitle>
          </div>
          <Badge variant={impact.color}>{impact.label}</Badge>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <p>
            <span className="font-semibold text-foreground">Valor:</span>{" "}
            {field.value}
          </p>
          <p>
            <span className="font-semibold text-foreground">¿Qué es?</span>{" "}
            {field.explanation}
          </p>
          <p>
            <span className="font-semibold text-foreground">Impacto:</span>{" "}
            {field.healthImpact}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
