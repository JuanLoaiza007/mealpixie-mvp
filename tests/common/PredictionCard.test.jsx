import { render, screen, fireEvent } from '@testing-library/react';
import { PredictionCard } from '@/components/ui/features/common/PredictionCard';
import '@testing-library/jest-dom';

// Mocks de íconos
jest.mock('lucide-react', () => ({
  ChevronDown: (props) => <svg data-testid="icon-down" {...props} />,
  ChevronUp: (props) => <svg data-testid="icon-up" {...props} />,
}));

describe('<PredictionCard />', () => {
  const mockToggle = jest.fn();
  const sampleResult = {
    isFood: true,
    name: 'Pan integral',
    description: 'Contiene granos enteros ricos en fibra.',
  };
  const sampleOutputs = ['Pan', 'Pan de trigo', 'Pan integral'];

  afterEach(() => mockToggle.mockClear());

  it('muestra el nombre del alimento si es válido', () => {
    render(
      <PredictionCard
        finalResult={sampleResult}
        showPredictions={false}
        toggle={mockToggle}
        visionOutputs={sampleOutputs}
      />
    );

    expect(screen.getByText(/pan integral/i)).toBeInTheDocument();
    expect(screen.getByText(/contiene granos enteros/i)).toBeInTheDocument();
    expect(screen.getByText(/mostrar predicciones/i)).toBeInTheDocument();
    expect(screen.getByTestId('icon-down')).toBeInTheDocument();
  });

  it('muestra mensaje cuando no se detecta alimento', () => {
    render(
      <PredictionCard
        finalResult={{ isFood: false }}
        showPredictions={false}
        toggle={mockToggle}
        visionOutputs={[]}
      />
    );

    expect(screen.getByText(/no he detectado nada/i)).toBeInTheDocument();
  });

  it('muestra predicciones cuando showPredictions es true', () => {
    render(
      <PredictionCard
        finalResult={sampleResult}
        showPredictions={true}
        toggle={mockToggle}
        visionOutputs={sampleOutputs}
      />
    );

    sampleOutputs.forEach((text, i) => {
      expect(screen.getByText(`Predicción ${i + 1}: ${text}`)).toBeInTheDocument();
    });

    expect(screen.getByText(/ocultar predicciones/i)).toBeInTheDocument();
    expect(screen.getByTestId('icon-up')).toBeInTheDocument();
  });

  it('llama a toggle al hacer click en el botón', () => {
    render(
      <PredictionCard
        finalResult={sampleResult}
        showPredictions={false}
        toggle={mockToggle}
        visionOutputs={sampleOutputs}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /mostrar predicciones/i }));
    expect(mockToggle).toHaveBeenCalled();
  });
});
