import { render, screen, fireEvent } from '@testing-library/react';
import SidebarNav from '@/components/ui/features/SidebarNav';
import { usePathname } from 'next/navigation';

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

jest.mock('@/config/userNavRoutes', () => ({
  NAV_TAGS: {
    page: 'page',
  },
  userNavRoutes: [
    {
      id: 'home',
      label: 'Inicio',
      href: '/home',
      icon: (props) => <svg data-testid="home-icon" {...props} />,
      tags: ['page'],
    },
    {
      id: 'settings',
      label: 'Configuración',
      href: '/settings',
      icon: (props) => <svg data-testid="settings-icon" {...props} />,
      tags: ['page'],
    },
  ],
}));

jest.mock('@/config/constantsApp', () => ({
  APP_NAME: 'MealPixie',
  APP_VERSION: '1.0.0',
}));

jest.mock('@/assets/assets', () => ({
  assets: { logo: '/logo.png' },
}));

describe('<SidebarNav />', () => {
  beforeEach(() => {
    usePathname.mockReturnValue('/home');
  });

  it('muestra el logo, nombre de app y versión por defecto', () => {
    render(<SidebarNav />);
    expect(screen.getByAltText(/mealpixie logo/i)).toBeInTheDocument();
    expect(screen.getByText(/mealpixie/i)).toBeInTheDocument();
    expect(screen.getByText(/v1\.0\.0/i)).toBeInTheDocument();
  });

  it('renderiza los botones de navegación con íconos y etiquetas', () => {
    render(<SidebarNav />);
    expect(screen.getByTestId('home-icon')).toBeInTheDocument();
    expect(screen.getByText('Inicio')).toBeInTheDocument();
    expect(screen.getByTestId('settings-icon')).toBeInTheDocument();
    expect(screen.getByText('Configuración')).toBeInTheDocument();
  });

  it('resalta la ruta activa con clases específicas', () => {
    const { container } = render(<SidebarNav />);
    const activeBtn = container.querySelector('.text-orange-500.bg-orange-100');
    expect(activeBtn).toBeInTheDocument();
    expect(activeBtn).toHaveTextContent('Inicio');
  });

  it('puede colapsar y expandir el menú con el botón toggle', () => {
    render(<SidebarNav />);
    const toggleBtn = screen.getAllByRole('button')[0];
    expect(screen.getByText(/mealpixie/i)).toBeInTheDocument(); // Expandido
    fireEvent.click(toggleBtn);
    expect(screen.queryByText(/mealpixie/i)).not.toBeInTheDocument(); // Colapsado
  });
});
