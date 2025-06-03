import {
  Camera,
  Utensils,
  Hash,
  BookOpen,
  Thermometer,
  FileText,
  DollarSign,
  Ruler,
  HomeIcon,
  UserCircle,
} from "lucide-react";

export const NAV_TAGS = {
  root: "root",
  mainPage: "main-page",
  page: "page",
  functionality: "functionality",
  requiredTopBar: "required-top-bar",
};

export const NAV_IDS = {
  home: "home",
  vision: "vision",
  profile: "profile",
  analyzer: "analyzer",
  instaRecipe: "insta-recipe",
  portionScan: "portion-scan",
  foodTypeAtlas: "foodtype-atlas",
  freshSense: "fresh-sense",
  labelLens: "label-lens",
  pricePeek: "price-peek",
  sizeSage: "size-sage",
};

export const userNavRoutes = [
  {
    id: NAV_IDS.home,
    label: "Inicio",
    href: "/",
    icon: HomeIcon,
    tags: [NAV_TAGS.root],
  },
  {
    id: NAV_IDS.vision,
    label: "Visión",
    href: "/app/vision",
    icon: Camera,
    tags: [NAV_TAGS.mainPage, NAV_TAGS.page],
  },
  {
    id: NAV_IDS.profile,
    label: "Perfil",
    href: "/app/profile",
    icon: UserCircle,
    tags: [NAV_TAGS.page],
  },
  {
    id: NAV_IDS.analyzer,
    label: "Analyzer",
    description:
      "Obtén información de este comestible, como ventajas y desventajas nutricionales.",
    long_description:
      "Presiona analizar para empezar a estudiar tu imagen. Si es un alimento, fruta, snack o cualquier cosa comestible, detectaremos su nombre, ventajas, desventajas, sus propiedades nutricionales e incluso le daremos una calificación en una escala de 0 a 100 para conocer que tan saludable es!.",
    href: "/app/vision/analyzer",
    icon: Camera,
    tags: [NAV_TAGS.functionality, NAV_TAGS.requiredTopBar],
  },
  {
    id: NAV_IDS.instaRecipe,
    label: "InstaRecipe",
    description:
      "Si es una foto de varios ingredientes, genera sugerencias de recetas.",
    long_description:
      "Presiona analizar para empezar a estudiar tu imagen. Si son ingredientes, podremos detectar que ingredientes son y que recetas se pueden hacer con ellos.",
    href: "/app/vision/insta-recipe",
    icon: Utensils,
    tags: [NAV_TAGS.functionality, NAV_TAGS.requiredTopBar],
  },
  {
    id: NAV_IDS.portionScan,
    label: "PortionScan",
    description: "Detecta la cantidad visible de ingredientes contables.",
    long_description: 
      "Detecta y cuenta alimentos visibles como manzanas, huevos, rebanadas de pan o galletas. Perfecto para cuando no hay etiqueta nutricional pero necesitas entender cuántas porciones hay en tu plato.",
    href: "/app/vision/portion-scan",
    icon: Hash,
    tags: [NAV_TAGS.functionality, NAV_TAGS.requiredTopBar],
  },
  {
    id: NAV_IDS.foodTypeAtlas,
    label: "FoodType Atlas",
    description: "Clasifica cada alimento por tipo. nutricional",
    long_description:
      "Presiona analizar para empezar a estudiar tu imagen. Si es un alimento podremos clasificar sus componentes por tipo nutricional.",
    href: "/app/vision/foodtype-atlas",
    icon: BookOpen,
    tags: [NAV_TAGS.functionality, NAV_TAGS.requiredTopBar],
  },
  {
    id: NAV_IDS.freshSense,
    label: "FreshSense",
    description: "Identifica cocción o frescura por color.",
    href: "/app/vision/fresh-sense",
    long_description:
      "Presiona analizar para empezar a estudiar tu imagen. Si es un alimento podremos identificar su estado de cocción o frescura por el color.",
    icon: Thermometer,
    tags: [NAV_TAGS.functionality, NAV_TAGS.requiredTopBar],
  },
  {
    id: NAV_IDS.labelLens,
    label: "LabelLens",
    description: "Extrae y organiza información de etiquetas.",
    href: "/app/vision/label-lens",
    description:
      "Extrae información de etiquetas nutricionales y organízala en un formato fácil de leer.",
    long_description:
      "Presiona analizar para empezar a estudiar tu imagen. Si es un alimento podremos extraer información de etiquetas nutricionales y organizarla en un formato fácil de entender.",
    icon: FileText,
    tags: [NAV_TAGS.functionality, NAV_TAGS.requiredTopBar],
  },
  {
    id: NAV_IDS.pricePeek,
    label: "PricePeek",
    description: "Estima el costo por unidad o porción.",
    href: "/app/vision/price-peek",
    icon: DollarSign,
    tags: [NAV_TAGS.functionality, NAV_TAGS.requiredTopBar],
  },
  {
    id: NAV_IDS.sizeSage,
    label: "SizeSage",
    description: "Mide dimensiones y volumen con referencia.",
    href: "/app/vision/size-sage",
    long_description:
      "Presiona analizar para empezar a estudiar tu imagen. Si es un alimento podremos estimar el volumen y las dimensiones del alimento.",
    icon: Ruler,
    tags: [NAV_TAGS.functionality, NAV_TAGS.requiredTopBar],
  },
];
