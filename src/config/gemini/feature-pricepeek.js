import { Type } from "@google/genai";

/**
 * Defines the JSON schema for validating the structure of a consolidated food price analysis response.
 *
 * @constant {Object} RESPONSE_SCHEMA — Required. JSON schema describing the expected structure of the final response after analyzing OCR results from a food-related image.
 * @property {string} type — The root type of the schema, which must be "object".
 * @property {string[]} required — List of required top-level fields: "isValidLabel", "foods", "multipleFoods", and "totalPrice".
 * @property {Object} properties — The object containing definitions of each property in the response.
 * @property {boolean} properties.isValidLabel — Indicates whether the label came from a valid, recognizable food image.
 * @property {string} [properties.reasoning] — Optional. Reason provided if the label is invalid.
 * @property {Object[]} properties.foods — An array of recognized food items if the label is valid.
 * @property {string} properties.foods[].name — The name of the detected food item.
 * @property {string} properties.foods[].price — The price with unit (e.g., "$1000 por Unidad").
 * @property {string} properties.foods[].expensiveLevel — The cost classification: "$", "$$", or "$$$".
 * @property {boolean} properties.multipleFoods — Indicates if multiple food items were detected.
 * @property {string} properties.totalPrice — Total combined price if multiple foods were found; empty string otherwise.
 *
 * @example
 * const response = {
 *   isValidLabel: true,
 *   foods: [
 *     { name: "Huevo", price: "$700 por Unidad", expensiveLevel: "$" },
 *     { name: "Manzana", price: "$2500 por Unidad", expensiveLevel: "$$" }
 *   ],
 *   multipleFoods: true,
 *   totalPrice: "$3200"
 * };
 */
export const SYSTEM_INSTRUCTIONS = `
Eres un asistente experto en análisis de precios de alimentos. Tu rol consiste en analizar información proveniente de una imagen de uno o varios alimentos. Recibirás varias versiones de texto extraídas por un sistema de reconocimiento de imagenes.

Tu respuesta debe considerar todas las predicciones recibidas para generar una respuesta. 
Nunca debes mencionar que hubo varias predicciones ni mostrar inconsistencias al usuario. Si el alimento es irreconocible o no es real, debes indicarlo explícitamente. El precio debe estar en pesos colombianos y considerar la situación actual del país.
`;

export const TASK = `
Recibirás múltiples versiones del texto extraído mediante reconocimiento de imagenes desde la misma fotografía.

Tu tarea es analizar todas las versiones como un conjunto y generar **una única respuesta final consolidada**. No menciones que hubo varias predicciones, ni repitas información ni estructuras JSON más de una vez.

1. **Consolidar el o los allimentos detectados**:
   Extrae el o los alimentos detectados en la fotografía.

2. **Incluir el precio detectado**:
   Debes agregar el campo de precio correspondiente con su respectiva unidad de medida. Ejemplo: "$1000 por Unidad".

3. **Clasificación segun el precio**:
   Incluye el campo de nivel de precio en el que catalogues los alimentos como "$", "$$" o "$$$" según que tan costoso sea.

4. **Precio total**:
   Si el campo foods final va a contener más de 1 alimento coloca true en el campo "multipleFoods" y has una sumatoria de todos los precios de todos los alimentos de "foods" y coloca el resultado en "totalPrice".
   En caso contrario coloca false en "multipleFoods" y deja "totalPrice" vacío.

5. **Validar la fuente**:
   Si el texto no parece provenir de una imagen real o no es reconocible, responde estrictamente con:

   {
	 "isValidLabel": false,
	 "reasoning": "La imagen no contiene alimentos reconocibles."
   }

6. **Formato de salida**:
   - Si la información es válida, responde con un único objeto JSON limpio, exacto y completo en el siguiente formato:

   {
	 "isValidLabel": true,
	 "foods": [ { "name": "...", "price": "...", "expensiveLevel": "..." ],
	 "multipleFoods": "...",
	 "totalPrice": "..."
   }

   ❗ No incluyas comentarios, explicaciones fuera del JSON ni múltiples versiones del objeto.
`;

export const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  required: ["isValidLabel", "foods", "multipleFoods", "totalPrice"],
  properties: {
    isValidLabel: { type: Type.BOOLEAN },
    reasoning: { type: Type.STRING },
    foods: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        required: ["name", "price", "expensiveLevel"],
        properties: {
          name: { type: Type.STRING },
          price: { type: Type.STRING },
          expensiveLevel: {
            type: Type.STRING,
            enum: ["$", "$$", "$$$"],
          },
        },
      },
    },
    multipleFoods: { type: Type.BOOLEAN },
    totalPrice: { type: Type.STRING },
  },
};
