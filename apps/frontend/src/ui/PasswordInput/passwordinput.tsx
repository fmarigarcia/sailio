import { forwardRef } from 'react';
import { Input, InputProps } from '../Input';

export type PasswordInputProps = Omit<InputProps, 'type'>;

/**
 * PasswordInput is a specialized Input component for password input.
 * It extends the base Input component with type="password" pre-configured.
 */
export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>((props, ref) => {
  return <Input {...props} type="password" ref={ref} />;
});

PasswordInput.displayName = 'PasswordInput';
