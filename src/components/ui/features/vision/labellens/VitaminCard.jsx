"use client";
import { motion } from "framer-motion";
import { HeartPulse } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

/**
 * Displays a vitamin or micronutrient card showing its name, daily value percentage, and associated health benefit.
 *
 * @component
 * @param {Object} props - The props object.
 * @param {Object} props.item - Vitamin or micronutrient data. Required.
 * @param {string} props.item.name - Name of the vitamin or nutrient. Required.
 * @param {number|string} props.item.percentage - Daily value percentage provided by the portion. Required.
 * @param {string} [props.item.benefit] - Description of the health benefit associated with the nutrient. Optional.
 * @remarks
 * Utilizes Framer Motion for entrance and interaction animations. Styled with a heart icon to suggest health benefits and visual emphasis on percentage.
 * @returns {JSX.Element} A card component highlighting the presence and benefits of a specific vitamin or micronutrient.
 * @example
 * <VitaminCard 
 *   item={{
 *     name: "Vitamina C",
 *     percentage: 35,
 *     benefit: "Contribuye al funcionamiento normal del sistema inmunológico."
 *   }} 
 * />
 */
export function VitaminCard({ item }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03, boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <Card className="flex flex-col h-full shadow-md border border-border bg-background transition-colors">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center gap-2">
            <HeartPulse className="w-5 h-5 text-green-600" />
            <CardTitle className="text-base text-foreground">{item.name}</CardTitle>
          </div>
          <span className="text-xs font-medium text-foreground bg-muted rounded px-2 py-0.5">
            {item.percentage}%
          </span>
        </CardHeader>

        <CardContent className="text-sm text-muted-foreground">
          <p>{item.benefit || <span className="italic text-muted">Sin beneficio especificado</span>}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
