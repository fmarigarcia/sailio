import type { Meta, StoryObj } from '@storybook/react';
import { Table } from './table';

const meta: Meta<typeof Table> = {
  title: 'UI/Table',
  component: Table,
  tags: ['autodocs'],
  argTypes: {
    striped: {
      control: 'boolean',
      description: 'Alternate row colors for better readability',
    },
    hoverable: {
      control: 'boolean',
      description: 'Highlight rows on hover',
    },
    bordered: {
      control: 'boolean',
      description: 'Show cell borders',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Table padding size',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Table>;

export const Default: Story = {
  render: (args) => (
    <Table {...args}>
      <Table.Header>
        <Table.Row>
          <Table.Cell as="th">Name</Table.Cell>
          <Table.Cell as="th">Email</Table.Cell>
          <Table.Cell as="th">Role</Table.Cell>
          <Table.Cell as="th" align="right">
            Actions
          </Table.Cell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row>
          <Table.Cell>John Doe</Table.Cell>
          <Table.Cell>john@example.com</Table.Cell>
          <Table.Cell>Coach</Table.Cell>
          <Table.Cell align="right">Edit</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Jane Smith</Table.Cell>
          <Table.Cell>jane@example.com</Table.Cell>
          <Table.Cell>Athlete</Table.Cell>
          <Table.Cell align="right">Edit</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Bob Johnson</Table.Cell>
          <Table.Cell>bob@example.com</Table.Cell>
          <Table.Cell>Athlete</Table.Cell>
          <Table.Cell align="right">Edit</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  ),
  args: {
    striped: false,
    hoverable: false,
    bordered: false,
    size: 'md',
  },
};

export const Striped: Story = {
  render: (args) => (
    <Table {...args}>
      <Table.Header>
        <Table.Row>
          <Table.Cell as="th">Session</Table.Cell>
          <Table.Cell as="th">Date</Table.Cell>
          <Table.Cell as="th">Duration</Table.Cell>
          <Table.Cell as="th" align="right">
            Status
          </Table.Cell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row>
          <Table.Cell>Morning Practice</Table.Cell>
          <Table.Cell>2026-02-06</Table.Cell>
          <Table.Cell>2h 30m</Table.Cell>
          <Table.Cell align="right">Completed</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Afternoon Drills</Table.Cell>
          <Table.Cell>2026-02-06</Table.Cell>
          <Table.Cell>1h 45m</Table.Cell>
          <Table.Cell align="right">Completed</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Tactical Review</Table.Cell>
          <Table.Cell>2026-02-05</Table.Cell>
          <Table.Cell>1h 15m</Table.Cell>
          <Table.Cell align="right">Completed</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Physical Training</Table.Cell>
          <Table.Cell>2026-02-05</Table.Cell>
          <Table.Cell>2h 00m</Table.Cell>
          <Table.Cell align="right">Completed</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  ),
  args: {
    striped: true,
    hoverable: false,
    bordered: false,
    size: 'md',
  },
};

export const Hoverable: Story = {
  render: (args) => (
    <Table {...args}>
      <Table.Header>
        <Table.Row>
          <Table.Cell as="th">Athlete</Table.Cell>
          <Table.Cell as="th">Boat Class</Table.Cell>
          <Table.Cell as="th">Last Session</Table.Cell>
          <Table.Cell as="th" align="right">
            Performance
          </Table.Cell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row>
          <Table.Cell>Alice Williams</Table.Cell>
          <Table.Cell>Laser</Table.Cell>
          <Table.Cell>2 days ago</Table.Cell>
          <Table.Cell align="right">85%</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Carlos Rodriguez</Table.Cell>
          <Table.Cell>470</Table.Cell>
          <Table.Cell>1 day ago</Table.Cell>
          <Table.Cell align="right">92%</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Emma Chen</Table.Cell>
          <Table.Cell>Finn</Table.Cell>
          <Table.Cell>3 days ago</Table.Cell>
          <Table.Cell align="right">78%</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  ),
  args: {
    striped: false,
    hoverable: true,
    bordered: false,
    size: 'md',
  },
};

export const Bordered: Story = {
  render: (args) => (
    <Table {...args}>
      <Table.Header>
        <Table.Row>
          <Table.Cell as="th">Metric</Table.Cell>
          <Table.Cell as="th" align="center">
            Week 1
          </Table.Cell>
          <Table.Cell as="th" align="center">
            Week 2
          </Table.Cell>
          <Table.Cell as="th" align="center">
            Week 3
          </Table.Cell>
          <Table.Cell as="th" align="center">
            Week 4
          </Table.Cell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row>
          <Table.Cell>Distance (km)</Table.Cell>
          <Table.Cell align="center">45</Table.Cell>
          <Table.Cell align="center">52</Table.Cell>
          <Table.Cell align="center">48</Table.Cell>
          <Table.Cell align="center">55</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Sessions</Table.Cell>
          <Table.Cell align="center">8</Table.Cell>
          <Table.Cell align="center">9</Table.Cell>
          <Table.Cell align="center">7</Table.Cell>
          <Table.Cell align="center">10</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Avg Speed (knots)</Table.Cell>
          <Table.Cell align="center">4.2</Table.Cell>
          <Table.Cell align="center">4.5</Table.Cell>
          <Table.Cell align="center">4.3</Table.Cell>
          <Table.Cell align="center">4.6</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  ),
  args: {
    striped: false,
    hoverable: false,
    bordered: true,
    size: 'md',
  },
};

export const SmallSize: Story = {
  render: (args) => (
    <Table {...args}>
      <Table.Header>
        <Table.Row>
          <Table.Cell as="th">ID</Table.Cell>
          <Table.Cell as="th">Name</Table.Cell>
          <Table.Cell as="th">Status</Table.Cell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row>
          <Table.Cell>001</Table.Cell>
          <Table.Cell>Session Alpha</Table.Cell>
          <Table.Cell>Active</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>002</Table.Cell>
          <Table.Cell>Session Beta</Table.Cell>
          <Table.Cell>Completed</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>003</Table.Cell>
          <Table.Cell>Session Gamma</Table.Cell>
          <Table.Cell>Pending</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  ),
  args: {
    striped: false,
    hoverable: false,
    bordered: false,
    size: 'sm',
  },
};

export const LargeSize: Story = {
  render: (args) => (
    <Table {...args}>
      <Table.Header>
        <Table.Row>
          <Table.Cell as="th">Equipment</Table.Cell>
          <Table.Cell as="th">Status</Table.Cell>
          <Table.Cell as="th">Last Maintenance</Table.Cell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row>
          <Table.Cell>Laser Boat #12</Table.Cell>
          <Table.Cell>Available</Table.Cell>
          <Table.Cell>2026-01-15</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>470 Boat #08</Table.Cell>
          <Table.Cell>In Use</Table.Cell>
          <Table.Cell>2026-01-20</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  ),
  args: {
    striped: false,
    hoverable: false,
    bordered: false,
    size: 'lg',
  },
};

export const StripedAndHoverable: Story = {
  render: (args) => (
    <Table {...args}>
      <Table.Header>
        <Table.Row>
          <Table.Cell as="th">Rank</Table.Cell>
          <Table.Cell as="th">Athlete</Table.Cell>
          <Table.Cell as="th">Country</Table.Cell>
          <Table.Cell as="th" align="center">
            Points
          </Table.Cell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row>
          <Table.Cell>1</Table.Cell>
          <Table.Cell>Sarah Thompson</Table.Cell>
          <Table.Cell>USA</Table.Cell>
          <Table.Cell align="center">98</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>2</Table.Cell>
          <Table.Cell>Marco Rossi</Table.Cell>
          <Table.Cell>ITA</Table.Cell>
          <Table.Cell align="center">95</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>3</Table.Cell>
          <Table.Cell>Yuki Tanaka</Table.Cell>
          <Table.Cell>JPN</Table.Cell>
          <Table.Cell align="center">92</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>4</Table.Cell>
          <Table.Cell>Lars Hansen</Table.Cell>
          <Table.Cell>NOR</Table.Cell>
          <Table.Cell align="center">89</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>5</Table.Cell>
          <Table.Cell>Ana Silva</Table.Cell>
          <Table.Cell>BRA</Table.Cell>
          <Table.Cell align="center">87</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  ),
  args: {
    striped: true,
    hoverable: true,
    bordered: false,
    size: 'md',
  },
};

export const ComplexTable: Story = {
  render: (args) => (
    <Table {...args}>
      <Table.Header>
        <Table.Row>
          <Table.Cell as="th">Competition</Table.Cell>
          <Table.Cell as="th">Date</Table.Cell>
          <Table.Cell as="th">Participants</Table.Cell>
          <Table.Cell as="th" align="center">
            Races
          </Table.Cell>
          <Table.Cell as="th" align="right">
            Status
          </Table.Cell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row>
          <Table.Cell>Winter Championship 2026</Table.Cell>
          <Table.Cell>2026-02-15 to 2026-02-18</Table.Cell>
          <Table.Cell>45 athletes</Table.Cell>
          <Table.Cell align="center">12</Table.Cell>
          <Table.Cell align="right">Upcoming</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Spring Regatta</Table.Cell>
          <Table.Cell>2026-04-10 to 2026-04-12</Table.Cell>
          <Table.Cell>32 athletes</Table.Cell>
          <Table.Cell align="center">8</Table.Cell>
          <Table.Cell align="right">Open</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Summer Cup</Table.Cell>
          <Table.Cell>2026-07-05 to 2026-07-08</Table.Cell>
          <Table.Cell>60 athletes</Table.Cell>
          <Table.Cell align="center">15</Table.Cell>
          <Table.Cell align="right">Planning</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  ),
  args: {
    striped: true,
    hoverable: true,
    bordered: true,
    size: 'md',
  },
};
