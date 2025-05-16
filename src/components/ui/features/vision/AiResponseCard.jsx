import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Loader2, ChevronDown, ChevronUp } from "lucide-react";

const AiResponseCard = ({
  className,
  isLoadingVision,
  isLoadingText,
  visionAnalysisMessage,
  reasoningText,
  finalResponseText,
  showReasoning,
  onToggleReasoning,
  responseTextError,
}) => {
  return (
    <div className={`flex flex-col border rounded-md p-4 ${className}`}>
      {visionAnalysisMessage && (
        <p
          className={`mt-1 text-sm text-gray-700 ${
            isLoadingVision ? "animate-pulse" : ""
          }`}
        >
          {visionAnalysisMessage}
        </p>
      )}
      {isLoadingText ? (
        <div className="flex items-center gap-2">
          <Loader2 className="animate-spin w-5 h-5" />
          Generando respuesta...
        </div>
      ) : finalResponseText ? (
        <div className="space-y-2 text-sm">
          {reasoningText && reasoningText.length > 0 && (
            <button
              className="text-blue-500 hover:underline text-xs flex items-center gap-1"
              onClick={onToggleReasoning}
            >
              {showReasoning ? (
                <>
                  Mostrar Razonamiento <ChevronUp className="w-4 h-4" />
                </>
              ) : (
                <>
                  Mostrar Razonamiento <ChevronDown className="w-4 h-4" />
                </>
              )}
            </button>
          )}
          {showReasoning && reasoningText && (
            <div className="border rounded-md p-2 bg-gray-50 text-xs text-gray-600 max-h-80 overflow-y-auto">
              <h3 className="font-semibold mb-1">Razonamiento:</h3>
              <Markdown remarkPlugins={[remarkGfm]}>{reasoningText}</Markdown>
            </div>
          )}
          <div>
            <h3 className="font-semibold mb-1">Respuesta:</h3>
            <Markdown remarkPlugins={[remarkGfm]}>{finalResponseText}</Markdown>
          </div>
        </div>
      ) : (
        <p className="text-gray-600">Esperando análisis...</p>
      )}
      {responseTextError && (
        <p className="mt-2 text-sm text-red-500">{responseTextError}</p>
      )}
    </div>
  );
};

export default AiResponseCard;
