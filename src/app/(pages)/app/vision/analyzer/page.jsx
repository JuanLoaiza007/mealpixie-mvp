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
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ChevronDown, ChevronUp } from "lucide-react";
import ImagePreviewCard from "@/components/ui/features/common/ImagePreviewCard";
import Screen from "@/components/ui/features/common/Screen";

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
        for await (const part of stream) {
          text += part;
        }
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
          {/* Image and Analyze Button */}
          <ImagePreviewCard imageUrl={imageUrl} alt="Analysis Image">
            <Button
              className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
              disabled={loading.vision || loading.text}
              onClick={analyzeImage}
            >
              {(loading.vision || loading.text) && (
                <Loader2 className="animate-spin mr-2" />
              )}
              {loading.vision
                ? `Analizando con modelo de visión ${analysisPhase}/${NUM_VISION_REQUESTS}`
                : loading.text
                ? "Generando respuesta final"
                : "Analizar imagen"}
            </Button>
          </ImagePreviewCard>
          {/* Results Column */}
          <div className="flex-1 flex flex-col gap-2">
            {error && (
              <Card>
                <CardHeader>
                  <CardTitle>Error</CardTitle>
                </CardHeader>
                <CardContent>{error}</CardContent>
              </Card>
            )}

            {finalResult && (
              <>
                <Card className="gap-0">
                  <CardHeader>
                    <CardTitle className="text-xl">
                      {finalResult.isFood
                        ? finalResult.name
                        : "No Food Detected"}
                      <button
                        className="flex items-center text-blue-600 underline text-xs my-2"
                        onClick={togglePreds}
                      >
                        {showPredictions ? (
                          <>
                            <ChevronUp />
                            Ocultar predicciones
                          </>
                        ) : (
                          <>
                            <ChevronDown />
                            Mostrar predicciones
                          </>
                        )}
                      </button>

                      {showPredictions && (
                        <div className="text-xs mb-4 border-1 border-slate-200 p-2 max-h-60 overflow-auto rounded-md">
                          {visionOutputs.map((o, i) => (
                            <p key={i} className="mb-6 font-light">
                              Predicción {i + 1}: {o}
                            </p>
                          ))}
                        </div>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm md:text-md mb-4">
                      {finalResult.description}
                    </p>
                  </CardContent>
                </Card>

                {finalResult.isFood && (
                  <div className="grid grid-cols-2 gap-2">
                    <Card className="gap-0">
                      <CardHeader className="px-4">
                        <CardTitle className="text-sm md:text-md">
                          Ventajas
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="px-4">
                        <ul className="list-disc list-inside text-xs md:text-sm">
                          {finalResult.advantages.map((adv, i) => (
                            <li key={i}>{adv}</li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>

                    <Card className="gap-0">
                      <CardHeader className="px-4">
                        <CardTitle className="text-sm md:text-md">
                          Desventajas
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="px-4">
                        <ul className="list-disc list-inside text-xs md:text-sm">
                          {finalResult.disadvantages.map((dis, i) => (
                            <li key={i}>{dis}</li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {!finalResult.isFood && showPredictions && (
                  <p className="text-xs">{finalResult.reasoning}</p>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </Screen>
  );
}
