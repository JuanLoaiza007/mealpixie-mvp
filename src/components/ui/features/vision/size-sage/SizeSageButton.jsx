// components/ui/features/vision/fresh-sense/SizeSageButton.jsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

/**
 * Renders a button that initiates image analysis and displays loading states.
 *
 * @component
 *
 * @param {Function} onClick - Callback function invoked when the button is clicked. (required)
 * @param {{ vision: boolean, text: boolean }} loading - Object representing loading states: `vision` for vision analysis and `text` for final response generation. (required)
 * @param {number} phase - Current analysis phase index, used to display progress. (required)
 * @param {number} total - Total number of analysis phases. (required)
 *
 * @remarks
 * - Conditionally renders a spinner (Loader2) when either `loading.vision` or `loading.text` is true.
 * - Disables the button during any loading phase.
 *
 * @returns {JSX.Element} A styled button that shows a loader and appropriate label text based on loading state.
 *
 * @example
 * ```jsx
 * import React, { useState } from "react";
 * import { SizeSageButton } from "@/components/ui/features/vision/size-sage/SizeSageButton";
 *
 * function ExampleUsage() {
 *   const [loading, setLoading] = useState({ vision: false, text: false });
 *   const [phase, setPhase] = useState(1);
 *   const totalPhases = 5;
 *
 *   const handleAnalyze = () => {
 *     setLoading({ vision: true, text: false });
 *     // Simulate analysis steps...
 *     setTimeout(() => {
 *       setLoading({ vision: false, text: true });
 *       setTimeout(() => {
 *         setLoading({ vision: false, text: false });
 *         setPhase((prev) => prev + 1);
 *       }, 1000);
 *     }, 2000);
 *   };
 *
 *   return (
 *     <SizeSageButton
 *       onClick={handleAnalyze}
 *       loading={loading}
 *       phase={phase}
 *       total={totalPhases}
 *     />
 *   );
 * }
 * ```
 */
export function SizeSageButton({ onClick, loading, phase, total }) {
  return (
    <Button
      className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded"
      disabled={loading.vision || loading.text}
      onClick={onClick}
    >
      {(loading.vision || loading.text) && (
        <Loader2 className="animate-spin mr-2" />
      )}
      {loading.vision
        ? `Analizando con modelo de visión ${phase}/${total}`
        : loading.text
        ? "Generando respuesta final"
        : "Analizar imagen"}
    </Button>
  );
}
