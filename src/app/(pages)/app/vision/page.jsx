"use client";

import Link from "next/link";
import { useState, useCallback } from "react";
import { ImagePlus, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useImage } from "@/context/image";
import { visionFeatures } from "@/constants/visionFeatures";
import { SUPPORTED_IMAGE_TYPES } from "@/config/together/common";
import ImageSourceDialog from "@/components/ui/features/vision/imageSourceDialog";
import ImagePreviewCard from "@/components/ui/features/common/ImagePreviewCard";

export default function VisionToolsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [requiredDialogOpen, setRequiredDialogOpen] = useState(false);
  const [unsupportedDialogOpen, setUnsupportedDialogOpen] = useState(false);
  const { imageUrl, setImageUrl } = useImage();

  const handleImageSelected = useCallback(
    (file) => {
      if (!SUPPORTED_IMAGE_TYPES.includes(file.type)) {
        setUnsupportedDialogOpen(true);
        return;
      }
      setIsDialogOpen(false);
      const reader = new FileReader();
      reader.onloadend = () => setImageUrl(reader.result);
      reader.readAsDataURL(file);
    },
    [setImageUrl]
  );

  const handleDelete = useCallback(() => {
    setImageUrl(null);
  }, [setImageUrl]);

  const onDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file && file.type.startsWith("image/")) {
        handleImageSelected(file);
      }
    },
    [handleImageSelected]
  );

  return (
    <main className="flex-1 flex flex-col mx-auto overflow-y-auto gap-4 justify-center">
      <h1 className="text-2xl font-bold">Herramientas de visión</h1>

      <section className="flex flex-col xl:flex-row gap-2 items-center">
        {/* Imagen cargada o placeholder */}
        {imageUrl ? (
          <ImagePreviewCard imageUrl={imageUrl} alt="Vista previa">
            <button
              className="absolute bottom-2 right-2 bg-white/80 backdrop-blur-md rounded-md p-1"
              onClick={handleDelete}
            >
              <Trash2 className="h-6 w-6 text-red-500" />
            </button>
          </ImagePreviewCard>
        ) : (
          <div
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            className="w-full h-64 md:w-80 md:h-80 rounded-md mx-auto"
          >
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <ImagePreviewCard
                  className={`${
                    isDragging ? "animate-pulse [animation-duration:500ms]" : ""
                  } cursor-pointer`}
                  onClick={() => setIsDialogOpen(true)}
                >
                  <ImagePlus className="h-8 w-8 text-orange-500" />
                  <h3 className="font-semibold">Agregar Foto</h3>
                  <p className="text-xs text-slate-500 text-center">
                    Haz clic o arrastra una imagen aquí
                  </p>
                </ImagePreviewCard>
              </DialogTrigger>
              <ImageSourceDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                onImageSelected={handleImageSelected}
              />
            </Dialog>
          </div>
        )}

        {/* Tarjetas de funciones */}
        <section className="grid gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 flex-1">
          {visionFeatures.map((feat) => {
            const card = (
              <Card
                key={feat.name}
                className="aspect-square w-full hover:shadow-md transition-shadow duration-200 flex flex-col items-center justify-center overflow-hidden p-0 px-2 md:px-4 gap-2"
              >
                {feat.icon}
                <h3 className="font-semibold text-center">{feat.name}</h3>
                <p className="text-xs text-slate-500 text-center">
                  {feat.description}
                </p>
              </Card>
            );

            // Si no hay imagen, abrimos diálogo de carga
            return imageUrl ? (
              <Link key={feat.name} href={feat.href}>
                {card}
              </Link>
            ) : (
              <div key={feat.name} onClick={() => setRequiredDialogOpen(true)}>
                {card}
              </div>
            );
          })}
        </section>
      </section>

      {/* Diálogo: falta imagen */}
      <Dialog open={requiredDialogOpen} onOpenChange={setRequiredDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Carga una imagen primero</DialogTitle>
          </DialogHeader>
          <p>Debes cargar una imagen para usar estas funciones.</p>
          <DialogFooter>
            <Button onClick={() => setRequiredDialogOpen(false)}>Cerrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo: formato no soportado */}
      <Dialog
        open={unsupportedDialogOpen}
        onOpenChange={setUnsupportedDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Formato no soportado</DialogTitle>
          </DialogHeader>
          <p>Usa un formato JPG, PNG o WEBP.</p>
          <DialogFooter>
            <Button onClick={() => setUnsupportedDialogOpen(false)}>
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
