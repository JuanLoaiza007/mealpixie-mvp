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
} from "@/config/together/feature-labellens";
import {
  SYSTEM_INSTRUCTIONS as GEMINI_SYSTEM_INSTRUCTIONS,
  TASK as GEMINI_TASK,
  RESPONSE_SCHEMA as GEMINI_RESPONSE_SCHEMA,
} from "@/config/gemini/feature-labellens";
import Screen from "@/components/ui/features/common/Screen";
import ImagePreviewCard from "@/components/ui/features/common/ImagePreviewCard";
import { InstructionCard } from "@/components/ui/features/common/InstructionCard";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { NAV_IDS, NAV_TAGS, userNavRoutes } from "@/config/userNavRoutes";
import { PortionCard } from "@/components/ui/features/vision/labellens/PortionCard";
import { NutrientCard } from "@/components/ui/features/vision/labellens/NutrientCard";
import { ActionAnimatedButton } from "@/components/ui/features/common/ActionAnimatedButton";
import { VitaminCard } from "@/components/ui/features/vision/labellens/VitaminCard";
import { IngredientsCard } from "@/components/ui/features/vision/labellens/IngredientsCard";
import { ErrorCard } from "@/components/ui/features/vision/labellens/ErrorCard";

const NUM_VISION_REQUESTS = 3;

/**
 * Analyzes a nutritional label image using OCR and AI to extract and present structured nutritional information.
 *
 * @component
 * @remarks
 * - Uses a vision assistant and Gemini AI to process image text and generate structured nutrition data.
 * - Performs multiple OCR passes (defined by NUM_VISION_REQUESTS) to improve accuracy.
 * - Displays result cards such as nutrients, vitamins, portion, and ingredients using tab navigation.
 * - Handles various UI states including loading, error, and fallback navigation.
 * - Requires `imageUrl` from context and redirects if not present.
 * @returns {JSX.Element} Nutrition label analysis interface with image preview, processing button, and results display.
 * @example
 * // Used as a route/page component for OCR analysis
 * export default function NutritionOCRPage() {
 *   return <NutritionOCRPage />;
 * }
 */
export default function NutritionOCRPage() {
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
    (route) => route.id === NAV_IDS.labelLens
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
   * Performs OCR analysis on an image and generates a structured response using AI.
   *
   * @param {string} imageUrl — The URL of the image to be analyzed (required).
   * @throws {Error} If the image cannot be processed or if generating the final response fails.
   * @returns {Promise<void>} Resolves when the OCR analysis and response generation are complete.
   *
   * @example
   * // Example usage within a React component with a valid imageUrl:
   * analyzeOCR().then(() => {
   *   console.log("OCR and response processing completed.");
   * });
   */
  const analyzeOCR = useCallback(async () => {
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
        `${GEMINI_TASK}\n\nPredicciones OCR:\n` +
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
      <div className="flex flex-col md:flex-row gap-2">
        <section className="flex flex-col gap-2">
          <ImagePreviewCard
            className="w-full sm md:w-60 lg:w-100 gap-0"
            imageUrl={imageUrl}
            alt="Etiqueta Nutricional"
          >
            <ActionAnimatedButton
              onClick={analyzeOCR}
              loading={loading}
              phase={phase}
              total={NUM_VISION_REQUESTS}
              defaultText="Escanear etiqueta"
              visionLoadingText="Extrayendo texto OCR {{phase}}/{{total}}"
              textLoadingText="Analizando contenido nutricional"
            />
          </ImagePreviewCard>
          <InstructionCard functionInfo={functionInfo} />
        </section>
        <section className="flex flex-col gap-2">
          {error && (
            <ErrorCard
              title="Error"
              message={`${error} Asegúrate de que la imagen esté clara y enfocada.`}
            />
          )}

          {finalResult?.isValidLabel && (
            <div className="w-full space-y-4">
              <PortionCard portion={finalResult.portion} />
              <Tabs defaultValue="nutrients" className="w-full">
                <TabsList className="flex flex-wrap gap-2 justify-start">
                  {finalResult?.fields?.length > 0 && (
                    <TabsTrigger value="nutrients">Nutrientes</TabsTrigger>
                  )}
                  {finalResult?.vitaminsAndMinerals?.length > 0 && (
                    <TabsTrigger value="vitamins">Vitaminas</TabsTrigger>
                  )}
                  {finalResult.ingredients && (
                    <TabsTrigger value="ingredients">Ingredientes</TabsTrigger>
                  )}
                </TabsList>

                <TabsContent value="nutrients">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-3">
                    {finalResult.fields?.map((field, index) => (
                      <NutrientCard field={field} key={index} />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="vitamins">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
                    {finalResult.vitaminsAndMinerals?.map((item, index) => (
                      <VitaminCard item={item} key={index} />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="ingredients">
                  <IngredientsCard ingredients={finalResult.ingredients} />
                </TabsContent>
              </Tabs>
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
