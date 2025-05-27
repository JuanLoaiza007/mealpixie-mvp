import { userNavRoutes } from "@/config/userNavRoutes";
import {
  Camera,
  Utensils,
  Hash,
  BookOpen,
  Thermometer,
  FileText,
  DollarSign,
  Ruler,
  Home,
} from "lucide-react";

import Link from "next/link";

export const functionIcons = {
  Analyzer: Camera,
  InstaRecipe: Utensils,
  PortionScan: Hash,
  "FoodType Atlas": BookOpen,
  FreshSense: Thermometer,
  LabelLens: FileText,
  PricePeek: DollarSign,
  SizeSage: Ruler,
};

/**
 * Renders a responsive layout section with a dynamic icon header and customizable content area.
 *
 * @component
 * @param {Object} props - The props for the Screen component.
 * @param {string} props.inPageTitle - Determines the header text and icon; matches a predefined key in `functionIcons`. Required.
 * @param {React.ReactNode} props.children - The content to display inside the screen layout. Required.
 * @param {...any} props - Additional props are passed directly to the inner container div. Optional.
 * @remarks
 * Uses icons from `lucide-react` mapped by the `functionIcons` object. Relies on responsive Tailwind CSS classes. No hooks or side effects.
 * @returns {JSX.Element} The layout container with a title and children content area.
 * @example
 * <Screen inPageTitle="Analyzer">
 *   <p>This is the analysis section content.</p>
 * </Screen>
 */
export default function Screen({ inPageTitle, children, ...props }) {
  const Icon = functionIcons[inPageTitle] ?? null;

  return (
    <div className="flex w-full flex-wrap">
      <h1 className="hidden md:flex md:items-center md:gap-2 md:my-2 text-2xl font-bold">
        {Icon && <Icon className="w-6 h-6" />}
        {inPageTitle}
      </h1>

      <Link
        href={userNavRoutes.find((route) => route.id === "vision").href}
        className="absolute right-4 top-4 text-muted-foreground hover:text-foreground transition-colors"
        title="Volver al inicio"
      >
        <Home className="w-5 h-5 text-orange-500" />
      </Link>

      <div className="flex flex-col lg:flex-row mt-12 w-full gap-2" {...props}>
        {children}
      </div>
    </div>
  );
}
