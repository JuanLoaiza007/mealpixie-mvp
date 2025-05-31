// tests/fresh-sense/FreshSenseButton.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { FreshSenseButton } from '@/components/ui/features/vision/fresh-sense/FreshSenseButton';

describe('FreshSenseButton', () => {
  const defaultProps = {
    onClick: jest.fn(),
    loading: { vision: false, text: false },
    phase: 1,
    total: 5,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debe renderizar el botón con etiqueta "Analizar imagen" cuando no está cargando', () => {
    render(<FreshSenseButton {...defaultProps} />);
    const button = screen.getByRole('button', { name: /analizar imagen/i });
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
  });

  it('debe invocar onClick al hacer clic cuando no hay loading', () => {
    render(<FreshSenseButton {...defaultProps} />);
    const button = screen.getByRole('button', { name: /analizar imagen/i });
    fireEvent.click(button);
    expect(defaultProps.onClick).toHaveBeenCalledTimes(1);
  });

  it('debe mostrar estado de "Analizando con modelo de visión" y deshabilitar botón cuando loading.vision es true', () => {
    const props = {
      ...defaultProps,
      loading: { vision: true, text: false },
      phase: 2,
      total: 5,
    };
    render(<FreshSenseButton {...props} />);

    const expectedText = `Analizando con modelo de visión ${props.phase}/${props.total}`;
    const button = screen.getByRole('button', { name: new RegExp(expectedText, 'i') });
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();

    const spinner = button.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('no debe invocar onClick cuando loading.vision es true', () => {
    const props = {
      ...defaultProps,
      loading: { vision: true, text: false },
      phase: 2,
      total: 5,
    };
    render(<FreshSenseButton {...props} />);
    const button = screen.getByRole('button', { name: /analizando con modelo de visión 2\/5/i });
    expect(button).toBeDisabled();
    fireEvent.click(button);
    expect(defaultProps.onClick).not.toHaveBeenCalled();
  });

  it('debe mostrar estado de "Generando respuesta final" y deshabilitar botón cuando loading.text es true', () => {
    const props = {
      ...defaultProps,
      loading: { vision: false, text: true },
    };
    render(<FreshSenseButton {...props} />);
    const button = screen.getByRole('button', { name: /generando respuesta final/i });
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();

    const spinner = button.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('no debe invocar onClick cuando loading.text es true', () => {
    const props = {
      ...defaultProps,
      loading: { vision: false, text: true },
    };
    render(<FreshSenseButton {...props} />);
    const button = screen.getByRole('button', { name: /generando respuesta final/i });
    expect(button).toBeDisabled();
    fireEvent.click(button);
    expect(defaultProps.onClick).not.toHaveBeenCalled();
  });

  it('mantiene accesibilidad: detectable por role y nombre', () => {
    render(<FreshSenseButton {...defaultProps} />);
    // Solo comprobamos que getByRole encuentre el botón con el texto adecuado.
    const button = screen.getByRole('button', { name: /analizar imagen/i });
    expect(button).toBeInTheDocument();
  });
});
