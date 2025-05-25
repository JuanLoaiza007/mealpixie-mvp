import { render, screen } from '@testing-library/react';
import { IngredientsCard } from '@/components/ui/features/vision/labellens/IngredientsCard';

// Mock de íconos y framer-motion
jest.mock('lucide-react', () => ({
  ListOrdered: (props) => <svg data-testid="icon-list" {...props} />,
  FlaskConical: (props) => <svg data-testid="icon-flask" {...props} />,
}));

jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...rest }) => <div {...rest}>{children}</div>,
  },
}));

describe('<IngredientsCard />', () => {
  const defaultProps = {
    ingredients: {
      list: 'Harina, Agua, Sal',
      analysis: 'Alta en carbohidratos, bajo contenido graso',
    },
  };

  it('renders the card title and both sections', () => {
    render(<IngredientsCard {...defaultProps} />);

    // Accesibilidad
    expect(screen.getByText(/ingredientes/i)).toBeInTheDocument();

    // Contenido
    expect(screen.getByText(/lista:/i)).toBeInTheDocument();
    expect(screen.getByText(/harina, agua, sal/i)).toBeInTheDocument();
    expect(screen.getByText(/análisis:/i)).toBeInTheDocument();
    expect(screen.getByText(/alta en carbohidratos/i)).toBeInTheDocument();

    // Iconos
    expect(screen.getAllByTestId('icon-list')).toHaveLength(2);
    expect(screen.getByTestId('icon-flask')).toBeInTheDocument();
  });

  it('renders fallback when no ingredients are provided', () => {
    render(<IngredientsCard ingredients={{}} />);

    expect(screen.getAllByText(/no disponible/i)).toHaveLength(2);
  });

  it('renders gracefully if `ingredients` is undefined', () => {
    render(<IngredientsCard />);

    const fallbacks = screen.getAllByText(/no disponible/i);
    expect(fallbacks).toHaveLength(2);
  });

  it('has accessible structure and semantics', () => {
    render(<IngredientsCard {...defaultProps} />);

    // Verifica que haya elementos legibles por screen readers
    const heading = screen.getByText(/ingredientes/i);
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveClass('text-base');

    const listLabel = screen.getByText(/lista:/i);
    expect(listLabel).toHaveClass('font-semibold');
  });
});
