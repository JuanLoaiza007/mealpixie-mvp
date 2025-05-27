import { render, screen, fireEvent } from '@testing-library/react';
import MobileNav from '@/components/ui/features/MobileNav';
import { usePathname } from 'next/navigation';
import { useMobileTopBar } from '@/context/mobileTopBar';

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
  useRouter: jest.fn(() => ({ back: jest.fn() })),
}));

jest.mock('@/context/mobileTopBar', () => ({
  useMobileTopBar: jest.fn(),
}));

jest.mock('@/config/userNavRoutes', () => ({
  NAV_TAGS: {
    page: 'page',
    requiredTopBar: 'requiredTopBar',
  },
  userNavRoutes: [
    {
      id: 'home',
      label: 'Inicio',
      href: '/home',
      icon: (props) => <svg data-testid="home-icon" {...props} />,
      tags: ['page', 'requiredTopBar'],
    },
    {
      id: 'settings',
      label: 'Ajustes',
      href: '/settings',
      icon: (props) => <svg data-testid="settings-icon" {...props} />,
      tags: ['page'],
    },
    {
      id: 'secret',
      label: 'Oculto',
      href: '/secret',
      icon: (props) => <svg data-testid="hidden-icon" {...props} />,
      tags: [],
    },
  ],
}));

describe('<MobileNav />', () => {
  beforeEach(() => {
    useMobileTopBar.mockReturnValue({ title: 'Título Actual' });
  });

  it('muestra topbar si la ruta lo requiere', () => {
    usePathname.mockReturnValue('/home');
    render(<MobileNav />);
    expect(screen.getByText(/título actual/i)).toBeInTheDocument();
    const buttons = screen.getAllByRole('button');
    expect(buttons[0]).toBeInTheDocument(); 
  });

  it('no muestra topbar si la ruta no lo requiere', () => {
    usePathname.mockReturnValue('/settings');
    render(<MobileNav />);
    expect(screen.queryByText(/título actual/i)).not.toBeInTheDocument();
  });

  it('renderiza navegación inferior para rutas tipo "page"', () => {
    usePathname.mockReturnValue('/settings');
    render(<MobileNav />);
    expect(screen.getByTestId('settings-icon')).toBeInTheDocument();
    expect(screen.getByText('Ajustes')).toBeInTheDocument();
    expect(screen.queryByTestId('hidden-icon')).not.toBeInTheDocument();
  });

  it('marca la ruta activa en la navegación inferior', () => {
    usePathname.mockReturnValue('/settings');
    const { container } = render(<MobileNav />);
    const activeBtn = container.querySelector('.text-orange-500');
    expect(activeBtn).toBeInTheDocument();
    expect(activeBtn).toHaveTextContent('Ajustes');
  });
});
