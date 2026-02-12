import type { Meta, StoryObj } from '@storybook/react';
import Stepper from './stepper';

const meta = {
  title: 'UI/Stepper',
  component: Stepper,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    currentStep: {
      control: {
        type: 'number',
        min: 1,
        max: 4,
      },
      description: 'Current active step (1-based)',
    },
    showCompletedIcon: {
      control: 'boolean',
      description: 'Shows icon on completed steps',
    },
  },
} satisfies Meta<typeof Stepper>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultSteps = ['Personal Info', 'Sailing Credentials', 'Review'];

export const FirstStep: Story = {
  args: {
    steps: defaultSteps,
    currentStep: 1,
  },
};

export const MiddleStep: Story = {
  args: {
    steps: defaultSteps,
    currentStep: 2,
  },
};

export const FinalStep: Story = {
  args: {
    steps: defaultSteps,
    currentStep: 3,
  },
};

export const WithoutCompletedIcons: Story = {
  args: {
    steps: defaultSteps,
    currentStep: 3,
    showCompletedIcon: false,
  },
};
