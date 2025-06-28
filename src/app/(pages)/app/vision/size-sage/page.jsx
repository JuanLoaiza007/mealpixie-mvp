// app/features/vision/size-sage/page.jsx
"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useImage } from "@/context/image";
import { useMobileTopBar } from "@/context/mobileTopBar";
import { createVisionAssistant } from "@/utils/togheter-factory";
import { generateWithGemini } from "@/utils/gemini-factory";

import {
  SYSTEM_INSTRUCTIONS as TOGETHER_SYSTEM_INSTRUCTIONS,
  TASK as TOGETHER_TASK,
} from "@/config/together/feature-sizesage";
import {
  SYSTEM_INSTRUCTIONS as GEMINI_SYSTEM_INSTRUCTIONS,
  TASK as GEMINI_TASK,
  RESPONSE_SCHEMA as GEMINI_RESPONSE_SCHEMA,
} from "@/config/gemini/feature-sizesage";

import Screen from "@/components/ui/features/common/Screen";
import ImagePreviewCard from "@/components/ui/features/common/ImagePreviewCard";
import { ActionAnimatedButton } from "@/components/ui/features/common/ActionAnimatedButton";
import { InstructionCard } from "@/components/ui/features/common/InstructionCard";
import { PredictionCard } from "@/components/ui/features/common/PredictionCard";
import { SizeSageMessageCard } from "@/components/ui/features/vision/size-sage/SizeSageMessageCard";
import { SizeSageResultsList } from "@/components/ui/features/vision/size-sage/SizeSageResultsList";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import { NAV_TAGS, NAV_IDS, userNavRoutes } from "@/config/userNavRoutes";

const NUM_VISION_REQUESTS = 5;

/**
 * Renders the SizeSagePage, which allows users to analyze an uploaded image and receive size-related predictions and recommendations using AI models.
 *
 * @component
 *
 * @remarks
 * - Uses `useEffect` to redirect if no image is loaded and to initialize a vision assistant on mount.
 * - Employs `useCallback` to handle the asynchronous image analysis logic.
 * - Makes multiple vision requests and then summarizes the output using Gemini.
 * - Relies on several custom context providers: `useImage` and `useMobileTopBar`.
 *
 * @returns {JSX.Element} A screen containing image preview, analysis controls, and results or error messages.
 *
 * @example
 * // Usage within a Next.js route
 * import SizeSagePage from '@/app/features/vision/size-sage/page';
 *
 * export default function PageWrapper() {
 *   return <SizeSagePage />;
 * }
 */
export default function SizeSagePage() {
  const { imageUrl } = useImage();
  const router = useRouter();
  const { setTitle } = useMobileTopBar();
  const visionAssistant = useRef(null);

  const [visionOutputs, setVisionOutputs] = useState([]); // predicciones crudas
  const [analysisPhase, setAnalysisPhase] = useState(0);
  const [finalResult, setFinalResult] = useState(null);
  const [loading, setLoading] = useState({ vision: false, text: false });
  const [error, setError] = useState(null);
  const [showPredictions, setShowPredictions] = useState(false);

  const functionInfo = userNavRoutes.find(
    (route) => route.id === NAV_IDS.sizeSage
  );

  // Redirigir si no hay una imagen cargada
  useEffect(() => {
    if (!imageUrl) {
      const dest = userNavRoutes.find((r) =>
        r.tags.includes(NAV_TAGS.mainPage)
      );
      router.push(dest.href);
    }
  }, [imageUrl, router]);

  // Configurar título y crear el “assistant”
  useEffect(() => {
    setTitle(functionInfo.label);
    visionAssistant.current = createVisionAssistant({
      systemInstruction: TOGETHER_SYSTEM_INSTRUCTIONS,
    });
  }, [setTitle]);

  /**
   * Analyzes an image using a vision assistant and refines the results with Gemini AI.
   *
   * @param {void} — This function does not take any parameters directly but relies on external state like `imageUrl`.
   * @returns {Promise<void>} Resolves when the analysis and response parsing are complete.
   * @throws {Error} Throws if the vision analysis or Gemini processing fails.
   *
   * @example
   * // Inside a React component with valid `imageUrl` and refs/state initialized:
   * analyzeImage();
   */
  const analyzeImage = useCallback(async () => {
    if (!imageUrl) return;

    setError(null);
    setVisionOutputs([]);
    setFinalResult(null);
    setShowPredictions(false);
    setLoading({ vision: true, text: false });
    setAnalysisPhase(1);

    // 1) Ejecutar las peticiones de visión
    const preds = [];
    for (let i = 0; i < NUM_VISION_REQUESTS; i++) {
      try {
        let text = "";
        const stream = await visionAssistant.current.analyzeImage(
          imageUrl,
          TOGETHER_TASK
        );
        for await (const part of stream) {
          text += part;
        }
        preds.push(text);
        setVisionOutputs((prev) => [...prev, text]);
      } catch {
        setError("Error durante el análisis de imagen.");
        setLoading({ vision: false, text: false });
        return;
      }
      setAnalysisPhase(i + 2);

      // (Opcional) delay entre peticiones de visión:
      // if (i < NUM_VISION_REQUESTS - 1) {
      //   await new Promise((resolve) => setTimeout(resolve, 500));
      // }
    }

    // 2) Enviar a Gemini
    setLoading({ vision: false, text: true });
    try {
      const combined =
        `${GEMINI_TASK}\n\nPredicciones:\n` +
        preds.map((p, idx) => `- Predicción ${idx + 1}:\n${p}`).join("\n\n");

      const jsonResponse = await generateWithGemini({
        systemInstruction: GEMINI_SYSTEM_INSTRUCTIONS,
        task: combined,
        responseSchema: GEMINI_RESPONSE_SCHEMA,
        history: [],
      });

      // Intentamos parsear; si falla, mostramos mensaje de error
      let parsed;
      try {
        parsed = JSON.parse(jsonResponse);
        console.log("Parsed SizeSage response:", parsed);
        setFinalResult(parsed);
      } catch (parseErr) {
        console.error("JSON.parse falló:", parseErr);
        console.warn("Respuesta cruda de Gemini:", jsonResponse);
        setError(
          "La respuesta de Gemini no es un JSON válido. Revisa la consola."
        );
      }
    } catch (geminiErr) {
      console.error("Error en el bloque de Gemini:", geminiErr);
      const is429 =
        geminiErr?.status === 429 || geminiErr?.message?.includes("429");
      if (is429) {
        setError(
          "Has excedido el límite de solicitudes. Espera unos segundos e inténtalo de nuevo."
        );
      } else {
        setError("Error generando respuesta final.");
      }
    } finally {
      setLoading((prev) => ({ ...prev, text: false }));
    }
  }, [imageUrl]);

  const togglePreds = () => setShowPredictions((v) => !v);

  if (!imageUrl) return null;

  return (
    <Screen inPageTitle={functionInfo.label}>
      <div className="flex flex-col md:flex-row gap-2">
        {/* ============================= */}
        {/* Columna IZQUIERDA: Imagen + botón + Instruction/Prediction */}
        {/* ============================= */}
        <section className="flex flex-col gap-2">
          <ImagePreviewCard imageUrl={imageUrl} alt="SizeSage Image">
            <ActionAnimatedButton
              onClick={analyzeImage}
              loading={loading}
              phase={analysisPhase}
              total={NUM_VISION_REQUESTS}
              defaultText="Estimar tamaño"
              visionLoadingText="Generando hipótesis de tamaño {{phase}}/{{total}}"
              textLoadingText="Generando respuesta final"
            />
          </ImagePreviewCard>

          <InstructionCard functionInfo={functionInfo} />
        </section>

        {/* ============================= */}
        {/* Columna DERECHA: Resultados o mensaje */}
        {/* ============================= */}
        <section className="flex flex-col gap-2">
          {error && (
            <Card>
              <CardHeader>
                <CardTitle>Error</CardTitle>
              </CardHeader>
              <CardContent>{error}</CardContent>
            </Card>
          )}

          {finalResult ? (
            finalResult.isEstimationAvailable ? (
              // Mostrar lista de resultados cuando isEstimationAvailable = true
              <SizeSageResultsList results={finalResult.results} />
            ) : (
              // Mostrar mensaje cuando isEstimationAvailable = false
              <>
                <SizeSageMessageCard message={finalResult.message} />
                {/* Si el usuario clicó “Ver predicciones crudas”, mostrar text adicional */}
                {showPredictions && (
                  <p className="text-xs text-gray-500 mt-2">
                    {finalResult.message}
                  </p>
                )}
              </>
            )
          ) : null}
        </section>
      </div>
    </Screen>
  );
}
