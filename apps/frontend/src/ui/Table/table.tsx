import React, { ReactNode, ThHTMLAttributes, TdHTMLAttributes, HTMLAttributes } from 'react';
import clsx from 'clsx';
import './table.css';

interface TableProps extends Omit<HTMLAttributes<HTMLTableElement>, 'className' | 'style'> {
  children: ReactNode;
  striped?: boolean;
  hoverable?: boolean;
  bordered?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

interface TableHeaderProps extends Omit<
  HTMLAttributes<HTMLTableSectionElement>,
  'className' | 'style'
> {
  children: ReactNode;
}

interface TableBodyProps extends Omit<
  HTMLAttributes<HTMLTableSectionElement>,
  'className' | 'style'
> {
  children: ReactNode;
}

interface TableRowProps extends Omit<HTMLAttributes<HTMLTableRowElement>, 'className' | 'style'> {
  children: ReactNode;
}

interface TableCellProps extends Omit<
  ThHTMLAttributes<HTMLTableCellElement> & TdHTMLAttributes<HTMLTableCellElement>,
  'className' | 'style'
> {
  children?: ReactNode;
  as?: 'th' | 'td';
  align?: 'left' | 'center' | 'right';
}

const Table: React.FC<TableProps> = ({
  children,
  striped = false,
  hoverable = false,
  bordered = false,
  size = 'md',
  ...props
}) => {
  return (
    <table
      className={clsx(
        'table',
        `table-${size}`,
        striped && 'table-striped',
        hoverable && 'table-hoverable',
        bordered && 'table-bordered'
      )}
      {...props}
    >
      {children}
    </table>
  );
};

const TableHeader: React.FC<TableHeaderProps> = ({ children, ...props }) => {
  return (
    <thead className="table-header" {...props}>
      {children}
    </thead>
  );
};

const TableBody: React.FC<TableBodyProps> = ({ children, ...props }) => {
  return (
    <tbody className="table-body" {...props}>
      {children}
    </tbody>
  );
};

const TableRow: React.FC<TableRowProps> = ({ children, ...props }) => {
  return (
    <tr className="table-row" {...props}>
      {children}
    </tr>
  );
};

const TableCell: React.FC<TableCellProps> = ({ children, as = 'td', align = 'left', ...props }) => {
  const Component = as;
  const className = `table-cell table-cell-${align}`;

  return (
    <Component className={className} {...props}>
      {children}
    </Component>
  );
};

const TableComponent = Object.assign(Table, {
  Header: TableHeader,
  Body: TableBody,
  Row: TableRow,
  Cell: TableCell,
});

export { TableComponent as Table };
export type { TableProps, TableHeaderProps, TableBodyProps, TableRowProps, TableCellProps };
