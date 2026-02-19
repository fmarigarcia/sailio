import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './button';

const meta = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'danger', 'ghost', 'text'],
      description: 'Visual variant of the button',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the button',
    },
    loading: {
      control: 'boolean',
      description: 'Whether the button is in loading state',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the button is disabled',
    },
    children: {
      control: 'text',
      description: 'Button content',
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// Primary Variants
export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Button',
  },
};

export const PrimarySmall: Story = {
  args: {
    variant: 'primary',
    size: 'sm',
    children: 'Small Primary',
  },
};

export const PrimaryMedium: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    children: 'Medium Primary',
  },
};

export const PrimaryLarge: Story = {
  args: {
    variant: 'primary',
    size: 'lg',
    children: 'Large Primary',
  },
};

export const PrimaryLoading: Story = {
  args: {
    variant: 'primary',
    loading: true,
    children: 'Loading...',
  },
};

export const PrimaryDisabled: Story = {
  args: {
    variant: 'primary',
    disabled: true,
    children: 'Disabled Primary',
  },
};

// Secondary Variants
export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary Button',
  },
};

export const SecondarySmall: Story = {
  args: {
    variant: 'secondary',
    size: 'sm',
    children: 'Small Secondary',
  },
};

export const SecondaryMedium: Story = {
  args: {
    variant: 'secondary',
    size: 'md',
    children: 'Medium Secondary',
  },
};

export const SecondaryLarge: Story = {
  args: {
    variant: 'secondary',
    size: 'lg',
    children: 'Large Secondary',
  },
};

export const SecondaryLoading: Story = {
  args: {
    variant: 'secondary',
    loading: true,
    children: 'Loading...',
  },
};

export const SecondaryDisabled: Story = {
  args: {
    variant: 'secondary',
    disabled: true,
    children: 'Disabled Secondary',
  },
};

// Danger Variants
export const Danger: Story = {
  args: {
    variant: 'danger',
    children: 'Danger Button',
  },
};

export const DangerSmall: Story = {
  args: {
    variant: 'danger',
    size: 'sm',
    children: 'Small Danger',
  },
};

export const DangerMedium: Story = {
  args: {
    variant: 'danger',
    size: 'md',
    children: 'Medium Danger',
  },
};

export const DangerLarge: Story = {
  args: {
    variant: 'danger',
    size: 'lg',
    children: 'Large Danger',
  },
};

export const DangerLoading: Story = {
  args: {
    variant: 'danger',
    loading: true,
    children: 'Loading...',
  },
};

export const DangerDisabled: Story = {
  args: {
    variant: 'danger',
    disabled: true,
    children: 'Disabled Danger',
  },
};

// Ghost Variants
export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Ghost Button',
  },
};

export const GhostSmall: Story = {
  args: {
    variant: 'ghost',
    size: 'sm',
    children: 'Small Ghost',
  },
};

export const GhostMedium: Story = {
  args: {
    variant: 'ghost',
    size: 'md',
    children: 'Medium Ghost',
  },
};

export const GhostLarge: Story = {
  args: {
    variant: 'ghost',
    size: 'lg',
    children: 'Large Ghost',
  },
};

export const GhostLoading: Story = {
  args: {
    variant: 'ghost',
    loading: true,
    children: 'Loading...',
  },
};

export const GhostDisabled: Story = {
  args: {
    variant: 'ghost',
    disabled: true,
    children: 'Disabled Ghost',
  },
};

// Text Variants
export const Text: Story = {
  args: {
    variant: 'text',
    children: 'Text Button',
  },
};

// All Sizes Comparison
export const AllSizes: Story = {
  args: {
    children: 'Button',
  },
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
      <Button variant="primary" size="sm">
        Small
      </Button>
      <Button variant="primary" size="md">
        Medium
      </Button>
      <Button variant="primary" size="lg">
        Large
      </Button>
    </div>
  ),
};

// All Variants Comparison
export const AllVariants: Story = {
  args: {
    children: 'Button',
  },
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="danger">Danger</Button>
      <Button variant="ghost">Ghost</Button>
    </div>
  ),
};

// All States Comparison
export const AllStates: Story = {
  args: {
    children: 'Button',
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <Button variant="primary">Normal</Button>
        <Button variant="primary" disabled>
          Disabled
        </Button>
        <Button variant="primary" loading>
          Loading
        </Button>
      </div>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <Button variant="secondary">Normal</Button>
        <Button variant="secondary" disabled>
          Disabled
        </Button>
        <Button variant="secondary" loading>
          Loading
        </Button>
      </div>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <Button variant="danger">Normal</Button>
        <Button variant="danger" disabled>
          Disabled
        </Button>
        <Button variant="danger" loading>
          Loading
        </Button>
      </div>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <Button variant="ghost">Normal</Button>
        <Button variant="ghost" disabled>
          Disabled
        </Button>
        <Button variant="ghost" loading>
          Loading
        </Button>
      </div>
    </div>
  ),
};
