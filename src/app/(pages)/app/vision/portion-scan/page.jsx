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
} from "@/config/together/feature-portion-scan";
import {
  SYSTEM_INSTRUCTIONS as GEMINI_SYSTEM_INSTRUCTIONS,
  TASK as GEMINI_TASK,
  RESPONSE_SCHEMA as GEMINI_RESPONSE_SCHEMA,
} from "@/config/gemini/feature-portion-scan";
import Screen from "@/components/ui/features/common/Screen";
import ImagePreviewCard from "@/components/ui/features/common/ImagePreviewCard";
import { InstructionCard } from "@/components/ui/features/common/InstructionCard";
import { NAV_IDS, NAV_TAGS, userNavRoutes } from "@/config/userNavRoutes";
import { PortionResultCard } from "@/components/ui/features/vision/portion-scan/PortionResultCard";
import { ActionAnimatedButton } from "@/components/ui/features/common/ActionAnimatedButton";

const NUM_VISION_REQUESTS = 3;

/**
 * Analyzes a nutrition label image to extract and summarize portion-related information.
 *
 * @component
 *
 * @param {Object} props - Component props (none required directly).
 *
 * @remarks
 * - Uses `useEffect` to manage image presence and top bar title on mount.
 * - Leverages a vision assistant (Together AI) for image analysis, and Gemini for final result summarization.
 * - Invokes asynchronous streams and JSON parsing with potential UI state updates.
 * - Redirects if no image is available, and provides visual feedback during processing.
 *
 * @returns {JSX.Element} The rendered UI with image preview, action button, instructions, and results or error messages.
 *
 * @example
 * // Usage within a parent route where `useImage()` provides a valid `imageUrl`:
 * <PortionScan />
 */
export default function PortionScan() {
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
    (route) => route.id === NAV_IDS.portionScan
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

  /**
   * Analyzes a scanned image of portions using a vision model and processes the results with a text model.
   *
   * @async
   * @function
   * @returns {Promise<void>} A promise that resolves when the analysis is complete.
   * @throws {Error} Throws an error if the image processing or final response generation fails.
   *
   * @example
   * // Will start processing the image when imageUrl is defined:
   * await analyzePortionScan();
   */
  const analyzePortionScan = useCallback(async () => {
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
        `${GEMINI_TASK}\n\nPredicciones Portion Scan:\n` +
        preds.map((p, i) => `- OCR ${i + 1}:\n${p}`).join("\n\n");

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
      <div className="flex flex-col md:flex-row gap-2 w-full">
        <section className="flex flex-col gap-2">
          <ImagePreviewCard
            className="w-full sm md:w-60 lg:w-100 gap-0"
            imageUrl={imageUrl}
            alt="Etiqueta Nutricional"
          >
            <ActionAnimatedButton
              onClick={analyzePortionScan}
              loading={loading}
              phase={phase}
              total={NUM_VISION_REQUESTS}
              defaultText="Escanear porciones"
              visionLoadingText="Extrayendo porciones {{phase}}/{{total}}"
              textLoadingText="Analizando contenido de porciones"
            />
          </ImagePreviewCard>
          <InstructionCard functionInfo={functionInfo} />
        </section>
        <section className="flex flex-col gap-2 w-full">
          {error && (
            <ErrorCard
              title="Error"
              message={`${error} Asegúrate de que la imagen esté clara y enfocada.`}
            />
          )}

          {finalResult?.hasCountableItems && (
            <div className="w-full grid gap-4 grid-cols-1 sm:grid-cols-2">
              {finalResult?.items.map((item, index) => (
                <PortionResultCard key={index} item={item} />
              ))}
            </div>
          )}

          {!finalResult?.isValidLabel && finalResult?.reasoning && (
            <ErrorCard
              title="No se pudo interpretar la etiqueta"
              message={finalResult.reasoning}
            />
          )}
        </section>
      </div>
    </Screen>
  );
}
