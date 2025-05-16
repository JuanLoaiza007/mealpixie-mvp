import {
  API_KEY,
  DEFAULT_GENERATION_CONFIG,
  DEFAULT_MODEL_NAME,
} from "@/config/gemini/common";
import { GoogleGenAI } from "@google/genai";

// Initialize the Gem in a client with your API key
const genAI = new GoogleGenAI({
  apiKey: API_KEY,
});

/**
 * Generic factory to interact with Google Gemini models.
 *
 * @param {Object} params
 * @param {string} params.modelName - Name of the Gem ina model to use (e.g., "gemini-2.0-flash").
 * @param {string} params.systemInstruction - System-level instruction for the model.
 * @param {string} params.task - User prompt or task description.
 * @param {Array<{ role: string, text: string }>} [params.history=[]] - Conversation history.
 * @param {Object} [params.generationConfig={}] - Additional generation settings (e.g., temperature, maxTokens).
 * @param {Object} params.responseSchema - JSON-schema for validating the response.
 *
 * @returns {Promise<string>} Streamed model output as a string.
 */
export async function generateWithGemini({
  modelName = DEFAULT_MODEL_NAME,
  systemInstruction,
  task,
  history = [],
  generationConfig = DEFAULT_GENERATION_CONFIG,
  responseSchema,
}) {
  // Build default config, then merge overrides
  const config = {
    responseMimeType: "application/json",
    responseSchema,
    systemInstruction: [{ text: systemInstruction }],
    ...generationConfig,
  };

  // Construct the message sequence
  const contents = [];

  // Append any prior conversation
  for (const msg of history) {
    contents.push({
      role: msg.role,
      parts: [{ text: msg.text }],
    });
  }

  // User task/message
  contents.push({
    role: "user",
    parts: [{ text: task }],
  });

  // Call the streaming API
  const stream = await genAI.models.generateContentStream({
    model: modelName,
    config,
    contents,
  });

  // Aggregate streamed chunks
  let result = "";
  for await (const chunk of stream) {
    result += chunk.text;
  }

  return result;
}
