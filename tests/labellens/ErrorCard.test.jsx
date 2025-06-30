import { render, screen } from '@testing-library/react';
import { ErrorCard } from "@/components/ui/features/vision/labellens/ErrorCard";

jest.mock('framer-motion', () => {
  const React = require('react');
  return {
    motion: {
      div: ({ children }) => <div>{children}</div>,
    },
  };
});


describe('<ErrorCard />', () => {
  it('renders default title and message when no props are provided', () => {
    render(<ErrorCard />);
    
    expect(screen.getByText(/error/i)).toBeInTheDocument();
    expect(screen.getByText(/ha ocurrido un problema/i)).toBeInTheDocument();
  });

  it('renders custom title and message', () => {
    render(<ErrorCard title="Connection Failed" message="Unable to connect to the server." />);
    
    expect(screen.getByText(/Connection Failed/i)).toBeInTheDocument();
    expect(screen.getByText(/unable to connect to the server/i)).toBeInTheDocument();
  });

  it('renders alert icon (accessibility check)', () => {
    const { container } = render(<ErrorCard />);
    
    const svgIcon = container.querySelector('svg');
    expect(svgIcon).toBeInTheDocument();
  });
});
