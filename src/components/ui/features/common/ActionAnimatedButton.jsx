"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Renders an animated action button with customizable text, icons, and loading states.
 *
 * @component
 * @param {Object} props - The props object.
 * @param {Function} props.onClick - Callback function triggered on button click.
 * @param {Object} props.loading - Loading state flags.
 * @param {boolean} props.loading.vision - Indicates if the primary (vision) process is in progress.
 * @param {boolean} props.loading.text - Indicates if the secondary (text/analysis) process is in progress.
 * @param {number} props.phase - Current phase or step number for the primary loading state.
 * @param {number} props.total - Total number of steps for the primary loading state.
 * @param {string} props.defaultText - Text to display when no loading is active.
 * @param {string} props.visionLoadingText - Text to display when `loading.vision` is true.
 * @param {string} props.textLoadingText - Text to display when `loading.text` is true.
 * @param {React.ElementType} props.Icon - Lucide-react icon component to display when not loading.
 * @param {string} [props.className=""] - Additional Tailwind CSS classes for the internal Button component.
 * @param {string} [props.containerClassName=""] - Additional Tailwind CSS classes for the outer motion.div container.
 * @returns {JSX.Element} An animated button with dynamic content based on loading states.
 * @example
 * <ActionAnimatedButton
 * onClick={handleAnalyze}
 * loading={{ vision: true, text: false }}
 * phase={1}
 * total={3}
 * defaultText="Analyze Image"
 * visionLoadingText="Analyzing vision model {{phase}}/{{total}}"
 * textLoadingText="Generating final response"
 * Icon={Search}
 * className="bg-blue-500"
 * containerClassName="top-4"
 * />
 */
export function ActionAnimatedButton({
  onClick,
  loading,
  phase,
  total,
  defaultText = "Analizar imagen",
  visionLoadingText = "Analizando con modelo de visión {{phase}}/{{total}}",
  textLoadingText = "Generando respuesta final",
  Icon = Search,
  className = "",
  containerClassName = "",
}) {
  const isLoading = loading.vision || loading.text;

  const getText = () => {
    if (loading.vision) {
      return visionLoadingText
        .replace("{{phase}}", phase)
        .replace("{{total}}", total);
    }
    if (loading.text) {
      return textLoadingText;
    }
    return defaultText;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, boxShadow: "0 8px 24px rgba(0,0,0,0.05)" }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`absolute bottom-2 left-1/2 -translate-x-1/2 z-20 ${containerClassName}`}
    >
      <Button
        onClick={onClick}
        disabled={isLoading}
        className={`bg-orange-600 hover:bg-orange-700 text-white font-medium px-6 py-2 rounded-md text-sm flex items-center gap-2 min-w-[260px] justify-center shadow-md ${className}`}
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
              {Icon && <Icon className="mr-2 w-4 h-4" />}
              {getText()}
            </motion.span>
          )}
        </AnimatePresence>
      </Button>
    </motion.div>
  );
}
