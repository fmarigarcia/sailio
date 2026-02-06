import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Spinner } from '../spinner';

describe('Spinner', () => {
  describe('Renderizado básico', () => {
    it('debe renderizar correctamente', () => {
      render(<Spinner />);
      const spinner = screen.getByRole('status');
      expect(spinner).toBeInTheDocument();
    });

    it('debe tener aria-label por defecto', () => {
      render(<Spinner />);
      const spinner = screen.getByRole('status');
      expect(spinner).toHaveAttribute('aria-label', 'Loading...');
    });

    it('debe permitir aria-label personalizado', () => {
      render(<Spinner ariaLabel="Cargando datos..." />);
      const spinner = screen.getByRole('status');
      expect(spinner).toHaveAttribute('aria-label', 'Cargando datos...');
    });

    it('debe tener texto visualmente oculto para screen readers', () => {
      render(<Spinner ariaLabel="Cargando" />);
      const hiddenText = screen.getByText('Cargando');
      expect(hiddenText).toHaveClass('spinner__visually-hidden');
    });
  });

  describe('Tamaños', () => {
    it('debe aplicar clase small', () => {
      const { container } = render(<Spinner size="small" />);
      expect(container.querySelector('.spinner--small')).toBeInTheDocument();
    });

    it('debe aplicar clase medium por defecto', () => {
      const { container } = render(<Spinner />);
      expect(container.querySelector('.spinner--medium')).toBeInTheDocument();
    });

    it('debe aplicar clase large', () => {
      const { container } = render(<Spinner size="large" />);
      expect(container.querySelector('.spinner--large')).toBeInTheDocument();
    });
  });

  describe('Variantes', () => {
    it('debe aplicar clase inline por defecto', () => {
      const { container } = render(<Spinner />);
      expect(container.querySelector('.spinner--inline')).toBeInTheDocument();
    });

    it('debe aplicar clase centered', () => {
      const { container } = render(<Spinner variant="centered" />);
      expect(container.querySelector('.spinner--centered')).toBeInTheDocument();
    });

    it('debe aplicar clase overlay', () => {
      const { container } = render(<Spinner variant="overlay" />);
      expect(container.querySelector('.spinner--overlay')).toBeInTheDocument();
    });

    it('debe renderizar backdrop cuando variant es overlay', () => {
      const { container } = render(<Spinner variant="overlay" />);
      const backdrop = container.querySelector('.spinner__backdrop');
      expect(backdrop).toBeInTheDocument();
      expect(backdrop).toHaveAttribute('aria-hidden', 'true');
    });

    it('NO debe renderizar backdrop cuando variant NO es overlay', () => {
      const { container } = render(<Spinner variant="inline" />);
      const backdrop = container.querySelector('.spinner__backdrop');
      expect(backdrop).not.toBeInTheDocument();
    });
  });

  describe('Label', () => {
    it('NO debe mostrar label si no se proporciona', () => {
      const { container } = render(<Spinner />);
      const label = container.querySelector('.spinner__label');
      expect(label).not.toBeInTheDocument();
    });

    it('debe mostrar label si se proporciona', () => {
      render(<Spinner label="Cargando datos..." />);
      const label = screen.getByText('Cargando datos...');
      expect(label).toBeInTheDocument();
      expect(label).toHaveClass('spinner__label');
    });
  });

  describe('Clases personalizadas', () => {
    it('debe aplicar className personalizado', () => {
      const { container } = render(<Spinner className="custom-spinner" />);
      expect(container.querySelector('.custom-spinner')).toBeInTheDocument();
    });

    it('debe combinar clases base con className personalizado', () => {
      const { container } = render(
        <Spinner size="large" variant="centered" className="my-spinner" />
      );
      const spinner = container.querySelector('.spinner');
      expect(spinner).toHaveClass('spinner');
      expect(spinner).toHaveClass('spinner--large');
      expect(spinner).toHaveClass('spinner--centered');
      expect(spinner).toHaveClass('my-spinner');
    });
  });

  describe('Estructura DOM', () => {
    it('debe tener la estructura correcta', () => {
      const { container } = render(<Spinner />);

      const spinner = container.querySelector('.spinner');
      expect(spinner).toBeInTheDocument();

      const spinnerContainer = container.querySelector('.spinner__container') as HTMLElement;
      expect(spinnerContainer).toBeInTheDocument();
      expect(spinner).toContainElement(spinnerContainer);

      const circle = container.querySelector('.spinner__circle') as HTMLElement;
      expect(circle).toBeInTheDocument();
      expect(spinnerContainer).toContainElement(circle);
    });

    it('debe incluir label en el container si está presente', () => {
      const { container } = render(<Spinner label="Loading..." />);
      const spinnerContainer = container.querySelector('.spinner__container') as HTMLElement;
      const label = container.querySelector('.spinner__label') as HTMLElement;

      expect(label).toBeInTheDocument();
      expect(spinnerContainer).toContainElement(label);
    });
  });

  describe('Accesibilidad', () => {
    it('debe tener role="status"', () => {
      render(<Spinner />);
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('el backdrop debe tener aria-hidden="true"', () => {
      const { container } = render(<Spinner variant="overlay" />);
      const backdrop = container.querySelector('.spinner__backdrop');
      expect(backdrop).toHaveAttribute('aria-hidden', 'true');
    });

    it('debe ser anunciado por screen readers', () => {
      render(<Spinner ariaLabel="Guardando cambios" />);
      // El texto debe estar presente para screen readers
      expect(screen.getByText('Guardando cambios')).toBeInTheDocument();
    });
  });

  describe('Display Name', () => {
    it('debe tener displayName configurado', () => {
      expect(Spinner.displayName).toBe('Spinner');
    });
  });
});
