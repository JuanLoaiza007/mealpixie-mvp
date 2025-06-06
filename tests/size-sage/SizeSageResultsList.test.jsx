// tests/size-sage/SizeSageResultsList.test.jsx

import { render, screen } from '@testing-library/react';
import { SizeSageResultsList } from '@/components/ui/features/vision/size-sage/SizeSageResultsList';
import '@testing-library/jest-dom';

// Mock del componente hijo SizeSageResultItem
jest.mock('@/components/ui/features/vision/size-sage/SizeSageResultItem', () => ({
  __esModule: true,
  SizeSageResultItem: ({ object, item }) => (
    <div data-testid="result-item">
      {object} - {item}
    </div>
  ),
}));

describe('SizeSageResultsList', () => {
  const sampleResults = [
    {
      object: 'Box',
      item: 'Electronics',
      largo_cm: 30,
      ancho_cm: 20,
      alto_cm: 15,
      volumen_cm3: 9000,
    },
    {
      object: 'Container',
      item: 'Books',
      largo_cm: 25,
      ancho_cm: 20,
      alto_cm: 30,
      volumen_cm3: 15000,
    },
  ];

  it('renders null when results are undefined', () => {
    const { container } = render(<SizeSageResultsList results={undefined} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders null when results is an empty array', () => {
    const { container } = render(<SizeSageResultsList results={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders result items and total volume correctly', () => {
    render(<SizeSageResultsList results={sampleResults} />);
    
    // Verificar que los items fueron renderizados
    const resultItems = screen.getAllByTestId('result-item');
    expect(resultItems).toHaveLength(sampleResults.length);

    // En lugar de getByRole('heading', …), buscamos el texto “Volumen estimado” dentro de un <div>
    expect(screen.getByText(/volumen estimado/i)).toBeInTheDocument();
    
    // Verificar texto de volumen total (p.ej. “24000.00 cm³”)
    const total = sampleResults.reduce((sum, r) => sum + r.volumen_cm3, 0).toFixed(2);
    expect(screen.getByText(new RegExp(`${total}\\s*cm³`, 'i'))).toBeInTheDocument();
  });

  it('accesibilidad: muestra el título “Volumen estimado” y el texto “Volumen total”', () => {
    render(<SizeSageResultsList results={sampleResults} />);

    // Solo comprobamos que “Volumen estimado” esté presente en texto
    expect(screen.getByText(/volumen estimado/i)).toBeInTheDocument();

    // “Volumen total” sí es un <h4>, así que podemos verificarlo con getByRole
    expect(screen.getByRole('heading', { level: 4, name: /volumen total/i })).toBeVisible();
  });
});
