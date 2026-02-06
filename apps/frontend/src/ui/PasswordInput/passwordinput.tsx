import { forwardRef } from 'react';
import { Input, InputProps } from '../Input';

export type PasswordInputProps = Omit<InputProps, 'type'>;

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>((props, ref) => {
  return <Input {...props} type="password" ref={ref} />;
});

PasswordInput.displayName = 'PasswordInput';

export { PasswordInput };
