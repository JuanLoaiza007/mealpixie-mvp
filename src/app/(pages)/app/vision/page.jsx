"use client";

import Link from "next/link";
import {
  Camera,
  Utensils,
  Hash,
  BookOpen,
  Thermometer,
  FileText,
  DollarSign,
  Ruler,
  ImagePlus,
  PlusCircleIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useState, useCallback } from "react";
import ImageSourceDialog from "@/components/ui/features/vision/imageSourceDialog";
import NotImplementedDialog from "@/components/ui/features/common/notImplementedDialog";

const features = [
  {
    name: "Analyzer",
    description:
      "Obtén información de este comestible, como ventajas y desventajas nutricionales.",
    icon: <Camera className="h-6 w-6 text-orange-500" />,
    href: "/tools/analyzer",
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

export default function FeatureCards() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [notImplementedDialogOpen, setNotImplementedDialogOpen] =
    useState(false);
  const [selectedFeature, setSelectedFeature] = useState(null);

  const handleImageSelected = useCallback((imageFileOrBlob) => {
    setIsDialogOpen(false);
    const imageUrl = URL.createObjectURL(imageFileOrBlob);
    setSelectedImage(imageUrl);
    setProcessedImage(imageFileOrBlob);
    console.log("Imagen seleccionada:", imageFileOrBlob);
  }, []);

  const handleReplaceImage = () => {
    setSelectedImage(null);
    setProcessedImage(null);
    setIsDialogOpen(true);
  };

  const handleFeatureClick = (feature) => {
    setSelectedFeature(feature);
    setNotImplementedDialogOpen(true);
  };

  return (
    <main className="flex-1 flex flex-col mx-auto overflow-y-auto gap-4 justify-center">
      <h1 className="text-2xl font-bold">Herramientas de visión</h1>
      <section className="flex flex-col xl:flex-row gap-2">
        {selectedImage && (
          <Card className="flex aspect-square rounded-md max-w-md mx-auto">
            <CardContent className="flex-1 relative p-4">
              <img
                src={selectedImage}
                alt="Vista previa"
                className="object-contain w-full h-full"
              />
              <div
                className="absolute bottom-1 right-1 bg-white/80 backdrop-blur-sm rounded-md p-1 cursor-pointer shadow-sm"
                onClick={handleReplaceImage}
              >
                <PlusCircleIcon className="h-10 w-10 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            {!selectedImage ? (
              <Card className="aspect-square rounded-md w-full max-w-md mx-auto items-center justify-center my-auto">
                <div className="flex flex-col items-center justify-center space-y-2">
                  <ImagePlus className="h-8 w-8 text-orange-500" />
                  <h3 className="font-semibold text-center">Agregar Foto</h3>
                  <p className="text-xs text-slate-500 text-center">
                    Galería o Cámara
                  </p>
                </div>
              </Card>
            ) : null}
          </DialogTrigger>
          <ImageSourceDialog
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            onImageSelected={handleImageSelected}
          />
        </Dialog>

        <section className="w-full flex-1 grid gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {features.map((feature) => (
            <Card
              key={feature.name}
              className="aspect-square hover:shadow-md transition-shadow duration-200 flex flex-col justify-center items-center cursor-pointer"
              onClick={() => handleFeatureClick(feature)}
            >
              <div className="flex flex-col items-center justify-center space-y-2">
                {feature.icon}
                <h3 className="font-semibold text-center">{feature.name}</h3>
                <p className="text-xs text-slate-500 text-center">
                  {feature.description}
                </p>
              </div>
            </Card>
          ))}
        </section>

        <NotImplementedDialog
          open={notImplementedDialogOpen}
          onOpenChange={setNotImplementedDialogOpen}
          selectedFeature={selectedFeature}
        />
      </section>
    </main>
  );
}
