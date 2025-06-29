import { render, screen } from "@testing-library/react";
import React from "react";
import { SizeSageMessageCard } from "@/components/ui/features/vision/size-sage/SizeSageMessageCard";

describe("SizeSageMessageCard", () => {
  it('renderiza el título "Estimación no disponible" y el mensaje cuando hay contenido', () => {
    render(<SizeSageMessageCard message="No se pudo estimar el tamaño." />);

    // Verifica que el título se muestre como texto (sin rol <h>)
    expect(screen.getByText(/estimación no disponible/i)).toBeInTheDocument();

    // Verifica contenido del mensaje
    expect(
      screen.getByText(/no se pudo estimar el tamaño\./i)
    ).toBeInTheDocument();
  });

  it('renderiza título y un párrafo vacío cuando message=""', () => {
    const { container } = render(<SizeSageMessageCard message="" />);

    // El título siempre debe estar presente
    expect(screen.getByText(/estimación no disponible/i)).toBeInTheDocument();

    // Verifica que exista un <p> y que esté vacío
    const pElements = container.getElementsByTagName("p");
    expect(pElements.length).toBeGreaterThan(0);
    expect(pElements[0].textContent).toBe("");
  });
});
