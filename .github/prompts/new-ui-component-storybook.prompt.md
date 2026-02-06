# Prompt: Crear Componente UI con Storybook

## Objetivo
Crear un nuevo componente para el design system interno (carpeta `ui/`) con su respectiva documentación en Storybook.

## Instrucciones para GitHub Copilot

Por favor, crea un nuevo componente UI llamado `{NOMBRE_COMPONENTE}` con la siguiente estructura:

```
apps/frontend/src/ui/{Component}/
  __tests__/
    {component}.test.tsx
  {component}.tsx
  {component}.stories.tsx
  {component}.css
  index.ts
```

### Requisitos:

1. **{component}.tsx**:
   - Componente React funcional con TypeScript
   - Props bien definidas con interface/type
   - NO lógica de negocio
   - Props mínimas necesarias
   - Variantes con tipos específicos (no strings libres)
   - Componente cerrado y consistente

   Ejemplo:
   ```typescript
   interface ButtonProps {
     variant?: 'primary' | 'secondary' | 'danger';
     size?: 'sm' | 'md' | 'lg';
     children: ReactNode;
     onClick?: () => void;
     disabled?: boolean;
     type?: 'button' | 'submit' | 'reset';
   }

   export function Button({ 
     variant = 'primary', 
     size = 'md',
     type = 'button',
     disabled = false,
     children,
     onClick 
   }: ButtonProps) {
     return (
       <button
         type={type}
         className={`btn btn-${variant} btn-${size}`}
         onClick={onClick}
         disabled={disabled}
       >
         {children}
       </button>
     );
   }
   ```

2. **{component}.css**:
   - Usar SOLO tokens CSS (variables)
   - NO valores hardcoded
   - Naming consistente con BEM o similar
   - Responsive cuando aplique

   Ejemplo:
   ```css
   .btn {
     display: inline-flex;
     align-items: center;
     justify-content: center;
     font-family: var(--font-family-base);
     font-weight: 500;
     border: none;
     border-radius: var(--border-radius-md);
     cursor: pointer;
     transition: all 0.2s ease;
   }

   .btn-primary {
     background-color: var(--color-primary);
     color: var(--color-white);
   }

   .btn-primary:hover {
     background-color: var(--color-primary-dark);
   }

   .btn-sm {
     padding: var(--space-xs) var(--space-sm);
     font-size: var(--font-size-sm);
   }

   .btn-md {
     padding: var(--space-sm) var(--space-md);
     font-size: var(--font-size-base);
   }

   .btn:disabled {
     opacity: 0.5;
     cursor: not-allowed;
   }
   ```

3. **{component}.stories.tsx**:
   - Storybook 7+ con TypeScript
   - Documentar todas las variantes
   - Incluir casos de uso comunes
   - Tags `['autodocs']` para generación automática

   Ejemplo:
   ```typescript
   import type { Meta, StoryObj } from '@storybook/react';
   import { Button } from './button';

   const meta: Meta<typeof Button> = {
     title: 'UI/Button',
     component: Button,
     tags: ['autodocs'],
     argTypes: {
       variant: {
         control: 'select',
         options: ['primary', 'secondary', 'danger'],
       },
       size: {
         control: 'select',
         options: ['sm', 'md', 'lg'],
       },
       disabled: {
         control: 'boolean',
       },
     },
   };

   export default meta;
   type Story = StoryObj<typeof Button>;

   export const Primary: Story = {
     args: {
       variant: 'primary',
       children: 'Primary Button',
     },
   };

   export const Secondary: Story = {
     args: {
       variant: 'secondary',
       children: 'Secondary Button',
     },
   };

   export const Danger: Story = {
     args: {
       variant: 'danger',
       children: 'Delete',
     },
   };

   export const Small: Story = {
     args: {
       size: 'sm',
       children: 'Small Button',
     },
   };

   export const Large: Story = {
     args: {
       size: 'lg',
       children: 'Large Button',
     },
   };

   export const Disabled: Story = {
     args: {
       disabled: true,
       children: 'Disabled Button',
     },
   };
   ```

4. **__tests__/{component}.test.tsx**:
   - Tests con React Testing Library
   - Probar rendering de variantes
   - Probar interacciones
   - Probar estados (disabled, loading, etc.)
   - Cobertura ≥ 80%

   Ejemplo:
   ```typescript
   import { render, screen, fireEvent } from '@testing-library/react';
   import { describe, it, expect, vi } from 'vitest';
   import { Button } from '../button';

   describe('Button', () => {
     it('renders with text', () => {
       render(<Button>Click me</Button>);
       expect(screen.getByRole('button')).toHaveTextContent('Click me');
     });

     it('applies primary variant class', () => {
       render(<Button variant="primary">Primary</Button>);
       expect(screen.getByRole('button')).toHaveClass('btn-primary');
     });

     it('applies secondary variant class', () => {
       render(<Button variant="secondary">Secondary</Button>);
       expect(screen.getByRole('button')).toHaveClass('btn-secondary');
     });

     it('applies small size class', () => {
       render(<Button size="sm">Small</Button>);
       expect(screen.getByRole('button')).toHaveClass('btn-sm');
     });

     it('calls onClick when clicked', () => {
       const handleClick = vi.fn();
       render(<Button onClick={handleClick}>Click</Button>);
       
       fireEvent.click(screen.getByRole('button'));
       
       expect(handleClick).toHaveBeenCalledTimes(1);
     });

     it('does not call onClick when disabled', () => {
       const handleClick = vi.fn();
       render(<Button onClick={handleClick} disabled>Click</Button>);
       
       fireEvent.click(screen.getByRole('button'));
       
       expect(handleClick).not.toHaveBeenCalled();
     });

     it('is disabled when disabled prop is true', () => {
       render(<Button disabled>Disabled</Button>);
       expect(screen.getByRole('button')).toBeDisabled();
     });
   });
   ```

5. **index.ts**:
   ```typescript
   export { Button } from './button';
   export type { ButtonProps } from './button';
   ```

### Características del Componente:

{DESCRIBIR CARACTERÍSTICAS ESPECÍFICAS}

Ejemplo:
- Variantes: primary, secondary, danger
- Tamaños: small, medium, large
- Estados: default, hover, active, disabled
- Icon support (opcional)
- Loading state (opcional)

### Tokens CSS a Usar:

Asegúrate de usar tokens existentes:
- Colores: `var(--color-*)`
- Spacing: `var(--space-*)`
- Fonts: `var(--font-size-*)`, `var(--font-family-*)`
- Border radius: `var(--border-radius-*)`
- Shadows: `var(--shadow-*)`

Si necesitas nuevos tokens, créalos en los archivos correspondientes:
- `ui/colors.css`
- `ui/spacing.css`
- `ui/typography.css`

### Reglas Importantes:

- ✅ NO lógica de negocio en el componente
- ✅ Props mínimas y cerradas (no infinitas opciones)
- ✅ Sin estilos inline (`style={{}}`)
- ✅ Usar SOLO tokens CSS
- ✅ Componente genérico y reutilizable
- ✅ Accesibilidad (roles, aria-labels cuando aplique)
- ✅ Sin console.log
- ✅ Sin tipo `any`
- ✅ Tests con cobertura ≥ 80%
- ✅ Storybook funcionando correctamente

### Accesibilidad:

Considerar:
- Roles ARIA apropiados
- Labels descriptivos
- Keyboard navigation
- Focus states
- Screen reader support

### Responsive:

Si aplica, el componente debe ser responsive:
- Mobile first
- Breakpoints consistentes
- Testing en diferentes tamaños

## Checklist de Validación:

- [ ] Estructura de archivos correcta en `ui/`
- [ ] Componente funcional con props tipadas
- [ ] CSS usa SOLO tokens (no valores hardcoded)
- [ ] Sin estilos inline
- [ ] Storybook con todas las variantes
- [ ] Storybook tag `['autodocs']`
- [ ] Tests con cobertura ≥ 80%
- [ ] Todas las variantes testeadas
- [ ] Interacciones testeadas
- [ ] Estados (disabled, loading) testeados
- [ ] Sin linting errors
- [ ] Storybook corre sin errores (`pnpm storybook`)
- [ ] Commits one-liner
- [ ] Accesibilidad básica implementada

## Testing de Storybook:

Verificar que funciona:
```bash
pnpm storybook
```

Navegar a `UI/{Component}` y verificar:
- Todas las stories se renderizan
- Controles funcionan
- Documentación generada correctamente

## Componentes de Referencia:

Consulta componentes existentes en `ui/` para mantener consistencia en:
- Naming de props
- Estructura de variantes
- Patrones de CSS
- Naming de clases CSS

## Integración en Módulos:

Una vez creado, el componente puede ser usado en módulos:

```typescript
// En cualquier módulo
import { {Component} } from '@/ui/{Component}';

function MyPage() {
  return <{Component} variant="primary">Action</{Component}>;
}
```
