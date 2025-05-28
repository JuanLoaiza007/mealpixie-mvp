// __tests__/InstaRecipeButton.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { InstaRecipeButton } from '@/components/ui/features/vision/insta-recipe/InstaRecipeButton';

describe('InstaRecipeButton', () => {
  const onClickMock = jest.fn();

  beforeEach(() => {
    onClickMock.mockClear();
  });

  it('muestra el texto "Analizar imagen" y llama a onClick al hacer click', () => {
    render(
      <InstaRecipeButton
        onClick={onClickMock}
        loading={{ vision: false, text: false }}
        phase={0}
        total={0}
      />
    );

    const button = screen.getByRole('button', { name: /Analizar imagen/i });
    expect(button).toBeEnabled();

    fireEvent.click(button);
    expect(onClickMock).toHaveBeenCalledTimes(1);
  });

  it('estado loading.vision true: deshabilita el botón, muestra spinner y texto de fase', () => {
    render(
      <InstaRecipeButton
        onClick={onClickMock}
        loading={{ vision: true, text: false }}
        phase={2}
        total={5}
      />
    );

    const button = screen.getByRole('button', {
      name: /Analizando con modelo de visión 2\/5/i,
    });
    expect(button).toBeDisabled();

    // Comprueba que hay un elemento con la clase del spinner
    const spinner = button.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();

    fireEvent.click(button);
    expect(onClickMock).not.toHaveBeenCalled();
  });

  it('estado loading.text true (vision false): deshabilita el botón y muestra texto final', () => {
    render(
      <InstaRecipeButton
        onClick={onClickMock}
        loading={{ vision: false, text: true }}
        phase={0}
        total={0}
      />
    );

    const button = screen.getByRole('button', {
      name: /Generando respuesta final/i,
    });
    expect(button).toBeDisabled();

    const spinner = button.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('cambia dinámicamente entre estados de loading', () => {
    const { rerender } = render(
      <InstaRecipeButton
        onClick={onClickMock}
        loading={{ vision: false, text: false }}
        phase={0}
        total={0}
      />
    );

    // Estado inicial
    expect(screen.getByRole('button', { name: /Analizar imagen/i })).toBeEnabled();

    // Paso a vision
    rerender(
      <InstaRecipeButton
        onClick={onClickMock}
        loading={{ vision: true, text: false }}
        phase={1}
        total={3}
      />
    );
    expect(
      screen.getByRole('button', { name: /Analizando con modelo de visión 1\/3/i })
    ).toBeDisabled();

    // Paso a text
    rerender(
      <InstaRecipeButton
        onClick={onClickMock}
        loading={{ vision: false, text: true }}
        phase={0}
        total={0}
      />
    );
    expect(
      screen.getByRole('button', { name: /Generando respuesta final/i })
    ).toBeDisabled();
  });
});
