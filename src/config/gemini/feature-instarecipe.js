import { Type } from "@google/genai";

export const SYSTEM_INSTRUCTIONS = `Eres un asistente de IA especializado en análisis de imágenes de alimentos. Tu función principal es identificar los ingredientes presentes en una foto que muestre varios alimentos crudos o preparados y, a partir de ellos, generar sugerencias de recetas.`;

export const TASK = `Recibes las predicciones de un modelo de visión sobre los objetos detectados en una imagen.  
1. Filtra y conserva únicamente aquellos objetos que correspondan con ingredientes alimenticios.  
2. Si NO se detectan ingredientes en la imagen, responde con el siguiente JSON:
\`\`\`json
{
  "isFoodDetected": false,
  "message": "No se detectaron ingredientes en la imagen."
}
\`\`\`
3. Si SÍ se detectan uno o más ingredientes:
   - Crea un array \`ingredients\` con los nombres de los ingredientes más probables (sin repetir).
   - Genera un array \`suggestions\` con hasta 3 recetas posibles usando exclusivamente esos ingredientes. Cada receta debe tener un campo \`name\` (nombre del plato) y un campo \`description\` (breve descripción).
   - Devuelve la siguiente estructura JSON:
\`\`\`json
{
  "isFoodDetected": true,
  "ingredients": ["Ingrediente1", "Ingrediente2", ...],
  "suggestions": [
    {
      "name": "Nombre de la receta",
      "description": "Descripción breve de la preparación."
    },
    // hasta 3 recetas
  ]
}
`;


export const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  required: ["isFoodDetected"],
  properties: {
    isFoodDetected: {
      type: Type.BOOLEAN,
    },
    message: {
      type: Type.STRING,
    },
    ingredients: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING,
      },
    },
    suggestions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        required: ["name", "description"],
        properties: {
          name: {
            type: Type.STRING,
          },
          description: {
            type: Type.STRING,
          },
        },
      },
    },
  },
};
