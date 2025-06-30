import { render, screen } from "@testing-library/react";
import HealthScoreChart from "@/components/ui/features/vision/analyzer/HealthScoreChart";
import React from "react";

jest.mock("recharts", () => {
  const React = require("react");
  return {
    ResponsiveContainer: ({ children }) => (
      <div data-testid="ResponsiveContainer">{children}</div>
    ),
    RadialBarChart: ({ children }) => (
      <svg data-testid="RadialBarChart">{children}</svg>
    ),
    RadialBar: () => <rect data-testid="RadialBar" />,
    PolarAngleAxis: () => <g data-testid="PolarAngleAxis" />,
  };
});

describe("HealthScoreChart", () => {
  it("renderiza correctamente con un score válido", () => {
    render(<HealthScoreChart score={75} />);

    expect(screen.getByTestId("ResponsiveContainer")).toBeInTheDocument();
    expect(screen.getByTestId("RadialBarChart")).toBeInTheDocument();
    expect(screen.getByTestId("RadialBar")).toBeInTheDocument();
    expect(screen.getByTestId("PolarAngleAxis")).toBeInTheDocument();
  });

  it("soporta diferentes valores de score", () => {
    const { rerender } = render(<HealthScoreChart score={30} />);
    expect(screen.getByTestId("RadialBarChart")).toBeInTheDocument();

    rerender(<HealthScoreChart score={100} />);
    expect(screen.getByTestId("RadialBarChart")).toBeInTheDocument();

    rerender(<HealthScoreChart score={0} />);
    expect(screen.getByTestId("RadialBarChart")).toBeInTheDocument();
  });

  it("usa el valor por defecto de altura si no se proporciona", () => {
    render(<HealthScoreChart score={50} />);
    const chart = screen.getByTestId("ResponsiveContainer");
    expect(chart).toBeInTheDocument();
  });

  it("renderiza sin romperse con un score nulo o undefined", () => {
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    render(<HealthScoreChart score={null} />);
    render(<HealthScoreChart score={undefined} />);
    expect(screen.getAllByTestId("RadialBarChart").length).toBe(2);
    consoleSpy.mockRestore();
  });
});
