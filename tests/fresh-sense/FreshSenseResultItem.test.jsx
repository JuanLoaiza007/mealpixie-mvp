// tests/fresh-sense/FreshSenseResultItem.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { FreshSenseResultItem } from '@/components/ui/features/vision/fresh-sense/FreshSenseResultItem';

describe('FreshSenseResultItem', () => {
  it('debe renderizar la etiqueta del ítem, el texto de assessment y el icono', () => {
    const mockIcon = <span data-testid="icon-mock">ICON</span>;

    render(
      <FreshSenseResultItem
        item="Temperature"
        assessment="Within normal range"
        icon={mockIcon}
      />
    );

    // 1) Verificar que el heading (h4) aparece con el texto correcto
    const heading = screen.getByRole('heading', { name: /temperature/i });
    expect(heading).toBeInTheDocument();

    // 2) Verificar que el párrafo con el assessment aparezca
    const assessmentText = screen.getByText(/within normal range/i);
    expect(assessmentText).toBeInTheDocument();

    // 3) Verificar que el ícono con data-testid="icon-mock" esté presente
    const iconElement = screen.getByTestId('icon-mock');
    expect(iconElement).toBeInTheDocument();
  });

  it('debería pasar verificaciones básicas de accesibilidad', () => {
    // En este caso, agregamos aria-label al icono para testear getByLabelText
    const accessibleIcon = <span aria-label="Sensor Icon" data-testid="icon-accessible">🔍</span>;

    render(
      <FreshSenseResultItem
        item="Humidity"
        assessment="High humidity detected"
        icon={accessibleIcon}
      />
    );

    // 1) El heading con nivel “heading” debe ser detectable por role=heading
    const heading = screen.getByRole('heading', { name: /humidity/i });
    expect(heading).toBeInTheDocument();

    // 2) El icono debe poder localizarse con getByLabelText
    const iconByLabel = screen.getByLabelText(/sensor icon/i);
    expect(iconByLabel).toBeInTheDocument();
  });

  it('renderiza correctamente aun si se pasa assessment vacío', () => {
    const mockIcon = <span data-testid="icon-empty">ICON</span>;

    const { container } = render(
      <FreshSenseResultItem
        item="Pressure"
        assessment="" // assessment vacío
        icon={mockIcon}
      />
    );

    // 1) El heading sigue presente
    const heading = screen.getByRole('heading', { name: /pressure/i });
    expect(heading).toBeInTheDocument();

    // 2) Debe existir el párrafo (<p>) aunque esté vacío
    const pElement = container.querySelector('p');
    expect(pElement).toBeInTheDocument();
    expect(pElement.textContent).toBe('');

    // 3) El icono sigue presente
    const iconElement = screen.getByTestId('icon-empty');
    expect(iconElement).toBeInTheDocument();
  });
});
