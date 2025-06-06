import { render, screen, fireEvent } from '@testing-library/react';
import { SizeSageButton } from '@/components/ui/features/vision/size-sage/SizeSageButton';
import React from 'react';

describe('SizeSageButton', () => {
  const defaultProps = {
    onClick: jest.fn(),
    loading: { vision: false, text: false },
    phase: 2,
    total: 5,
  };

  it('renders con texto por defecto y es clickeable cuando no está en loading', () => {
    render(<SizeSageButton {...defaultProps} />);
    const button = screen.getByRole('button', { name: /analizar imagen/i });
    expect(button).toBeInTheDocument();
    expect(button).toBeEnabled();

    fireEvent.click(button);
    expect(defaultProps.onClick).toHaveBeenCalled();
  });

  it('muestra ícono (SVG) y texto "Analizando con modelo de visión" cuando loading.vision=true', () => {
    render(
      <SizeSageButton
        {...defaultProps}
        loading={{ vision: true, text: false }}
      />
    );
    const button = screen.getByRole('button', {
      name: /analizando con modelo de visión 2\/5/i,
    });
    expect(button).toBeDisabled();
    expect(
      screen.getByText(/analizando con modelo de visión 2\/5/i)
    ).toBeInTheDocument();

    // Verificamos que haya un <svg> dentro del botón (loader)
    const svgElement = button.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
  });

  it('muestra ícono (SVG) y texto "Generando respuesta final" cuando loading.text=true', () => {
    render(
      <SizeSageButton
        {...defaultProps}
        loading={{ vision: false, text: true }}
      />
    );
    const button = screen.getByRole('button', {
      name: /generando respuesta final/i,
    });
    expect(button).toBeDisabled();
    expect(screen.getByText(/generando respuesta final/i)).toBeInTheDocument();

    // Verificamos que haya un <svg> dentro del botón (loader)
    const svgElement = button.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
  });

  it('cumple con accesibilidad: getByRole y getByLabelText funcionan para el botón', () => {
    render(<SizeSageButton {...defaultProps} />);
    const button = screen.getByRole('button', { name: /analizar imagen/i });
    expect(button).toHaveAccessibleName('Analizar imagen');
  });
});
