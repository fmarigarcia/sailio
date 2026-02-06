import type { Meta, StoryObj } from '@storybook/react';
import { TextInput } from './textinput';

const meta: Meta<typeof TextInput> = {
  title: 'UI/TextInput',
  component: TextInput,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'TextInput is a specialized Input component for text input. It extends the base Input component with type="text" pre-configured.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof TextInput>;

export const Default: Story = {
  args: {
    label: 'Username',
    placeholder: 'Enter your username',
  },
};

export const WithHelperText: Story = {
  args: {
    label: 'Full Name',
    placeholder: 'John Doe',
    helperText: 'Enter your first and last name',
  },
};

export const Required: Story = {
  args: {
    label: 'Full Name',
    placeholder: 'John Doe',
    required: true,
  },
};

export const WithError: Story = {
  args: {
    label: 'Username',
    placeholder: 'Enter your username',
    error: 'Username is already taken',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Username',
    value: 'johndoe',
    disabled: true,
  },
};

export const ReadOnly: Story = {
  args: {
    label: 'ID',
    value: 'USER-12345',
    readOnly: true,
    helperText: 'This field cannot be edited',
  },
};
