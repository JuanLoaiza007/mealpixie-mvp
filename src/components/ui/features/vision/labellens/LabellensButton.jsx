"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2, ScanLine } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Renders an animated button for initiating label scanning and displaying OCR or analysis status.
 *
 * @component
 * @param {Object} props - The props object.
 * @param {Function} props.onClick - Callback function triggered on button click. Required.
 * @param {Object} props.loading - Loading state flags. Required.
 * @param {boolean} props.loading.vision - Indicates if OCR extraction is in progress. Required.
 * @param {boolean} props.loading.text - Indicates if nutritional analysis is in progress. Required.
 * @param {number} props.phase - Current OCR phase or step number. Required.
 * @param {number} props.total - Total number of OCR steps. Required.
 * @remarks
 * Combines Framer Motion for entrance and state transitions, and AnimatePresence for smooth content changes. Button is styled and disabled during loading phases.
 * @returns {JSX.Element} An animated scanning button with status-dependent icons and text.
 * @example
 * <LabelLensButton 
 *   onClick={handleScan}
 *   loading={{ vision: true, text: false }}
 *   phase={1}
 *   total={3}
 * />
 */
export function LabelLensButton({ onClick, loading, phase, total }) {
  const isLoading = loading.vision || loading.text;

  const getText = () => {
    if (loading.vision) return `Extrayendo texto OCR ${phase}/${total}`;
    if (loading.text) return "Analizando contenido nutricional";
    return "Escanear etiqueta";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, boxShadow: "0 8px 24px rgba(0,0,0,0.05)" }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20"
    >
      <Button
        onClick={onClick}
        disabled={isLoading}
        className="bg-orange-600 hover:bg-orange-700 text-white font-medium px-6 py-2 rounded-md text-sm flex items-center gap-2 min-w-[260px] justify-center shadow-md"
      >
        <AnimatePresence mode="wait" initial={false}>
          {isLoading ? (
            <motion.span
              key="loading"
              className="flex items-center"
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 5 }}
              transition={{ duration: 0.2 }}
            >
              <Loader2 className="animate-spin mr-2 w-4 h-4" />
              {getText()}
            </motion.span>
          ) : (
            <motion.span
              key="default"
              className="flex items-center"
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 5 }}
              transition={{ duration: 0.2 }}
            >
              <ScanLine className="mr-2 w-4 h-4" />
              {getText()}
            </motion.span>
          )}
        </AnimatePresence>
      </Button>
    </motion.div>
  );
}
