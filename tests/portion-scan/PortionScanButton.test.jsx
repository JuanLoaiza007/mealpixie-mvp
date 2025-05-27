import { render, screen, fireEvent } from '@testing-library/react';
import { PortionScanButton } from '@/components/ui/features/vision/portion-scan/PortionScanButton';

jest.mock('lucide-react', () => ({
  Loader2: (props) => <svg data-testid="loader-icon" {...props} />,
  ScanLine: (props) => <svg data-testid="scan-icon" {...props} />,
}));

jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    span: ({ children, ...props }) => <span {...props}>{children}</span>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

describe('<PortionScanButton />', () => {
  const defaultProps = {
    onClick: jest.fn(),
    phase: 1,
    total: 3,
    loading: { vision: false, text: false },
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders default state with scan icon and text', () => {
    render(<PortionScanButton {...defaultProps} />);

    expect(screen.getByRole('button', { name: /escanear porciones/i })).toBeInTheDocument();
    expect(screen.getByTestId('scan-icon')).toBeInTheDocument();
  });

  it('shows vision loading state with proper text and loader icon', () => {
    render(<PortionScanButton {...defaultProps} loading={{ vision: true, text: false }} />);

    expect(screen.getByText(/extrayendo porciones 1\/3/i)).toBeInTheDocument();
    expect(screen.getByTestId('loader-icon')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('shows text loading state with proper text and loader icon', () => {
    render(<PortionScanButton {...defaultProps} loading={{ vision: false, text: true }} />);

    expect(screen.getByText(/analizando contenido de porciones/i)).toBeInTheDocument();
    expect(screen.getByTestId('loader-icon')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('calls onClick when not loading and button is clicked', () => {
    render(<PortionScanButton {...defaultProps} />);

    fireEvent.click(screen.getByRole('button'));
    expect(defaultProps.onClick).toHaveBeenCalled();
  });

  it('does not call onClick when vision loading is active', () => {
    render(<PortionScanButton {...defaultProps} loading={{ vision: true, text: false }} />);

    fireEvent.click(screen.getByRole('button'));
    expect(defaultProps.onClick).not.toHaveBeenCalled();
  });

  it('does not call onClick when text loading is active', () => {
    render(<PortionScanButton {...defaultProps} loading={{ vision: false, text: true }} />);

    fireEvent.click(screen.getByRole('button'));
    expect(defaultProps.onClick).not.toHaveBeenCalled();
  });
});
