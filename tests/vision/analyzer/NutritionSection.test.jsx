import { render, screen } from "@testing-library/react";
import { NutritionSection } from "@/components/ui/features/vision/analyzer/NutritionSection";

// Mock de los componentes hijos
jest.mock("@/components/ui/features/vision/analyzer/NutritionPieChart", () => ({
  __esModule: true,
  default: ({ data, size }) => (
    <div data-testid="NutritionPieCharts" data-size={size}>
      {data.map((item) => (
        <div key={item.name}>{item.name}</div>
      ))}
    </div>
  ),
}));

jest.mock("@/components/ui/features/vision/analyzer/HealthScoreChart", () => ({
  __esModule: true,
  default: ({ score }) => (
    <div data-testid="HealthScoreChart">Score: {score}</div>
  ),
}));

describe("NutritionSection", () => {
  const mockResult = {
    mainCharacteristics: [
      { name: "Proteína", percentage: 30 },
      { name: "Carbohidratos", percentage: 40 },
    ],
    healthProbability: 85,
  };

  it("renderiza correctamente los títulos", () => {
    render(<NutritionSection finalResult={mockResult} />);
    expect(screen.getByText(/información nutricional/i)).toBeInTheDocument();
    expect(screen.getByText(/puntuación de salud/i)).toBeInTheDocument();
  });

  it("renderiza NutritionPieCharts con los datos y tamaño correctos", () => {
    render(<NutritionSection finalResult={mockResult} />);
    const chart = screen.getByTestId("NutritionPieCharts");
    expect(chart).toBeInTheDocument();
    expect(chart.dataset.size).toBe("50");
    expect(chart).toHaveTextContent("Proteína");
    expect(chart).toHaveTextContent("Carbohidratos");
  });

  it("renderiza HealthScoreChart con el puntaje correcto", () => {
    render(<NutritionSection finalResult={mockResult} />);
    const chart = screen.getByTestId("HealthScoreChart");
    expect(chart).toHaveTextContent("Score: 85");
    expect(screen.getByText(/85% Saludable/)).toBeInTheDocument();
  });

  it("maneja finalResult vacío sin crashear", () => {
    const emptyResult = { mainCharacteristics: [], healthProbability: 0 };
    render(<NutritionSection finalResult={emptyResult} />);
    expect(screen.getByTestId("NutritionPieCharts")).toBeInTheDocument();
    expect(screen.getByTestId("HealthScoreChart")).toHaveTextContent(
      "Score: 0"
    );
    expect(screen.getByText(/0% Saludable/)).toBeInTheDocument();
  });
});
