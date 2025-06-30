"use client";
import { AlertTriangle } from "lucide-react";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MotionCard } from "@/components/ui/features/common/MotionCard";

/**
 * Displays a stylized error message card with an icon, title, and message.
 *
 * @component
 * @param {Object} props - The props object.
 * @param {string} [props.title="Error"] - Title of the error card. Optional, defaults to "Error".
 * @param {string} [props.message="Ha ocurrido un problema."] - Message content displayed below the title. Optional, defaults to "Ha ocurrido un problema.".
 * @remarks
 * Utilizes Framer Motion for fade-in animation on mount. Integrates UI components from a design system and Lucide icons.
 * @returns {JSX.Element} A card component indicating an error state.
 * @example
 * <ErrorCard
 *   title="Connection Failed"
 *   message="Unable to connect to the server. Please try again later."
 * />
 */
export function ErrorCard({
  title = "Error",
  message = "Ha ocurrido un problema.",
}) {
  return (
    <MotionCard className="border border-destructive bg-red-50 text-destructive shadow-sm">
      <CardHeader className="flex flex-row items-center gap-2">
        <AlertTriangle className="w-5 h-5 text-destructive" />
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-destructive-foreground">
        {message}
      </CardContent>
    </MotionCard>
  );
}
