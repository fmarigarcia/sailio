/* eslint-disable react/forbid-dom-props */
import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './badge';

const meta = {
  title: 'UI/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['success', 'warning', 'error', 'info', 'neutral'],
      description: 'Semantic variant of the badge',
    },
    size: {
      control: 'select',
      options: ['sm', 'md'],
      description: 'Size of the badge',
    },
    children: {
      control: 'text',
      description: 'Badge content',
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

// Variant Stories
export const Success: Story = {
  args: {
    variant: 'success',
    children: 'Active',
  },
};

export const Warning: Story = {
  args: {
    variant: 'warning',
    children: 'Pending',
  },
};

export const Error: Story = {
  args: {
    variant: 'error',
    children: 'Error',
  },
};

export const Info: Story = {
  args: {
    variant: 'info',
    children: 'Info',
  },
};

export const Neutral: Story = {
  args: {
    variant: 'neutral',
    children: 'Draft',
  },
};

// Size Stories
export const Small: Story = {
  args: {
    size: 'sm',
    variant: 'info',
    children: 'Small Badge',
  },
};

export const Medium: Story = {
  args: {
    size: 'md',
    variant: 'info',
    children: 'Medium Badge',
  },
};

// Use Case Stories - Estados
export const StatusActive: Story = {
  name: 'Status: Active',
  args: {
    variant: 'success',
    children: 'Active',
  },
};

export const StatusPending: Story = {
  name: 'Status: Pending',
  args: {
    variant: 'warning',
    children: 'Pending',
  },
};

export const StatusError: Story = {
  name: 'Status: Error',
  args: {
    variant: 'error',
    children: 'Error',
  },
};

export const StatusCompleted: Story = {
  name: 'Status: Completed',
  args: {
    variant: 'success',
    children: 'Completed',
  },
};

export const StatusInactive: Story = {
  name: 'Status: Inactive',
  args: {
    variant: 'neutral',
    children: 'Inactive',
  },
};

// Use Case Stories - Planes
export const PlanFree: Story = {
  name: 'Plan: Free',
  args: {
    variant: 'neutral',
    size: 'sm',
    children: 'Free',
  },
};

export const PlanPro: Story = {
  name: 'Plan: Pro',
  args: {
    variant: 'info',
    size: 'sm',
    children: 'Pro',
  },
};

export const PlanEnterprise: Story = {
  name: 'Plan: Enterprise',
  args: {
    variant: 'success',
    size: 'sm',
    children: 'Enterprise',
  },
};

// Use Case Stories - Roles
export const RoleAdmin: Story = {
  name: 'Role: Admin',
  args: {
    variant: 'error',
    size: 'sm',
    children: 'Admin',
  },
};

export const RoleCoach: Story = {
  name: 'Role: Coach',
  args: {
    variant: 'info',
    size: 'sm',
    children: 'Coach',
  },
};

export const RoleAthlete: Story = {
  name: 'Role: Athlete',
  args: {
    variant: 'neutral',
    size: 'sm',
    children: 'Athlete',
  },
};

// Multiple Badges Example
export const MultipleBadges: Story = {
  name: 'Multiple Badges',
  args: {
    children: 'Badge',
  },
  render: () => (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <Badge variant="success">Active</Badge>
      <Badge variant="warning">Pending</Badge>
      <Badge variant="error">Error</Badge>
      <Badge variant="info">Info</Badge>
      <Badge variant="neutral">Draft</Badge>
    </div>
  ),
};

// All Sizes Example
export const AllSizes: Story = {
  name: 'All Sizes',
  args: {
    children: 'Badge',
  },
  render: () => (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
      <Badge size="sm" variant="info">
        Small
      </Badge>
      <Badge size="md" variant="info">
        Medium
      </Badge>
    </div>
  ),
};

// Real World Example - User Profile
export const RealWorldUserProfile: Story = {
  name: 'Example: User Profile',
  args: {
    children: 'Badge',
  },
  render: () => (
    <div
      style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'flex-start' }}
    >
      <div>
        <strong>John Doe</strong>
        <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
          <Badge variant="info" size="sm">
            Coach
          </Badge>
          <Badge variant="success" size="sm">
            Active
          </Badge>
          <Badge variant="info" size="sm">
            Pro
          </Badge>
        </div>
      </div>
    </div>
  ),
};

// Real World Example - Training Session
export const RealWorldTrainingSession: Story = {
  name: 'Example: Training Session',
  args: {
    children: 'Badge',
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div>
        <strong>Morning Training - 10:00 AM</strong>
        <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
          <Badge variant="success">Completed</Badge>
          <Badge variant="info" size="sm">
            High Intensity
          </Badge>
        </div>
      </div>
      <div>
        <strong>Evening Session - 6:00 PM</strong>
        <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
          <Badge variant="warning">Pending</Badge>
          <Badge variant="info" size="sm">
            Recovery
          </Badge>
        </div>
      </div>
      <div>
        <strong>Cancelled Session</strong>
        <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
          <Badge variant="error">Cancelled</Badge>
        </div>
      </div>
    </div>
  ),
};
