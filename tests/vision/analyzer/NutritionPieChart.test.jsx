import { render, screen } from "@testing-library/react";
import NutritionPieCharts from "@/components/ui/features/vision/analyzer/NutritionPieChart";
import React from "react";

// Mock de recharts para testear sin SVG real
jest.mock("recharts", () => {
  const React = require("react");
  return {
    ResponsiveContainer: ({ children }) => (
      <div data-testid="ResponsiveContainer">{children}</div>
    ),
    PieChart: ({ children }) => <svg data-testid="PieChart">{children}</svg>,
    Pie: ({ children }) => <g data-testid="Pie">{children}</g>,
    Cell: ({ fill }) => <rect data-testid="Cell" data-fill={fill} />,
  };
});

describe("NutritionPieCharts", () => {
  const mockData = [
    { name: "Carbohydrates", percentage: 40 },
    { name: "Proteins", percentage: 30 },
    { name: "Fats", percentage: 20 },
  ];

  it("renderiza un gráfico por cada ítem en el data", () => {
    render(<NutritionPieCharts data={mockData} />);

    const charts = screen.getAllByTestId("PieChart");
    expect(charts).toHaveLength(mockData.length);

    mockData.forEach((item) => {
      expect(screen.getByText(item.name)).toBeInTheDocument();
    });
  });

  it("usa el tamaño por defecto si no se proporciona `size`", () => {
    render(<NutritionPieCharts data={[{ name: "Fiber", percentage: 10 }]} />);
    expect(screen.getByTestId("PieChart")).toBeInTheDocument();
  });

  it("renderiza correctamente valores límite como 0% y 100%", () => {
    const edgeData = [
      { name: "Zero", percentage: 0 },
      { name: "Full", percentage: 100 },
    ];
    render(<NutritionPieCharts data={edgeData} />);

    edgeData.forEach((item) => {
      expect(screen.getByText(item.name)).toBeInTheDocument();
    });
  });

  it("no explota con un array vacío", () => {
    render(<NutritionPieCharts data={[]} />);
    // El contenedor existe pero no hay PieCharts
    expect(screen.queryAllByTestId("PieChart")).toHaveLength(0);
  });

  it("renderiza con colores cíclicos según índice", () => {
    render(<NutritionPieCharts data={mockData} />);
    const cells = screen.getAllByTestId("Cell");
    // Cada gráfico genera dos celdas: una con color, otra gris
    const coloredCells = cells.filter(
      (cell) => cell.getAttribute("data-fill") !== "#e5e7eb"
    );
    expect(coloredCells).toHaveLength(mockData.length);
  });
});
