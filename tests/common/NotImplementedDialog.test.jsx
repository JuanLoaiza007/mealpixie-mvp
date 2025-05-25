import { render, screen, fireEvent } from '@testing-library/react';
import NotImplementedDialog from '@/components/ui/features/common/notImplementedDialog';

jest.mock('@/components/ui/dialog', () => ({
  Dialog: ({ open, onOpenChange, children }) => (
    open ? <div data-testid="dialog">{children}</div> : null
  ),
  DialogContent: ({ children, ...props }) => <div {...props}>{children}</div>,
  DialogHeader: ({ children }) => <div>{children}</div>,
  DialogTitle: ({ children }) => <h2>{children}</h2>,
  DialogDescription: ({ children }) => <p>{children}</p>,
  DialogFooter: ({ children }) => <div>{children}</div>,
}));

jest.mock('@/components/ui/button', () => ({
  Button: ({ onClick, children }) => (
    <button onClick={onClick}>{children}</button>
  ),
}));

describe('<NotImplementedDialog />', () => {
  const mockFeature = { name: 'InstaRecipe' };
  const mockOnOpenChange = jest.fn();

  afterEach(() => mockOnOpenChange.mockClear());

  it('renderiza el nombre de la feature y el mensaje por defecto', () => {
    render(
      <NotImplementedDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        selectedFeature={mockFeature}
      />
    );

    expect(screen.getByText(/instarecipe/i)).toBeInTheDocument();
    expect(screen.getByText(/not implemented yet/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cerrar/i })).toBeInTheDocument();
  });

  it('ejecuta onOpenChange(false) al hacer click en "Cerrar"', () => {
    render(
      <NotImplementedDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        selectedFeature={mockFeature}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /cerrar/i }));
    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });

  it('no renderiza el diálogo si `open` es false', () => {
    render(
      <NotImplementedDialog
        open={false}
        onOpenChange={mockOnOpenChange}
        selectedFeature={mockFeature}
      />
    );

    expect(screen.queryByTestId('dialog')).not.toBeInTheDocument();
  });
});
