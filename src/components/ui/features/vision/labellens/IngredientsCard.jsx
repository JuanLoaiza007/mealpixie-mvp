"use client";
import { motion } from "framer-motion";
import { ListOrdered, FlaskConical } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

/**
 * Renders a card displaying a list of ingredients and their analysis, with icons and animations.
 *
 * @component
 * @param {Object} props - The props object.
 * @param {Object} props.ingredients - Ingredients data object. Required.
 * @param {string} [props.ingredients.list] - A textual list of ingredients. Optional.
 * @param {string} [props.ingredients.analysis] - Analytical description or composition of the ingredients. Optional.
 * @remarks
 * Uses Framer Motion for entry and interaction animations (hover and tap). Relies on a custom UI card system and Lucide icons for visual cues.
 * @returns {JSX.Element} A card component with ingredient list and analysis sections.
 * @example
 * <IngredientsCard 
 *   ingredients={{ 
 *     list: "Harina, Agua, Sal", 
 *     analysis: "Alta en carbohidratos, bajo contenido graso" 
 *   }} 
 * />
 */
export function IngredientsCard({ ingredients }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, boxShadow: "0 8px 24px rgba(0,0,0,0.05)" }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <Card className="shadow-md border border-border bg-background transition-colors mt-3">
        <CardHeader className="flex items-center gap-2">
          <ListOrdered className="w-5 h-5 text-lime-600" />
          <CardTitle className="text-base text-foreground">Ingredientes</CardTitle>
        </CardHeader>

        <CardContent className="text-sm text-muted-foreground space-y-3">
          <div className="flex items-start gap-2">
            <ListOrdered className="w-4 h-4 mt-1 text-muted" />
            <p>
              <span className="font-semibold text-foreground">Lista:</span>{" "}
              {ingredients?.list || <em className="text-muted">No disponible</em>}
            </p>
          </div>

          <div className="flex items-start gap-2">
            <FlaskConical className="w-4 h-4 mt-1 text-muted" />
            <p>
              <span className="font-semibold text-foreground">Análisis:</span>{" "}
              {ingredients?.analysis || <em className="text-muted">No disponible</em>}
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
