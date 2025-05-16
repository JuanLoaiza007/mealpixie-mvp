"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useImage } from "@/context/image";
import { useMobileTopBar } from "@/context/mobileTopBar";
import { createVisionAssistant } from "@/utils/togheter-factory";
import { generateWithGemini } from "@/utils/gemini-factory";
import {
  SYSTEM_INSTRUCTIONS as TOGETHER_SYSTEM_INSTRUCTIONS,
  TASK as TOGETHER_TASK,
} from "@/config/togheter/feature-analyzer";
import {
  SYSTEM_INSTRUCTIONS as GEMINI_SYSTEM_INSTRUCTIONS,
  TASK as GEMINI_TASK,
  RESPONSE_SCHEMA as GEMINI_RESPONSE_SCHEMA,
} from "@/config/gemini/feature-analyzer";
import Screen from "@/components/ui/features/common/Screen";
import ImagePreviewCard from "@/components/ui/features/common/ImagePreviewCard";
import { AnalyzeButton } from "@/components/ui/features/vision/analyzer/AnalyzeButton";
import { InstructionCard } from "@/components/ui/features/vision/analyzer/InstructionCard";
import { PredictionCard } from "@/components/ui/features/vision/analyzer/PredictionCard";
import { DetailSection } from "@/components/ui/features/vision/analyzer/DetailSection";
import { NutritionSection } from "@/components/ui/features/vision/analyzer/NutritionSection";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const NUM_VISION_REQUESTS = 3;

export default function AnalyzerPage() {
  const { imageUrl } = useImage();
  const { setTitle } = useMobileTopBar();
  const visionAssistant = useRef(null);

  const [visionOutputs, setVisionOutputs] = useState([]);
  const [analysisPhase, setAnalysisPhase] = useState(0);
  const [finalResult, setFinalResult] = useState(null);
  const [loading, setLoading] = useState({ vision: false, text: false });
  const [error, setError] = useState(null);
  const [showPredictions, setShowPredictions] = useState(false);

  useEffect(() => {
    setTitle("Analyzer");
    visionAssistant.current = createVisionAssistant({
      systemInstruction: TOGETHER_SYSTEM_INSTRUCTIONS,
    });
  }, [setTitle]);

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
        setError("Error during vision analysis.");
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
      setError("Error generating final response.");
    } finally {
      setLoading((prev) => ({ ...prev, text: false }));
    }
  }, [imageUrl]);

  const togglePreds = () => setShowPredictions((v) => !v);

  return (
    <Screen inPageTitle="Analyzer">
      {!imageUrl ? (
        <p className="text-center text-gray-500">Select an image to analyze.</p>
      ) : (
        <div className="flex flex-col md:flex-row gap-2">
          <section className="flex flex-col gap-2">
            <ImagePreviewCard
              className="w-full sm md:w-60 lg:w-100 gap-0"
              imageUrl={imageUrl}
              alt="Analysis Image"
            >
              <AnalyzeButton
                onClick={analyzeImage}
                loading={loading}
                phase={analysisPhase}
                total={NUM_VISION_REQUESTS}
              />
            </ImagePreviewCard>

            {!finalResult ? (
              <InstructionCard />
            ) : (
              <PredictionCard
                finalResult={finalResult}
                showPredictions={showPredictions}
                toggle={togglePreds}
                visionOutputs={visionOutputs}
              />
            )}
          </section>

          <section className="flex flex-col gap-2">
            {error && (
              <Card>
                <CardHeader>
                  <CardTitle>Error</CardTitle>
                </CardHeader>
                <CardContent>{error}</CardContent>
              </Card>
            )}

            {finalResult && finalResult.isFood && (
              <DetailSection finalResult={finalResult} />
            )}
            {finalResult && finalResult.isFood && (
              <NutritionSection finalResult={finalResult} />
            )}
            {!finalResult?.isFood && showPredictions && (
              <p className="text-xs">{finalResult.reasoning}</p>
            )}
          </section>
        </div>
      )}
    </Screen>
  );
}
