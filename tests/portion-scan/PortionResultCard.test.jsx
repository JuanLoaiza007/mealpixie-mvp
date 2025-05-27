import { render, screen } from '@testing-library/react';
import { PortionResultCard } from '@/components/ui/features/vision/portion-scan/PortionResultCard';

// Mocks necesarios si usas framer-motion de forma intensiva
jest.mock('framer-motion', () => {
  const React = require('react');
  return {
    motion: {
      div: React.forwardRef((props, ref) => (
        <div ref={ref} {...props} />
      )),
    },
  };
});

describe('PortionResultCard', () => {
  const baseItem = {
    name: 'manzana',
    count: 2,
    estimatedWeightKg: 0.3,
    estimatedCalories: 150,
  };

  it('renderiza correctamente el nombre formateado y la cantidad', () => {
    render(<PortionResultCard item={baseItem} />);

    // Nombre capitalizado
    expect(screen.getByText('Manzana')).toBeInTheDocument();

    // Cantidad como texto
    expect(screen.getByText(/× 2/i)).toBeInTheDocument();

    // Accesibilidad básica: label de cantidad
    expect(screen.getByText(/Cantidad:/i)).toBeInTheDocument();
  });

  it('muestra el peso estimado si está presente', () => {
    render(<PortionResultCard item={baseItem} />);

    expect(screen.getByText(/Peso estimado:/i)).toBeInTheDocument();
    expect(screen.getByText(/0\.30 kg/i)).toBeInTheDocument();
  });

  it('muestra las calorías estimadas si están presentes', () => {
    render(<PortionResultCard item={baseItem} />);

    expect(screen.getByText(/Calorías estimadas:/i)).toBeInTheDocument();
    expect(screen.getByText(/150 kcal/i)).toBeInTheDocument();
  });

  it('no muestra peso ni calorías si no se proporcionan', () => {
    const minimalItem = {
      name: 'pera',
      count: 1,
    };

    render(<PortionResultCard item={minimalItem} />);

    expect(screen.queryByText(/Peso estimado:/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Calorías estimadas:/i)).not.toBeInTheDocument();
  });
});
