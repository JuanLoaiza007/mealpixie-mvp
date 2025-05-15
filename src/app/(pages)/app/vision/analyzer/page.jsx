"use client";

import { useImage } from "@/context/image";
import { useState, useEffect, useRef, useCallback } from "react";
import { createVisionAssistant } from "@/utils/togheter-factory";
import {
  SYSTEM_INSTRUCTIONS as TOGETHER_SYSTEM_INSTRUCTIONS,
  TASK as TOGETHER_TASK,
} from "@/config/togheter/feature-analyzer";
import { createGeminiAssistant } from "@/utils/gemini-factory";
import {
  SYSTEM_INSTRUCTIONS as GEMINI_SYSTEM_INSTRUCTIONS,
  TASK as GEMINI_TASK,
} from "@/config/gemini/feature-analyzer";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Loader2, ChevronDown, ChevronUp } from "lucide-react";

const NUM_TOGETHER_REQUESTS = 3;

export default function AnalyzerPage() {
  const { imageUrl } = useImage();
  const [results, setResults] = useState({ together: [], gemini: "" });
  const [loading, setLoading] = useState({ together: false, gemini: false });
  const [errors, setErrors] = useState({ together: null, gemini: null });
  const assistants = useRef({ together: null, gemini: null });
  const [phase, setPhase] = useState(0);
  const [showReasoning, setShowReasoning] = useState(false);
  const analysisMessage = loading.together
    ? `Analizando con modelo de visión (${phase}/${NUM_TOGETHER_REQUESTS})...`
    : loading.gemini
    ? "Preparando respuesta..."
    : "";

  useEffect(() => {
    assistants.current.together = createVisionAssistant({
      systemInstruction: TOGETHER_SYSTEM_INSTRUCTIONS,
    });
    assistants.current.gemini = createGeminiAssistant({
      systemInstruction: GEMINI_SYSTEM_INSTRUCTIONS,
    });
  }, []);

  const analyzeImage = useCallback(async () => {
    if (!imageUrl || loading.together || loading.gemini) return;

    setResults({ together: [], gemini: "" });
    setLoading({ together: true, gemini: false });
    setErrors({ together: null, gemini: null });
    setShowReasoning(false);
    setPhase(1);

    const togetherResponses = [];
    for (let i = 0; i < NUM_TOGETHER_REQUESTS; i++) {
      try {
        let fullResponse = "";
        const stream = await assistants.current.together.analyzeImage(
          imageUrl,
          TOGETHER_TASK
        );
        for await (const token of stream) {
          fullResponse += token;
        }
        togetherResponses.push(fullResponse);
        setPhase(i + 2);
        setResults((prev) => ({
          ...prev,
          together: [...prev.together, fullResponse],
        }));
      } catch (error) {
        console.error("TogetherAI Error:", error);
        setErrors((prev) => ({ ...prev, together: "Error al analizar." }));
        setLoading({ together: false, gemini: false });
        return;
      }
    }

    setLoading((prev) => ({ ...prev, together: false, gemini: true }));
    try {
      const geminiInput = `${GEMINI_TASK}\n\nPredicciones:\n${togetherResponses
        .map((res, index) => `- Predicción ${index + 1}:\n${res}`)
        .join("\n\n")}`;
      const geminiResponse = await assistants.current.gemini.chat(
        [],
        geminiInput
      );
      setResults((prev) => ({ ...prev, gemini: geminiResponse }));
    } catch (error) {
      console.error("Gemini Error:", error);
      setErrors((prev) => ({ ...prev, gemini: "Error al generar respuesta." }));
    } finally {
      setLoading((prev) => ({ ...prev, gemini: false }));
    }
  }, [imageUrl]);

  return (
    <main className="flex flex-col gap-2">
      <h1 className="text-2xl font-bold">Analyzer</h1>
      {imageUrl ? (
        <div className="flex flex-col md:flex-row gap-4 items-start">
          <div className="flex flex-col items-center">
            <div className="w-full md:w-100 md:h-100 overflow-hidden rounded-lg shadow-md">
              <img
                src={imageUrl}
                alt="Analysis Image"
                className="fit-contain"
              />
            </div>
            <button
              onClick={analyzeImage}
              className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              disabled={loading.together || loading.gemini}
            >
              Analizar
            </button>
            {errors.together && (
              <p className="mt-1 text-sm text-red-500">{errors.together}</p>
            )}
          </div>

          <div className="flex-1 border rounded-md p-4 h-full w-full">
            {analysisMessage && (
              <p
                className={`mt-1 text-sm text-gray-700 ${
                  loading.together || loading.gemini ? "animate-pulse" : ""
                }`}
              >
                {analysisMessage}
              </p>
            )}
            {loading.gemini ? (
              <div className="flex items-center gap-2">
                <Loader2 className="animate-spin w-5 h-5" />
                Generando...
              </div>
            ) : results.gemini ? (
              <div className="space-y-2 text-sm">
                {results.together.length > 0 && (
                  <button
                    className="text-blue-500 hover:underline text-xs flex items-center gap-1"
                    onClick={() => setShowReasoning(!showReasoning)}
                  >
                    {showReasoning ? (
                      <>
                        Mostrar Razonamiento <ChevronUp className="w-4 h-4" />
                      </>
                    ) : (
                      <>
                        Mostrar Razonamiento <ChevronDown className="w-4 h-4" />
                      </>
                    )}
                  </button>
                )}
                {showReasoning && (
                  <div className="border rounded-md p-2 bg-gray-50 text-xs text-gray-600 max-h-80 overflow-y-auto">
                    <h3 className="font-semibold mb-1">Razonamiento:</h3>
                    <Markdown remarkPlugins={[remarkGfm]}>
                      {results.together.join("\n\n")}
                    </Markdown>
                  </div>
                )}
                <Markdown remarkPlugins={[remarkGfm]}>
                  {results.gemini}
                </Markdown>
              </div>
            ) : (
              <p className="text-gray-600">Esperando análisis...</p>
            )}
            {errors.gemini && (
              <p className="mt-2 text-sm text-red-500">{errors.gemini}</p>
            )}
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-600 mb-4">No image selected yet.</p>
      )}
    </main>
  );
}
