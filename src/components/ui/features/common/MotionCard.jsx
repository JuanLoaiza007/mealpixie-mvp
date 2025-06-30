"use client";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

/**
 * MotionCard Component
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {React.ReactNode} props.children - Content to be rendered inside the animated card.
 * @param {string} [props.className] - Additional CSS classes for the card, or any other prop supported by the underlying Card component.
 *
 * @returns {JSX.Element} A card wrapped in `motion.div` with entry and hover animations.
 *
 * @example
 * // Example with custom className and other props for the Card
 * <MotionCard className="custom-card-style" data-testid="my-card-element">
 * <CardHeader>
 * <CardTitle>My Title</CardTitle>
 * </CardHeader>
 * <CardContent>
 * <p>My content.</p>
 * </CardContent>
 * </MotionCard>
 */
export function MotionCard({ children, ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
      // El className del motion.div se manejaría aquí si fuera necesario
    >
      <Card {...props}>{children}</Card>
    </motion.div>
  );
}
