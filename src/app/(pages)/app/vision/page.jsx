"use client";
import Link from "next/link";
import { ImagePlus, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useState, useCallback } from "react";
import ImageSourceDialog from "@/components/ui/features/vision/imageSourceDialog";
import { useImage } from "@/context/image";
import { visionFeatures } from "@/constants/visionFeatures";

export default function VisionToolsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { imageUrl, setImageUrl } = useImage();

  const handleImageSelected = useCallback(
    (file) => {
      setIsDialogOpen(false);
      const url = URL.createObjectURL(file);
      setImageUrl(url);
    },
    [setImageUrl]
  );

  const handleDelete = () => {
    setImageUrl(null);
  };

  return (
    <main className="flex-1 flex flex-col mx-auto overflow-y-auto gap-4 justify-center">
      <h1 className="text-2xl font-bold">Herramientas de visión</h1>
      <section className="flex flex-col xl:flex-row gap-2 items-center">
        {/* Fixed-size card: shows upload prompt or image */}
        {imageUrl ? (
          <Card className="w-full h-64 md:w-80 md:h-80 rounded-md mx-auto overflow-hidden relative flex items-center justify-center border-6 border-slate-200 p-0">
            <img
              src={imageUrl}
              alt="Vista previa"
              className="object-cover w-full h-full"
            />
            <button
              className="absolute bottom-2 right-2 bg-white/80 backdrop-blur-md rounded-md p-1"
              onClick={handleDelete}
            >
              <Trash2 className="h-6 w-6 text-red-500" />
            </button>
          </Card>
        ) : (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Card className="w-full h-64 md:w-80 md:h-80 rounded-md mx-auto overflow-hidden relative flex items-center justify-center cursor-pointer">
                <div className="flex flex-col items-center space-y-2">
                  <ImagePlus className="h-8 w-8 text-orange-500" />
                  <h3 className="font-semibold">Agregar Foto</h3>
                  <p className="text-xs text-slate-500">Galería o Cámara</p>
                </div>
              </Card>
            </DialogTrigger>
            <ImageSourceDialog
              open={isDialogOpen}
              onOpenChange={setIsDialogOpen}
              onImageSelected={handleImageSelected}
            />
          </Dialog>
        )}

        {/* Feature cards: all equal size, no inner padding/margin */}
        <section className="grid gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 flex-1">
          {visionFeatures.map((feat) => (
            <Link key={feat.name} href={feat.href}>
              <Card className="aspect-square w-full hover:shadow-md transition-shadow duration-200 flex flex-col items-center justify-center overflow-hidden p-0 px-2 md:px-4 gap-2">
                {feat.icon}
                <h3 className="font-semibold text-center">{feat.name}</h3>
                <p className="text-xs text-slate-500 text-center">
                  {feat.description}
                </p>
              </Card>
            </Link>
          ))}
        </section>
      </section>
    </main>
  );
}
