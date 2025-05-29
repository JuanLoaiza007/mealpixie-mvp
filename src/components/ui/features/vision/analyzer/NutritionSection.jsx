"use client";
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import NutritionPieCharts from "@/components/ui/features/vision/analyzer/NutritionPieChart";
import HealthScoreChart from "@/components/ui/features/vision/analyzer/HealthScoreChart";

export function NutritionSection({ finalResult }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
      <Card className="gap-0">
        <CardHeader>
          <CardTitle>
            <h2 className="text-sm text-orange-500">Información nutricional</h2>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <NutritionPieCharts
            data={finalResult.mainCharacteristics}
            size={50}
          />
        </CardContent>
      </Card>
      <Card className="gap-0">
        <CardHeader className="py-0 gap-0">
          <CardTitle className="text-sm text-orange-500">
            Puntuación de salud
          </CardTitle>
        </CardHeader>
        <CardContent className="py-0 gap-0">
          <HealthScoreChart score={finalResult.healthProbability} />
          <p className="text-xs text-center mt-2">
            {finalResult.healthProbability}% Saludable
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
