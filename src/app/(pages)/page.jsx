"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Camera,
  Utensils,
  Hash,
  BookOpen,
  Thermometer,
  FileText,
  DollarSign,
  Ruler,
  ArrowRight,
  Users,
  Target,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { assets } from "@/assets/assets";
import { APP_NAME } from "@/config/constantsApp";
import { NAV_TAGS, userNavRoutes } from "@/config/userNavRoutes";

/**
 * Renders the main landing page of the application, showcasing features, target audience, and navigation.
 *
 * @component
 * @remarks
 * - Uses `framer-motion` for animation effects on scroll and load.
 * - Tracks scroll state with `useEffect` and updates the header background accordingly.
 * - Includes smooth-scrolling behavior for navigation buttons.
 * - Depends on constants and assets from configuration and design modules.
 * @returns {JSX.Element} The complete landing page layout including header, hero, problem, audience, features, and footer sections.
 * @example
 * // Used as the root component for the landing page
 * export default function HomePage() {
 *   return <Home />;
 * }
 */
export default function Home() {
  const APP_MAIN_ROUTE = userNavRoutes.find((route) =>
    route.tags.includes(NAV_TAGS.mainPage)
  );
  const getStartedRoute = APP_MAIN_ROUTE?.href;
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="flex flex-col w-full min-h-screen max-w-screen overflow-hidden">
      {/* Navigation */}
      <header
        className={`
          fixed top-0 left-0 right-0 z-50
          transition-colors backdrop-blur
          ${scrolled
            ? "bg-background/150 supports-[backdrop-filter]:bg-background/85 border-b"
            : "bg-transparent border-none"
          }
        `}
      >
        <div className="flex h-16 items-center justify-between p-4">
          <Link
            className="flex items-center gap-2 font-bold text-xl select-none"
            href="/"
          >
            <img
              src={assets.logo}
              alt="{APP_NAME} Logo"
              className="h-10 w-10 object-contain"
              draggable={false}
            />
            <span className="text-orange-500">{APP_NAME}</span>
          </Link>
          <nav className="flex items-center gap-4">
            <div className="hidden md:flex gap-4">
              <button
                onClick={() => scrollTo("features")}
                className="text-sm font-medium hover:underline"
              >
                Funciones
              </button>
              <button
                onClick={() => scrollTo("audience")}
                className="text-sm font-medium hover:underline"
              >
                Para quién?
              </button>
              <button
                onClick={() => scrollTo("problem")}
                className="text-sm font-medium hover:underline"
              >
                Problema
              </button>
            </div>
            <Link className="flex items-center gap-2 pointer-none:" href={getStartedRoute}>
              <Button
                variant="default"
                className="bg-orange-500 hover:bg-orange-600"
              >
                Comenzar
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 py-14 bg-white">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="md:min-h-[calc(100vh-10rem)] bg-gradient-to-b from-white to-orange-100 px-4 py-8"
        >
          <div className="flex flex-col-reverse md:flex-row items-center gap-8 md:px-40">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
              className="flex-1 flex flex-col justify-center gap-2 pb-2 md:pb-10"
            >
              <span className="w-80 rounded-lg bg-orange-200 px-3 py-1 text-sm text-orange-700">
                Conoce tu comida al instante
              </span>
              <h1 className="text-3xl font-bold sm:text-5xl md:text-6xl">
                {APP_NAME}
              </h1>
              <p className="text-xl text-muted-foreground">
                Tu asistente nutricional visual e instantáneo. Fotografía tu
                comida y obtén información al momento.
              </p>
              <Link
                className="flex flex-col sm:flex-row gap-2"
                href={getStartedRoute}
              >
                <Button className="bg-orange-500 hover:bg-orange-600 flex items-center">
                  Probar ahora <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
              className="flex justify-center px-2"
            >
              <img
                src={assets.demo}
                alt="{APP_NAME} App Demo"
                className="relative w-[80%] md:w-full max-w-md overflow-hidden rounded-xl border shadow-xl"
              />
            </motion.div>
          </div>
        </motion.section>

        {/* Problem Section */}
        <motion.section
          id="problem"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex-1 bg-white md:min-h-[calc(100vh-10rem)] text-center items-center"
        >
          <div className="px-4 md:px-40">
            <div className="flex flex-col items-center text-center space-y-6 py-10 md:py-20">
              <h1 className="text-3xl font-bold sm:text-4xl md:text-5xl pt-10">
                El Problema
              </h1>
              <p className="max-w-lg text-muted-foreground md:text-xl ">
                Tomar decisiones informadas sobre nuestra alimentación en el día
                a día puede ser un desafío.
              </p>
              <div className="flex flex-col md:flex-row flex-wrap gap-6 justify-center">
                {[
                  "Información difícil de acceder",
                  "Falta de herramientas ágiles",
                ].map((title, i) => (
                  <div
                    key={i}
                    className="flex-1 min-w-[260px] flex flex-col gap-2 rounded-lg border p-6 shadow-sm text-center items-center"
                  >
                    <div className="rounded-full bg-orange-100 p-2">
                      <Target className="h-6 w-6 text-orange-600" />
                    </div>
                    <h3 className="text-xl font-bold">{title}</h3>
                    <p className="text-muted-foreground">
                      {i === 0
                        ? "La información nutricional a menudo es difícil de acceder rápidamente o de interpretar."
                        : "En el momento crucial de decidir qué o cuánto comer, los usuarios carecen de datos inmediatos y personalizados."}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* Audience Section */}
        <motion.section
          id="audience"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="py-12 bg-orange-50 md:min-h-[calc(100vh-10rem)]"
        >
          <div className="px-4 md:px-40">
            <div className="flex flex-col items-center text-center space-y-6">
              <h2 className="text-3xl font-bold sm:text-4xl md:text-5xl pt-14">
                ¿Para quién es {APP_NAME}?
              </h2>
              <p className="max-w-lg text-muted-foreground md:text-xl">
                Nuestra aplicación está diseñada para diversos perfiles de
                usuarios.
              </p>
              <div className="flex flex-col sm:flex-row flex-wrap gap-6 justify-center">
                {[
                  "Saludables",
                  "Curiosos nutricionales",
                  "Estudiantes y educadores",
                  "Compradores",
                ].map((role, i) => (
                  <div
                    key={i}
                    className="flex-1 min-w-[180px] flex flex-col items-center gap-2 rounded-lg border p-6 shadow-sm"
                  >
                    <div className="rounded-full bg-orange-100 p-2">
                      <Users className="h-6 w-6 text-orange-600" />
                    </div>
                    <h3 className="text-lg font-bold">{role}</h3>
                    <p className="text-sm text-muted-foreground text-center">
                      {role === "Saludables"
                        ? "Quienes buscan info rápida sin tracking detallado."
                        : role === "Curiosos nutricionales"
                          ? "Quieren aprender más sobre su comida."
                          : role === "Estudiantes y educadores"
                            ? "Herramienta didáctica para analizar alimentos."
                            : "Analizar productos en el supermercado rápidamente."}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* Features Section */}
        <motion.section
          id="features"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="py-12 bg-white"
        >
          <div className="px-4 md:px-40">
            <div className="flex flex-col items-center text-center space-y-6 pt-14">
              <h2 className="text-3xl font-bold sm:text-4xl md:text-5xl">
                Funcionalidades
              </h2>
              <p className="max-w-lg text-muted-foreground md:text-xl">
                {APP_NAME} ofrece múltiples herramientas para analizar tus
                alimentos al instante.
              </p>
              <div className="flex flex-col sm:flex-row flex-wrap gap-6 justify-center">
                {[
                  {
                    Icon: Camera,
                    title: "Analyzer",
                    desc: "Sube una foto y obtén ventajas y desventajas nutricionales.",
                  },
                  {
                    Icon: Utensils,
                    title: "InstaRecipe",
                    desc: "Foto de varios ingredientes y sugerencias de recetas.",
                  },
                  {
                    Icon: Hash,
                    title: "PortionScan",
                    desc: "Detecta la cantidad visible de ingredientes contables.",
                  },
                  {
                    Icon: BookOpen,
                    title: "FoodType Atlas",
                    desc: "Clasifica cada alimento por tipo.",
                  },
                  {
                    Icon: Thermometer,
                    title: "FreshSense",
                    desc: "Identifica cocción o frescura por color.",
                  },
                  {
                    Icon: FileText,
                    title: "LabelLens",
                    desc: "Extrae y organiza información de etiquetas.",
                  },
                  {
                    Icon: DollarSign,
                    title: "PricePeek",
                    desc: "Estima el costo por unidad o porción.",
                  },
                  {
                    Icon: Ruler,
                    title: "SizeSage",
                    desc: "Mide dimensiones y volumen con referencia.",
                  },
                ].map(({ Icon, title, desc }, i) => (
                  <div
                    key={i}
                    className="flex-1 min-w-[200px] flex flex-col text-center items-center gap-2 rounded-lg border p-6 shadow-sm"
                  >
                    <div className="rounded-full bg-orange-100 p-2">
                      <Icon className="h-6 w-6 text-orange-600" />
                    </div>
                    <h3 className="text-xl font-bold">{title}</h3>
                    <p className="text-muted-foreground">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t py-6 bg-black text-white">
        <div className="flex flex-col md:flex-row items-center justify-between px-4 gap-4 md:px-10">
          <div className="flex items-center gap-2 font-bold">
            <img
              src={assets.logo}
              alt="{APP_NAME} Logo"
              className="h-10 w-10 object-contain"
            />
            <span>{APP_NAME}</span>
          </div>
          <p className="text-center text-sm text-muted-foreground md:text-left">
            © 2025 {APP_NAME}. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
