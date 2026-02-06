import { forwardRef } from 'react';
import { Input, InputProps } from '../Input';

export type EmailInputProps = Omit<InputProps, 'type'>;

/**
 * EmailInput is a specialized Input component for email input.
 * It extends the base Input component with type="email" pre-configured.
 */
export const EmailInput = forwardRef<HTMLInputElement, EmailInputProps>((props, ref) => {
  return <Input {...props} type="email" ref={ref} />;
});

EmailInput.displayName = 'EmailInput';
