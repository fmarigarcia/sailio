import type { Meta, StoryObj } from '@storybook/react';
import { EmptyState } from './emptystate';
import { EmptyStateIcon } from '../icons';

const meta = {
  title: 'UI/EmptyState',
  component: EmptyState,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'Main title for the empty state',
    },
    description: {
      control: 'text',
      description: 'Description or message for the empty state',
    },
    showDefaultIcon: {
      control: 'boolean',
      description: 'Show the default empty state icon',
    },
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the empty state',
    },
  },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'No items found',
    description: 'Try adjusting your search or filters to find what you are looking for.',
    showDefaultIcon: true,
    size: 'md',
  },
};

export const WithAction: Story = {
  args: {
    title: 'No training sessions yet',
    description: 'Start tracking your sailing progress by creating your first training session.',
    showDefaultIcon: true,
    size: 'md',
    action: {
      label: 'Create Session',
      onClick: () => alert('Create session clicked'),
      variant: 'primary',
    },
  },
};

export const WithSecondaryAction: Story = {
  args: {
    title: 'No athletes found',
    description: 'Add athletes to your team to start tracking their progress.',
    showDefaultIcon: true,
    size: 'md',
    action: {
      label: 'Add Athlete',
      onClick: () => alert('Add athlete clicked'),
      variant: 'primary',
    },
    secondaryAction: {
      label: 'Import Athletes',
      onClick: () => alert('Import clicked'),
      variant: 'secondary',
    },
  },
};

export const SmallSize: Story = {
  args: {
    title: 'No results',
    description: 'Your search did not match any records.',
    showDefaultIcon: true,
    size: 'sm',
  },
};

export const LargeSize: Story = {
  args: {
    title: 'Welcome to Sailio!',
    description:
      'Get started by creating your first training session. Track wind conditions, performance metrics, and athlete progress all in one place.',
    showDefaultIcon: true,
    size: 'lg',
    action: {
      label: 'Get Started',
      onClick: () => alert('Get started clicked'),
      variant: 'primary',
    },
  },
};

export const WithoutIcon: Story = {
  args: {
    title: 'Nothing to show',
    description: 'There are no items to display at the moment.',
    showDefaultIcon: false,
    size: 'md',
  },
};

export const CustomIcon: Story = {
  args: {
    title: 'No data available',
    description: 'Connect your devices or import data to get started.',
    icon: <EmptyStateIcon size={60} color="var(--color-primary)" />,
    size: 'md',
    action: {
      label: 'Connect Device',
      onClick: () => alert('Connect clicked'),
      variant: 'primary',
    },
  },
};

export const OnlyTitle: Story = {
  args: {
    title: 'Empty',
    showDefaultIcon: true,
    size: 'md',
  },
};

export const LongDescription: Story = {
  args: {
    title: 'No training data',
    description:
      'Training sessions help you track important metrics like wind speed, wave height, course completion, and athlete performance. Create your first session to start collecting valuable insights that will help improve training outcomes.',
    showDefaultIcon: true,
    size: 'md',
    action: {
      label: 'Create First Session',
      onClick: () => alert('Create clicked'),
      variant: 'primary',
    },
  },
};

export const UpsellExample: Story = {
  args: {
    title: 'Upgrade to unlock advanced analytics',
    description:
      'Get detailed performance reports, weather pattern analysis, and AI-powered training recommendations.',
    showDefaultIcon: false,
    size: 'md',
    action: {
      label: 'Upgrade Now',
      onClick: () => alert('Upgrade clicked'),
      variant: 'primary',
    },
    secondaryAction: {
      label: 'Learn More',
      onClick: () => alert('Learn more clicked'),
      variant: 'ghost',
    },
  },
};
