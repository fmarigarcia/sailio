import type { Meta, StoryObj } from '@storybook/react';
import { PasswordInput } from './passwordinput';

const meta: Meta<typeof PasswordInput> = {
  title: 'UI/PasswordInput',
  component: PasswordInput,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'PasswordInput is a specialized Input component for password input. It extends the base Input component with type="password" pre-configured.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof PasswordInput>;

export const Default: Story = {
  args: {
    label: 'Password',
    placeholder: 'Enter your password',
  },
};

export const WithHelperText: Story = {
  args: {
    label: 'Password',
    placeholder: 'Enter your password',
    helperText: 'Must be at least 8 characters',
  },
};

export const Required: Story = {
  args: {
    label: 'Password',
    placeholder: 'Enter your password',
    required: true,
  },
};

export const WithError: Story = {
  args: {
    label: 'Password',
    placeholder: 'Enter your password',
    error: 'Password must be at least 8 characters',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Password',
    value: 'secretpassword',
    disabled: true,
  },
};

export const ConfirmPassword: Story = {
  args: {
    label: 'Confirm Password',
    placeholder: 'Re-enter your password',
    helperText: 'Must match the password above',
  },
};
