import { render, screen, fireEvent } from "@testing-library/react";
import AiResponseCard from "@/components/ui/features/vision/AiResponseCard";

jest.mock('react-markdown', () => (props) => {
    return <div>{props.children}</div>;
  });

jest.mock("remark-gfm", () => () => (tree) => {
  tree.children = tree.children.map((node) => {
    if (node.type === "text") {
      node.value = node.value.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    }
    return node;
  });
  return tree;
});

describe("<AiResponseCard />", () => {
  it("muestra mensaje de análisis de visión si está presente", () => {
    render(<AiResponseCard visionAnalysisMessage="Procesando imagen..." />);
    expect(screen.getByText(/procesando imagen/i)).toBeInTheDocument();
  });

  it("muestra el loader mientras se genera respuesta de texto", () => {
    render(<AiResponseCard isLoadingText={true} />);
    expect(screen.getByText(/generando respuesta/i)).toBeInTheDocument();
    const loaderIcon = document.querySelector("svg.animate-spin");
    expect(loaderIcon).toBeInTheDocument();
  });

  it("muestra mensaje de espera si no hay respuesta final ni loading", () => {
    render(<AiResponseCard />);
    expect(screen.getByText(/esperando análisis/i)).toBeInTheDocument();
  });

  it("muestra respuesta final en markdown", () => {
    const markdownText = "**Respuesta final importante**";
    render(<AiResponseCard finalResponseText={markdownText} />);
    expect(screen.getByText(/respuesta final importante/i)).toBeInTheDocument();
  });

  it("muestra y oculta razonamiento al hacer click", () => {
    const reasoning = "Este es un *razonamiento* con detalle.";
    const toggleFn = jest.fn();

    render(
      <AiResponseCard
        reasoningText={reasoning}
        finalResponseText="Resultado final"
        onToggleReasoning={toggleFn}
        showReasoning={false}
      />
    );

    const toggleBtn = screen.getByRole("button", { name: /mostrar razonamiento/i });
    expect(toggleBtn).toBeInTheDocument();
    fireEvent.click(toggleBtn);
    expect(toggleFn).toHaveBeenCalled();
  });

  it("muestra el razonamiento cuando está activo", () => {
    const reasoning = "## Razonamiento importante\n\nTexto detallado.";
    render(
      <AiResponseCard
        reasoningText={reasoning}
        finalResponseText="Resultado final"
        showReasoning={true}
        onToggleReasoning={() => {}}
      />
    );
    expect(screen.getByText(/razonamiento:/i)).toBeInTheDocument();
    expect(screen.getByText(/texto detallado/i)).toBeInTheDocument();
  });

  it("muestra error si hay respuesta de error", () => {
    render(<AiResponseCard responseTextError="Error crítico al analizar." />);
    expect(screen.getByText(/error crítico/i)).toBeInTheDocument();
    expect(screen.getByText(/error crítico/i)).toHaveClass("text-red-500");
  });
});
