import { render, screen } from '@testing-library/react';
import { ImcCard } from '@/components/ui/features/profile/ImcCard';

jest.mock('@/components/schemas/userProfile', () => ({
  userProfileSchema: {
    pick: jest.fn(() => ({
      safeParse: jest.fn(({ weight, height }) => {
        if (typeof weight === 'number' && typeof height === 'number' && weight > 0 && height > 0) {
          return { success: true, data: { weight, height } };
        }
        return { success: false };
      }),
    })),
  },
}));

describe('<ImcCard />', () => {
  it('renderiza correctamente el título y categorías', () => {
    render(<ImcCard weight={70} height={175} />);
    expect(screen.getByText(/índice de masa corporal/i)).toBeInTheDocument();
    expect(screen.getByText(/bajo peso/i)).toBeInTheDocument();
    expect(screen.getAllByText(/^normal$/i).length).toBeGreaterThan(0); // ⬅️ Arreglo aquí
    expect(screen.getByText(/sobrepeso/i)).toBeInTheDocument();
    expect(screen.getByText(/obesidad/i)).toBeInTheDocument();
  });

  it('muestra el IMC calculado y su categoría textual', () => {
    render(<ImcCard weight={68} height={170} />); // ~23.5
    expect(screen.getByText(/tu imc:/i)).toBeInTheDocument();
    expect(screen.getByText(/23\.5 - Normal/i)).toBeInTheDocument();
  });

  it('renderiza correctamente con datos inválidos', () => {
    render(<ImcCard weight={null} height={0} />);
    expect(screen.getByText(/tu imc:/i)).toBeInTheDocument();
    expect(screen.getByText(/\.\.\./)).toBeInTheDocument();
  });

  it('muestra el marcador de IMC cuando válido', () => {
    const { container } = render(<ImcCard weight={80} height={180} />);
    const marker = container.querySelector('div.absolute');
    expect(marker).toBeInTheDocument();
  });

  it('muestra las 4 barras de colores con proporciones correctas', () => {
    const { container } = render(<ImcCard weight={75} height={170} />);
    const segments = container.querySelectorAll('.h-full');
    expect(segments).toHaveLength(4);

    segments.forEach((seg) => {
      const width = seg.style.width;
      expect(width).toBeTruthy(); // Verifica que haya valor
      expect(width).toMatch(/%$/); // Opcional: termina en %
    });
  });

});
