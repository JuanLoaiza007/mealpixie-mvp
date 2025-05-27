import { render, screen, fireEvent } from '@testing-library/react';
import ImagePreviewCard from '@/components/ui/features/common/ImagePreviewCard';
import '@testing-library/jest-dom';

jest.mock('next/image', () => (props) => {
  return <img {...props} data-testid="next-image" />;
});

describe('<ImagePreviewCard />', () => {
  const defaultProps = {
    imageUrl: '/test.jpg',
    alt: 'Etiqueta de prueba',
  };

  it('renderiza la imagen con alt y src correctamente', () => {
    render(<ImagePreviewCard {...defaultProps} />);

    const image = screen.getByTestId('next-image');
    expect(image).toHaveAttribute('src', expect.stringContaining('/test.jpg'));
    expect(image).toHaveAttribute('alt', 'Etiqueta de prueba');
  });

  it('renderiza children dentro del card', () => {
    render(
      <ImagePreviewCard {...defaultProps}>
        <p>Texto dentro del card</p>
      </ImagePreviewCard>
    );
    expect(screen.getByText(/texto dentro del card/i)).toBeInTheDocument();
  });

  it('aplica clases personalizadas cuando se pasan', () => {
    const { container } = render(
      <ImagePreviewCard
        {...defaultProps}
        styles={{ card: 'custom-card', image: 'custom-img' }}
        className="extra-card-class"
      />
    );

    const card = container.querySelector('.custom-card');
    const image = screen.getByTestId('next-image');

    expect(card).toBeInTheDocument();
    expect(image).toHaveClass('custom-img');
    expect(card).toHaveClass('extra-card-class');
  });

  it('llama a onClick cuando se hace click en el card', () => {
    const onClickMock = jest.fn();
    render(<ImagePreviewCard {...defaultProps} onClick={onClickMock} />);

    const card = screen.getByTestId('next-image').closest('div');
    fireEvent.click(card);
    expect(onClickMock).toHaveBeenCalled();
  });

  it('no renderiza imagen si imageUrl es falsy', () => {
    render(<ImagePreviewCard alt="Alt sin imagen" />);
    expect(screen.queryByTestId('next-image')).not.toBeInTheDocument();
  });
});
