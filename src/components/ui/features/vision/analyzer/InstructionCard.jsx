"use client";
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function InstructionCard() {
  return (
    <Card className="w-full sm md:w-60 lg:w-100 gap-1 bg-amber-100">
      <CardHeader className="gap-1">
        <CardTitle className="text-xl text-orange-500">Analyzer</CardTitle>
      </CardHeader>
      <CardContent className="text-sm md:text-md">
        <p>Presiona analizar para empezar a estudiar tu imagen.</p>
        <p>
          Si es un alimento, fruta, snack o cualquier cosa comestible,
          detectaremos su nombre, ventajas, desventajas, sus propiedades
          nutricionales e incluso le daremos una calificación en una escala de 0
          a 100 para saber que tan saludable es!.
        </p>
      </CardContent>
    </Card>
  );
}
