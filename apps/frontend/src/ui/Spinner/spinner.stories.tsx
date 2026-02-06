import type { Meta, StoryObj } from '@storybook/react';
import { Spinner } from './spinner';
import './spinner.css';
import './spinner-stories.css';

const meta = {
  title: 'UI/Feedback/Spinner',
  component: Spinner,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
El componente **Spinner** es el indicador de carga universal del design system.

### Casos de uso:
- **Botones**: Spinner pequeño inline durante acciones async
- **Secciones**: Spinner mediano centrado mientras carga contenido
- **Páginas completas**: Spinner con overlay para navegación/procesos largos

### ¿Por qué un solo componente?
Evita que cada desarrollador implemente su propio loading, garantizando:
- Consistencia visual en toda la app
- Accesibilidad uniforme
- Mantenimiento centralizado
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Tamaño del spinner',
    },
    variant: {
      control: 'select',
      options: ['inline', 'centered', 'overlay'],
      description: 'Modo de visualización',
    },
    label: {
      control: 'text',
      description: 'Texto opcional debajo del spinner',
    },
    ariaLabel: {
      control: 'text',
      description: 'Texto para screen readers',
    },
  },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Spinner por defecto (medium, inline)
 */
export const Default: Story = {
  args: {},
};

/**
 * Spinner con label descriptivo
 */
export const WithLabel: Story = {
  args: {
    label: 'Cargando datos...',
  },
};

/* ============================================
   Tamaños
   ============================================ */

/**
 * Spinner pequeño - ideal para botones
 */
export const Small: Story = {
  args: {
    size: 'small',
  },
};

/**
 * Spinner mediano - uso general
 */
export const Medium: Story = {
  args: {
    size: 'medium',
  },
};

/**
 * Spinner grande - para páginas completas
 */
export const Large: Story = {
  args: {
    size: 'large',
  },
};

/* ============================================
   Variantes de Display
   ============================================ */

/**
 * Inline - para usar dentro de texto o botones
 */
export const Inline: Story = {
  args: {
    variant: 'inline',
    size: 'small',
  },
  decorators: [
    (Story) => (
      <div className="spinner-story__inline-example">
        <span>Guardando cambios</span>
        <Story />
      </div>
    ),
  ],
};

/**
 * Centered - centrado en su contenedor
 */
export const Centered: Story = {
  args: {
    variant: 'centered',
    label: 'Cargando contenido...',
  },
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div className="spinner-story__centered-container">
        <Story />
      </div>
    ),
  ],
};

/**
 * Overlay - cubre toda la pantalla (usar con cuidado)
 *
 * ⚠️ Solo para procesos largos inevitables que bloquean la UI
 */
export const Overlay: Story = {
  args: {
    variant: 'overlay',
    size: 'large',
    label: 'Procesando...',
  },
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div className="spinner-story__overlay-container">
        <div className="spinner-story__overlay-content">
          <h2>Contenido de fondo</h2>
          <p>Este contenido queda detrás del overlay</p>
        </div>
        <Story />
      </div>
    ),
  ],
};

/* ============================================
   Casos de Uso Reales
   ============================================ */

/**
 * En un botón (loading state)
 */
export const InButton: Story = {
  args: {
    size: 'small',
    variant: 'inline',
  },
  decorators: [
    (Story) => (
      <button className="spinner-story__button" disabled>
        <Story />
        Guardando...
      </button>
    ),
  ],
};

/**
 * En una tabla mientras carga datos
 */
export const InTableSection: Story = {
  args: {
    variant: 'centered',
    label: 'Cargando atletas...',
  },
  decorators: [
    (Story) => (
      <div className="spinner-story__table">
        <div className="spinner-story__table-header">Lista de Atletas</div>
        <div className="spinner-story__table-body">
          <Story />
        </div>
      </div>
    ),
  ],
};

/**
 * Todos los tamaños juntos (comparación)
 */
export const AllSizes: Story = {
  render: () => (
    <div className="spinner-story__sizes-container">
      <div className="spinner-story__size-item">
        <Spinner size="small" />
        <div className="spinner-story__size-label">Small</div>
      </div>
      <div className="spinner-story__size-item">
        <Spinner size="medium" />
        <div className="spinner-story__size-label">Medium</div>
      </div>
      <div className="spinner-story__size-item">
        <Spinner size="large" />
        <div className="spinner-story__size-label">Large</div>
      </div>
    </div>
  ),
};
