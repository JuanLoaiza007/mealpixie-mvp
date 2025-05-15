"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  activityLevelOptions,
  goalOptions,
} from "@/components/schemas/userProfile";
import { ImcCard } from "@/components/ui/features/profile/imcCard";
import { useUserProfile } from "@/hooks/useUserProfile";
import { APP_VERSION } from "@/config/constantsApp";

export default function ProfilePage() {
  const { profile, loading, updateProfile } = useUserProfile();
  const [form, setForm] = useState(null);

  useEffect(() => {
    if (!loading && profile) setForm(profile);
  }, [loading, profile]);

  const handleChange = (field) => (value) => {
    setForm((prev) => {
      const updatedValue =
        field === "birthYear" || field === "height" || field === "weight"
          ? Number(value)
          : value;
      return { ...prev, [field]: updatedValue };
    });
  };

  const handleSave = async () => {
    await updateProfile(form);
  };

  if (loading || !form) {
    return <div className="p-4 text-center">Cargando perfil…</div>;
  }

  return (
    <main className="flex-1 flex flex-col mx-auto overflow-y-auto gap-4 justify-center">
      <h1 className="text-2xl font-bold">Perfil del usuario</h1>
      <section className="flex flex-col md:flex-row gap-4">
        <ImcCard weight={form.weight} height={form.height} />

        <Card className="flex-1 w-full">
          <CardHeader>
            <CardTitle className="text-orange-500">Datos personales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="username">Nombre de usuario</Label>
              <Input
                id="username"
                value={form.username}
                onChange={(e) => handleChange("username")(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="birthYear">Año de nacimiento</Label>
              <Input
                id="birthYear"
                type="number"
                min="1900"
                max={new Date().getFullYear()}
                value={form.birthYear}
                onChange={(e) => handleChange("birthYear")(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="height">Altura (cm)</Label>
              <Input
                id="height"
                type="number"
                value={form.height}
                onChange={(e) => handleChange("height")(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="weight">Peso (kg)</Label>
              <Input
                id="weight"
                type="number"
                value={form.weight}
                onChange={(e) => handleChange("weight")(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="activityLevel">Nivel de actividad</Label>
              <Select
                value={form.activityLevel}
                onValueChange={handleChange("activityLevel")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona nivel" />
                </SelectTrigger>
                <SelectContent>
                  {activityLevelOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="goal">Objetivo</Label>
              <Select value={form.goal} onValueChange={handleChange("goal")}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona objetivo" />
                </SelectTrigger>
                <SelectContent>
                  {goalOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="pt-4">
              <Button
                className="bg-orange-500 hover:bg-orange-600 text-white w-full"
                onClick={handleSave}
              >
                Guardar cambios
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
      <section className="md:hidden text-xs text-slate-400 items-center mx-auto">
        v{APP_VERSION}
      </section>
    </main>
  );
}
