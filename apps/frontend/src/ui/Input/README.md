# Input Component

Base input component for all form inputs in Sailio. Provides a consistent and accessible foundation for text-based form fields.

## Features

- ✅ Integrated label with required indicator
- ✅ Error state with validation messages
- ✅ Helper text for additional context
- ✅ Disabled and read-only states
- ✅ Consistent sizing (sm, md, lg)
- ✅ Full accessibility support (ARIA attributes)
- ✅ Built with design tokens (no magic values)
- ✅ TypeScript support with full type safety
- ✅ Ref forwarding for advanced use cases

## Basic Usage

```tsx
import { Input } from '@/ui';

function MyForm() {
  return (
    <Input
      label="Email"
      type="email"
      placeholder="name@example.com"
      helperText="We'll never share your email"
    />
  );
}
```

## Props

| Prop         | Type                   | Default | Description                                     |
| ------------ | ---------------------- | ------- | ----------------------------------------------- |
| `label`      | `string`               | -       | Label text for the input                        |
| `error`      | `string`               | -       | Error message to display (overrides helperText) |
| `helperText` | `string`               | -       | Helper text below the input                     |
| `size`       | `'sm' \| 'md' \| 'lg'` | `'md'`  | Size variant of the input                       |
| `fullWidth`  | `boolean`              | `false` | Makes input take full width                     |
| `disabled`   | `boolean`              | `false` | Disables the input                              |
| `readOnly`   | `boolean`              | `false` | Makes input read-only                           |
| `required`   | `boolean`              | `false` | Marks input as required (shows \*)              |

All standard HTML input attributes are also supported (placeholder, type, value, onChange, etc.)

## Specialized Components

The Input component is designed to be reused for specific input types:

### TextInput

```tsx
import { TextInput } from '@/ui';

<TextInput label="Username" placeholder="Enter username" helperText="Choose a unique username" />;
```

### PasswordInput

```tsx
import { PasswordInput } from '@/ui';

<PasswordInput
  label="Password"
  placeholder="Enter password"
  helperText="Must be at least 8 characters"
/>;
```

### EmailInput

```tsx
import { EmailInput } from '@/ui';

<EmailInput label="Email" placeholder="name@example.com" required />;
```

## Examples

### With Error State

```tsx
<Input
  label="Email"
  type="email"
  value={email}
  error={emailError}
  onChange={(e) => setEmail(e.target.value)}
/>
```

### Required Field

```tsx
<Input label="Full Name" placeholder="John Doe" required helperText="This field is required" />
```

### Disabled State

```tsx
<Input label="Username" value="johndoe" disabled />
```

### Read-Only State

```tsx
<Input label="User ID" value="USER-12345" readOnly helperText="This field cannot be edited" />
```

### Different Sizes

```tsx
<Input size="sm" label="Small" placeholder="Small input" />
<Input size="md" label="Medium" placeholder="Medium input (default)" />
<Input size="lg" label="Large" placeholder="Large input" />
```

### Full Width

```tsx
<Input label="Bio" placeholder="Tell us about yourself" fullWidth />
```

## Accessibility

The Input component follows WCAG 2.1 guidelines:

- **Label Association**: Proper `htmlFor` and `id` linking
- **Error Announcement**: Error messages have `role="alert"`
- **Helper Text Association**: Linked via `aria-describedby`
- **Invalid State**: `aria-invalid` set when error exists
- **Required Indicator**: Visual (\*) and `required` attribute
- **Keyboard Navigation**: Full keyboard support
- **Focus Visible**: Clear focus indicators

## Design Tokens

The component uses design system tokens exclusively:

- **Colors**: `--color-*` variables
- **Spacing**: `--space-*` variables
- **Typography**: `--font-*` variables
- **Borders**: `--radius-*` variables
- **Shadows**: `--shadow-*` for focus states

## Form Integration

Works seamlessly with form libraries:

### React Hook Form

```tsx
import { useForm } from 'react-hook-form';
import { Input } from '@/ui';

function MyForm() {
  const {
    register,
    formState: { errors },
  } = useForm();

  return (
    <form>
      <Input
        label="Email"
        type="email"
        error={errors.email?.message}
        {...register('email', { required: 'Email is required' })}
      />
    </form>
  );
}
```

### Formik

```tsx
import { useFormik } from 'formik';
import { Input } from '@/ui';

function MyForm() {
  const formik = useFormik({
    initialValues: { email: '' },
    onSubmit: (values) => console.log(values),
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Input
        label="Email"
        type="email"
        name="email"
        value={formik.values.email}
        onChange={formik.handleChange}
        error={formik.errors.email}
      />
    </form>
  );
}
```

## Testing

The Input component is fully tested with 100% coverage:

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from '@/ui';

test('renders with label', () => {
  render(<Input label="Email" />);
  expect(screen.getByText('Email')).toBeInTheDocument();
});

test('shows error message', () => {
  render(<Input label="Email" error="Invalid email" />);
  expect(screen.getByText('Invalid email')).toBeInTheDocument();
});

test('handles user input', async () => {
  const user = userEvent.setup();
  const handleChange = jest.fn();

  render(<Input label="Name" onChange={handleChange} />);
  await user.type(screen.getByRole('textbox'), 'John');

  expect(handleChange).toHaveBeenCalled();
});
```

## Storybook

All Input variants are documented in Storybook. Run `npm run storybook` to view:

- Default states
- All sizes
- Error states
- Disabled/readonly states
- Different input types
- With/without labels
- Helper text variations

## Why This Approach?

Having a base Input component ensures:

1. **Consistency**: All inputs look and behave the same
2. **Maintainability**: One component to update, not dozens
3. **Accessibility**: Built-in ARIA support everywhere
4. **Type Safety**: TypeScript catches errors early
5. **Testability**: Test once, confidence everywhere
6. **Scalability**: Easy to add new input types

Without this base, each form would be different, leading to:

- ❌ Inconsistent UI/UX
- ❌ Duplicated accessibility code
- ❌ Hard-to-maintain forms
- ❌ Styling inconsistencies
- ❌ More bugs

## Next Steps

To create more specialized inputs:

```tsx
// NumberInput example
export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>((props, ref) => {
  return <Input {...props} type="number" ref={ref} />;
});

// SearchInput example
export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>((props, ref) => {
  return <Input {...props} type="search" ref={ref} />;
});
```

## Related Components

- **TextInput**: For basic text input
- **PasswordInput**: For password fields
- **EmailInput**: For email addresses
- **TextArea**: For multi-line text (to be implemented)
- **Select**: For dropdown selections (to be implemented)
- **Checkbox**: For boolean values (to be implemented)
- **Radio**: For single selection (to be implemented)
