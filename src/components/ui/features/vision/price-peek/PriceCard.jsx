"use client";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign } from "lucide-react";

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
			<DollarSign className="w-4 h-4" />
			<CardTitle className="text-base text-foreground">{field.name}</CardTitle>
		  </div>
		  <Badge variant="success">{field.expensiveLevel}</Badge>
		</CardHeader>
		<CardContent className="text-sm text-muted-foreground">
		  <p>
			<span className="font-semibold text-foreground">Valor:</span>{" "}
			{field.price}
		  </p>
		</CardContent>
	  </Card>
	</motion.div>
  );
}
