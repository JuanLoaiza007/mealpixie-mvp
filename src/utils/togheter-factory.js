import Together from "together-ai";
import {
  API_KEY,
  DEFAULT_MODEL_NAME,
  DEFAULT_TASK,
} from "@/config/together/common";

/**
 * Factory for creating a TogetherAI-based vision assistant.
 *
 * @param {Object} options
 * @param {string} [options.modelName=DEFAULT_MODEL_NAME] - Vision model to use.
 * @param {string} [options.systemInstruction=SYSTEM_INSTRUCTIONS] - System prompt guiding vision analysis.
 * @param {string} [options.task=DEFAULT_TASK] - Default user task description.
 * @returns {Object} Assistant instance with `analyzeImage` method.
 */
export function createVisionAssistant({
  modelName = DEFAULT_MODEL_NAME,
  systemInstruction,
  task = DEFAULT_TASK,
}) {
  if (!API_KEY) {
    throw new Error("Together API key is required.");
  }
  if (!systemInstruction) {
    throw new Error("systemInstruction is required.");
  }

  const client = new Together({ apiKey: API_KEY });

  return {
    /**
     * Analyze a food image and stream back tokens.
     *
     * @async
     * @param {string} imageUrl - Data URL of the image to analyze.
     * @param {string} task - Task description for the model.
     * @returns {AsyncGenerator<string>} Stream of response tokens.
     */
    async analyzeImage(imageUrl, task) {
      const response = await client.chat.completions.create({
        model: modelName,
        stream: true,
        messages: [
          { role: "system", content: systemInstruction.trim() },
          {
            role: "user",
            content: [
              { type: "image_url", image_url: { url: imageUrl } },
              { type: "text", text: task },
            ],
          },
        ],
      });

      // Generator yielding token deltas as they arrive
      async function* tokenStream() {
        for await (const chunk of response) {
          const delta = chunk.choices?.[0]?.delta?.content;
          if (delta) yield delta;
        }
      }

      return tokenStream();
    },
  };
}
