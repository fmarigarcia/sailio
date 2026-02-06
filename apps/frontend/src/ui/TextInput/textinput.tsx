import { forwardRef } from 'react';
import { Input, InputProps } from '../Input';

export type TextInputProps = Omit<InputProps, 'type'>;

/**
 * TextInput is a specialized Input component for text input.
 * It extends the base Input component with type="text" pre-configured.
 */
export const TextInput = forwardRef<HTMLInputElement, TextInputProps>((props, ref) => {
  return <Input {...props} type="text" ref={ref} />;
});

TextInput.displayName = 'TextInput';
