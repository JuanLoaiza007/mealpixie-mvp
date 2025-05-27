import { render, screen } from '@testing-library/react';
import { VitaminCard } from '@/components/ui/features/vision/labellens/VitaminCard';

// Mocks de iconos y framer-motion
jest.mock('lucide-react', () => ({
  HeartPulse: (props) => <svg data-testid="heart-icon" {...props} />,
}));

jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
}));

describe('<VitaminCard />', () => {
  const baseItem = {
    name: 'Vitamina C',
    percentage: 35,
    benefit: 'Contribuye al sistema inmunológico.',
  };

  it('renders vitamin data correctly', () => {
    render(<VitaminCard item={baseItem} />);

    // Título e icono
    expect(screen.getByText(/vitamina c/i)).toBeInTheDocument();
    expect(screen.getByTestId('heart-icon')).toBeInTheDocument();

    // Porcentaje
    expect(screen.getByText(/35%/i)).toBeInTheDocument();

    // Beneficio
    expect(screen.getByText(/sistema inmunológico/i)).toBeInTheDocument();
  });

  it('renders fallback when no benefit is provided', () => {
    render(<VitaminCard item={{ ...baseItem, benefit: undefined }} />);

    expect(screen.getByText(/sin beneficio especificado/i)).toBeInTheDocument();
  });

  it('renders correctly with string percentage', () => {
    render(<VitaminCard item={{ ...baseItem, percentage: '20' }} />);
    expect(screen.getByText(/20%/)).toBeInTheDocument();
  });

  it('has accessible structure and styles', () => {
    render(<VitaminCard item={baseItem} />);

    const title = screen.getByText(/vitamina c/i);
    expect(title).toHaveClass('text-base');
    expect(screen.getByText(/35%/)).toHaveClass('text-xs');
  });
});
