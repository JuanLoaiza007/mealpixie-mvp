"use client";
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function InstructionCard({ functionInfo }) {
  return (
    <Card className="w-full sm md:w-60 lg:w-100 gap-1 bg-amber-100">
      <CardHeader className="gap-1">
        <CardTitle className="text-xl text-orange-500">
          {functionInfo.label}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm md:text-md">
        {functionInfo.long_description}
      </CardContent>
    </Card>
  );
}
