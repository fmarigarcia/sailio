import type { Meta, StoryObj } from '@storybook/react';
import Container from './container';
import './container-stories.css';

const meta: Meta<typeof Container> = {
  title: 'UI/Layout/Container',
  component: Container,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', '2xl', 'full', 'fluid'],
      description: 'Maximum width of the container',
    },
    padding: {
      control: 'boolean',
      description: 'Add responsive horizontal padding',
    },
    as: {
      control: 'text',
      description: 'HTML element to render as',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Container>;

export const Default: Story = {
  args: {
    size: 'lg',
    padding: true,
  },
  render: (args) => (
    <div className="story-container-viewport">
      <Container {...args}>
        <div className="story-container-demo-content">
          <h3 className="story-container-demo-title">Container (lg)</h3>
          <p className="story-container-demo-text">
            This content is centered and limited to 1024px width. Try resizing the viewport to see
            how it behaves.
          </p>
        </div>
      </Container>
    </div>
  ),
};

export const SizeSmall: Story = {
  args: {
    size: 'sm',
    padding: true,
  },
  render: (args) => (
    <div className="story-container-viewport">
      <Container {...args}>
        <div className="story-container-demo-content">
          <h3 className="story-container-demo-title">Small Container (640px)</h3>
          <p className="story-container-demo-text">
            Perfect for narrow content like forms or single-column text.
          </p>
        </div>
      </Container>
    </div>
  ),
};

export const SizeMedium: Story = {
  args: {
    size: 'md',
    padding: true,
  },
  render: (args) => (
    <div className="story-container-viewport">
      <Container {...args}>
        <div className="story-container-demo-content">
          <h3 className="story-container-demo-title">Medium Container (768px)</h3>
          <p className="story-container-demo-text">
            Good for blog posts, documentation, or reading-focused layouts.
          </p>
        </div>
      </Container>
    </div>
  ),
};

export const SizeLarge: Story = {
  args: {
    size: 'lg',
    padding: true,
  },
  render: (args) => (
    <div className="story-container-viewport">
      <Container {...args}>
        <div className="story-container-demo-content">
          <h3 className="story-container-demo-title">Large Container (1024px)</h3>
          <p className="story-container-demo-text">
            Balanced width for most application layouts. Default size.
          </p>
        </div>
      </Container>
    </div>
  ),
};

export const SizeExtraLarge: Story = {
  args: {
    size: 'xl',
    padding: true,
  },
  render: (args) => (
    <div className="story-container-viewport">
      <Container {...args}>
        <div className="story-container-demo-content">
          <h3 className="story-container-demo-title">Extra Large Container (1280px)</h3>
          <p className="story-container-demo-text">
            For dashboard layouts or content-heavy pages that need more space.
          </p>
        </div>
      </Container>
    </div>
  ),
};

export const Size2XL: Story = {
  args: {
    size: '2xl',
    padding: true,
  },
  render: (args) => (
    <div className="story-container-viewport">
      <Container {...args}>
        <div className="story-container-demo-content">
          <h3 className="story-container-demo-title">2XL Container (1536px)</h3>
          <p className="story-container-demo-text">
            Maximum practical width for very large screens with dense content.
          </p>
        </div>
      </Container>
    </div>
  ),
};

export const SizeFull: Story = {
  args: {
    size: 'full',
    padding: true,
  },
  render: (args) => (
    <div className="story-container-viewport">
      <Container {...args}>
        <div className="story-container-demo-content">
          <h3 className="story-container-demo-title">Full Width Container</h3>
          <p className="story-container-demo-text">
            Takes 100% width but maintains horizontal padding for edge spacing.
          </p>
        </div>
      </Container>
    </div>
  ),
};

export const SizeFluid: Story = {
  args: {
    size: 'fluid',
    padding: true,
  },
  render: (args) => (
    <div className="story-container-viewport">
      <Container {...args}>
        <div className="story-container-demo-content">
          <h3 className="story-container-demo-title">Fluid Container</h3>
          <p className="story-container-demo-text">
            No max-width constraint, expands to fill available space with padding.
          </p>
        </div>
      </Container>
    </div>
  ),
};

export const WithoutPadding: Story = {
  args: {
    size: 'lg',
    padding: false,
  },
  render: (args) => (
    <div className="story-container-viewport">
      <Container {...args}>
        <div className="story-container-demo-content">
          <h3 className="story-container-demo-title">Container Without Padding</h3>
          <p className="story-container-demo-text">
            Content extends to the edges. Useful when child elements handle their own spacing.
          </p>
        </div>
      </Container>
    </div>
  ),
};

export const AllSizesComparison: Story = {
  render: () => (
    <div className="story-container-comparison-wrapper">
      {[
        { size: 'sm' as const, maxWidth: '640px' },
        { size: 'md' as const, maxWidth: '768px' },
        { size: 'lg' as const, maxWidth: '1024px' },
        { size: 'xl' as const, maxWidth: '1280px' },
        { size: '2xl' as const, maxWidth: '1536px' },
      ].map(({ size, maxWidth }) => (
        <div key={size}>
          <div className="story-container-label">
            {size.toUpperCase()} - {maxWidth}
          </div>
          <Container size={size} padding>
            <div className="story-container-demo-content">
              <h3 className="story-container-demo-title">Container Size: {size}</h3>
              <p className="story-container-demo-text">Max width: {maxWidth}</p>
            </div>
          </Container>
        </div>
      ))}
    </div>
  ),
};

export const RealUseCase: Story = {
  render: () => (
    <div className="story-container-viewport">
      <Container size="lg" padding>
        <div className="story-content-block">
          <h1 className="story-content-block__heading">Sailing Training Session Report</h1>
          <p className="story-content-block__paragraph">
            The Container component prevents text from stretching across the entire viewport on
            large screens, maintaining optimal reading width. This is critical for SaaS applications
            where users may have ultra-wide monitors.
          </p>
          <p className="story-content-block__paragraph">
            Without a container, this text would extend to the full width of the screen (possibly
            200+ characters per line), making it nearly impossible to read comfortably. The human
            eye can comfortably read 50-75 characters per line.
          </p>
          <p className="story-content-block__paragraph">
            Container also centralizes content, creating a balanced, professional appearance that
            guides the user&apos;s focus to the content rather than dealing with awkward
            edge-to-edge layouts.
          </p>
        </div>
      </Container>
    </div>
  ),
};

export const NestedWithStack: Story = {
  render: () => (
    <div className="story-container-viewport">
      <Container size="lg" padding>
        <div className="story-content-block">
          <h2 className="story-content-block__heading">Page Title</h2>
          <p className="story-content-block__paragraph">
            Container works great with Stack for vertical spacing. This creates a predictable,
            consistent layout system.
          </p>
        </div>
      </Container>
    </div>
  ),
};
