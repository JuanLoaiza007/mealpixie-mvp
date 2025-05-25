import { render, screen } from '@testing-library/react';
import { InstructionCard } from '@/components/ui/features/common/InstructionCard';

describe('<InstructionCard />', () => {
  const mockFunctionInfo = {
    label: 'Analizador de Etiquetas',
    long_description: 'Escanea una etiqueta y extrae información nutricional automáticamente.',
  };

  it('renderiza el título (label) correctamente', () => {
    render(<InstructionCard functionInfo={mockFunctionInfo} />);
    expect(screen.getByText(/analizador de etiquetas/i)).toBeInTheDocument();
  });

  it('renderiza la descripción larga correctamente', () => {
    render(<InstructionCard functionInfo={mockFunctionInfo} />);
    expect(screen.getByText(/extrae información nutricional/i)).toBeInTheDocument();
  });

  it('tiene clases visuales clave y estructura básica', () => {
    const { container } = render(<InstructionCard functionInfo={mockFunctionInfo} />);
    const card = container.querySelector('.bg-amber-100');
    const title = screen.getByText(/analizador de etiquetas/i);

    expect(card).toBeInTheDocument();
    expect(title).toHaveClass('text-xl', 'text-orange-500');
  });
});
