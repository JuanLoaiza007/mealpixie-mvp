import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { SizeSageResultsList } from "@/components/ui/features/vision/size-sage/SizeSageResultsList";

// Mock the child components to isolate the test from their internal workings.
// This ensures we're only testing the rendering logic of SizeSageResultsList.
jest.mock("@/components/ui/features/common/MotionCard", () => ({
  MotionCard: ({ children }) => (
    <div data-testid="mock-motion-card">{children}</div>
  ),
}));

jest.mock(
  "@/components/ui/features/vision/size-sage/SizeSageResultItem",
  () => ({
    // We explicitly mock how SizeSageResultItem uses its props for verification.
    SizeSageResultItem: ({ item, volumen_cm3 }) => (
      <div data-testid={`mock-result-item-${item}`}>
        {item} - {volumen_cm3}cm³
      </div>
    ),
  })
);

describe("SizeSageResultsList", () => {
  // A basic example of results for our tests.
  const sampleResults = [
    {
      object: "Box",
      item: "Laptop",
      largo_cm: 30,
      ancho_cm: 20,
      alto_cm: 10,
      volumen_cm3: 6000,
    },
    {
      object: "Can",
      item: "Soda",
      largo_cm: 7,
      ancho_cm: 7,
      alto_cm: 12,
      volumen_cm3: 184.8,
    },
  ];

  it("should display total volume and individual items when results are provided", () => {
    // Render the component with some sample results.
    render(<SizeSageResultsList results={sampleResults} />);

    // Assert that the 'Volumen Total' heading is present (accessibility check).
    expect(screen.getByText(/Volumen Total/i)).toBeInTheDocument();

    // Verify that the total volume is correctly calculated and displayed.
    // 6000 + 184.8 = 6184.8
    expect(screen.getByText("6184.80 cm³")).toBeInTheDocument();

    // Ensure each individual item is rendered by its mocked test ID.
    expect(screen.getByTestId("mock-result-item-Laptop")).toBeInTheDocument();
    expect(screen.getByTestId("mock-result-item-Soda")).toBeInTheDocument();

    // Verify that the correct volume is passed to the mocked SizeSageResultItem.
    expect(screen.getByText("Laptop - 6000cm³")).toBeInTheDocument();
    expect(screen.getByText("Soda - 184.8cm³")).toBeInTheDocument();

    // Verify that the mock MotionCard is used, indicating the list structure is correct.
    expect(
      screen.getAllByTestId("mock-motion-card").length
    ).toBeGreaterThanOrEqual(1);
  });

  it("should not display any content when results are empty or missing", () => {
    // Render the component with an empty array of results.
    const { container: emptyResultsContainer } = render(
      <SizeSageResultsList results={[]} />
    );
    // Check if the container is empty.
    expect(emptyResultsContainer).toBeEmptyDOMElement();

    // Render the component with undefined results.
    const { container: noResultsContainer } = render(
      <SizeSageResultsList results={undefined} />
    );
    // Check if the container is empty.
    expect(noResultsContainer).toBeEmptyDOMElement();

    // Further verify that the "Volumen Total" heading is not present in the document.
    expect(
      screen.queryByRole("heading", { name: /Volumen total/i })
    ).not.toBeInTheDocument();
  });
});
