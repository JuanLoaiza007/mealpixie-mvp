// src/components/schemas/userProfile.js
import { z } from "zod";

export const activityLevels = [
  "sedentary",
  "lightly_active",
  "moderately_active",
  "very_active",
];
export const goals = ["lose", "maintain", "gain"];

export const activityLevelOptions = [
  { value: "sedentary", label: "Sedentario" },
  { value: "lightly_active", label: "Ligeramente activo" },
  { value: "moderately_active", label: "Moderadamente activo" },
  { value: "very_active", label: "Muy activo" },
];
export const goalOptions = [
  { value: "lose", label: "Perder peso" },
  { value: "maintain", label: "Mantenerse en forma" },
  { value: "gain", label: "Ganar peso" },
];

export const userProfileSchema = z.object({
  id: z.number().optional(), // Añade el id como opcional
  username: z
    .string()
    .min(1, "El nombre de usuario no puede estar vacío")
    .max(30, "El nombre de usuario debe tener como máximo 30 caracteres"),
  birthYear: z
    .number({ invalid_type_error: "El año de nacimiento debe ser un número" })
    .int("El año de nacimiento debe ser un entero")
    .gte(1900, "El año de nacimiento debe ser >= 1900")
    .lte(
      new Date().getFullYear(),
      `El año de nacimiento debe ser <= ${new Date().getFullYear()}`
    ),
  height: z
    .number({ invalid_type_error: "La altura debe ser un número" })
    .positive("La altura debe ser un valor positivo")
    .max(300, "La altura no puede superar los 300 cm"),
  weight: z
    .number({ invalid_type_error: "El peso debe ser un número" })
    .positive("El peso debe ser un valor positivo")
    .max(500, "El peso no puede superar los 500 kg"),
  activityLevel: z.enum(activityLevels, {
    errorMap: () => ({ message: "Nivel de actividad inválido" }),
  }),
  goal: z.enum(goals, {
    errorMap: () => ({ message: "Objetivo inválido" }),
  }),
});

export const initialProfile = {
  username: "guest",
  birthYear: 2000,
  height: 170,
  weight: 65,
  activityLevel: "moderately_active",
  goal: "maintain",
};

export const userProfileStore = {
  modelName: "userProfiles",
  storeConfig: {},
  indexes: [
    { name: "username", keyPath: "username", options: { unique: true } },
  ],
  schema: userProfileSchema,
};
