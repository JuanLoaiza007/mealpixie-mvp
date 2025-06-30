import { render, screen } from '@testing-library/react';
import { NutrientCard } from '@/components/ui/features/vision/labellens/NutrientCard';

jest.mock('@/components/ui/features/vision/labellens/nutrientIcons', () => ({
  getIconForField: jest.fn(() => <svg data-testid="nutrient-icon" />),
}));

jest.mock('@/components/ui/features/vision/labellens/impactLevel', () => ({
  getImpactLevel: jest.fn((input) => ({
    label: input === 'high' ? 'Alto' : 'Moderado',
    color: input === 'high' ? 'destructive' : 'warning',
  })),
}));

jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...rest }) => <div {...rest}>{children}</div>,
  },
}));

describe('<NutrientCard />', () => {
  const field = {
    name: 'Sodio',
    value: '120mg',
    explanation: 'Esencial para funciones musculares.',
    healthImpact: 'Puede aumentar la presión arterial.',
    impactLevel: 'high',
  };

  it('renders all nutrient data with icon and badge', () => {
    render(<NutrientCard field={field} />);

    // Textos principales
    expect(screen.getByText(/sodio/i)).toBeInTheDocument();
    expect(screen.getByText(/valor:/i)).toBeInTheDocument();
    expect(screen.getByText(/120mg/i)).toBeInTheDocument();
    expect(screen.getByText(/¿qué es\?/i)).toBeInTheDocument();
    expect(screen.getByText(/esencial para funciones musculares/i)).toBeInTheDocument();
    expect(screen.getByText(/impacto:/i)).toBeInTheDocument();
    expect(screen.getByText(/puede aumentar la presión/i)).toBeInTheDocument();

    // Badge generado
    expect(screen.getByText(/alto/i)).toBeInTheDocument();

    // Icono renderizado
    expect(screen.getByTestId('nutrient-icon')).toBeInTheDocument();
  });

  it('handles missing optional fields gracefully', () => {
    render(<NutrientCard field={{ name: 'Fibra', value: '5g', explanation: 'Buena para la digestión' }} />);

    expect(screen.getByText(/fibra/i)).toBeInTheDocument();
    expect(screen.getByText(/5g/i)).toBeInTheDocument();
    expect(screen.getByText(/buena para la digestión/i)).toBeInTheDocument();

    // "Impacto" aún debería mostrarse pero estar vacío o no renderizado
    expect(screen.getByText(/impacto:/i)).toBeInTheDocument();
  });

  it('renders default impact level when impactLevel is missing but healthImpact exists', () => {
    render(<NutrientCard field={{ ...field, impactLevel: undefined }} />);
    expect(screen.getByText(/moderado/i)).toBeInTheDocument();
  });

  it('has accessible structure', () => {
    render(<NutrientCard field={field} />);
    const name = screen.getByText(/sodio/i);
    expect(name).toHaveClass('text-base');
    expect(name).toBeInTheDocument();
    expect(screen.getByText(/valor:/i)).toBeInTheDocument();
  });
});
