// app/features/vision/fresh-sense/page.jsx
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
} from "@/config/together/feature-freshsense";
import {
  SYSTEM_INSTRUCTIONS as GEMINI_SYSTEM_INSTRUCTIONS,
  TASK as GEMINI_TASK,
  RESPONSE_SCHEMA as GEMINI_RESPONSE_SCHEMA,
} from "@/config/gemini/feature-freshsense";
import Screen from "@/components/ui/features/common/Screen";
import ImagePreviewCard from "@/components/ui/features/common/ImagePreviewCard";
import { FreshSenseButton } from "@/components/ui/features/vision/fresh-sense/FreshSenseButton";
import { InstructionCard } from "@/components/ui/features/common/InstructionCard";
import { PredictionCard } from "@/components/ui/features/common/PredictionCard";
import { FreshSenseResultsList } from "@/components/ui/features/vision/fresh-sense/FreshSenseResultsList";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { NAV_TAGS, NAV_IDS, userNavRoutes } from "@/config/userNavRoutes";

const NUM_VISION_REQUESTS = 6;

/**
 * Renders the FreshSensePage component, which manages the image analysis workflow and displays results.
 *
 * @component
 *
 * @remarks
 * - Uses `useImage` context to retrieve the current image URL.
 * - Redirects to the main page if no image URL is available.
 * - Sets the mobile top bar title using `useMobileTopBar`.
 * - Initializes a vision assistant via `createVisionAssistant` when the component mounts.
 * - Manages multiple analysis phases and handles asynchronous image analysis requests with a `useCallback` hook.
 * - On analysis completion, sends combined predictions to Gemini for final result generation.
 *
 * @returns {JSX.Element} The layout containing image preview, analysis button, instruction or prediction cards, and results.
 *
 * @example
 * ```jsx
 * import FreshSensePage from "@/app/features/vision/fresh-sense/page";
 *
 * function App() {
 *   return (
 *     <div>
 *       <FreshSensePage />
 *     </div>
 *   );
 * }
 * ```
 */
export default function FreshSensePage() {
  const { imageUrl } = useImage();
  const router = useRouter();
  const { setTitle } = useMobileTopBar();
  const visionAssistant = useRef(null);

  const [visionOutputs, setVisionOutputs] = useState([]);
  const [analysisPhase, setAnalysisPhase] = useState(0);
  const [finalResult, setFinalResult] = useState(null);
  const [loading, setLoading] = useState({ vision: false, text: false });
  const [error, setError] = useState(null);
  const [showPredictions, setShowPredictions] = useState(false);

  const functionInfo = userNavRoutes.find(
    (route) => route.id === NAV_IDS.freshSense
  );

  useEffect(() => {
    if (!imageUrl) {
      const dest = userNavRoutes.find((r) => r.tags.includes(NAV_TAGS.mainPage));
      router.push(dest.href);
    }
  }, [imageUrl, router]);

  useEffect(() => {
    setTitle(functionInfo.label);
    visionAssistant.current = createVisionAssistant({
      systemInstruction: TOGETHER_SYSTEM_INSTRUCTIONS,
    });
  }, [setTitle]);

  /**
 * Performs asynchronous image analysis by sending multiple requests to a vision assistant and aggregating results with Gemini, updating component state accordingly.
 *
 * @returns {Promise<void>} A promise that resolves when analysis and state updates are complete.
 *
 * @example
 * // Within a React component using hooks and context:
 * import React from "react";
 * function ExampleComponent() {
 *   // assume analyzeImage, loading, and other state setters are defined
 *   return (
 *     <button onClick={async () => { await analyzeImage(); }}>
 *       Analyze Image
 *     </button>
 *   );
 * }
 */
const analyzeImage = useCallback(async () => {
    if (!imageUrl) return;
    setError(null);
    setVisionOutputs([]);
    setFinalResult(null);
    setShowPredictions(false);
    setLoading({ vision: true, text: false });
    setAnalysisPhase(1);

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
        setVisionOutputs((prev) => [...prev, text]);
      } catch {
        setError("Error durante el análisis de imagen.");
        setLoading({ vision: false, text: false });
        return;
      }
      setAnalysisPhase(i + 2);
    }

    setLoading({ vision: false, text: true });
    try {
      const combined =
        `${GEMINI_TASK}\n\nPredicciones:\n` +
        preds.map((p, i) => `- Predicción ${i + 1}:\n${p}`).join("\n\n");
      const jsonResponse = await generateWithGemini({
        systemInstruction: GEMINI_SYSTEM_INSTRUCTIONS,
        task: combined,
        responseSchema: GEMINI_RESPONSE_SCHEMA,
        history: [],
      });
      setFinalResult(JSON.parse(jsonResponse));
    } catch {
      setError("Error generando respuesta final.");
    } finally {
      setLoading((prev) => ({ ...prev, text: false }));
    }
  }, [imageUrl]);


  const togglePreds = () => setShowPredictions((v) => !v);

  if (!imageUrl) {
    return null;
  }

  return (
    <Screen inPageTitle={functionInfo.label}>
      <div className="flex flex-col md:flex-row gap-2">
        {/* Sección izquierda: imagen, botón, InstructionCard + PredictionCard */}
        <section className="flex flex-col gap-2">
          <ImagePreviewCard imageUrl={imageUrl} alt="Fresh Sense Image">
            <FreshSenseButton
              onClick={analyzeImage}
              loading={loading}
              phase={analysisPhase}
              total={NUM_VISION_REQUESTS}
            />
          </ImagePreviewCard>

          {!finalResult ? (
            <InstructionCard functionInfo={functionInfo} />
          ) : (
            <PredictionCard
              finalResult={finalResult}
              showPredictions={showPredictions}
              toggle={togglePreds}
              visionOutputs={visionOutputs}
            />
          )}
        </section>

        {/* Sección derecha: resultados procesados o razonamiento */}
        <section className="flex flex-col gap-2">
          {error && (
            <Card>
              <CardHeader>
                <CardTitle>Error</CardTitle>
              </CardHeader>
              <CardContent>{error}</CardContent>
            </Card>
          )}

          {finalResult && finalResult.isFreshnessDetected && (
            <FreshSenseResultsList results={finalResult.results} />
          )}

          {!finalResult?.isFreshnessDetected && showPredictions && (
            <p className="text-xs text-gray-500">{finalResult?.reasoning}</p>
          )}
        </section>
      </div>
    </Screen>
  );
}
