import type { Meta, StoryObj } from '@storybook/react';
import Tooltip from './tooltip';
import { Button } from '../Button';
import { InfoIcon } from '../icons';
import './tooltip-stories.css';

const meta = {
  title: 'UI/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Tooltip component for displaying contextual information on hover or focus. Essential for dense UIs, dashboards, and settings.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    content: {
      control: 'text',
      description: 'Content to display in the tooltip',
    },
    position: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
      description: 'Position of the tooltip relative to the trigger',
    },
    delay: {
      control: { type: 'number', min: 0, max: 1000, step: 50 },
      description: 'Delay in milliseconds before showing the tooltip',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the tooltip is disabled',
    },
    maxWidth: {
      control: { type: 'number', min: 100, max: 500, step: 50 },
      description: 'Maximum width of the tooltip in pixels',
    },
  },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    content: 'This is a helpful tooltip',
    position: 'top',
    delay: 200,
    disabled: false,
    maxWidth: 250,
    children: <Button>Hover me</Button>,
  },
};

export const Positions: Story = {
  args: {
    content: 'Tooltip',
    children: <Button>Button</Button>,
  },
  render: () => (
    <div className="tooltip-demo-container">
      <Tooltip content="Tooltip on top" position="top">
        <Button>Top</Button>
      </Tooltip>
      <Tooltip content="Tooltip on bottom" position="bottom">
        <Button>Bottom</Button>
      </Tooltip>
      <Tooltip content="Tooltip on left" position="left">
        <Button>Left</Button>
      </Tooltip>
      <Tooltip content="Tooltip on right" position="right">
        <Button>Right</Button>
      </Tooltip>
    </div>
  ),
};

export const WithIcon: Story = {
  args: {
    content: 'Tooltip',
    children: <Button>Button</Button>,
  },
  render: () => (
    <div className="tooltip-demo-label">
      <Tooltip content="Click for more information about this feature">
        <button className="tooltip-demo-icon-button" aria-label="More information">
          <InfoIcon size={20} />
        </button>
      </Tooltip>
    </div>
  ),
};

export const LongContent: Story = {
  args: {
    content:
      'This is a longer tooltip with more text to demonstrate how the component handles multi-line content and text wrapping.',
    children: <Button>Hover for long text</Button>,
    maxWidth: 200,
  },
};

export const CustomWidth: Story = {
  args: {
    content: 'Tooltip',
    children: <Button>Button</Button>,
  },
  render: () => (
    <div className="tooltip-demo-container">
      <Tooltip content="Narrow tooltip with limited width" maxWidth={150}>
        <Button size="sm">Narrow (150px)</Button>
      </Tooltip>
      <Tooltip content="Default tooltip width for regular content" maxWidth={250}>
        <Button size="sm">Default (250px)</Button>
      </Tooltip>
      <Tooltip
        content="Wide tooltip that can accommodate longer descriptions and more detailed content"
        maxWidth={400}
      >
        <Button size="sm">Wide (400px)</Button>
      </Tooltip>
    </div>
  ),
};

export const DelayVariations: Story = {
  args: {
    content: 'Tooltip',
    children: <Button>Button</Button>,
  },
  render: () => (
    <div className="tooltip-demo-container">
      <Tooltip content="Appears instantly" delay={0}>
        <Button>No delay</Button>
      </Tooltip>
      <Tooltip content="Default delay" delay={200}>
        <Button>200ms delay</Button>
      </Tooltip>
      <Tooltip content="Longer delay" delay={500}>
        <Button>500ms delay</Button>
      </Tooltip>
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    content: 'This tooltip will not appear',
    disabled: true,
    children: <Button>Disabled tooltip</Button>,
  },
};

export const WithTextInput: Story = {
  args: {
    content: 'Tooltip',
    children: <Button>Button</Button>,
  },
  render: () => (
    <div className="tooltip-demo-label">
      <label>
        Username
        <Tooltip
          content="Your username must be unique and at least 3 characters long"
          position="right"
        >
          <input type="text" placeholder="Enter username" className="tooltip-demo-text-input" />
        </Tooltip>
      </label>
    </div>
  ),
};

export const InDenseUI: Story = {
  args: {
    content: 'Tooltip',
    children: <Button>Button</Button>,
  },
  render: () => (
    <div className="tooltip-demo-label">
      <div className="tooltip-demo-grid">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
          <Tooltip key={item} content={`Details for item ${item}`} position="top">
            <button className="tooltip-demo-grid-item">Item {item}</button>
          </Tooltip>
        ))}
      </div>
    </div>
  ),
};

export const AccessibilityDemo: Story = {
  args: {
    content: 'Tooltip',
    children: <Button>Button</Button>,
  },
  render: () => (
    <div className="tooltip-demo-flex-column">
      <p>Tab through these elements to see tooltips on focus:</p>
      <div className="tooltip-demo-flex-row">
        <Tooltip content="First focusable element">
          <Button>Tab stop 1</Button>
        </Tooltip>
        <Tooltip content="Second focusable element">
          <Button>Tab stop 2</Button>
        </Tooltip>
        <Tooltip content="Third focusable element">
          <Button>Tab stop 3</Button>
        </Tooltip>
      </div>
    </div>
  ),
};

export const DashboardExample: Story = {
  args: {
    content: 'Tooltip',
    children: <Button>Button</Button>,
  },
  render: () => (
    <div className="tooltip-demo-label">
      <div className="tooltip-demo-dashboard">
        <h3 className="tooltip-demo-dashboard-header">
          Performance Metrics
          <Tooltip content="Metrics are updated every 5 minutes" position="right">
            <InfoIcon size={16} color="#666" />
          </Tooltip>
        </h3>
        <div className="tooltip-demo-dashboard-metrics">
          <Tooltip content="Total active users in the last 24 hours">
            <div className="tooltip-demo-metric-card">
              <div className="tooltip-demo-metric-label">Active Users</div>
              <div className="tooltip-demo-metric-value">1,234</div>
            </div>
          </Tooltip>
          <Tooltip content="Revenue generated today">
            <div className="tooltip-demo-metric-card">
              <div className="tooltip-demo-metric-label">Revenue</div>
              <div className="tooltip-demo-metric-value">$12,345</div>
            </div>
          </Tooltip>
          <Tooltip content="Average conversion rate this month">
            <div className="tooltip-demo-metric-card">
              <div className="tooltip-demo-metric-label">Conversion</div>
              <div className="tooltip-demo-metric-value">3.2%</div>
            </div>
          </Tooltip>
        </div>
      </div>
    </div>
  ),
};
