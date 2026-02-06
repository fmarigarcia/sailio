import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Container from '../container';

describe('Container', () => {
  it('renders children correctly', () => {
    render(
      <Container>
        <div>Test Content</div>
      </Container>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('renders as div by default', () => {
    const { container } = render(
      <Container>
        <div>Child</div>
      </Container>
    );

    const containerElement = container.firstChild;
    expect(containerElement?.nodeName).toBe('DIV');
  });

  it('renders as custom element when as prop is provided', () => {
    const { container } = render(
      <Container as="section">
        <div>Child</div>
      </Container>
    );

    const containerElement = container.firstChild;
    expect(containerElement?.nodeName).toBe('SECTION');
  });

  describe('Size variants', () => {
    it('applies lg size class by default', () => {
      const { container } = render(
        <Container>
          <div>Child</div>
        </Container>
      );

      const containerElement = container.firstChild as HTMLElement;
      expect(containerElement.className).toContain('container--lg');
    });

    it('applies sm size class when specified', () => {
      const { container } = render(
        <Container size="sm">
          <div>Child</div>
        </Container>
      );

      const containerElement = container.firstChild as HTMLElement;
      expect(containerElement.className).toContain('container--sm');
    });

    it('applies md size class when specified', () => {
      const { container } = render(
        <Container size="md">
          <div>Child</div>
        </Container>
      );

      const containerElement = container.firstChild as HTMLElement;
      expect(containerElement.className).toContain('container--md');
    });

    it('applies lg size class when specified', () => {
      const { container } = render(
        <Container size="lg">
          <div>Child</div>
        </Container>
      );

      const containerElement = container.firstChild as HTMLElement;
      expect(containerElement.className).toContain('container--lg');
    });

    it('applies xl size class when specified', () => {
      const { container } = render(
        <Container size="xl">
          <div>Child</div>
        </Container>
      );

      const containerElement = container.firstChild as HTMLElement;
      expect(containerElement.className).toContain('container--xl');
    });

    it('applies 2xl size class when specified', () => {
      const { container } = render(
        <Container size="2xl">
          <div>Child</div>
        </Container>
      );

      const containerElement = container.firstChild as HTMLElement;
      expect(containerElement.className).toContain('container--2xl');
    });

    it('applies full size class when specified', () => {
      const { container } = render(
        <Container size="full">
          <div>Child</div>
        </Container>
      );

      const containerElement = container.firstChild as HTMLElement;
      expect(containerElement.className).toContain('container--full');
    });

    it('applies fluid size class when specified', () => {
      const { container } = render(
        <Container size="fluid">
          <div>Child</div>
        </Container>
      );

      const containerElement = container.firstChild as HTMLElement;
      expect(containerElement.className).toContain('container--fluid');
    });
  });

  describe('Padding', () => {
    it('applies padding class by default', () => {
      const { container } = render(
        <Container>
          <div>Child</div>
        </Container>
      );

      const containerElement = container.firstChild as HTMLElement;
      expect(containerElement.className).toContain('container--padding');
    });

    it('applies padding class when padding is true', () => {
      const { container } = render(
        <Container padding>
          <div>Child</div>
        </Container>
      );

      const containerElement = container.firstChild as HTMLElement;
      expect(containerElement.className).toContain('container--padding');
    });

    it('does not apply padding class when padding is false', () => {
      const { container } = render(
        <Container padding={false}>
          <div>Child</div>
        </Container>
      );

      const containerElement = container.firstChild as HTMLElement;
      expect(containerElement.className).not.toContain('container--padding');
    });
  });

  describe('Base classes', () => {
    it('always applies base container class', () => {
      const { container } = render(
        <Container>
          <div>Child</div>
        </Container>
      );

      const containerElement = container.firstChild as HTMLElement;
      expect(containerElement.className).toContain('container');
    });
  });

  describe('Combined props', () => {
    it('applies multiple classes correctly', () => {
      const { container } = render(
        <Container size="md" padding>
          <div>Child</div>
        </Container>
      );

      const containerElement = container.firstChild as HTMLElement;
      expect(containerElement.className).toContain('container');
      expect(containerElement.className).toContain('container--md');
      expect(containerElement.className).toContain('container--padding');
    });

    it('works with size and no padding', () => {
      const { container } = render(
        <Container size="xl" padding={false}>
          <div>Child</div>
        </Container>
      );

      const containerElement = container.firstChild as HTMLElement;
      expect(containerElement.className).toContain('container');
      expect(containerElement.className).toContain('container--xl');
      expect(containerElement.className).not.toContain('container--padding');
    });

    it('works with custom element, size, and padding', () => {
      const { container } = render(
        <Container as="article" size="sm" padding={false}>
          <div>Child</div>
        </Container>
      );

      const containerElement = container.firstChild as HTMLElement;
      expect(containerElement?.nodeName).toBe('ARTICLE');
      expect(containerElement.className).toContain('container');
      expect(containerElement.className).toContain('container--sm');
      expect(containerElement.className).not.toContain('container--padding');
    });
  });

  describe('Nested content', () => {
    it('renders nested components correctly', () => {
      render(
        <Container>
          <div>
            <h1>Heading</h1>
            <p>Paragraph</p>
          </div>
        </Container>
      );

      expect(screen.getByText('Heading')).toBeInTheDocument();
      expect(screen.getByText('Paragraph')).toBeInTheDocument();
    });

    it('handles multiple children', () => {
      render(
        <Container>
          <div>First</div>
          <div>Second</div>
          <div>Third</div>
        </Container>
      );

      expect(screen.getByText('First')).toBeInTheDocument();
      expect(screen.getByText('Second')).toBeInTheDocument();
      expect(screen.getByText('Third')).toBeInTheDocument();
    });
  });
});
