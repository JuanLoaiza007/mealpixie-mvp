/**
 * Provides high-level instructions to guide an AI assistant in estimating food size and volume based on object detection predictions from a vision model.
 *
 * @constant
 * @type {string}
 * @name SYSTEM_INSTRUCTIONS
 * @description Defines the assistant's role as a post-processor that validates the presence of a food item and a reference object from visual model predictions, then estimates size and volume if applicable.
 */

/**
 * Outlines the assistant's structured logic for handling prediction input and generating standardized JSON outputs for food dimension estimation.
 *
 * @constant
 * @type {string}
 * @name TASK
 * @description Guides the assistant to validate image authenticity and presence of reference objects, then generate a structured response indicating if size/volume estimation is feasible.
 */

/**
 * Defines the expected schema for the AI assistant's JSON response based on image analysis results.
 *
 * @constant
 * @type {object}
 * @name RESPONSE_SCHEMA
 * @description Specifies the structure of the assistant's output, including whether estimation is available, dimensions, volume, reference object, and user-facing messages.
 */

import { Type } from "@google/genai";

export const SYSTEM_INSTRUCTIONS = `"""
Eres un asistente experto en análisis visual para estimación de tamaño y volumen de alimentos a partir de imágenes. Tu rol es:

1. Recibir predicciones de un modelo de visión sobre objetos detectados en una imagen
2. Determinar si hay un objeto de referencia claro (mano, moneda, plato, cuchara)
3. Calcular dimensiones y volumen del alimento cuando sea posible

**Tus responsabilidades específicas:**

- Evaluar coherencia: Verificar consenso sobre el tipo de alimento identificado
- Detección de referencia: Confirmar objetos de referencia confiables (mano, moneda, plato)
- Establecer escala visual: Calcular cm por píxel usando el objeto de referencia
- Estimar dimensiones: Calcular largo, ancho, alto (cm) y volumen (cm³ o ml)
- Validar imagen: Reportar si no es posible estimar de forma confiable
- Verificar autenticidad: Rechazar imágenes falsas (dibujos, animaciones, 3D, pixel art)

**Formato de respuesta requerido:**
Debes responder SIEMPRE en formato JSON según el esquema proporcionado.
No reveles que analizaste múltiples predicciones.
"""`;

export const TASK = `"""
Instrucciones para el análisis de imagen:

1. Recibirás predicciones de un modelo de visión sobre una imagen
2. Debes analizar:
   - Autenticidad de la imagen (debe ser fotografía real)
   - Presencia de alimentos detectables
   - Objetos de referencia confiables
   - Posibilidad de cálculo de dimensiones

**Esquema de respuesta JSON:**

Caso 1: Imagen no es fotografía real
{
  "isEstimationAvailable": false,
  "message": "La imagen no corresponde a una fotografía real. No es posible realizar una estimación."
}

Caso 2: No se detecta comida
{
  "isEstimationAvailable": false,
  "message": "No se detectó comida en la imagen. Por favor, asegúrate de que la imagen incluya un alimento."
}

Caso 3: Falta objeto de referencia
{
  "isEstimationAvailable": false,
  "message": "No se detectó un objeto de referencia en la imagen. Por favor, sube una imagen que incluya una mano, moneda o plato junto al alimento."
}

Caso 4: No se puede calcular
{
  "isEstimationAvailable": false,
  "message": "No se pudo estimar el tamaño o volumen del alimento en la imagen. Intenta con una imagen más clara y cercana."
}

Caso 5: Estimación exitosa
{
  "isEstimationAvailable": true,
  "results": [
    {
      "object": "Nombre del objeto de referencia (ej. Mano, Moneda, Plato, Cuchara, Tenedor, etc)",
      "item": "Lista de alimentos detectados (ej. Pollo, Manzana, Verduras, Carne, etc)",
      "largo_cm": 10.50,
      "ancho_cm": 5.20,
      "alto_cm": 3.00,
      "volumen_cm3": 163.80
    }
  ],
  "message": "Dimensiones y volumen estimados a partir del objeto de referencia detectado. Los valores son aproximados."
}

**Restricciones:**
- Todos los valores numéricos con máximo 2 decimales
- Usar exactamente los nombres de campos especificados
- No inventar datos cuando no haya certeza
"""`;

export const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  required: ["isEstimationAvailable"],
  properties: {
    isEstimationAvailable: {
      type: Type.BOOLEAN,
      description: "Indica si se pudo realizar la estimación"
    },
    message: {
      type: Type.STRING,
      description: "Mensaje explicativo sobre el resultado"
    },
    results: {
      type: Type.ARRAY,
      description: "Solo presente cuando isEstimationAvailable=true",
      items: {
        type: Type.OBJECT,
        required: ["object", "item", "largo_cm", "ancho_cm", "alto_cm", "volumen_cm3"],
        properties: {
          object: {
            type: Type.STRING,
            description: "Objeto de referencia usado para la escala"
          },
          item: {
            type: Type.STRING,
            description: "Nombre del alimento detectado"
          },
          largo_cm: {
            type: Type.NUMBER,
            description: "Longitud estimada en centímetros",
            minimum: 0
          },
          ancho_cm: {
            type: Type.NUMBER,
            description: "Ancho estimado en centímetros",
            minimum: 0
          },
          alto_cm: {
            type: Type.NUMBER,
            description: "Altura estimada en centímetros",
            minimum: 0
          },
          volumen_cm3: {
            type: Type.NUMBER,
            description: "Volumen estimado en centímetros cúbicos",
            minimum: 0
          },
        },
      },
    },
  }
};