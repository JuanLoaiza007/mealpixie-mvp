// tests/fresh-sense/FreshSenseResultsList.test.jsx

import React from "react";
import { render, screen } from "@testing-library/react";
import { FreshSenseResultsList } from "@/components/ui/features/vision/fresh-sense/FreshSenseResultsList";

jest.mock(
  "@/components/ui/features/vision/fresh-sense/FreshSenseResultItem",
  () => ({
    FreshSenseResultItem: ({ item, assessment, icon }) => (
      <div data-testid="result-item">
        {icon} {item} – {assessment}
      </div>
    ),
  })
);

describe("FreshSenseResultsList", () => {
  it("no renderiza nada si `results` es undefined", () => {
    const { container } = render(<FreshSenseResultsList />);
    // container.innerHTML estará vacío (null)
    expect(container).toBeEmptyDOMElement();
  });

  it("no renderiza nada si `results` es un arreglo vacío", () => {
    const { container } = render(<FreshSenseResultsList results={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renderiza el encabezado y la lista de elementos cuando hay resultados", () => {
    const sampleResults = [
      { item: "Tomate", assessment: "fresco", emoji: "🍅" },
      { item: "Lechuga", assessment: "marchita", emoji: "🥬" },
      { item: "Zanahoria", assessment: "buena", emoji: "🥕" },
    ];

    render(<FreshSenseResultsList results={sampleResults} />);

    // Verificamos que exista el encabezado <h3> con texto "Ingredientes"
    const heading = screen.getByRole("heading", { name: /ingredientes/i });
    expect(heading).toBeInTheDocument();

    // Verificamos que se hayan renderizado exactamente 3 items (uno por cada resultado)
    const items = screen.getAllByTestId("result-item");
    expect(items).toHaveLength(sampleResults.length);

    // Opcional: comprobamos que el texto dentro de cada elemento corresponda
    sampleResults.forEach((r) => {
      expect(
        screen.getByText(
          new RegExp(`${r.emoji}\\s+${r.item}\\s+–\\s+${r.assessment}`, "i")
        )
      ).toBeInTheDocument();
    });
  });
});
