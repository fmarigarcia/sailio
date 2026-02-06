import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './input';

const meta: Meta<typeof Input> = {
  title: 'UI/Input',
  component: Input,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Base Input component for all form inputs. Includes integrated label, error state, helper text, and support for disabled/readonly states.',
      },
    },
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the input',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the input',
    },
    readOnly: {
      control: 'boolean',
      description: 'Makes the input read-only',
    },
    required: {
      control: 'boolean',
      description: 'Marks the input as required',
    },
    fullWidth: {
      control: 'boolean',
      description: 'Makes the input take full width',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    label: 'Email',
    placeholder: 'Enter your email',
  },
};

export const WithHelperText: Story = {
  args: {
    label: 'Username',
    placeholder: 'Enter your username',
    helperText: 'This will be your public display name',
  },
};

export const WithError: Story = {
  args: {
    label: 'Email',
    placeholder: 'Enter your email',
    error: 'This field is required',
    value: '',
  },
};

export const Required: Story = {
  args: {
    label: 'Password',
    type: 'password',
    placeholder: 'Enter your password',
    required: true,
  },
};

export const Disabled: Story = {
  args: {
    label: 'Email',
    placeholder: 'Enter your email',
    value: 'user@example.com',
    disabled: true,
  },
};

export const ReadOnly: Story = {
  args: {
    label: 'Username',
    value: 'johndoe',
    readOnly: true,
    helperText: 'This field cannot be edited',
  },
};

export const SmallSize: Story = {
  args: {
    label: 'Small Input',
    placeholder: 'Small size',
    size: 'sm',
  },
};

export const MediumSize: Story = {
  args: {
    label: 'Medium Input',
    placeholder: 'Medium size (default)',
    size: 'md',
  },
};

export const LargeSize: Story = {
  args: {
    label: 'Large Input',
    placeholder: 'Large size',
    size: 'lg',
  },
};

export const FullWidth: Story = {
  args: {
    label: 'Full Width Input',
    placeholder: 'This input takes full width',
    fullWidth: true,
  },
};

export const WithoutLabel: Story = {
  args: {
    placeholder: 'Input without label',
    helperText: 'Helper text can still be shown',
  },
};

export const TypePassword: Story = {
  args: {
    label: 'Password',
    type: 'password',
    placeholder: 'Enter your password',
    helperText: 'Must be at least 8 characters',
  },
};

export const TypeEmail: Story = {
  args: {
    label: 'Email Address',
    type: 'email',
    placeholder: 'name@example.com',
  },
};

export const TypeNumber: Story = {
  args: {
    label: 'Age',
    type: 'number',
    placeholder: 'Enter your age',
    min: 0,
    max: 120,
  },
};

export const TypeSearch: Story = {
  args: {
    label: 'Search',
    type: 'search',
    placeholder: 'Search...',
  },
};

export const AllStates: Story = {
  render: () => (
    <div className="input-story-container">
      <Input label="Default" placeholder="Default state" />
      <Input label="With value" value="Some text" />
      <Input label="With helper text" placeholder="Enter text" helperText="This is a helper text" />
      <Input label="With error" placeholder="Enter text" error="This field is required" />
      <Input label="Required" placeholder="Required field" required />
      <Input label="Disabled" value="Disabled field" disabled />
      <Input label="Read only" value="Read only field" readOnly />
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="input-story-container">
      <Input label="Small" placeholder="Small size" size="sm" />
      <Input label="Medium" placeholder="Medium size (default)" size="md" />
      <Input label="Large" placeholder="Large size" size="lg" />
    </div>
  ),
};
