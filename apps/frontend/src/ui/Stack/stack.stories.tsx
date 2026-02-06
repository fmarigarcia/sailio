import type { Meta, StoryObj } from '@storybook/react';
import Stack from './stack';
import './stack-stories.css';

const meta: Meta<typeof Stack> = {
  title: 'UI/Layout/Stack',
  component: Stack,
  tags: ['autodocs'],
  argTypes: {
    direction: {
      control: 'select',
      options: ['vertical', 'horizontal'],
      description: 'Direction of the stack',
    },
    spacing: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'],
      description: 'Spacing between items using design tokens',
    },
    align: {
      control: 'select',
      options: ['start', 'center', 'end', 'stretch'],
      description: 'Alignment of items on the cross axis',
    },
    justify: {
      control: 'select',
      options: ['start', 'center', 'end', 'space-between', 'space-around'],
      description: 'Alignment of items on the main axis',
    },
    wrap: {
      control: 'boolean',
      description: 'Whether items should wrap',
    },
    as: {
      control: 'text',
      description: 'HTML element to render as',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Stack>;

const Box = ({
  children,
  color,
}: {
  children: React.ReactNode;
  color?: 'default' | 'blue' | 'light-blue';
}) => {
  const colorClass =
    color === 'blue' ? 'story-box--blue' : color === 'light-blue' ? 'story-box--light-blue' : '';
  return <div className={`story-box ${colorClass}`.trim()}>{children}</div>;
};

export const Default: Story = {
  args: {
    direction: 'vertical',
    spacing: 'md',
  },
  render: (args) => (
    <Stack {...args}>
      <Box>Item 1</Box>
      <Box>Item 2</Box>
      <Box>Item 3</Box>
    </Stack>
  ),
};

export const Horizontal: Story = {
  args: {
    direction: 'horizontal',
    spacing: 'md',
  },
  render: (args) => (
    <Stack {...args}>
      <Box>Item 1</Box>
      <Box>Item 2</Box>
      <Box>Item 3</Box>
    </Stack>
  ),
};

export const SpacingVariants: Story = {
  render: () => (
    <Stack direction="vertical" spacing="xl">
      {(['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'] as const).map((spacing) => (
        <div key={spacing}>
          <p className="story-spacing-label">Spacing: {spacing}</p>
          <Stack direction="horizontal" spacing={spacing}>
            <Box color="blue">A</Box>
            <Box color="blue">B</Box>
            <Box color="blue">C</Box>
          </Stack>
        </div>
      ))}
    </Stack>
  ),
};

export const AlignmentStart: Story = {
  args: {
    direction: 'horizontal',
    spacing: 'md',
    align: 'start',
  },
  render: (args) => (
    <div className="story-container--tall">
      <Stack {...args}>
        <Box>Short</Box>
        <Box>
          Tall
          <br />
          Item
          <br />
          Here
        </Box>
        <Box>Short</Box>
      </Stack>
    </div>
  ),
};

export const AlignmentCenter: Story = {
  args: {
    direction: 'horizontal',
    spacing: 'md',
    align: 'center',
  },
  render: (args) => (
    <div className="story-container--tall">
      <Stack {...args}>
        <Box>Short</Box>
        <Box>
          Tall
          <br />
          Item
          <br />
          Here
        </Box>
        <Box>Short</Box>
      </Stack>
    </div>
  ),
};

export const AlignmentEnd: Story = {
  args: {
    direction: 'horizontal',
    spacing: 'md',
    align: 'end',
  },
  render: (args) => (
    <div className="story-container--tall">
      <Stack {...args}>
        <Box>Short</Box>
        <Box>
          Tall
          <br />
          Item
          <br />
          Here
        </Box>
        <Box>Short</Box>
      </Stack>
    </div>
  ),
};

export const JustifyCenter: Story = {
  args: {
    direction: 'horizontal',
    spacing: 'md',
    justify: 'center',
  },
  render: (args) => (
    <div className="story-container">
      <Stack {...args}>
        <Box>Item 1</Box>
        <Box>Item 2</Box>
        <Box>Item 3</Box>
      </Stack>
    </div>
  ),
};

export const JustifySpaceBetween: Story = {
  args: {
    direction: 'horizontal',
    spacing: 'md',
    justify: 'space-between',
  },
  render: (args) => (
    <div className="story-container">
      <Stack {...args}>
        <Box>Item 1</Box>
        <Box>Item 2</Box>
        <Box>Item 3</Box>
      </Stack>
    </div>
  ),
};

export const WithWrap: Story = {
  args: {
    direction: 'horizontal',
    spacing: 'md',
    wrap: true,
  },
  render: (args) => (
    <div className="story-container--narrow">
      <Stack {...args}>
        <Box>Item 1</Box>
        <Box>Item 2</Box>
        <Box>Item 3</Box>
        <Box>Item 4</Box>
        <Box>Item 5</Box>
        <Box>Item 6</Box>
        <Box>Item 7</Box>
        <Box>Item 8</Box>
      </Stack>
    </div>
  ),
};

export const NestedStacks: Story = {
  render: () => (
    <Stack direction="vertical" spacing="lg">
      <Box color="light-blue">
        <Stack direction="horizontal" spacing="sm">
          <Box color="blue">A1</Box>
          <Box color="blue">A2</Box>
          <Box color="blue">A3</Box>
        </Stack>
      </Box>
      <Box color="light-blue">
        <Stack direction="horizontal" spacing="sm">
          <Box color="blue">B1</Box>
          <Box color="blue">B2</Box>
        </Stack>
      </Box>
      <Box color="light-blue">
        <Stack direction="horizontal" spacing="sm">
          <Box color="blue">C1</Box>
          <Box color="blue">C2</Box>
          <Box color="blue">C3</Box>
          <Box color="blue">C4</Box>
        </Stack>
      </Box>
    </Stack>
  ),
};

export const RealUseCase: Story = {
  render: () => (
    <Stack direction="vertical" spacing="md">
      <div className="story-card">
        <Stack direction="vertical" spacing="sm">
          <h3 className="story-card__title">Card Title 1</h3>
          <p className="story-card__text">This is a card with consistent spacing using Stack</p>
          <Stack direction="horizontal" spacing="sm">
            <button className="story-button story-button--primary">Action</button>
            <button className="story-button story-button--secondary">Cancel</button>
          </Stack>
        </Stack>
      </div>

      <div className="story-card">
        <Stack direction="vertical" spacing="sm">
          <h3 className="story-card__title">Card Title 2</h3>
          <p className="story-card__text">
            Notice how all spacing is consistent without custom margins
          </p>
          <Stack direction="horizontal" spacing="sm">
            <button className="story-button story-button--primary">Action</button>
            <button className="story-button story-button--secondary">Cancel</button>
          </Stack>
        </Stack>
      </div>

      <div className="story-card">
        <Stack direction="vertical" spacing="sm">
          <h3 className="story-card__title">Card Title 3</h3>
          <p className="story-card__text">Zero custom CSS needed for spacing!</p>
          <Stack direction="horizontal" spacing="sm">
            <button className="story-button story-button--primary">Action</button>
            <button className="story-button story-button--secondary">Cancel</button>
          </Stack>
        </Stack>
      </div>
    </Stack>
  ),
};
