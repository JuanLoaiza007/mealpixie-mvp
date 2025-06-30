"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { userProfileSchema } from "@/components/schemas/userProfile";

// Categorías IMC
const bmiCategories = [
  { max: 18.5, label: "Bajo peso" },
  { max: 24.9, label: "Normal" },
  { max: 29.9, label: "Sobrepeso" },
  { max: Infinity, label: "Obesidad" },
];

export function ImcCard({ weight, height }) {
  // Validar peso y altura
  const validator = userProfileSchema.pick({ weight: true, height: true });
  const result = validator.safeParse({ weight, height });
  const valid = result.success;

  // Datos parseados o valores por defecto para dibujar la barra
  const w = valid ? result.data.weight : 0;
  const h = valid ? result.data.height : 0;
  const heightM = h / 100 || 1;
  const bmi = w / (heightM * heightM) || 0;

  // Porcentajes segmentos
  const maxImc = 40;
  const pctUnder = (bmiCategories[0].max / maxImc) * 100;
  const pctNormal =
    ((bmiCategories[1].max - bmiCategories[0].max) / maxImc) * 100;
  const pctOver =
    ((bmiCategories[2].max - bmiCategories[1].max) / maxImc) * 100;
  const pctObese = 100 - (pctUnder + pctNormal + pctOver);
  const markerPos = (Math.min(bmi, maxImc) / maxImc) * 100;

  // Categoría textual
  const category = valid
    ? bmiCategories.find((cat) => bmi <= cat.max)?.label
    : null;

  return (
    <Card className="w-full flex flex-col md:max-w-xs gap-2 justify-center">
      <CardHeader>
        <CardTitle className="text-orange-500">
          Índice de Masa Corporal (IMC)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="relative">
            {valid && (
              <div
                className="absolute top-0 h-5 w-0.5 bg-black"
                style={{ left: `calc(${markerPos}% - 1px)` }}
              />
            )}
          </div>
          <div className="flex h-4 w-full overflow-hidden rounded">
            <div
              className="h-full"
              style={{ width: `${pctUnder}%`, backgroundColor: "#93c5fd" }}
            />
            <div
              className="h-full"
              style={{ width: `${pctNormal}%`, backgroundColor: "#6ee7b7" }}
            />
            <div
              className="h-full"
              style={{ width: `${pctOver}%`, backgroundColor: "#facc15" }}
            />
            <div
              className="h-full"
              style={{ width: `${pctObese}%`, backgroundColor: "#f87171" }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Bajo peso</span>
            <span>Normal</span>
            <span>Sobrepeso</span>
            <span>Obesidad</span>
          </div>
          <p className="text-sm">
            {"Tu IMC: "}
            {valid ? (
              <span className="font-medium">
                {bmi.toFixed(1)} {" - "} {category}
              </span>
            ) : (
              <>{" ..."}</>
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
