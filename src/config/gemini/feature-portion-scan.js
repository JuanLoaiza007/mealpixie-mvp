import { Type } from "@google/genai";

export const SYSTEM_INSTRUCTIONS = `
Eres un asistente de IA experto en reconocimiento visual de alimentos e ingredientes contables.

Tu tarea es analizar imágenes de platos, frutas, snacks o ingredientes visibles para detectar objetos repetidos o contables (como galletas, manzanas, huevos, rebanadas de pan).

Debes generar una respuesta estructurada que indique cuántos elementos contables han sido detectados y organizarlos por tipo. Si no puedes detectar elementos claramente visibles o hay ambigüedad, debes indicarlo explícitamente.

Nunca menciones que analizaste predicciones de modelos. La respuesta debe parecer directa, clara y confiable para el usuario final.
`;

export const TASK = `
Analiza el contenido de una imagen con el objetivo de detectar **alimentos contables** como frutas, snacks, ingredientes individuales o porciones claramente separadas.

Tu análisis debe identificar objetos visualmente repetidos y contables, como:
- 3 huevos
- 2 manzanas
- 4 galletas
- 6 rebanadas de pan

1. **Detección principal**:
   Si logras detectar este tipo de objetos, genera una lista de conteo consolidada junto con una estimación de:
   - Peso total aproximado (en kilogramos) por tipo de objeto.
   - Calorías aproximadas totales por tipo de objeto.

2. **Supuestos**:
   - Utiliza promedios estándar conocidos para estimar peso y calorías si no se proporciona contexto específico.
     Ejemplo: una manzana ≈ 180g y ≈ 95 kcal, una galleta ≈ 25g y ≈ 120 kcal, un huevo ≈ 60g y ≈ 78 kcal.

3. **Estructura de salida esperada**:
{
  "hasCountableItems": true,
  "items": [
    {
      "name": "galletas",
      "count": 4,
      "estimatedWeightKg": 0.1,
      "estimatedCalories": 480
    },
    {
      "name": "manzanas",
      "count": 2,
      "estimatedWeightKg": 0.36,
      "estimatedCalories": 190
    }
  ]
}

4. Si no se detectan objetos contables con claridad, responde únicamente:
{
  "hasCountableItems": false,
  "reasoning": "No se pudieron identificar elementos contables en la imagen. Por favor, asegúrate de que los objetos sean claramente visibles."
}

❗ No incluyas explicaciones ni comentarios fuera del JSON. La respuesta debe ser un único objeto válido, claro y limpio.
`;

export const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  required: ["hasCountableItems"],
  properties: {
    hasCountableItems: { type: Type.BOOLEAN },
    reasoning: { type: Type.STRING },
    items: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        required: ["name", "count", "estimatedWeightKg", "estimatedCalories"],
        properties: {
          name: { type: Type.STRING },
          count: { type: Type.INTEGER },
          estimatedWeightKg: { type: Type.NUMBER },
          estimatedCalories: { type: Type.INTEGER },
        },
      },
    },
  },
};