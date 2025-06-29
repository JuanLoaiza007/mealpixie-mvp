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
} from "@/config/together/feature-foodtype-atlas";
import {
  SYSTEM_INSTRUCTIONS as GEMINI_SYSTEM_INSTRUCTIONS,
  TASK as GEMINI_TASK,
  RESPONSE_SCHEMA as GEMINI_RESPONSE_SCHEMA,
} from "@/config/gemini/feature-foodtype-atlas";
import Screen from "@/components/ui/features/common/Screen";
import ImagePreviewCard from "@/components/ui/features/common/ImagePreviewCard";
import { ActionAnimatedButton } from "@/components/ui/features/common/ActionAnimatedButton";
import { InstructionCard } from "@/components/ui/features/common/InstructionCard";
import { PredictionCard } from "@/components/ui/features/common/PredictionCard";
import {
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { MotionCard } from "@/components/ui/features/common/MotionCard";
import { NAV_TAGS, NAV_IDS, userNavRoutes } from "@/config/userNavRoutes";

const NUM_VISION_REQUESTS = 5;

export default function FoodTypeAtlasPage() {
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
    (route) => route.id === NAV_IDS.foodTypeAtlas
  );

  useEffect(() => {
    if (!imageUrl) {
      const destinationRoute = userNavRoutes.find((route) =>
        route.tags.includes(NAV_TAGS.mainPage)
      );
      router.push(destinationRoute.href);
    }
  }, [imageUrl, router]);

  useEffect(() => {
    setTitle(functionInfo.label);
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
    } catch (e) {
      setError("Error generating final response.");
      console.error(e);
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
        <section className="flex flex-col gap-2">
          <ImagePreviewCard
            className="w-full sm md:w-60 lg:w-100 gap-0"
            imageUrl={imageUrl}
            alt="Analysis Image"
          >
            <ActionAnimatedButton
              onClick={analyzeImage}
              loading={loading}
              phase={analysisPhase}
              total={NUM_VISION_REQUESTS}
              defaultText="Analizar composición nutricional"
              visionLoadingText="Analizando composición {{phase}}/{{total}}"
              textLoadingText="Organizando información nutricional"
            />
          </ImagePreviewCard>

          <InstructionCard functionInfo={functionInfo} />
        </section>

        <section className="flex flex-col gap-2">
          {error && (
            <MotionCard>
              <CardHeader>
                <CardTitle>Error</CardTitle>
              </CardHeader>
              <CardContent>{error}</CardContent>
            </MotionCard>
          )}

          {finalResult && finalResult.isFoodDetected && (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
              {finalResult.classifications.map((c, i) => (
                <MotionCard className={"gap-2 justify-between"}>
                  <CardHeader className={"text-orange-500"}>
                    <CardTitle className={"text-base text-foreground"}>
                      🧬 {c.type}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-center">
                      {c.items.map((item, i) => (
                        <>
                          {item}
                          {i !== c.items.length - 1 ? ", " : "."}
                        </>
                      ))}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <p className="text-xs">{c.definition}</p>
                  </CardFooter>
                </MotionCard>
              ))}
            </div>
          )}
        </section>
      </div>
    </Screen>
  );
}
