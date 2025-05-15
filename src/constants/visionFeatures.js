import {
  Camera,
  Utensils,
  Hash,
  BookOpen,
  Thermometer,
  FileText,
  DollarSign,
  Ruler,
} from "lucide-react";

export const visionFeatures = [
  {
    name: "Analyzer",
    description:
      "Obtén información de este comestible, como ventajas y desventajas nutricionales.",
    icon: <Camera className="h-6 w-6 text-orange-500" />,
    href: "/app/vision/analyzer",
  },
  {
    name: "InstaRecipe",
    description:
      "Si es una foto de varios ingredientes, genera sugerencias de recetas.",
    icon: <Utensils className="h-6 w-6 text-orange-500" />,
    href: "/tools/instarecipe",
  },
  {
    name: "PortionScan",
    description: "Detecta la cantidad visible de ingredientes contables.",
    icon: <Hash className="h-6 w-6 text-orange-500" />,
    href: "/tools/portionscan",
  },
  {
    name: "FoodType Atlas",
    description: "Clasifica cada alimento por tipo.",
    icon: <BookOpen className="h-6 w-6 text-orange-500" />,
    href: "/tools/foodatlas",
  },
  {
    name: "FreshSense",
    description: "Identifica cocción o frescura por color.",
    icon: <Thermometer className="h-6 w-6 text-orange-500" />,
    href: "/tools/freshsense",
  },
  {
    name: "LabelLens",
    description: "Extrae y organiza información de etiquetas.",
    icon: <FileText className="h-6 w-6 text-orange-500" />,
    href: "/tools/labellens",
  },
  {
    name: "PricePeek",
    description: "Estima el costo por unidad o porción.",
    icon: <DollarSign className="h-6 w-6 text-orange-500" />,
    href: "/tools/pricepeek",
  },
  {
    name: "SizeSage",
    description: "Mide dimensiones y volumen con referencia.",
    icon: <Ruler className="h-6 w-6 text-orange-500" />,
    href: "/tools/sizesage",
  },
];
