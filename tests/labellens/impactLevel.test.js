import { getImpactLevel } from '@/components/ui/features/vision/labellens/impactLevel';

describe('getImpactLevel', () => {
  it('detecta impacto Perjudicial por palabras clave negativas', () => {
    expect(getImpactLevel('Este producto puede aumentar el colesterol.')).toEqual({
      label: 'Perjudicial',
      color: 'destructive',
    });
    expect(getImpactLevel('Alto riesgo de hipertensión y diabetes')).toEqual({
      label: 'Perjudicial',
      color: 'destructive',
    });
    expect(getImpactLevel('Consumo en exceso puede ser perjudicial')).toEqual({
      label: 'Perjudicial',
      color: 'destructive',
    });
  });

  it('detecta impacto Recomendado por palabras clave positivas', () => {
    expect(getImpactLevel('Este alimento es beneficioso para la salud')).toEqual({
      label: 'Recomendado',
      color: 'success',
    });
    expect(getImpactLevel('Recomendado por expertos en salud')).toEqual({
      label: 'Recomendado',
      color: 'success',
    });
    expect(getImpactLevel('Ayuda a mantener una buena digestión')).toEqual({
      label: 'Recomendado',
      color: 'success',
    });
  });

  it('detecta impacto Neutro por palabras de neutralidad', () => {
    expect(getImpactLevel('Este ingrediente no afecta la salud')).toEqual({
      label: 'Neutro',
      color: 'secondary',
    });
    expect(getImpactLevel('Este componente es neutro')).toEqual({
      label: 'Neutro',
      color: 'secondary',
    });
    expect(getImpactLevel('No perjudicial ni beneficioso')).toEqual({
      label: 'Perjudicial',
      color: 'destructive',
    });

  });

  it('retorna "Sin Informacion" si no se encuentra ninguna palabra clave', () => {
    expect(getImpactLevel('Contenido de uso general')).toEqual({
      label: 'Sin Informacion',
      color: 'secondary',
    });
    expect(getImpactLevel('')).toEqual({
      label: 'Sin Informacion',
      color: 'secondary',
    });
  });

  it('ignora mayúsculas y acentos', () => {
    expect(getImpactLevel('ESTE PRODUCTO ES BENEFICIOSO')).toEqual({
      label: 'Recomendado',
      color: 'success',
    });
    expect(getImpactLevel('Puede causar HIPERTENSIÓN')).toEqual({
      label: 'Perjudicial',
      color: 'destructive',
    });
  });
});
