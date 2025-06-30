// tests/fresh-sense/FreshSenseMessageCard.test.jsx

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { FreshSenseMessageCard } from '@/components/ui/features/vision/fresh-sense/FreshSenseMessageCard';

// Mockeamos las dependencias de Card para simplificar la prueba
jest.mock('@/components/ui/card', () => ({
  Card: ({ children, className }) => <div data-testid="card" className={className}>{children}</div>,
  CardHeader: ({ children }) => <header>{children}</header>,
  CardTitle: ({ children }) => <h2>{children}</h2>,
  CardContent: ({ children }) => <section>{children}</section>,
}));

describe('FreshSenseMessageCard', () => {
  it('renderiza el título "Resultado" y el mensaje proporcionado', () => {
    const testMessage = 'Este es un mensaje de prueba';

    render(<FreshSenseMessageCard message={testMessage} />);

    // Verificar que el título "Resultado" exista y sea un heading (h2 en nuestro mock)
    const heading = screen.getByRole('heading', { name: /resultado/i });
    expect(heading).toBeInTheDocument();

    // Verificar que el párrafo muestre el mensaje
    const paragraph = screen.getByText(testMessage);
    expect(paragraph).toBeInTheDocument();

    // Verificar que el componente padre tenga la clase CSS esperada
    const cardElement = screen.getByTestId('card');
    expect(cardElement).toHaveClass('border-gray-300 w-full max-w-2xl mx-auto mt-4');
  });

  it('renderiza un elemento <p> vacío cuando el mensaje es cadena vacía', () => {
    render(<FreshSenseMessageCard message="" />);

    // Para este caso, debería renderizar un <p> aunque esté vacío
    const paragraph = screen.getByText('', { selector: 'p' });
    expect(paragraph).toBeInTheDocument();

    // El <h2> con "Resultado" sigue presente
    const heading = screen.getByRole('heading', { name: /resultado/i });
    expect(heading).toBeInTheDocument();
  });
});
