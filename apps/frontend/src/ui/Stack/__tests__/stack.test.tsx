import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Stack from '../stack';

describe('Stack', () => {
  it('renders children correctly', () => {
    render(
      <Stack>
        <div>Child 1</div>
        <div>Child 2</div>
        <div>Child 3</div>
      </Stack>
    );

    expect(screen.getByText('Child 1')).toBeInTheDocument();
    expect(screen.getByText('Child 2')).toBeInTheDocument();
    expect(screen.getByText('Child 3')).toBeInTheDocument();
  });

  it('renders as div by default', () => {
    const { container } = render(
      <Stack>
        <div>Child</div>
      </Stack>
    );

    const stack = container.firstChild;
    expect(stack?.nodeName).toBe('DIV');
  });

  it('renders as custom element when as prop is provided', () => {
    const { container } = render(
      <Stack as="section">
        <div>Child</div>
      </Stack>
    );

    const stack = container.firstChild;
    expect(stack?.nodeName).toBe('SECTION');
  });

  describe('Direction', () => {
    it('applies vertical direction class by default', () => {
      const { container } = render(
        <Stack>
          <div>Child</div>
        </Stack>
      );

      const stack = container.firstChild as HTMLElement;
      expect(stack.className).toContain('stack--vertical');
    });

    it('applies horizontal direction class when specified', () => {
      const { container } = render(
        <Stack direction="horizontal">
          <div>Child</div>
        </Stack>
      );

      const stack = container.firstChild as HTMLElement;
      expect(stack.className).toContain('stack--horizontal');
    });
  });

  describe('Spacing', () => {
    it('applies md spacing class by default', () => {
      const { container } = render(
        <Stack>
          <div>Child</div>
        </Stack>
      );

      const stack = container.firstChild as HTMLElement;
      expect(stack.className).toContain('stack--spacing-md');
    });

    it('applies correct spacing class for xs', () => {
      const { container } = render(
        <Stack spacing="xs">
          <div>Child</div>
        </Stack>
      );

      const stack = container.firstChild as HTMLElement;
      expect(stack.className).toContain('stack--spacing-xs');
    });

    it('applies correct spacing class for sm', () => {
      const { container } = render(
        <Stack spacing="sm">
          <div>Child</div>
        </Stack>
      );

      const stack = container.firstChild as HTMLElement;
      expect(stack.className).toContain('stack--spacing-sm');
    });

    it('applies correct spacing class for lg', () => {
      const { container } = render(
        <Stack spacing="lg">
          <div>Child</div>
        </Stack>
      );

      const stack = container.firstChild as HTMLElement;
      expect(stack.className).toContain('stack--spacing-lg');
    });

    it('applies correct spacing class for xl', () => {
      const { container } = render(
        <Stack spacing="xl">
          <div>Child</div>
        </Stack>
      );

      const stack = container.firstChild as HTMLElement;
      expect(stack.className).toContain('stack--spacing-xl');
    });

    it('applies correct spacing class for 2xl', () => {
      const { container } = render(
        <Stack spacing="2xl">
          <div>Child</div>
        </Stack>
      );

      const stack = container.firstChild as HTMLElement;
      expect(stack.className).toContain('stack--spacing-2xl');
    });

    it('applies correct spacing class for 3xl', () => {
      const { container } = render(
        <Stack spacing="3xl">
          <div>Child</div>
        </Stack>
      );

      const stack = container.firstChild as HTMLElement;
      expect(stack.className).toContain('stack--spacing-3xl');
    });
  });

  describe('Alignment', () => {
    it('applies stretch alignment class by default', () => {
      const { container } = render(
        <Stack>
          <div>Child</div>
        </Stack>
      );

      const stack = container.firstChild as HTMLElement;
      expect(stack.className).toContain('stack--align-stretch');
    });

    it('applies start alignment class when specified', () => {
      const { container } = render(
        <Stack align="start">
          <div>Child</div>
        </Stack>
      );

      const stack = container.firstChild as HTMLElement;
      expect(stack.className).toContain('stack--align-start');
    });

    it('applies center alignment class when specified', () => {
      const { container } = render(
        <Stack align="center">
          <div>Child</div>
        </Stack>
      );

      const stack = container.firstChild as HTMLElement;
      expect(stack.className).toContain('stack--align-center');
    });

    it('applies end alignment class when specified', () => {
      const { container } = render(
        <Stack align="end">
          <div>Child</div>
        </Stack>
      );

      const stack = container.firstChild as HTMLElement;
      expect(stack.className).toContain('stack--align-end');
    });
  });

  describe('Justify', () => {
    it('does not apply justify class by default', () => {
      const { container } = render(
        <Stack>
          <div>Child</div>
        </Stack>
      );

      const stack = container.firstChild as HTMLElement;
      expect(stack.className).not.toContain('stack--justify');
    });

    it('applies start justify class when specified', () => {
      const { container } = render(
        <Stack justify="start">
          <div>Child</div>
        </Stack>
      );

      const stack = container.firstChild as HTMLElement;
      expect(stack.className).toContain('stack--justify-start');
    });

    it('applies center justify class when specified', () => {
      const { container } = render(
        <Stack justify="center">
          <div>Child</div>
        </Stack>
      );

      const stack = container.firstChild as HTMLElement;
      expect(stack.className).toContain('stack--justify-center');
    });

    it('applies end justify class when specified', () => {
      const { container } = render(
        <Stack justify="end">
          <div>Child</div>
        </Stack>
      );

      const stack = container.firstChild as HTMLElement;
      expect(stack.className).toContain('stack--justify-end');
    });

    it('applies space-between justify class when specified', () => {
      const { container } = render(
        <Stack justify="space-between">
          <div>Child</div>
        </Stack>
      );

      const stack = container.firstChild as HTMLElement;
      expect(stack.className).toContain('stack--justify-space-between');
    });

    it('applies space-around justify class when specified', () => {
      const { container } = render(
        <Stack justify="space-around">
          <div>Child</div>
        </Stack>
      );

      const stack = container.firstChild as HTMLElement;
      expect(stack.className).toContain('stack--justify-space-around');
    });
  });

  describe('Wrap', () => {
    it('does not apply wrap class by default', () => {
      const { container } = render(
        <Stack>
          <div>Child</div>
        </Stack>
      );

      const stack = container.firstChild as HTMLElement;
      expect(stack.className).not.toContain('stack--wrap');
    });

    it('applies wrap class when wrap is true', () => {
      const { container } = render(
        <Stack wrap>
          <div>Child</div>
        </Stack>
      );

      const stack = container.firstChild as HTMLElement;
      expect(stack.className).toContain('stack--wrap');
    });
  });

  describe('Combined Props', () => {
    it('applies multiple classes correctly', () => {
      const { container } = render(
        <Stack direction="horizontal" spacing="lg" align="center" justify="space-between" wrap>
          <div>Child</div>
        </Stack>
      );

      const stack = container.firstChild as HTMLElement;
      expect(stack.className).toContain('stack');
      expect(stack.className).toContain('stack--horizontal');
      expect(stack.className).toContain('stack--spacing-lg');
      expect(stack.className).toContain('stack--align-center');
      expect(stack.className).toContain('stack--justify-space-between');
      expect(stack.className).toContain('stack--wrap');
    });

    it('handles stretch alignment with no extra class when explicitly set', () => {
      const { container } = render(
        <Stack align="stretch">
          <div>Child</div>
        </Stack>
      );

      const stack = container.firstChild as HTMLElement;
      expect(stack.className).toContain('stack--align-stretch');
    });
  });

  describe('Nested Stacks', () => {
    it('renders nested stacks correctly', () => {
      render(
        <Stack direction="vertical" spacing="lg">
          <Stack direction="horizontal" spacing="sm">
            <div>A1</div>
            <div>A2</div>
          </Stack>
          <Stack direction="horizontal" spacing="sm">
            <div>B1</div>
            <div>B2</div>
          </Stack>
        </Stack>
      );

      expect(screen.getByText('A1')).toBeInTheDocument();
      expect(screen.getByText('A2')).toBeInTheDocument();
      expect(screen.getByText('B1')).toBeInTheDocument();
      expect(screen.getByText('B2')).toBeInTheDocument();
    });
  });
});
