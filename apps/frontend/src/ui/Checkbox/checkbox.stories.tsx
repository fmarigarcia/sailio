import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from './checkbox';

const meta: Meta<typeof Checkbox> = {
  title: 'UI/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  args: {
    label: 'Accept terms and conditions',
  },
};

export const Checked: Story = {
  args: {
    label: 'Accept terms and conditions',
    checked: true,
  },
};

export const Disabled: Story = {
  args: {
    label: 'Accept terms and conditions',
    disabled: true,
  },
};

export const DisabledChecked: Story = {
  args: {
    label: 'Accept terms and conditions',
    checked: true,
    disabled: true,
  },
};

export const WithError: Story = {
  args: {
    label: 'Accept terms and conditions',
    error: true,
    errorMessage: 'You must accept the terms and conditions',
  },
};

export const WithHelperText: Story = {
  args: {
    label: 'Receive notifications',
    helperText: 'We will send you updates about your account',
  },
};

export const WithoutLabel: Story = {
  args: {},
};

export const LongLabel: Story = {
  args: {
    label:
      'I agree to the terms and conditions, privacy policy, and understand that my data will be processed according to the regulations',
  },
};
