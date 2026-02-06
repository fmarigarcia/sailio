/* eslint-disable react/forbid-dom-props */
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Alert } from './alert';

const meta = {
  title: 'UI/Alert',
  component: Alert,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['info', 'success', 'warning', 'error'],
      description: 'Semantic variant of the alert',
    },
    title: {
      control: 'text',
      description: 'Optional title for the alert',
    },
    children: {
      control: 'text',
      description: 'Alert message content',
    },
    dismissible: {
      control: 'boolean',
      description: 'Whether the alert can be dismissed',
    },
    fullWidth: {
      control: 'boolean',
      description: 'Whether the alert should take full width',
    },
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic variants
export const Info: Story = {
  args: {
    variant: 'info',
    children: 'This is an informational message.',
  },
};

export const Success: Story = {
  args: {
    variant: 'success',
    children: 'Session saved successfully.',
  },
};

export const Warning: Story = {
  args: {
    variant: 'warning',
    children: 'Your subscription expires in 3 days.',
  },
};

export const Error: Story = {
  args: {
    variant: 'error',
    children: 'Connection error. Please try again.',
  },
};

// With title
export const InfoWithTitle: Story = {
  args: {
    variant: 'info',
    title: 'New Feature Available',
    children: 'We have added a new training analytics dashboard. Check it out!',
  },
};

export const SuccessWithTitle: Story = {
  args: {
    variant: 'success',
    title: 'Training Completed',
    children: 'Your training session has been saved and synced to all devices.',
  },
};

export const WarningWithTitle: Story = {
  args: {
    variant: 'warning',
    title: 'Action Required',
    children: 'Please update your payment method before the next billing cycle.',
  },
};

export const ErrorWithTitle: Story = {
  args: {
    variant: 'error',
    title: 'Connection Failed',
    children: 'Unable to connect to the server. Check your internet connection and try again.',
  },
};

// Dismissible
const DismissibleInfoComponent = () => {
  const [visible, setVisible] = useState(true);

  if (!visible) {
    return (
      <button onClick={() => setVisible(true)} style={{ padding: '8px 16px' }}>
        Show Alert
      </button>
    );
  }

  return (
    <Alert variant="info" title="Dismissible Alert" dismissible onDismiss={() => setVisible(false)}>
      Click the X button to dismiss this alert.
    </Alert>
  );
};

export const DismissibleInfo: Story = {
  render: () => <DismissibleInfoComponent />,
  args: {
    children: '',
  },
};

const DismissibleWarningComponent = () => {
  const [visible, setVisible] = useState(true);

  if (!visible) {
    return (
      <button onClick={() => setVisible(true)} style={{ padding: '8px 16px' }}>
        Show Alert
      </button>
    );
  }

  return (
    <Alert
      variant="warning"
      title="Update Available"
      dismissible
      onDismiss={() => setVisible(false)}
    >
      A new version is available. Update now to get the latest features.
    </Alert>
  );
};

export const DismissibleWarning: Story = {
  render: () => <DismissibleWarningComponent />,
  args: {
    children: '',
  },
};

// With action button
export const WithAction: Story = {
  args: {
    variant: 'warning',
    title: 'Subscription Ending',
    children: 'Your subscription will expire in 3 days. Renew now to keep access.',
    action: {
      label: 'Renew Now',
      onClick: () => alert('Renew clicked'),
    },
  },
};

export const ErrorWithAction: Story = {
  args: {
    variant: 'error',
    title: 'Sync Failed',
    children: 'Unable to sync your data. Some changes might not be saved.',
    action: {
      label: 'Retry Now',
      onClick: () => alert('Retry clicked'),
    },
    dismissible: true,
    onDismiss: () => alert('Dismissed'),
  },
};

// Long content
export const LongContent: Story = {
  args: {
    variant: 'info',
    title: 'Detailed Information',
    children:
      'This is a longer message that contains more detailed information about the situation. It might wrap to multiple lines depending on the container width. The alert component should handle long content gracefully and maintain readability throughout.',
  },
};

// Full width
export const FullWidth: Story = {
  args: {
    variant: 'success',
    title: 'Account Created',
    children:
      'Your account has been successfully created. You can now start managing your training sessions.',
    fullWidth: true,
  },
  parameters: {
    layout: 'padded',
  },
};

// All variants comparison
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '600px' }}>
      <Alert variant="info" title="Information">
        This is an informational message.
      </Alert>
      <Alert variant="success" title="Success">
        Operation completed successfully.
      </Alert>
      <Alert variant="warning" title="Warning">
        Please review this important information.
      </Alert>
      <Alert variant="error" title="Error">
        An error occurred. Please try again.
      </Alert>
    </div>
  ),
  args: {
    children: '',
  },
  parameters: {
    layout: 'centered',
  },
};

// Real-world examples
export const AccountNotification: Story = {
  args: {
    variant: 'warning',
    title: 'Payment Method Expired',
    children:
      'Your credit card has expired. Please update your payment method to avoid service interruption.',
    action: {
      label: 'Update Now',
      onClick: () => alert('Navigate to payment settings'),
    },
    dismissible: true,
    onDismiss: () => alert('Dismissed'),
  },
};

export const SuccessFeedback: Story = {
  args: {
    variant: 'success',
    title: 'Training Session Saved',
    children: 'Your training session "Morning Practice - Jan 15" has been saved successfully.',
    dismissible: true,
    onDismiss: () => alert('Dismissed'),
  },
};

export const ErrorFeedback: Story = {
  args: {
    variant: 'error',
    title: 'Upload Failed',
    children: 'Unable to upload training data. File size exceeds 10MB limit.',
    action: {
      label: 'Try Again',
      onClick: () => alert('Retry upload'),
    },
  },
};

export const GlobalError: Story = {
  args: {
    variant: 'error',
    title: 'Connection Lost',
    children: 'You are currently offline. Changes will be synced when connection is restored.',
    fullWidth: true,
  },
};
