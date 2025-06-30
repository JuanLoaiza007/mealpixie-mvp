import { render, screen } from '@testing-library/react';
import Screen from '@/components/ui/features/common/Screen';
import { functionIcons } from '@/components/ui/features/common/Screen';
import { userNavRoutes } from '@/config/userNavRoutes';
import '@testing-library/jest-dom';

// Mock de next/link
jest.mock('next/link', () => {
  return ({ href, children, ...rest }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  );
});

describe('Screen component', () => {
  it('renders title with correct icon when inPageTitle is valid', () => {
    const title = 'Analyzer';
    const Icon = functionIcons[title];

    render(
      <Screen inPageTitle={title}>
        <p>Contenido de prueba</p>
      </Screen>
    );

    // Validamos el título renderizado
    expect(screen.getByText(title)).toBeInTheDocument();

    // Validamos que el ícono esté en el documento
    const icon = screen.getByTestId('icon');
    expect(icon).toBeInTheDocument();
    expect(icon.tagName.toLowerCase()).toBe('svg');
  });

  it('renders without icon if inPageTitle does not match', () => {
    render(
      <Screen inPageTitle="UnknownTitle">
        <p>Contenido sin ícono</p>
      </Screen>
    );

    expect(screen.getByText('UnknownTitle')).toBeInTheDocument();
    expect(screen.queryByTestId('icon')).not.toBeInTheDocument();
  });

  it('renders children content', () => {
    render(
      <Screen inPageTitle="Analyzer">
        <div data-testid="child">Contenido interno</div>
      </Screen>
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.getByText('Contenido interno')).toBeInTheDocument();
  });

  it('renders "Volver al inicio" link with Home icon', () => {
    const href = userNavRoutes.find((r) => r.id === 'vision')?.href;
  
    render(<Screen inPageTitle="Analyzer">test</Screen>);
  
    const link = screen.getByTitle('Volver al inicio');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', href);
  
    // Comprobamos que contenga un ícono SVG (no accesible por rol)
    const svgIcon = link.querySelector('svg');
    expect(svgIcon).toBeInTheDocument();
  });

  it('has accessible heading', () => {
    render(<Screen inPageTitle="InstaRecipe">test</Screen>);

    const heading = screen.getByRole('heading', { name: 'InstaRecipe' });
    expect(heading).toBeInTheDocument();
  });
});
