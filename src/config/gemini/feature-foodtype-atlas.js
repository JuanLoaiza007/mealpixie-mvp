import { Type } from "@google/genai";

export const SYSTEM_INSTRUCTIONS = `Eres un clasificador experto en tipos de alimentos. Tu función es recibir una lista de alimentos identificados en una imagen y clasificarlos según su tipo nutricional (vegetal, proteína, carbohidrato, fruta, etc.), junto con una breve definición del tipo correspondiente.

**Tus tareas incluyen:**

1.  **Clasificar Alimentos:** A cada alimento identificado se le debe asignar un tipo nutricional.
2.  **Agrupar Clasificaciones:** Se deben agrupar los alimentos por tipo en la salida.
3.  **Generar Definiciones:** Por cada tipo presente, se debe incluir una definición breve, clara y sencilla.
4.  **Formatear Respuesta:** La salida debe ser un objeto JSON con la estructura definida.

**Instrucciones adicionales:**
- Los nombres de los alimentos deben estar capitalizados y en español neutro.
- Las definiciones deben tener un máximo de 25 palabras y ser comprensibles para todo público.
- La clasificación debe ser precisa y aplicable a cada alimento individualmente.
- Si no se detecta ningún alimento, la salida debe incluir "isFoodDetected: false" y un mensaje adecuado.`;

export const TASK = `A continuación se te entrega una lista de alimentos detectados por el modelo de visión. Clasifícalos por tipo y agrupa la salida según el siguiente esquema.

[ESQUEMA]
- Si hay alimentos:
{
  "isFoodDetected": true,
  "classifications": [
    {
      "type": "TipoDeAlimento",
      "definition": "Breve definición del tipo",
      "items": ["Alimento1", "Alimento2", ...]
    },
    ...
  ]
}

- Si NO hay alimentos:
{
  "isFoodDetected": false,
  "message": "No se detectaron alimentos en la imagen."
}

[REGLAS]
- Tipos posibles: "Carbohidrato", "Proteína", "Vegetal", "Fruta", "Grasa", "Lácteo", "Otro"
- Ejemplo de definición: "Carbohidrato: Alimentos que son la principal fuente de energía del cuerpo, como el pan y la pasta."
- Ordena los tipos alfabéticamente.
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
    classifications: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        required: ["type", "definition", "items"],
        properties: {
          type: {
            type: Type.STRING,
          },
          definition: {
            type: Type.STRING,
          },
          items: {
            type: Type.ARRAY,
            items: {
              type: Type.STRING,
            },
          },
        },
      },
    },
  },
};
