import { render, screen } from "@testing-library/react";
import { DetailSection } from "@/components/ui/features/vision/analyzer/DetailSection";
import React from "react";

jest.mock("lucide-react", () => ({
  CheckCircle: () => <svg data-testid="check-icon" />,
  AlertTriangle: () => <svg data-testid="alert-icon" />,
}));

describe("DetailSection", () => {
  const mockFinalResult = {
    advantages: ["Fácil de usar", "Eficiente en recursos"],
    disadvantages: [
      "Puede fallar en edge cases",
      "No soporta múltiples idiomas",
    ],
  };

  it("renderiza correctamente los títulos de sección", () => {
    render(<DetailSection finalResult={mockFinalResult} />);
    expect(screen.getByTestId("advantages-header")).toHaveTextContent(
      /ventajas/i
    );
    expect(screen.getByTestId("disadvantages-header")).toHaveTextContent(
      /desventajas/i
    );
    expect(screen.getByTestId("check-icon")).toBeInTheDocument();
    expect(screen.getByTestId("alert-icon")).toBeInTheDocument();
  });

  it("muestra todas las ventajas provistas", () => {
    render(<DetailSection finalResult={mockFinalResult} />);
    mockFinalResult.advantages.forEach((adv) => {
      expect(
        screen.getByText((content) => content.includes(adv))
      ).toBeInTheDocument();
    });
  });

  it("muestra todas las desventajas provistas", () => {
    render(<DetailSection finalResult={mockFinalResult} />);
    mockFinalResult.disadvantages.forEach((dis) => {
      expect(
        screen.getByText((content) => content.includes(dis))
      ).toBeInTheDocument();
    });
  });

  it("renderiza sin errores si arrays están vacíos", () => {
    const emptyResult = { advantages: [], disadvantages: [] };
    render(<DetailSection finalResult={emptyResult} />);
    expect(screen.getByTestId("advantages-header")).toBeInTheDocument();
    expect(screen.getByTestId("disadvantages-header")).toBeInTheDocument();
    expect(screen.queryAllByRole("listitem")).toHaveLength(0);
  });

  it("usa accesibilidad básica para cada sección", () => {
    render(<DetailSection finalResult={mockFinalResult} />);
    const headers = screen.getAllByRole("heading");
    expect(headers.length).toBeGreaterThanOrEqual(2);
    expect(headers[0]).toHaveTextContent(/ventajas/i);
    expect(headers[1]).toHaveTextContent(/desventajas/i);
  });
});
