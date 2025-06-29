import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Camera, ImagePlus } from "lucide-react";
import { handleTakePhoto, handleChooseFromGallery } from "@/utils/media";

function ImageSourceDialog({ open, onOpenChange, onImageSelected }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Seleccionar origen de la foto</DialogTitle>
          <DialogDescription>
            Elige cómo quieres agregar la foto para analizar.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Button
            className="w-full"
            onClick={() => {
              onOpenChange(false);
              handleTakePhoto(onImageSelected);
            }}
          >
            <Camera className="mr-2 h-4 w-4" /> Tomar foto
          </Button>
          <Button
            className="w-full"
            onClick={() => {
              onOpenChange(false);
              handleChooseFromGallery(onImageSelected);
            }}
          >
            <ImagePlus className="mr-2 h-4 w-4" /> Elegir de la galería
          </Button>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="secondary"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ImageSourceDialog;
