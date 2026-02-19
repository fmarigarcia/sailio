import type { Meta, StoryObj } from '@storybook/react';
import { LoadingState } from './loading-state';

const meta = {
  title: 'UI/Feedback/LoadingState',
  component: LoadingState,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    message: {
      control: 'text',
      description: 'Mensaje de carga mostrado al usuario',
    },
    variant: {
      control: 'radio',
      options: ['section', 'page'],
      description: 'Tamaño del estado de carga',
    },
  },
} satisfies Meta<typeof LoadingState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Section: Story = {
  args: {
    message: 'Cargando datos...',
    variant: 'section',
  },
};

export const Page: Story = {
  args: {
    message: 'Cargando página...',
    variant: 'page',
  },
};
