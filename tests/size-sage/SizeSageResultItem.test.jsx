import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { SizeSageResultItem } from "@/components/ui/features/vision/size-sage/SizeSageResultItem";

// Mock del componente MotionCard para aislar el test de sus animaciones.
// Esto asegura que probamos solo el contenido de SizeSageResultItem.
jest.mock("@/components/ui/features/common/MotionCard", () => ({
  MotionCard: ({ children }) => (
    <div data-testid="mock-motion-card">{children}</div>
  ),
}));

describe("SizeSageResultItem", () => {
  const defaultProps = {
    object: "Plato",
    item: "Manzana",
    largo_cm: 8.5,
    ancho_cm: 8.5,
    alto_cm: 7,
    volumen_cm3: 500.75,
  };

  it("should render with default values when props are missing", () => {
    // 1. Renderizar el componente sin proporcionar los valores numéricos.
    const propsWithoutValues = {
      object: "Moneda",
      item: "Galleta",
    };
    render(<SizeSageResultItem {...propsWithoutValues} />);

    // 2. Verificar que los valores por defecto (0) se usan y se formatean correctamente.
    expect(screen.getByText(/Galleta/i)).toBeInTheDocument();
    expect(screen.getByText(/Referencia:/i)).toBeInTheDocument();
    expect(screen.getByText(/Moneda/i)).toBeInTheDocument();
    expect(screen.getByText(/Largo:0.00 cm/i)).toBeInTheDocument();
    expect(screen.getByText(/Ancho:0.00 cm/i)).toBeInTheDocument();
    expect(screen.getByText(/Alto: 0.00 cm/i)).toBeInTheDocument();
    expect(screen.getByText(/Volumen: 0.00 cm³/i)).toBeInTheDocument();
  });
});
