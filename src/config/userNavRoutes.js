import { Camera, UserCircle, HomeIcon } from "lucide-react";

export const userNavRoutes = [
  {
    id: "home",
    label: "Inicio",
    href: "/",
    icon: HomeIcon,
    tags: ["root"],
  },
  {
    id: "vision",
    label: "Visión",
    href: "/app/vision",
    icon: Camera,
    tags: ["main-functionality", "functionality"],
  },
  {
    id: "profile",
    label: "Perfil",
    href: "/app/profile",
    icon: UserCircle,
    tags: ["functionality"],
  },
];
