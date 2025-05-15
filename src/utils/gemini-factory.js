import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  API_KEY,
  DEFAULT_MODEL_NAME,
  DEFAULT_GENERATION_CONFIG,
} from "@/config/gemini/common";

/**
 * Factory function to create a Gemini-based assistant.
 *
 * @param {Object} options - Assistant configuration options.
 * @param {string} [options.modelName=DEFAULT_MODEL_NAME] - Name of the Gemini model to use.
 * @param {string} options.systemInstruction - Prompt to guide the assistant's behavior.
 * @param {Object} [options.generationConfig=DEFAULT_GENERATION_CONFIG] - Generation parameters.
 * @returns {Object} An assistant instance with a `chat` method.
 */
export function createGeminiAssistant({
  modelName = DEFAULT_MODEL_NAME,
  systemInstruction,
  generationConfig = DEFAULT_GENERATION_CONFIG,
}) {
  if (!API_KEY) {
    throw new Error("Gemini API key is required.");
  }

  if (!systemInstruction) {
    throw new Error("systemInstruction is required.");
  }

  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({
    model: modelName,
    systemInstruction: systemInstruction.trim(),
  });

  return {
    /**
     * Sends a message to the Gemini assistant and returns its response.
     *
     * @async
     * @param {Array<{ sender: string, text: string }>} history - Previous chat messages.
     * @param {string} userMessage - The user's input message.
     * @returns {Promise<string>} Assistant's reply.
     */
    async chat(history = [], userMessage) {
      try {
        const session = model.startChat({
          generationConfig,
          history: history.map((message) => ({
            author: message.sender,
            content: message.text,
          })),
        });

        const result = await session.sendMessage(userMessage);
        return result.response.text();
      } catch (error) {
        console.error("GeminiAssistant.chat error:", error);
        throw new Error("Failed to communicate with Gemini.");
      }
    },
  };
}
