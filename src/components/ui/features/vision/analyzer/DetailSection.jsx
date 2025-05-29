"use client";
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CheckCircle, AlertTriangle } from "lucide-react";

export function DetailSection({ finalResult }) {
  return (
    <>
      <div className="grid grid-cols-2 gap-2">
        <Card className="gap-0">
          <CardHeader className="px-4" data-testid="advantages-header">
            <CardTitle>
              <h2 className="text-sm md:text-md flex items-center text-orange-500">
                <CheckCircle className="mr-2" /> Ventajas
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
        </Card>

        <Card className="gap-0">
          <CardHeader className="px-4" data-testid="disadvantages-header">
            <CardTitle>
              <h2 className="text-sm md:text-md flex items-center text-orange-500">
                <AlertTriangle className="mr-2" /> Desventajas
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
        </Card>
      </div>
    </>
  );
}
