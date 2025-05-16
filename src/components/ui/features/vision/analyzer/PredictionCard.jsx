"use client";
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";

export function PredictionCard({
  finalResult,
  showPredictions,
  toggle,
  visionOutputs,
}) {
  return (
    <Card className="w-full sm md:w-60 lg:w-100 gap-0">
      <CardHeader className="gap-0">
        <CardTitle className="text-xl">
          {finalResult?.isFood ? finalResult.name : "No he detectado nada"}
        </CardTitle>
        <button
          className="flex items-center text-orange-500 underline text-xs my-2"
          onClick={toggle}
        >
          {showPredictions ? (
            <>
              <ChevronUp />
              <span className="ml-1">Ocultar predicciones</span>
            </>
          ) : (
            <>
              <ChevronDown />
              <span className="ml-1">Mostrar predicciones</span>
            </>
          )}
        </button>
        {showPredictions && (
          <div className="text-xs mb-4 border-1 border-slate-200 p-2 max-h-40 overflow-auto rounded-md">
            {visionOutputs.map((o, i) => (
              <p key={i} className="mb-6 font-light">
                Predicción {i + 1}: {o}
              </p>
            ))}
          </div>
        )}
      </CardHeader>
      <CardContent className="gap-0">
        <p className="text-sm md:text-md mb-2">{finalResult?.description}</p>
      </CardContent>
    </Card>
  );
}
