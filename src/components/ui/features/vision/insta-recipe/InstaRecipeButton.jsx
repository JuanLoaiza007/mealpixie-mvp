"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export function InstaRecipeButton({ onClick, loading, phase, total }) {
  return (
    <Button
      className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded"
      disabled={loading.vision || loading.text}
      onClick={onClick}
    >
      {(loading.vision || loading.text) && (
        <Loader2 className="animate-spin mr-2" />
      )}
      {loading.vision
        ? `Analizando con modelo de visión ${phase}/${total}`
        : loading.text
        ? "Generando respuesta final"
        : "Analizar imagen"}
    </Button>
  );
}
