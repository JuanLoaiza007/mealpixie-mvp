import { render, screen } from '@testing-library/react';
import { getIconForField } from '@/components/ui/features/vision/labellens/nutrientIcons';
import '@testing-library/jest-dom';

// Mock todos los íconos como SVG con `data-testid` para facilitar el testing
jest.mock('lucide-react', () => ({
  Flame: (props) => <svg data-testid="icon-flame" {...props} />,
  Droplet: (props) => <svg data-testid="icon-droplet" {...props} />,
  Candy: (props) => <svg data-testid="icon-candy" {...props} />,
  Drumstick: (props) => <svg data-testid="icon-drumstick" {...props} />,
  SprayCan: (props) => <svg data-testid="icon-spray" {...props} />,
  Utensils: (props) => <svg data-testid="icon-utensils" {...props} />,
  Wheat: (props) => <svg data-testid="icon-wheat" {...props} />,
  Egg: (props) => <svg data-testid="icon-egg" {...props} />,
  HeartPulse: (props) => <svg data-testid="icon-heart" {...props} />,
  Info: (props) => <svg data-testid="icon-info" {...props} />,
}));

// Utilidad para renderizar el resultado de getIconForField
const renderIcon = (name) => {
  const Icon = getIconForField(name);
  render(Icon);
};

describe('getIconForField', () => {
  it('devuelve ícono de calorías (Flame)', () => {
    renderIcon('Calorías');
    expect(screen.getByTestId('icon-flame')).toBeInTheDocument();
  });

  it('devuelve ícono de grasas (Droplet)', () => {
    renderIcon('Grasa total');
    expect(screen.getByTestId('icon-droplet')).toBeInTheDocument();
  });

  it('devuelve ícono de azúcar (Candy)', () => {
    renderIcon('Contenido de azúcar');
    expect(screen.getByTestId('icon-candy')).toBeInTheDocument();
  });

  it('devuelve ícono de proteína (Drumstick)', () => {
    renderIcon('Contenido proteico');
    expect(screen.getByTestId('icon-drumstick')).toBeInTheDocument();
  });

  it('devuelve ícono de sodio/sal (SprayCan)', () => {
    renderIcon('Sodio');
    expect(screen.getByTestId('icon-spray')).toBeInTheDocument();
  });

  it('devuelve ícono de carbohidratos (Utensils)', () => {
    renderIcon('Carbs');
    expect(screen.getByTestId('icon-utensils')).toBeInTheDocument();
  });

  it('devuelve ícono de fibra (Wheat)', () => {
    renderIcon('Fibra dietaria');
    expect(screen.getByTestId('icon-wheat')).toBeInTheDocument();
  });

  it('devuelve ícono de huevo (Egg)', () => {
    renderIcon('Huevo');
    expect(screen.getByTestId('icon-egg')).toBeInTheDocument();
  });

  it('devuelve ícono de vitaminas (HeartPulse)', () => {
    renderIcon('Vitamina C');
    expect(screen.getByTestId('icon-heart')).toBeInTheDocument();
  });

  it('devuelve ícono por defecto (Info) si no hay coincidencia', () => {
    renderIcon('Desconocido');
    expect(screen.getByTestId('icon-info')).toBeInTheDocument();
  });

  it('es insensible a mayúsculas/minúsculas y espacios', () => {
    renderIcon('  CALORÍAS  ');
    expect(screen.getByTestId('icon-flame')).toBeInTheDocument();
  });
});
