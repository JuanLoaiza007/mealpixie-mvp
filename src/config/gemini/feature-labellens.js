import { Type } from "@google/genai";

/**
 * Consolidates multiple OCR results from a nutritional label and generates a structured JSON response with health insights.
 *
 * @constant
 * @type {string}
 * @name SYSTEM_INSTRUCTIONS
 * @description System-level prompt that defines the assistant's role in interpreting OCR-extracted text from nutritional labels.
 */

/**
 * Defines the task for consolidating and interpreting OCR results from nutritional labels into a structured, user-friendly output.
 *
 * @constant
 * @type {string}
 * @name TASK
 * @description Detailed multi-step instruction set guiding the AI to extract, explain, and evaluate nutritional information, detect ingredients, and validate the source.
 */

/**
 * JSON schema that the AI-generated response must follow to ensure consistency, validity, and completeness.
 *
 * @constant
 * @type {object}
 * @name RESPONSE_SCHEMA
 * @property {boolean} isValidLabel — Indicates whether the OCR text corresponds to a valid nutritional label.
 * @property {string} [reasoning] — Reason for invalidation if the label is not valid.
 * @property {string} [portion] — Detected portion size of the product (optional if not found).
 * @property {Array<Object>} fields — Nutrient data including value, explanation, and health impact.
 * @property {Array<Object>} vitaminsAndMinerals — Vitamins and minerals present with benefits and percentages.
 * @property {Object} ingredients — List and analysis of detected ingredients.
 * @description JSON schema used to validate AI output; enforces structure and ensures each response element is properly typed and explained.
 */

export const SYSTEM_INSTRUCTIONS = `
Eres un asistente experto en análisis de etiquetas nutricionales. Tu rol consiste en consolidar y explicar información proveniente de una imagen de una etiqueta alimentaria. Recibirás varias versiones de texto extraídas por un sistema OCR (Reconocimiento Óptico de Caracteres).

Tu respuesta debe estructurar la información nutricional de forma clara y legible, y brindar explicaciones concisas sobre cada nutriente, incluyendo su impacto en la salud. 
Nunca debes mencionar que hubo varias predicciones ni mostrar inconsistencias al usuario. Si el texto es ilegible o no proviene de una etiqueta nutricional real, debes indicarlo explícitamente.
`;


export const TASK = `
Recibirás múltiples versiones del texto extraído mediante OCR desde la misma etiqueta nutricional.

Tu tarea es analizar todas las versiones como un conjunto y generar **una única respuesta final consolidada**. No menciones que hubo varias predicciones, ni repitas información ni estructuras JSON más de una vez.

1. **Consolidar la información nutricional**:
   Extrae los valores más confiables de los siguientes campos:
   - Porción (ej. 100g, 1 taza, 250ml)
   - Calorías
   - Grasas totales, saturadas y trans
   - Azúcares
   - Carbohidratos
   - Fibra dietaria
   - Proteínas
   - Sodio

2. **Explicar cada nutriente. Campo muy importante y que debe siempre estar**:
   Para cada uno de los anteriores, incluye:
   - \`name\`: nombre del nutriente.
   - \`value\`: valor numérico con unidad.
   - \`explanation\`: breve descripción del nutriente.
   - \`healthImpact\`: frase sencilla sobre el efecto en la salud (positivo o negativo).
   - \`impactLevel\`: clasifica el impacto en uno de estos valores:
     - \`recomendado\`: si el valor es saludable o beneficioso según guías nutricionales.
     - \`neutro\`: si el valor es adecuado o no representa riesgo.
     - \`perjudicial\`: si el valor excede lo recomendado o puede causar efectos negativos.

   Usa como referencia los valores diarios recomendados para un adulto promedio. Compara la cantidad del nutriente con la porción indicada y determina si está dentro, por debajo o por encima de lo ideal.

3. **Incluir la porción detectada**:
   Si puedes identificar el tamaño de la porción, agrega el campo \`portion\` con el texto correspondiente. Ejemplo: "1 taza (250g)".

4. **Agregar vitaminas y minerales si están presentes**:
   Incluye un campo opcional \`vitaminsAndMinerals\`, que sea una lista de objetos con:
   - \`name\`: nombre (ej. "Vitamina C", "Hierro").
   - \`percentage\`: porcentaje del valor diario.
   - \`benefit\`: breve explicación de su función para la salud.

5. **Agregar ingredientes si se detectan**:
   Si la etiqueta contiene una lista de ingredientes, agrégala en el campo \`ingredients\` con:
   - \`list\`: ingredientes separados por comas.
   - \`analysis\`: una breve explicación general sobre la calidad de los ingredientes y si alguno puede ser perjudicial para la salud.

6. **Validar la fuente**:
   Si el texto no parece provenir de una etiqueta nutricional real o es ilegible, responde estrictamente con:

   {
     "isValidLabel": false,
     "reasoning": "La imagen no contiene una etiqueta nutricional legible o válida."
   }

7. **Formato de salida**:
   - Si la información es válida, responde con un único objeto JSON limpio, exacto y completo en el siguiente formato:

   {
     "isValidLabel": true,
     "portion": "1 taza (252g)",
     "fields": [ { "name": "...", "value": "...", "explanation": "...", "healthImpact": "..." } ],
     "vitaminsAndMinerals": [ { "name": "...", "percentage": 10, "benefit": "..." } ],
     "ingredients": {
       "list": "agua, azúcar, colorantes, saborizante natural",
       "analysis": "Contiene ingredientes altamente procesados, como colorantes y saborizantes artificiales, que pueden ser perjudiciales para la salud si se consumen en exceso."
     }
   }

   ❗ No incluyas comentarios, explicaciones fuera del JSON ni múltiples versiones del objeto.
`;

export const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  required: ["isValidLabel", "fields", "vitaminsAndMinerals", "ingredients"],
  properties: {
    isValidLabel: { type: Type.BOOLEAN },
    reasoning: { type: Type.STRING },
    portion: { type: Type.STRING },
    fields: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        required: ["name", "value", "explanation", "healthImpact", "impactLevel"],
        properties: {
          name: { type: Type.STRING },
          value: { type: Type.STRING },
          explanation: { type: Type.STRING },
          healthImpact: { type: Type.STRING },
          impactLevel: {
            type: Type.STRING,
            enum: ["recomendado", "neutro", "perjudicial"],
          },
        },
      },
    },
    vitaminsAndMinerals: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        required: ["name", "percentage", "benefit"],
        properties: {
          name: { type: Type.STRING },
          percentage: { type: Type.NUMBER },
          benefit: { type: Type.STRING },
        },
      },
    },
    ingredients: {
      type: Type.OBJECT,
      required: ["list", "analysis"],
      properties: {
        list: { type: Type.STRING },
        analysis: { type: Type.STRING },
      },
    },
  },
};


