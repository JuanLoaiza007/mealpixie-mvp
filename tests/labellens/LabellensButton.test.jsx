import { render, screen, fireEvent } from '@testing-library/react';
import { LabelLensButton } from '@/components/ui/features/vision/labellens/LabellensButton';

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

describe('<LabelLensButton />', () => {
  const defaultProps = {
    onClick: jest.fn(),
    phase: 1,
    total: 3,
    loading: { vision: false, text: false },
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the default scan state with icon and text', () => {
    render(<LabelLensButton {...defaultProps} />);
    
    expect(screen.getByRole('button', { name: /escanear etiqueta/i })).toBeInTheDocument();
    expect(screen.getByTestId('scan-icon')).toBeInTheDocument();
  });

  it('displays OCR loading state when vision loading is true', () => {
    render(<LabelLensButton {...defaultProps} loading={{ vision: true, text: false }} />);
    
    expect(screen.getByText(/extrayendo texto ocr 1\/3/i)).toBeInTheDocument();
    expect(screen.getByTestId('loader-icon')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('displays text analysis loading state when text loading is true', () => {
    render(<LabelLensButton {...defaultProps} loading={{ vision: false, text: true }} />);
    
    expect(screen.getByText(/analizando contenido nutricional/i)).toBeInTheDocument();
    expect(screen.getByTestId('loader-icon')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('calls onClick when button is clicked and not loading', () => {
    render(<LabelLensButton {...defaultProps} />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(defaultProps.onClick).toHaveBeenCalled();
  });

  it('does not call onClick when loading is active', () => {
    render(<LabelLensButton {...defaultProps} loading={{ vision: true, text: false }} />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(defaultProps.onClick).not.toHaveBeenCalled();
  });
});
