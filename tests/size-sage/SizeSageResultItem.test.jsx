import { render, screen } from '@testing-library/react';
import { SizeSageResultItem } from '@/components/ui/features/vision/size-sage/SizeSageResultItem';
describe('SizeSageResultItem', () => {
  const defaultProps = {
    object: 'Plate',
    item: 'Apple',
    largo_cm: 8.5,
    ancho_cm: 8.5,
    alto_cm: 7,
    volumen_cm3: 500.75,
  };

  it('renders all measurement fields correctly', () => {
    render(<SizeSageResultItem {...defaultProps} />);

    expect(screen.getByRole('heading', { level: 4, name: /apple/i })).toBeInTheDocument();
    expect(screen.getByText((_, el) => el.textContent === 'Referencia: Plate')).toBeInTheDocument();
    expect(screen.getByText((_, el) => el.textContent === 'Largo: 8.50 cm')).toBeInTheDocument();
    expect(screen.getByText((_, el) => el.textContent === 'Ancho: 8.50 cm')).toBeInTheDocument();
    expect(screen.getByText((_, el) => el.textContent === 'Alto: 7.00 cm')).toBeInTheDocument();
    expect(screen.getByText((_, el) => el.textContent === 'Volumen: 500.75 cm³')).toBeInTheDocument();
  });

  it('renders with edge values (zero and high precision)', () => {
    render(
      <SizeSageResultItem
        object="Coin"
        item="Pea"
        largo_cm={0}
        ancho_cm={0.123456}
        alto_cm={0.9999}
        volumen_cm3={0.0042}
      />
    );

    expect(screen.getByText((_, el) => el.textContent === 'Largo: 0.00 cm')).toBeInTheDocument();
    expect(screen.getByText((_, el) => el.textContent === 'Ancho: 0.12 cm')).toBeInTheDocument();
    expect(screen.getByText((_, el) => el.textContent === 'Alto: 1.00 cm')).toBeInTheDocument();
    expect(screen.getByText((_, el) => el.textContent === 'Volumen: 0.00 cm³')).toBeInTheDocument();
  });

  it('ensures basic accessibility with heading', () => {
    render(<SizeSageResultItem {...defaultProps} />);
    expect(screen.getByRole('heading', { level: 4 })).toBeInTheDocument();
  });

  // Opcional, solo si agregas valores por defecto:
  it('handles missing numeric props gracefully', () => {
    render(<SizeSageResultItem object="Hand" item="Banana" />);
    expect(screen.getByText((_, el) => el.textContent === 'Largo: 0.00 cm')).toBeInTheDocument();
  });
});
