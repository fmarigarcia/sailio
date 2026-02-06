import type { Meta, StoryObj } from '@storybook/react';
import { Modal } from './modal';
import { useState } from 'react';
import './modal-stories.css';

const meta: Meta<typeof Modal> = {
  title: 'UI/Modal',
  component: Modal,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: 'Controls whether the modal is visible',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the modal',
    },
    closeOnOverlayClick: {
      control: 'boolean',
      description: 'Close modal when clicking outside',
    },
    showCloseButton: {
      control: 'boolean',
      description: 'Show close button in header',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Modal>;

// Wrapper component to manage state
function ModalWrapper(args: React.ComponentProps<typeof Modal>) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Open Modal</button>
      <Modal {...args} isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}

export const Default: Story = {
  render: (args) => <ModalWrapper {...args} />,
  args: {
    title: 'Modal Title',
    children: (
      <div>
        <p>This is the modal content. You can put any content here.</p>
        <p>The modal will close when you press ESC or click outside.</p>
      </div>
    ),
  },
};

export const WithFooter: Story = {
  render: (args) => <ModalWrapper {...args} />,
  args: {
    title: 'Confirm Action',
    children: (
      <div>
        <p>Are you sure you want to proceed with this action?</p>
        <p>This action cannot be undone.</p>
      </div>
    ),
    footer: (
      <>
        <button className="btn-secondary">Cancel</button>
        <button className="btn-danger">Delete</button>
      </>
    ),
  },
};

export const SmallSize: Story = {
  render: (args) => <ModalWrapper {...args} />,
  args: {
    title: 'Small Modal',
    size: 'sm',
    children: (
      <div>
        <p>This is a small modal with limited width.</p>
      </div>
    ),
  },
};

export const MediumSize: Story = {
  render: (args) => <ModalWrapper {...args} />,
  args: {
    title: 'Medium Modal',
    size: 'md',
    children: (
      <div>
        <p>This is a medium modal (default size).</p>
        <p>It provides a good balance between space and focus.</p>
      </div>
    ),
  },
};

export const LargeSize: Story = {
  render: (args) => <ModalWrapper {...args} />,
  args: {
    title: 'Large Modal',
    size: 'lg',
    children: (
      <div>
        <p>This is a large modal with more width for complex content.</p>
        <p>Use this for forms or detailed information.</p>
      </div>
    ),
  },
};

export const WithForm: Story = {
  render: (args) => <ModalWrapper {...args} />,
  args: {
    title: 'Create New Item',
    children: (
      <form>
        <div className="form-field">
          <label>Name:</label>
          <input type="text" className="form-input" />
        </div>
        <div className="form-field">
          <label>Description:</label>
          <textarea rows={4} className="form-input" />
        </div>
      </form>
    ),
    footer: (
      <>
        <button className="btn-secondary">Cancel</button>
        <button className="btn-primary">Save</button>
      </>
    ),
  },
};

export const NoHeader: Story = {
  render: (args) => <ModalWrapper {...args} />,
  args: {
    showCloseButton: false,
    children: (
      <div>
        <h3>Custom Content</h3>
        <p>This modal has no standard header.</p>
      </div>
    ),
    footer: <button className="btn-secondary">Close</button>,
  },
};

export const PreventOverlayClose: Story = {
  render: (args) => <ModalWrapper {...args} />,
  args: {
    title: 'Important Notice',
    closeOnOverlayClick: false,
    children: (
      <div>
        <p>This modal cannot be closed by clicking outside.</p>
        <p>You must use the close button or press ESC.</p>
      </div>
    ),
  },
};

export const LongContent: Story = {
  render: (args) => <ModalWrapper {...args} />,
  args: {
    title: 'Terms and Conditions',
    children: (
      <div>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua.
        </p>
        <p>
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
          commodo consequat.
        </p>
        <p>
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
          nulla pariatur.
        </p>
        <p>
          Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit
          anim id est laborum.
        </p>
        <p>
          Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque
          laudantium, totam rem aperiam.
        </p>
        <p>
          Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia
          consequuntur magni dolores.
        </p>
        <p>
          Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci
          velit, sed quia non numquam.
        </p>
        <p>
          At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium
          voluptatum deleniti atque.
        </p>
      </div>
    ),
    footer: (
      <>
        <button className="btn-secondary">Decline</button>
        <button className="btn-success">Accept</button>
      </>
    ),
  },
};
