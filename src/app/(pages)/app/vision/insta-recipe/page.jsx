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
} from "@/config/together/feature-instarecipe";
import {
  SYSTEM_INSTRUCTIONS as GEMINI_SYSTEM_INSTRUCTIONS,
  TASK as GEMINI_TASK,
  RESPONSE_SCHEMA as GEMINI_RESPONSE_SCHEMA,
} from "@/config/gemini/feature-instarecipe";
import Screen from "@/components/ui/features/common/Screen";
import ImagePreviewCard from "@/components/ui/features/common/ImagePreviewCard";
import { InstaRecipeButton } from "@/components/ui/features/vision/InstaRecipeButton";
import { InstructionCard } from "@/components/ui/features/common/InstructionCard";
import { PredictionCard } from "@/components/ui/features/common/PredictionCard";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { NAV_TAGS, NAV_IDS, userNavRoutes } from "@/config/userNavRoutes";

const NUM_VISION_REQUESTS = 5;

/**
 * Analyzes an image of food ingredients using AI to extract ingredients and generate recipe suggestions.
 *
 * @component
 * @remarks
 * - Uses a vision assistant and Gemini AI to process food-related images.
 * - Performs multiple image analysis requests (defined by NUM_VISION_REQUESTS) to improve output robustness.
 * - Generates a list of detected ingredients and recipe suggestions based on predictions.
 * - Displays result cards conditionally based on analysis outcome (ingredients found or not).
 * - Includes developer-only debug view to inspect raw vision outputs.
 * - Requires `imageUrl` from context and redirects if not present.
 * @returns {JSX.Element} Ingredient analysis and recipe suggestion interface with image preview, results, and fallback UI.
 * @example
 * // Used as a route/page component for vision-based recipe generation:
 * export default function IngredientsRecipePage() {
 *   return <IngredientsRecipePage />;
 * }
 */
export default function IngredientsRecipePage() {
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
    (route) => route.id === NAV_IDS.instaRecipe
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

  /**
  * Analyzes an image to detect ingredients and generate suggested recipes.
  *
  * @async
  * @throws {Error} If an error occurs during vision analysis or generation of the final response.
  * @returns {Promise<void>} Resolves when the vision analysis and response generation are complete.
  *
  * @example
  * analyzeImage().then(() => {
  *   console.log("Analysis completed");
  * });
  */
  const analyzeIngredients = useCallback(async () => {
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
            <InstaRecipeButton
              onClick={analyzeIngredients}
              loading={loading}
              phase={analysisPhase}
              total={NUM_VISION_REQUESTS}
            />
          </ImagePreviewCard>

          {!finalResult ? (
            <InstructionCard functionInfo={functionInfo} />
          ) : (
            process.env.NODE_ENV === "development" && (
              <PredictionCard
                finalResult={finalResult}
                showPredictions={showPredictions}
                toggle={togglePreds}
                visionOutputs={visionOutputs}
              />
            )
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

          {!error && finalResult && !finalResult.isFoodDetected && (
            <Card>
              <CardHeader>
                <CardTitle>No se detectaron ingredientes</CardTitle>
              </CardHeader>
              <CardContent>{finalResult.message}</CardContent>
            </Card>
          )}

          {!error && finalResult && finalResult.isFoodDetected && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Ingredientes</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside">
                    {finalResult.ingredients.map((ing, idx) => (
                      <li key={idx}>{ing}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recetas</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-decimal list-inside">
                    {finalResult.suggestions.map((rec, idx) => (
                      <li key={idx} className="mb-2">
                        <strong>{rec.name}:</strong> {rec.description}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </>
          )}
        </section>
      </div>
    </Screen>
  );
}
