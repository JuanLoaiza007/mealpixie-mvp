import { render, screen } from '@testing-library/react';
import Screen from '@/components/ui/features/common/Screen';

// Mock de íconos
jest.mock('lucide-react', () => ({
  Camera: (props) => <svg data-testid="icon-camera" {...props} />,
  Utensils: (props) => <svg data-testid="icon-utensils" {...props} />,
  Hash: (props) => <svg data-testid="icon-hash" {...props} />,
  BookOpen: (props) => <svg data-testid="icon-book" {...props} />,
  Thermometer: (props) => <svg data-testid="icon-thermo" {...props} />,
  FileText: (props) => <svg data-testid="icon-text" {...props} />,
  DollarSign: (props) => <svg data-testid="icon-dollar" {...props} />,
  Ruler: (props) => <svg data-testid="icon-ruler" {...props} />,
}));

describe('<Screen />', () => {
  it('renders title and correct icon for "Analyzer"', () => {
    render(
      <Screen inPageTitle="Analyzer">
        <p>Contenido de prueba</p>
      </Screen>
    );

    expect(screen.getByText(/analyzer/i)).toBeInTheDocument();
    expect(screen.getByTestId('icon-camera')).toBeInTheDocument();
    expect(screen.getByText(/contenido de prueba/i)).toBeInTheDocument();
  });

  it('renders correct icon for other functions', () => {
    render(<Screen inPageTitle="SizeSage">Tamaño</Screen>);
    expect(screen.getByText(/sizesage/i)).toBeInTheDocument();
    expect(screen.getByTestId('icon-ruler')).toBeInTheDocument();
    expect(screen.getByText(/tamaño/i)).toBeInTheDocument();
  });

  it('renders title even if icon is unknown', () => {
    render(<Screen inPageTitle="UnknownFunction">Contenido</Screen>);
    expect(screen.getByText(/unknownfunction/i)).toBeInTheDocument();
    expect(screen.queryByTestId(/icon/i)).not.toBeInTheDocument();
  });

  it('renders children inside layout container', () => {
    render(<Screen inPageTitle="LabelLens"><div>Contenido de etiqueta</div></Screen>);
    expect(screen.getByText(/contenido de etiqueta/i)).toBeInTheDocument();
  });
});
