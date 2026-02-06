import type { Meta, StoryObj } from '@storybook/react';
import { Select, SelectOption } from './select';
import { useState } from 'react';

const meta: Meta<typeof Select> = {
  title: 'UI/Select',
  component: Select,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    disabled: {
      control: 'boolean',
    },
    error: {
      control: 'boolean',
    },
    required: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Select>;

const defaultOptions = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
  { value: 'option4', label: 'Option 4' },
];

const longOptions = [
  { value: 'short', label: 'Short' },
  {
    value: 'long1',
    label: 'This is a very long option text that should be handled gracefully with ellipsis',
  },
  {
    value: 'long2',
    label:
      'Another extremely long option that contains a lot of text to test how the component handles it',
  },
  { value: 'medium', label: 'Medium length option' },
];

const countriesOptions = [
  { value: 'es', label: 'Spain' },
  { value: 'us', label: 'United States' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'fr', label: 'France' },
  { value: 'de', label: 'Germany' },
  { value: 'it', label: 'Italy' },
  { value: 'pt', label: 'Portugal' },
];

// Interactive wrapper for controlled components
interface SelectWrapperProps {
  options: SelectOption[];
  placeholder?: string;
  value?: string;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  error?: boolean;
  errorMessage?: string;
  required?: boolean;
}

const SelectWrapper = (args: SelectWrapperProps) => {
  const [value, setValue] = useState(args.value || '');
  return <Select {...args} value={value} onChange={setValue} />;
};

export const Default: Story = {
  render: SelectWrapper,
  args: {
    options: defaultOptions,
    placeholder: 'Select an option',
  },
};

export const WithValue: Story = {
  render: SelectWrapper,
  args: {
    options: defaultOptions,
    placeholder: 'Select an option',
    value: 'option2',
  },
};

export const WithPlaceholder: Story = {
  render: SelectWrapper,
  args: {
    options: defaultOptions,
    placeholder: 'Choose your preferred option...',
  },
};

export const SmallSize: Story = {
  render: SelectWrapper,
  args: {
    options: defaultOptions,
    placeholder: 'Small select',
    size: 'sm',
  },
};

export const LargeSize: Story = {
  render: SelectWrapper,
  args: {
    options: defaultOptions,
    placeholder: 'Large select',
    size: 'lg',
  },
};

export const Disabled: Story = {
  render: SelectWrapper,
  args: {
    options: defaultOptions,
    placeholder: 'This select is disabled',
    disabled: true,
  },
};

export const DisabledWithValue: Story = {
  render: SelectWrapper,
  args: {
    options: defaultOptions,
    value: 'option2',
    disabled: true,
  },
};

export const WithError: Story = {
  render: SelectWrapper,
  args: {
    options: defaultOptions,
    placeholder: 'Select an option',
    error: true,
    errorMessage: 'This field is required',
  },
};

export const WithErrorAndValue: Story = {
  render: SelectWrapper,
  args: {
    options: defaultOptions,
    value: 'option1',
    error: true,
    errorMessage: 'Invalid selection',
  },
};

export const LongOptions: Story = {
  render: SelectWrapper,
  args: {
    options: longOptions,
    placeholder: 'Select an option with long text',
  },
};

export const Countries: Story = {
  render: SelectWrapper,
  args: {
    options: countriesOptions,
    placeholder: 'Select a country',
  },
};

export const WithDisabledOptions: Story = {
  render: SelectWrapper,
  args: {
    options: [
      { value: 'enabled1', label: 'Enabled Option 1' },
      { value: 'disabled1', label: 'Disabled Option', disabled: true },
      { value: 'enabled2', label: 'Enabled Option 2' },
      { value: 'disabled2', label: 'Another Disabled Option', disabled: true },
      { value: 'enabled3', label: 'Enabled Option 3' },
    ],
    placeholder: 'Some options are disabled',
  },
};

export const Required: Story = {
  render: SelectWrapper,
  args: {
    options: defaultOptions,
    placeholder: 'This field is required',
    required: true,
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className="storybook-select-showcase">
      <SelectWrapper options={defaultOptions} placeholder="Small" size="sm" />
      <SelectWrapper options={defaultOptions} placeholder="Medium (default)" size="md" />
      <SelectWrapper options={defaultOptions} placeholder="Large" size="lg" />
    </div>
  ),
};

export const AllStates: Story = {
  render: () => (
    <div className="storybook-select-showcase">
      <SelectWrapper options={defaultOptions} placeholder="Normal" />
      <SelectWrapper options={defaultOptions} value="option2" />
      <SelectWrapper options={defaultOptions} placeholder="Disabled" disabled />
      <SelectWrapper
        options={defaultOptions}
        placeholder="With error"
        error
        errorMessage="This field is required"
      />
    </div>
  ),
};
