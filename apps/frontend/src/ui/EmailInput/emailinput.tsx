import { forwardRef } from 'react';
import { Input, InputProps } from '../Input';

export type EmailInputProps = Omit<InputProps, 'type'>;

export const EmailInput = forwardRef<HTMLInputElement, EmailInputProps>((props, ref) => {
  return <Input {...props} type="email" ref={ref} />;
});

EmailInput.displayName = 'EmailInput';
