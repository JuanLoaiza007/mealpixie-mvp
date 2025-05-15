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
import AiResponseCard from "@/components/ui/features/vision/AiResponseCard";
import ImagePreviewCard from "@/components/ui/features/common/ImagePreviewCard";
import { print_error, print_log } from "@/utils/development";
import { useSetMobileTopBarTitle } from "@/context/mobileTopBar";
import Screen from "@/components/ui/features/common/Screen";

const NUM_TOGETHER_REQUESTS = 3;

export default function AnalyzerPage() {
  const { imageUrl } = useImage();
  const setTitle = useSetMobileTopBarTitle();
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
    // Initialize topbar title for mobile
    setTitle("Analyzer");
    print_log("Topbar title set to 'Analyzer'");

    // Create assistants
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
        print_error("TogetherAI Error:", error);
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
      print_error("Gemini Error:", error);
      setErrors((prev) => ({ ...prev, gemini: "Error al generar respuesta." }));
    } finally {
      setLoading((prev) => ({ ...prev, gemini: false }));
    }
  }, [imageUrl]);

  const toggleReasoning = useCallback(() => {
    setShowReasoning((prev) => !prev);
  }, []);

  return (
    // Screen component is mandatory for vision functionalities
    <Screen inPageTitle="Analyzer">
      {imageUrl ? (
        <>
          <div className="flex flex-1 flex-col items-center">
            <ImagePreviewCard imageUrl={imageUrl} alt="Analysis Image" />
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
          <AiResponseCard
            className="w-full lg:w-2/3"
            isLoadingVision={loading.together}
            isLoadingText={loading.gemini}
            visionAnalysisMessage={analysisMessage}
            reasoningText={results.together.join("\n\n")}
            finalResponseText={results.gemini}
            showReasoning={showReasoning}
            onToggleReasoning={toggleReasoning}
            responseTextError={errors.gemini}
          />
        </>
      ) : (
        <p className="text-center text-gray-600 mb-4">No image selected yet.</p>
      )}
    </Screen>
  );
}
