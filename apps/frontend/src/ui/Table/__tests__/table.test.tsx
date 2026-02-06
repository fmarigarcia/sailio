import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Table } from '../table';

describe('Table', () => {
  it('renders table with content', () => {
    render(
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.Cell as="th">Header</Table.Cell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell>Content</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    );

    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByRole('columnheader')).toHaveTextContent('Header');
    expect(screen.getByRole('cell')).toHaveTextContent('Content');
  });

  it('applies default md size class', () => {
    render(
      <Table>
        <Table.Body>
          <Table.Row>
            <Table.Cell>Test</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    );

    expect(screen.getByRole('table')).toHaveClass('table-md');
  });

  it('applies small size class', () => {
    render(
      <Table size="sm">
        <Table.Body>
          <Table.Row>
            <Table.Cell>Test</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    );

    expect(screen.getByRole('table')).toHaveClass('table-sm');
  });

  it('applies large size class', () => {
    render(
      <Table size="lg">
        <Table.Body>
          <Table.Row>
            <Table.Cell>Test</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    );

    expect(screen.getByRole('table')).toHaveClass('table-lg');
  });

  it('applies striped class when striped prop is true', () => {
    render(
      <Table striped>
        <Table.Body>
          <Table.Row>
            <Table.Cell>Test</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    );

    expect(screen.getByRole('table')).toHaveClass('table-striped');
  });

  it('does not apply striped class when striped prop is false', () => {
    render(
      <Table striped={false}>
        <Table.Body>
          <Table.Row>
            <Table.Cell>Test</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    );

    expect(screen.getByRole('table')).not.toHaveClass('table-striped');
  });

  it('applies hoverable class when hoverable prop is true', () => {
    render(
      <Table hoverable>
        <Table.Body>
          <Table.Row>
            <Table.Cell>Test</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    );

    expect(screen.getByRole('table')).toHaveClass('table-hoverable');
  });

  it('applies bordered class when bordered prop is true', () => {
    render(
      <Table bordered>
        <Table.Body>
          <Table.Row>
            <Table.Cell>Test</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    );

    expect(screen.getByRole('table')).toHaveClass('table-bordered');
  });

  it('applies multiple modifier classes together', () => {
    render(
      <Table striped hoverable bordered size="sm">
        <Table.Body>
          <Table.Row>
            <Table.Cell>Test</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    );

    const table = screen.getByRole('table');
    expect(table).toHaveClass('table-sm');
    expect(table).toHaveClass('table-striped');
    expect(table).toHaveClass('table-hoverable');
    expect(table).toHaveClass('table-bordered');
  });
});

describe('Table.Header', () => {
  it('renders thead element', () => {
    const { container } = render(
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.Cell as="th">Header</Table.Cell>
          </Table.Row>
        </Table.Header>
      </Table>
    );

    const thead = container.querySelector('thead');
    expect(thead).toBeInTheDocument();
    expect(thead).toHaveClass('table-header');
  });

  it('renders children correctly', () => {
    render(
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.Cell as="th">Column 1</Table.Cell>
            <Table.Cell as="th">Column 2</Table.Cell>
          </Table.Row>
        </Table.Header>
      </Table>
    );

    expect(screen.getByText('Column 1')).toBeInTheDocument();
    expect(screen.getByText('Column 2')).toBeInTheDocument();
  });
});

describe('Table.Body', () => {
  it('renders tbody element', () => {
    const { container } = render(
      <Table>
        <Table.Body>
          <Table.Row>
            <Table.Cell>Body</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    );

    const tbody = container.querySelector('tbody');
    expect(tbody).toBeInTheDocument();
    expect(tbody).toHaveClass('table-body');
  });

  it('renders multiple rows', () => {
    render(
      <Table>
        <Table.Body>
          <Table.Row>
            <Table.Cell>Row 1</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>Row 2</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>Row 3</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    );

    expect(screen.getByText('Row 1')).toBeInTheDocument();
    expect(screen.getByText('Row 2')).toBeInTheDocument();
    expect(screen.getByText('Row 3')).toBeInTheDocument();
  });
});

describe('Table.Row', () => {
  it('renders tr element', () => {
    const { container } = render(
      <Table>
        <Table.Body>
          <Table.Row>
            <Table.Cell>Test</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    );

    const tr = container.querySelector('tr');
    expect(tr).toBeInTheDocument();
    expect(tr).toHaveClass('table-row');
  });

  it('renders multiple cells', () => {
    render(
      <Table>
        <Table.Body>
          <Table.Row>
            <Table.Cell>Cell 1</Table.Cell>
            <Table.Cell>Cell 2</Table.Cell>
            <Table.Cell>Cell 3</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    );

    expect(screen.getByText('Cell 1')).toBeInTheDocument();
    expect(screen.getByText('Cell 2')).toBeInTheDocument();
    expect(screen.getByText('Cell 3')).toBeInTheDocument();
  });
});

describe('Table.Cell', () => {
  it('renders td element by default', () => {
    const { container } = render(
      <Table>
        <Table.Body>
          <Table.Row>
            <Table.Cell>Content</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    );

    const td = container.querySelector('td');
    expect(td).toBeInTheDocument();
    expect(td).toHaveClass('table-cell');
  });

  it('renders th element when as prop is th', () => {
    const { container } = render(
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.Cell as="th">Header</Table.Cell>
          </Table.Row>
        </Table.Header>
      </Table>
    );

    const th = container.querySelector('th');
    expect(th).toBeInTheDocument();
    expect(th).toHaveClass('table-cell');
  });

  it('applies left align class by default', () => {
    render(
      <Table>
        <Table.Body>
          <Table.Row>
            <Table.Cell>Left</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    );

    expect(screen.getByRole('cell')).toHaveClass('table-cell-left');
  });

  it('applies center align class', () => {
    render(
      <Table>
        <Table.Body>
          <Table.Row>
            <Table.Cell align="center">Center</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    );

    expect(screen.getByRole('cell')).toHaveClass('table-cell-center');
  });

  it('applies right align class', () => {
    render(
      <Table>
        <Table.Body>
          <Table.Row>
            <Table.Cell align="right">Right</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    );

    expect(screen.getByRole('cell')).toHaveClass('table-cell-right');
  });

  it('renders cell content', () => {
    render(
      <Table>
        <Table.Body>
          <Table.Row>
            <Table.Cell>Test Content</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('renders empty cell', () => {
    const { container } = render(
      <Table>
        <Table.Body>
          <Table.Row>
            <Table.Cell />
          </Table.Row>
        </Table.Body>
      </Table>
    );

    const td = container.querySelector('td');
    expect(td).toBeInTheDocument();
    expect(td).toBeEmptyDOMElement();
  });
});

describe('Table Integration', () => {
  it('renders complete table structure', () => {
    render(
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.Cell as="th">Name</Table.Cell>
            <Table.Cell as="th">Email</Table.Cell>
            <Table.Cell as="th" align="right">
              Actions
            </Table.Cell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell>John Doe</Table.Cell>
            <Table.Cell>john@example.com</Table.Cell>
            <Table.Cell align="right">Edit</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>Jane Smith</Table.Cell>
            <Table.Cell>jane@example.com</Table.Cell>
            <Table.Cell align="right">Edit</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    );

    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getAllByRole('columnheader')).toHaveLength(3);
    expect(screen.getAllByRole('row')).toHaveLength(3); // 1 header + 2 body
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  it('renders table with all variants enabled', () => {
    render(
      <Table striped hoverable bordered size="lg">
        <Table.Header>
          <Table.Row>
            <Table.Cell as="th">ID</Table.Cell>
            <Table.Cell as="th">Name</Table.Cell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell>1</Table.Cell>
            <Table.Cell>Item 1</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>2</Table.Cell>
            <Table.Cell>Item 2</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    );

    const table = screen.getByRole('table');
    expect(table).toHaveClass('table');
    expect(table).toHaveClass('table-lg');
    expect(table).toHaveClass('table-striped');
    expect(table).toHaveClass('table-hoverable');
    expect(table).toHaveClass('table-bordered');
  });

  it('handles complex table with different cell alignments', () => {
    render(
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.Cell as="th">Left Header</Table.Cell>
            <Table.Cell as="th" align="center">
              Center Header
            </Table.Cell>
            <Table.Cell as="th" align="right">
              Right Header
            </Table.Cell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell>Left content</Table.Cell>
            <Table.Cell align="center">Center content</Table.Cell>
            <Table.Cell align="right">Right content</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    );

    const cells = screen.getAllByRole('cell');
    expect(cells[0]).toHaveClass('table-cell-left');
    expect(cells[1]).toHaveClass('table-cell-center');
    expect(cells[2]).toHaveClass('table-cell-right');
  });
});
