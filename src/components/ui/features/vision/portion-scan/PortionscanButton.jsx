"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2, ScanLine } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Button component for initiating or displaying the progress of a portion scan process.
 *
 * @component
 *
 * @param {Object} props - Component props.
 * @param {function} props.onClick - Callback function triggered on button click. Required.
 * @param {Object} props.loading - Loading state object. Required.
 * @param {boolean} props.loading.vision - Indicates if the vision process is ongoing. Required.
 * @param {boolean} props.loading.text - Indicates if the text analysis is ongoing. Required.
 * @param {number} props.phase - Current step in the scanning process. Required.
 * @param {number} props.total - Total number of vision scanning steps. Required.
 *
 * @remarks
 * - Uses Framer Motion for entry, hover, and content transition animations.
 * - Dynamically updates the button label based on scanning or text analysis phase.
 * - Displays appropriate icons (Loader2 or ScanLine) based on loading state.
 *
 * @returns {JSX.Element} A styled, animated button that initiates or shows progress of a portion scan.
 *
 * @example
 * <PortionScanButton
 *   onClick={handleScan}
 *   loading={{ vision: true, text: false }}
 *   phase={2}
 *   total={3}
 * />
 */

export function PortionScanButton({ onClick, loading, phase, total }) {
  const isLoading = loading.vision || loading.text;

  /**
   * Returns a status message based on the current loading state.
   *
   * @returns {string} A user-friendly status message reflecting the current operation.
   *
   * @example
   * // Assuming loading.vision is true, phase is 2, and total is 5:
   * const message = getText();
   * console.log(message); // "Extrayendo Porciones 2/5"
   */
  const getText = () => {
    if (loading.vision) return `Extrayendo Porciones ${phase}/${total}`;
    if (loading.text) return "Analizando contenido de porciones";
    return "Escanear porciones";
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
