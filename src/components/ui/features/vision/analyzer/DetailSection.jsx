"use client";
import React from "react";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MotionCard } from "@/components/ui/features/common/MotionCard";
import { CheckCircle, AlertTriangle } from "lucide-react";

export function DetailSection({ finalResult }) {
  return (
    <>
      <div className="grid grid-cols-2 gap-2">
        <MotionCard className="gap-0">
          <CardHeader className="px-4" data-testid="advantages-header">
            <CardTitle>
              <h2 className="text-base text-foreground flex items-center">
                <CheckCircle className="mr-2 text-orange-600" /> Ventajas
              </h2>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4">
            <ul className="list-disc list-inside text-xs md:text-sm">
              {finalResult.advantages.map((adv, i) => (
                <li key={i} className="flex items-center">
                  - {adv}
                </li>
              ))}
            </ul>
          </CardContent>
        </MotionCard>

        <MotionCard className="gap-0">
          <CardHeader className="px-4" data-testid="disadvantages-header">
            <CardTitle>
              <h2 className="text-base text-foreground flex items-center ">
                <AlertTriangle className="mr-2 text-orange-600" /> Desventajas
              </h2>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4">
            <ul className="list-disc list-inside text-xs md:text-sm">
              {finalResult.disadvantages.map((dis, i) => (
                <li key={i} className="flex items-center">
                  - {dis}
                </li>
              ))}
            </ul>
          </CardContent>
        </MotionCard>
      </div>
    </>
  );
}
