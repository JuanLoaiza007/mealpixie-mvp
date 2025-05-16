import { Type } from "@google/genai";

export const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

export const DEFAULT_MODEL_NAME = "gemini-2.0-flash";

export const DEFAULT_GENERATION_CONFIG = {
  temperature: 0.2,
  topP: 1.0,
  topK: 40,
  maxOutputTokens: 1024,
};
