import type { Meta, StoryObj } from '@storybook/react';
import { Dropdown } from './dropdown';
import { Button } from '../Button/button';
import './dropdown-stories.css';

const meta = {
  title: 'UI/Dropdown',
  component: Dropdown,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    position: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right', 'auto'],
      description: 'Position of the dropdown menu relative to trigger',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Size of the dropdown menu items',
    },
    closeOnSelect: {
      control: 'boolean',
      description: 'Close menu after selecting an item',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the dropdown',
    },
  },
} satisfies Meta<typeof Dropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic dropdown
export const Basic: Story = {
  args: {
    trigger: <Button variant="secondary">Open Menu</Button>,
    items: [
      { id: '1', label: 'Edit', onClick: () => alert('Edit clicked') },
      { id: '2', label: 'Duplicate', onClick: () => alert('Duplicate clicked') },
      { id: '3', label: 'Archive', onClick: () => alert('Archive clicked') },
      { id: 'sep-1', label: '', separator: true },
      { id: '4', label: 'Delete', danger: true, onClick: () => alert('Delete clicked') },
    ],
    position: 'bottom',
    size: 'medium',
  },
};

// With icons
export const WithIcons: Story = {
  args: {
    trigger: <Button variant="primary">Actions</Button>,
    items: [
      {
        id: '1',
        label: 'Edit',
        icon: '✏️',
        onClick: () => alert('Edit clicked'),
      },
      {
        id: '2',
        label: 'Copy',
        icon: '📋',
        onClick: () => alert('Copy clicked'),
      },
      {
        id: '3',
        label: 'Share',
        icon: '🔗',
        onClick: () => alert('Share clicked'),
      },
      { id: 'sep-1', label: '', separator: true },
      {
        id: '4',
        label: 'Delete',
        icon: '🗑️',
        danger: true,
        onClick: () => alert('Delete clicked'),
      },
    ],
  },
};

// User menu
export const UserMenu: Story = {
  args: {
    trigger: (
      <button className="user-avatar">
        <span>JD</span>
      </button>
    ),
    items: [
      {
        id: '1',
        label: 'Profile',
        icon: '👤',
        onClick: () => alert('Profile clicked'),
      },
      {
        id: '2',
        label: 'Settings',
        icon: '⚙️',
        onClick: () => alert('Settings clicked'),
      },
      {
        id: '3',
        label: 'Billing',
        icon: '💳',
        onClick: () => alert('Billing clicked'),
      },
      { id: 'sep-1', label: '', separator: true },
      {
        id: '4',
        label: 'Help',
        icon: '❓',
        onClick: () => alert('Help clicked'),
      },
      { id: 'sep-2', label: '', separator: true },
      {
        id: '5',
        label: 'Log out',
        icon: '🚪',
        onClick: () => alert('Log out clicked'),
      },
    ],
    position: 'bottom',
  },
};

// Row actions
export const RowActions: Story = {
  args: {
    trigger: (
      <button className="actions-trigger" aria-label="More actions">
        ⋮
      </button>
    ),
    items: [
      {
        id: '1',
        label: 'View details',
        onClick: () => alert('View details clicked'),
      },
      {
        id: '2',
        label: 'Edit',
        onClick: () => alert('Edit clicked'),
      },
      {
        id: '3',
        label: 'Duplicate',
        onClick: () => alert('Duplicate clicked'),
      },
      { id: 'sep-1', label: '', separator: true },
      {
        id: '4',
        label: 'Delete',
        danger: true,
        onClick: () => alert('Delete clicked'),
      },
    ],
    size: 'small',
  },
};

// With disabled items
export const WithDisabledItems: Story = {
  args: {
    trigger: <Button variant="secondary">Menu</Button>,
    items: [
      {
        id: '1',
        label: 'Available action',
        onClick: () => alert('Available clicked'),
      },
      {
        id: '2',
        label: 'Disabled action',
        disabled: true,
        onClick: () => alert('This should not fire'),
      },
      {
        id: '3',
        label: 'Another available',
        onClick: () => alert('Available clicked'),
      },
      { id: 'sep-1', label: '', separator: true },
      {
        id: '4',
        label: 'Delete (disabled)',
        danger: true,
        disabled: true,
        onClick: () => alert('This should not fire'),
      },
    ],
  },
};

// Different positions
export const PositionTop: Story = {
  args: {
    trigger: <Button variant="secondary">Open Upward</Button>,
    items: [
      { id: '1', label: 'Option 1', onClick: () => alert('Option 1') },
      { id: '2', label: 'Option 2', onClick: () => alert('Option 2') },
      { id: '3', label: 'Option 3', onClick: () => alert('Option 3') },
    ],
    position: 'top',
  },
};

export const PositionRight: Story = {
  args: {
    trigger: <Button variant="secondary">Open Right</Button>,
    items: [
      { id: '1', label: 'Option 1', onClick: () => alert('Option 1') },
      { id: '2', label: 'Option 2', onClick: () => alert('Option 2') },
      { id: '3', label: 'Option 3', onClick: () => alert('Option 3') },
    ],
    position: 'right',
  },
};

export const PositionLeft: Story = {
  args: {
    trigger: <Button variant="secondary">Open Left</Button>,
    items: [
      { id: '1', label: 'Option 1', onClick: () => alert('Option 1') },
      { id: '2', label: 'Option 2', onClick: () => alert('Option 2') },
      { id: '3', label: 'Option 3', onClick: () => alert('Option 3') },
    ],
    position: 'left',
  },
};

// Size variants
export const SizeSmall: Story = {
  args: {
    trigger: (
      <Button variant="secondary" size="sm">
        Small
      </Button>
    ),
    items: [
      { id: '1', label: 'Edit', onClick: () => alert('Edit') },
      { id: '2', label: 'Delete', danger: true, onClick: () => alert('Delete') },
    ],
    size: 'small',
  },
};

export const SizeLarge: Story = {
  args: {
    trigger: (
      <Button variant="secondary" size="lg">
        Large
      </Button>
    ),
    items: [
      { id: '1', label: 'Edit', onClick: () => alert('Edit') },
      { id: '2', label: 'Delete', danger: true, onClick: () => alert('Delete') },
    ],
    size: 'large',
  },
};

// Disabled dropdown
export const Disabled: Story = {
  args: {
    trigger: <Button variant="secondary">Disabled Menu</Button>,
    items: [
      { id: '1', label: 'Option 1', onClick: () => alert('Option 1') },
      { id: '2', label: 'Option 2', onClick: () => alert('Option 2') },
    ],
    disabled: true,
  },
};

// Don't close on select
export const KeepOpenOnSelect: Story = {
  args: {
    trigger: <Button variant="secondary">Multi-action Menu</Button>,
    items: [
      {
        id: '1',
        label: 'Toggle setting 1',
        icon: '☐',
        onClick: () => alert('Setting 1 toggled'),
      },
      {
        id: '2',
        label: 'Toggle setting 2',
        icon: '☐',
        onClick: () => alert('Setting 2 toggled'),
      },
      {
        id: '3',
        label: 'Toggle setting 3',
        icon: '☐',
        onClick: () => alert('Setting 3 toggled'),
      },
      { id: 'sep-1', label: '', separator: true },
      {
        id: '4',
        label: 'Done',
        onClick: () => alert('Done clicked'),
      },
    ],
    closeOnSelect: false,
  },
};

// Auto position (adapts to available space)
export const AutoPosition: Story = {
  args: {
    trigger: <Button variant="secondary">Auto Position</Button>,
    items: [
      { id: '1', label: 'Option 1', onClick: () => alert('Option 1') },
      { id: '2', label: 'Option 2', onClick: () => alert('Option 2') },
      { id: '3', label: 'Option 3', onClick: () => alert('Option 3') },
      { id: '4', label: 'Option 4', onClick: () => alert('Option 4') },
      { id: '5', label: 'Option 5', onClick: () => alert('Option 5') },
    ],
    position: 'auto',
  },
  decorators: [
    (Story) => (
      <div className="auto-position-container">
        <Story />
      </div>
    ),
  ],
};
