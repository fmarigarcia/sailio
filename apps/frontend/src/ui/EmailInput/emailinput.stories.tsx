import type { Meta, StoryObj } from '@storybook/react';
import { EmailInput } from './emailinput';

const meta: Meta<typeof EmailInput> = {
  title: 'UI/EmailInput',
  component: EmailInput,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'EmailInput is a specialized Input component for email input. It extends the base Input component with type="email" pre-configured and provides built-in email validation.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof EmailInput>;

export const Default: Story = {
  args: {
    label: 'Email',
    placeholder: 'name@example.com',
  },
};

export const WithHelperText: Story = {
  args: {
    label: 'Email Address',
    placeholder: 'name@example.com',
    helperText: 'We will never share your email',
  },
};

export const Required: Story = {
  args: {
    label: 'Email',
    placeholder: 'name@example.com',
    required: true,
  },
};

export const WithError: Story = {
  args: {
    label: 'Email',
    placeholder: 'name@example.com',
    error: 'Please enter a valid email address',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Email',
    value: 'user@example.com',
    disabled: true,
  },
};

export const ReadOnly: Story = {
  args: {
    label: 'Email',
    value: 'user@example.com',
    readOnly: true,
    helperText: 'Contact support to change your email',
  },
};
