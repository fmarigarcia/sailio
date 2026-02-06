import type { Meta, StoryObj } from '@storybook/react';
import { Radio } from './radio';

const meta: Meta<typeof Radio> = {
  title: 'UI/Radio',
  component: Radio,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof Radio>;

export const Default: Story = {
  args: {
    label: 'Option A',
    name: 'example',
  },
};

export const Checked: Story = {
  args: {
    label: 'Option A',
    name: 'example',
    checked: true,
  },
};

export const Disabled: Story = {
  args: {
    label: 'Option A',
    name: 'example',
    disabled: true,
  },
};

export const DisabledChecked: Story = {
  args: {
    label: 'Option A',
    name: 'example',
    checked: true,
    disabled: true,
  },
};

export const WithError: Story = {
  args: {
    label: 'Option A',
    name: 'example',
    error: true,
    errorMessage: 'Please select an option',
  },
};

export const WithHelperText: Story = {
  args: {
    label: 'Premium Plan',
    name: 'plan',
    helperText: 'Best for teams and organizations',
  },
};

export const WithoutLabel: Story = {
  args: {
    name: 'example',
  },
};

export const LongLabel: Story = {
  args: {
    label:
      'I want to receive promotional emails, newsletters, and updates about new features and special offers',
    name: 'example',
  },
};

export const RadioGroup: Story = {
  render: () => (
    <div className="radio-group-example">
      <Radio name="plan" label="Free Plan" helperText="Perfect for individuals" />
      <Radio name="plan" label="Pro Plan" helperText="Best for professionals" />
      <Radio name="plan" label="Enterprise Plan" helperText="For large organizations" />
    </div>
  ),
};
