import { render, screen, fireEvent } from '@testing-library/react';
import ImageSourceDialog from '@/components/ui/features/vision/imageSourceDialog';

jest.mock('@/utils/media', () => ({
  handleTakePhoto: jest.fn(),
  handleChooseFromGallery: jest.fn(),
}));

import { handleTakePhoto, handleChooseFromGallery } from '@/utils/media';

describe('<ImageSourceDialog />', () => {
  const mockOnOpenChange = jest.fn();
  const mockOnImageSelected = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza el modal con título y botones cuando open=true', () => {
    render(
      <ImageSourceDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onImageSelected={mockOnImageSelected}
      />
    );

    expect(screen.getByText(/seleccionar origen de la foto/i)).toBeInTheDocument();
    expect(screen.getByText(/tomar foto/i)).toBeInTheDocument();
    expect(screen.getByText(/elegir de la galería/i)).toBeInTheDocument();
    expect(screen.getByText(/cancelar/i)).toBeInTheDocument();
  });

  it('llama a handleTakePhoto y cierra el modal al hacer click en "Tomar foto"', () => {
    render(
      <ImageSourceDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onImageSelected={mockOnImageSelected}
      />
    );

    fireEvent.click(screen.getByText(/tomar foto/i));
    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    expect(handleTakePhoto).toHaveBeenCalledWith(mockOnImageSelected);
  });

  it('llama a handleChooseFromGallery y cierra el modal al hacer click en "Elegir de la galería"', () => {
    render(
      <ImageSourceDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onImageSelected={mockOnImageSelected}
      />
    );

    fireEvent.click(screen.getByText(/elegir de la galería/i));
    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    expect(handleChooseFromGallery).toHaveBeenCalledWith(mockOnImageSelected);
  });

  it('cierra el modal al hacer click en "Cancelar"', () => {
    render(
      <ImageSourceDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onImageSelected={mockOnImageSelected}
      />
    );

    fireEvent.click(screen.getByText(/cancelar/i));
    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });
});
