"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useImage } from "@/context/image";
import { useRouter } from "next/navigation";
import { useMobileTopBar } from "@/context/mobileTopBar";
import { createVisionAssistant } from "@/utils/togheter-factory";
import { generateWithGemini } from "@/utils/gemini-factory";
import {
  SYSTEM_INSTRUCTIONS as TOGETHER_SYSTEM_INSTRUCTIONS,
  TASK as TOGETHER_TASK,
} from "@/config/together/feature-pricepeek";
import {
  SYSTEM_INSTRUCTIONS as GEMINI_SYSTEM_INSTRUCTIONS,
  TASK as GEMINI_TASK,
  RESPONSE_SCHEMA as GEMINI_RESPONSE_SCHEMA,
} from "@/config/gemini/feature-pricepeek";
import Screen from "@/components/ui/features/common/Screen";
import ImagePreviewCard from "@/components/ui/features/common/ImagePreviewCard";
import { InstructionCard } from "@/components/ui/features/common/InstructionCard";
import { NAV_IDS, NAV_TAGS, userNavRoutes } from "@/config/userNavRoutes";


import { PriceCard } from "@/components/ui/features/vision/price-peek/PriceCard";
import { TotalPriceCard } from "@/components/ui/features/vision/price-peek/TotalPriceCard";
import { AnalyzeButton } from "@/components/ui/features/vision/analyzer/AnalyzeButton";
import { ErrorCard } from "@/components/ui/features/vision/labellens/ErrorCard";

const NUM_VISION_REQUESTS = 3;

/**
 * Displays the Price Peek feature page, allowing users to analyze an image and extract food pricing data.
 *
 * @component
 *
 * @remarks
 * - Uses `useImage` to access the uploaded image URL.
 * - Integrates a vision assistant (from Together AI) to process the image and extract textual predictions.
 * - Uses the Gemini API to summarize and validate predictions against a response schema.
 * - Employs `useMobileTopBar` to dynamically set the top bar title based on the feature context.
 * - Navigates back to the main page if no image is provided.
 * - Animates transitions between phases and shows different UI states based on processing results.
 *
 * @returns {JSX.Element} A fully interactive screen that displays image preview, instructions, analysis controls, and price results.
 *
 * @example
 * // Rendered as part of a Next.js route, no props needed:
 * <PricePeekPage />
 */
export default function PricePeekPage() {
  const { imageUrl } = useImage();
  const router = useRouter();
  const { setTitle } = useMobileTopBar();
  const visionAssistant = useRef(null);

  const [outputs, setOutputs] = useState([]);
  const [phase, setPhase] = useState(0);
  const [finalResult, setFinalResult] = useState(null);
  const [loading, setLoading] = useState({ vision: false, text: false });
  const [error, setError] = useState(null);

  const functionInfo = userNavRoutes.find(
    (route) => route.id === NAV_IDS.pricePeek
  );

  useEffect(() => {
    if (!imageUrl) {
      const fallback = userNavRoutes.find((r) =>
        r.tags.includes(NAV_TAGS.mainPage)
      );
      router.push(fallback.href);
    }
  }, [imageUrl, router]);

  useEffect(() => {
    setTitle(functionInfo.label);
    visionAssistant.current = createVisionAssistant({
      systemInstruction: TOGETHER_SYSTEM_INSTRUCTIONS,
    });
  }, [setTitle]);

  const analyze = useCallback(async () => {
    if (!imageUrl) return;
    setError(null);
    setOutputs([]);
    setFinalResult(null);
    setLoading({ vision: true, text: false });
    setPhase(1);

    const preds = [];
    for (let i = 0; i < NUM_VISION_REQUESTS; i++) {
      try {
        let text = "";
        const stream = await visionAssistant.current.analyzeImage(
          imageUrl,
          TOGETHER_TASK
        );
        for await (const part of stream) text += part;
        preds.push(text);
        setOutputs((prev) => [...prev, text]);
      } catch {
        setError("No se pudo procesar la imagen.");
        setLoading({ vision: false, text: false });
        return;
      }
      setPhase(i + 2);
    }

    setLoading({ vision: false, text: true });
    try {
      const formattedInput =
        `${GEMINI_TASK}\n\nPredicciones:\n` +
        preds.map((p, i) => `- ${i + 1}:\n${p}`).join("\n\n");

      const jsonResponse = await generateWithGemini({
        systemInstruction: GEMINI_SYSTEM_INSTRUCTIONS,
        task: formattedInput,
        responseSchema: GEMINI_RESPONSE_SCHEMA,
        history: [],
      });

      console.log("Respuesta de Gemini:", jsonResponse);
      setFinalResult(JSON.parse(jsonResponse));
    } catch {
      setError("Error generando respuesta final.");
    } finally {
      setLoading((prev) => ({ ...prev, text: false }));
    }
  }, [imageUrl]);

  if (!imageUrl) return null;

  return (
    <Screen inPageTitle={functionInfo.label}>
      <div className="flex flex-col md:flex-row gap-2">
        <section className="flex flex-col gap-2">
          <ImagePreviewCard
            className="w-full sm md:w-60 lg:w-100 gap-0"
            imageUrl={imageUrl}
            alt="Etiqueta Nutricional"
          >
            <AnalyzeButton
              onClick={analyze}
              loading={loading}
              phase={phase}
              total={NUM_VISION_REQUESTS}
            />
          </ImagePreviewCard>
          <InstructionCard functionInfo={functionInfo} />
        </section>
        <section className="flex flex-col gap-2">
          {error && (
            <ErrorCard title="Error" message={`${error} Asegúrate de que la imagen esté clara y enfocada.`} />
          )}

          {finalResult?.isValidLabel && (
            <div className="w-full space-y-4">
              {finalResult.multipleFoods && (
                <TotalPriceCard total={finalResult.totalPrice} />
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-3">
                {finalResult.foods?.map((food, index) => (
                  <PriceCard field={food} key={index} />
                ))}
              </div>
            </div>
          )}

          {!finalResult?.isValidLabel && finalResult?.reasoning && (
            <ErrorCard title="No se pudo interpretar la etiqueta" message={finalResult.reasoning} />
          )}
        </section>
      </div>
    </Screen>
  );
}
