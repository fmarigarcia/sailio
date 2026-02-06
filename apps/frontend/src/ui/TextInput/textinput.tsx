import { forwardRef } from 'react';
import { Input, InputProps } from '../Input';

export type TextInputProps = Omit<InputProps, 'type'>;

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>((props, ref) => {
  return <Input {...props} type="text" ref={ref} />;
});

TextInput.displayName = 'TextInput';
