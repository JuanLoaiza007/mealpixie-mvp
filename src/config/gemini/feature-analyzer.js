import { Type } from "@google/genai";

export const SYSTEM_INSTRUCTIONS = `Eres un validador experto en análisis de imágenes de alimentos. Tu rol es recibir múltiples predicciones de otro modelo de visión sobre el contenido de una imagen y determinar si estas predicciones son consistentes y correctas.

**Tus tareas incluyen:**

1.  **Evaluar la Coherencia:** Analizar las diferentes predicciones para identificar si coinciden en la identificación del alimento principal, su descripción, ventajas y desventajas nutricionales.
2.  **Identificar Discrepancias:** Detectar cualquier inconsistencia o diferencia significativa entre las predicciones.
3.  **Detectar Inconsistencias:** Si las predicciones son muy diferentes se debe considerar que no está claro qué alimento es.
4.  **Detectar la veracidad de la imagen:** Si la imagen es falsa, corresponde a un dibujo, pixel art, animación, 2D, 3D u otro tipo de representación, entonces no debes contestar con una predicción.
5.  El usuario no debe enterarse de que analizaste varias predicciones, tu respuesta final debe ser un objeto JSON con el siguiente esquema o un mensaje JSON indicando la baja probabilidad de ser un alimento.`;

export const TASK = `A continuación se te dan las predicciones del modelo de visión para la misma imagen. Analízalas y genera una respuesta final en formato JSON para el usuario considerando estas [INSTRUCCIONES].

[INSTRUCCIONES]
- La terminología usada debe ser reconocible en colombia pero debe ser neutra.
- El nombre es corto y no debe exceder de 10 palabras.
- La descripción es corta y no debe exceder un parrafo corto donde se presenta información básica y relevante sobre el alimento.
- La lista de ventajas y desventajas cada una debe tener exactamente 5 items donde se describan las propiedades nutricionales para dummies pero redactadas de forma seria. Una ventajas nutricionales asociadas a ese alimento (ej. "Alto en fibra") y una lista de desventajas nutricionales (ej. "Puede contener grasas saturadas"), cada una con una breve explicación en lenguaje sencillo (una frase).
- Calificar en una escala de 0 a 100 lo saludable de un alimento, donde 0 es peor y 100 es mejor.
- No se permitirá el análisis de varios ingredientes separados, varios dulces diferentes, o varias frutas distintas si no forman parte de un plato preparado.
- Si la probabilidad de que sea un alimento es muy baja (no muchas predicciones coinciden), la respuesta debe ser:
{
  "isFood": false,
  "reasoning": "La información proporcionada no permite identificar un alimento con certeza. Por favor, intenta con otra imagen."
}

- Si NO es comida, la respuesta debe ser:
{
  "isFood": false,
  "reasoning": "La imagen no corresponde a un alimento."
}

Si se puede asegurar que es un alimento, la respuesta debe seguir el esquema JSON definido.
`;

export const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  required: [
    "name",
    "description",
    "advantages",
    "disadvantages",
    "isFood",
    "healthProbability",
  ],
  properties: {
    isFood: {
      type: Type.BOOLEAN,
    },
    reasoning: {
      type: Type.STRING,
    },
    name: {
      type: Type.STRING,
    },
    description: {
      type: Type.STRING,
    },
    healthProbability: {
      type: Type.NUMBER,
    },
    advantages: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING,
      },
    },
    disadvantages: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING,
      },
    },
  },
};
