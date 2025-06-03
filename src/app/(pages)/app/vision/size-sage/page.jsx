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
import { SizeSageButton } from "@/components/ui/features/vision/size-sage/SizeSageButton";
import { InstructionCard } from "@/components/ui/features/common/InstructionCard";
import { PredictionCard } from "@/components/ui/features/common/PredictionCard";

import { SizeSageMessageCard } from "@/components/ui/features/vision/size-sage/SizeSageMessageCard";
import { SizeSageEstimationCard } from "@/components/ui/features/vision/size-sage/SizeSageEstimationCard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import { NAV_TAGS, NAV_IDS, userNavRoutes } from "@/config/userNavRoutes";

const NUM_VISION_REQUESTS = 3;

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

  // 1) Redirigir a la página principal si no hay imagen cargada
  useEffect(() => {
    if (!imageUrl) {
      const dest = userNavRoutes.find((r) =>
        r.tags.includes(NAV_TAGS.mainPage)
      );
      router.push(dest.href);
    }
  }, [imageUrl, router]);

  // 2) Configurar el título y crear el “assistant” de Together
  useEffect(() => {
    setTitle(functionInfo.label);
    visionAssistant.current = createVisionAssistant({
      systemInstruction: TOGETHER_SYSTEM_INSTRUCTIONS,
    });
  }, [setTitle]);

  // 3) Función que dispara todo el flujo: visión → Gemini
  const analyzeImage = useCallback(async () => {
    console.log("🕵️‍♂️ analyzeImage invocado");

    if (!imageUrl) {
      console.log("⚠️ No hay imageUrl definido, saliendo de analyzeImage.");
      return;
    }

    setError(null);
    setVisionOutputs([]);
    setFinalResult(null);
    setShowPredictions(false);
    setLoading({ vision: true, text: false });
    setAnalysisPhase(1);
    console.log(
      "🔄 Estados iniciales seteados: loading:",
      { vision: true, text: false },
      "phase:",
      1
    );

    // 1) Hacemos NUM_VISION_REQUESTS llamadas al assistant de visión
    const preds = [];
    for (let i = 0; i < NUM_VISION_REQUESTS; i++) {
      console.log(`🚀 Llamada vision #${i + 1} de ${NUM_VISION_REQUESTS}`);
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
        console.log(
          `✅ Predicción ${i + 1} recibida (longitud: ${
            text.length
          } caracteres)`
        );
      } catch (visionErr) {
        console.error("❌ Error dentro del bucle de visión:", visionErr);
        setError("Error durante el análisis de imagen.");
        setLoading({ vision: false, text: false });
        return;
      }
      setAnalysisPhase(i + 2);
      console.log("⏭️ Avanzando phase:", i + 2);

      // Si deseas un delay entre peticiones, descomenta esta sección:
      // if (i < NUM_VISION_REQUESTS - 1) {
      //   console.log("⏱️ Esperando 500ms antes de la siguiente petición vision...");
      //   await new Promise((resolve) => setTimeout(resolve, 500));
      // }
    }

    console.log("✅ Todas las predicciones de visión obtenidas:", preds);

    // 2) Una vez tenemos todas las predicciones “visuales”, las combinamos con Gemini
    setLoading({ vision: false, text: true });
    console.log("🔄 Cambio a loading.text=true, preparando llamada a Gemini");

    try {
      const combined =
        `${GEMINI_TASK}\n\nPredicciones:\n` +
        preds.map((p, idx) => `- Predicción ${idx + 1}:\n${p}`).join("\n\n");

      console.log(
        "📨 Enviando a Gemini (combined message):",
        combined.slice(0, 200) + (combined.length > 200 ? "…" : "")
      );

      const jsonResponse = await generateWithGemini({
        systemInstruction: GEMINI_SYSTEM_INSTRUCTIONS,
        task: combined,
        responseSchema: GEMINI_RESPONSE_SCHEMA,
        history: [],
      });

      console.log("📥 Respuesta de Gemini (raw):", jsonResponse);

      const parsed = JSON.parse(jsonResponse);
      console.log("✅ Respuesta parseada de Gemini:", parsed);

      setFinalResult(parsed);
    } catch (geminiErr) {
      console.error("❌ Error dentro del bloque de Gemini:", geminiErr);
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
      console.log("🔄 loading.text puesto en false");
    }
  }, [imageUrl]);


  // 4) Toggle para mostrar predicciones crudas (igual que FreshSense)
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
            <SizeSageButton
              onClick={analyzeImage}
              loading={loading}
              phase={analysisPhase}
              total={NUM_VISION_REQUESTS}
              disabled={loading.vision || loading.text}
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

        {/* ============================= */}
        {/* Columna DERECHA: Resultado o mensaje */}
        {/* ============================= */}
        <section className="flex flex-col gap-2">
          {/* 5) Si hay error en cualquier paso, mostrarlo arriba */}
          {error && (
            <Card>
              <CardHeader>
                <CardTitle>Error</CardTitle>
              </CardHeader>
              <CardContent>{error}</CardContent>
            </Card>
          )}

          {/* 6) Una vez tengamos finalResult, decidir qué mostrar */}
          {finalResult ? (
            finalResult.isEstimationAvailable ? (
              // 6A) Si la estimación está disponible, pintamos DIMENSIONES+VOLUMEN
              <SizeSageEstimationCard
                referenceObject={finalResult.referenceObject}
                dimensions={finalResult.dimensions}
                estimatedVolume_cm3={finalResult.estimatedVolume_cm3}
                message={finalResult.message}
              />
            ) : (
              <>
                {/* 6B) Si NO está disponible, mostramos el mensaje de “no disponible” */}
                <SizeSageMessageCard message={finalResult.message} />

                {/* 6C) Si existió un resultado pero no fue posible estimar, 
                         y el usuario pidió ver predicciones crudas, mostramos la razón */}
                {showPredictions && (
                  <p className="text-xs text-gray-500 mt-2">
                    {finalResult.reasoning || finalResult.message}
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
