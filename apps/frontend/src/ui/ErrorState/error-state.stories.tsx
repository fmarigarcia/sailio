import type { Meta, StoryObj } from '@storybook/react';
import { ErrorState } from './error-state';

const meta = {
  title: 'UI/Feedback/ErrorState',
  component: ErrorState,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'Título principal del estado de error',
    },
    description: {
      control: 'text',
      description: 'Descripción o mensaje de error',
    },
    fullWidth: {
      control: 'boolean',
      description: 'Hace que el Alert interno use el ancho disponible',
    },
  },
} satisfies Meta<typeof ErrorState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'No se pudo cargar la información',
    description: 'Inténtalo de nuevo en unos segundos.',
    fullWidth: true,
  },
};

export const Compact: Story = {
  args: {
    title: 'Request failed',
    description: 'Unexpected server response.',
    fullWidth: false,
  },
};
