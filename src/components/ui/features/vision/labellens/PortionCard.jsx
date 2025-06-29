import { Cookie, HelpCircle } from "lucide-react";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MotionCard } from "@/components/ui/features/common/MotionCard";

/**
 * Displays a card containing the portion size information extracted from a label, or a fallback message if unavailable.
 *
 * @component
 * @param {Object} props - The props object.
 * @param {string} [props.portion] - Text representing the portion size. Optional.
 * @remarks
 * Uses Framer Motion for entrance and content animations. Includes contextual icons for visual feedback based on portion availability.
 * @returns {JSX.Element} A card element displaying portion size or a warning message when not found.
 * @example
 * <PortionCard portion="1 galleta (30g)" />
 *
 * <PortionCard />
 */
export function PortionCard({ portion }) {
  return (
    <MotionCard className="min-h-[60px] w-sm flex flex-col justify-between">
      <CardHeader className="flex flex-row items-center gap-2">
        <Cookie className="w-5 h-5 text-orange-500" />
        <CardTitle>Porción</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        {portion ? (
          <p>{portion}</p>
        ) : (
          <div className="flex items-center gap-2 text-yellow-600">
            <HelpCircle className="w-4 h-4" />
            <span>No se encontró el tamaño de la porción en la etiqueta.</span>
          </div>
        )}
      </CardContent>
    </MotionCard>
  );
}
