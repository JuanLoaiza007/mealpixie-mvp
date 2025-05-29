import { render, screen, fireEvent } from "@testing-library/react";
import { AnalyzeButton } from "@/components/ui/features/vision/analyzer/AnalyzeButton";
import React from "react";

// Mock de ícono Loader2 para evitar problemas en test
jest.mock("lucide-react", () => ({
  Loader2: () => <svg data-testid="loader-icon" />,
}));

describe("AnalyzeButton", () => {
  const baseProps = {
    onClick: jest.fn(),
    phase: 1,
    total: 3,
    loading: {
      vision: false,
      text: false,
    },
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza correctamente el texto por defecto", () => {
    render(<AnalyzeButton {...baseProps} />);
    const button = screen.getByRole("button", { name: /analizar imagen/i });
    expect(button).toBeInTheDocument();
    expect(button).toBeEnabled();
  });

  it("renderiza el loader y texto de visión al estar cargando visión", () => {
    render(
      <AnalyzeButton {...baseProps} loading={{ vision: true, text: false }} />
    );
    const button = screen.getByRole("button", {
      name: /analizando con modelo de visión/i,
    });
    expect(button).toBeDisabled();
    expect(screen.getByTestId("loader-icon")).toBeInTheDocument();
  });

  it("renderiza el loader y texto de texto al estar cargando texto", () => {
    render(
      <AnalyzeButton {...baseProps} loading={{ vision: false, text: true }} />
    );
    const button = screen.getByRole("button", {
      name: /generando respuesta final/i,
    });
    expect(button).toBeDisabled();
    expect(screen.getByTestId("loader-icon")).toBeInTheDocument();
  });

  it("llama a onClick cuando se hace click en el botón habilitado", () => {
    render(<AnalyzeButton {...baseProps} />);
    const button = screen.getByRole("button", { name: /analizar imagen/i });
    fireEvent.click(button);
    expect(baseProps.onClick).toHaveBeenCalledTimes(1);
  });

  it("no llama a onClick si está deshabilitado por carga de visión", () => {
    const onClick = jest.fn();
    render(
      <AnalyzeButton
        {...baseProps}
        loading={{ vision: true, text: false }}
        onClick={onClick}
      />
    );
    const button = screen.getByRole("button");
    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("tiene roles y accesibilidad básica", () => {
    render(<AnalyzeButton {...baseProps} />);
    const button = screen.getByRole("button", { name: /analizar imagen/i });
    expect(button).toHaveAccessibleName();
  });
});
