import { Camera, UserCircle, HomeIcon } from "lucide-react";

export const NAV_TAGS = {
  root: "root",
  mainPage: "main-page",
  page: "page",
  functionality: "functionality",
  requiredTopBar: "required-top-bar",
};

export const userNavRoutes = [
  {
    id: "home",
    label: "Inicio",
    href: "/",
    icon: HomeIcon,
    tags: [NAV_TAGS.root],
  },
  {
    id: "vision",
    label: "Visión",
    href: "/app/vision",
    icon: Camera,
    tags: [NAV_TAGS.mainPage, NAV_TAGS.page],
  },
  {
    id: "profile",
    label: "Perfil",
    href: "/app/profile",
    icon: UserCircle,
    tags: [NAV_TAGS.page],
  },
  {
    id: "analyzer",
    label: "Analizador",
    href: "/app/vision/analyzer",
    icon: Camera,
    tags: [NAV_TAGS.functionality, NAV_TAGS.requiredTopBar],
  },
  {
    id: "insta-recipe",
    label: "InstaRecipe",
    href: "/app/vision/insta-recipe",
    icon: Camera,
    tags: [NAV_TAGS.functionality, NAV_TAGS.requiredTopBar],
  },
  {
    id: "portion-scan",
    label: "PortionScan",
    href: "/app/vision/portion-scan",
    icon: Camera,
    tags: [NAV_TAGS.functionality, NAV_TAGS.requiredTopBar],
  },
  {
    id: "food-type-atlas",
    label: "FoodType Atlas",
    href: "/app/vision/food-type-atlas",
    icon: Camera,
    tags: [NAV_TAGS.functionality, NAV_TAGS.requiredTopBar],
  },
  {
    id: "fresh-sense",
    label: "FreshSense",
    href: "/app/vision/fresh-sense",
    icon: Camera,
    tags: [NAV_TAGS.functionality, NAV_TAGS.requiredTopBar],
  },
  {
    id: "label-lens",
    label: "LabelLens",
    href: "/app/vision/label-lens",
    icon: Camera,
    tags: [NAV_TAGS.functionality, NAV_TAGS.requiredTopBar],
  },
  {
    id: "price-peek",
    label: "PricePeek",
    href: "/app/vision/price-peek",
    icon: Camera,
    tags: [NAV_TAGS.functionality, NAV_TAGS.requiredTopBar],
  },
  {
    id: "size-sage",
    label: "SizeSage",
    href: "/app/vision/size-sage",
    icon: Camera,
    tags: [NAV_TAGS.functionality, NAV_TAGS.requiredTopBar],
  },
];
