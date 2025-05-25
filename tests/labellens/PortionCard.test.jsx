import { render, screen } from '@testing-library/react';
import { PortionCard } from '@/components/ui/features/vision/labellens/PortionCard';

jest.mock('lucide-react', () => ({
  Cookie: (props) => <svg data-testid="cookie-icon" {...props} />,
  HelpCircle: (props) => <svg data-testid="help-icon" {...props} />,
}));

jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...rest }) => <div {...rest}>{children}</div>,
    p: ({ children, ...rest }) => <p {...rest}>{children}</p>,
  },
}));

describe('<PortionCard />', () => {
  it('renders portion information when provided', () => {
    render(<PortionCard portion="1 galleta (30g)" />);

    // Icono y título
    expect(screen.getByTestId('cookie-icon')).toBeInTheDocument();
    expect(screen.getByText(/porción/i)).toBeInTheDocument();

    // Contenido principal
    expect(screen.getByText(/1 galleta \(30g\)/i)).toBeInTheDocument();
  });

  it('renders fallback message when no portion is given', () => {
    render(<PortionCard />);

    // Icono de advertencia
    expect(screen.getByTestId('help-icon')).toBeInTheDocument();

    // Mensaje de fallback
    expect(
      screen.getByText(/no se encontró el tamaño de la porción/i)
    ).toBeInTheDocument();
  });

  it('has accessible and clear structure', () => {
    render(<PortionCard portion="100g" />);

    expect(screen.getByText(/porción/i)).toBeInTheDocument();
    expect(screen.getByText(/100g/i)).toBeInTheDocument();
  });
});
