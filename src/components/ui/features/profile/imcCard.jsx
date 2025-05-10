"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ImcCard({ weight, height }) {
  const heightM = Number(height) / 100;
  const bmi = Number(weight) / (heightM * heightM);

  // Porcentajes de segmentos (del total 40 como IMC máximo razonable)
  const pctUnder = (18.5 / 40) * 100; // ≈46.25%
  const pctNormal = ((24.9 - 18.5) / 40) * 100; // ≈16%
  const pctOver = ((29.9 - 24.9) / 40) * 100; // ≈12.5%
  // restante = 100 - (pctUnder + pctNormal + pctOver)
  const markerPos = (Math.min(bmi, 40) / 40) * 100;

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
            <div
              className="absolute top-0 h-5 w-0.5 bg-black"
              style={{ left: `calc(${markerPos}% - 1px)` }}
            />
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
              className="h-full flex-1"
              style={{ backgroundColor: "#f87171" }}
            />
          </div>

          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Bajo peso</span>
            <span>Normal</span>
            <span>Sobrepeso</span>
            <span>Obesidad</span>
          </div>
          <p className="text-sm">
            Tu IMC: <span className="font-medium">{bmi.toFixed(1)}</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
