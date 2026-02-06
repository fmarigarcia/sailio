import { forwardRef } from 'react';
import { Input, InputProps } from '../Input';

export type EmailInputProps = Omit<InputProps, 'type'>;

const EmailInput = forwardRef<HTMLInputElement, EmailInputProps>((props, ref) => {
  return <Input {...props} type="email" ref={ref} />;
});

EmailInput.displayName = 'EmailInput';

export { EmailInput };
