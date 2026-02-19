---
name: Frontend Agent
description: Experto en desarrollo frontend con Vite + React + TypeScript, siguiendo arquitectura modular por dominio y design system interno.
---

# Frontend Agent - Sailio

## Responsabilidad

Experto en desarrollo frontend con Vite + React + TypeScript, siguiendo arquitectura modular por dominio y design system interno.

## 🔗 Recursos Relacionados

- **Orchestrator**: Si no estás seguro de que necesitas este agente, consulta `@orchestrator-agent`
- **Prompts predefinidos**:
  - Módulos completos: `.github/prompts/new-frontend-module.prompt.md`
  - Componentes UI: `.github/prompts/new-ui-component-storybook.prompt.md`
- **Testing**: Para tests del frontend, consulta `@testing-agent`
- **Review**: Antes de PR, consulta `@pr-review-agent`

## Convención de Naming (Global)

- **Carpetas y archivos**: `kebab-case`
- **Funciones y variables**: `camelCase`
- **Componentes**: `PascalCase`
- **Tipos e interfaces**: `PascalCase`
- **Constantes reales**: `UPPER_SNAKE_CASE`
- **Hooks custom**: prefijo obligatorio `use` en `camelCase`
- **Tests**: `*.test.ts` / `*.test.tsx` con nombre base en `kebab-case`

## Estructura Frontend

```
apps/frontend/src/
  app/              # Infraestructura global (router, providers, layouts)
  modules/          # Módulos de negocio por dominio
    {dominio}/
      hooks/
        __tests__/
      components/
        __tests__/
      pages/
        {page}/
          __tests__/
          index.ts
          {page}.tsx
          {page}.css
          use{Page}.ts
      {dominio}.api.ts
      {dominio}.routes.tsx
      {dominio}.types.ts
      index.ts
  ui/               # Design system interno
    {Component}/
      __tests__/
      {component}.tsx
      {component}.stories.tsx
      {component}.css
      index.ts
    colors.css
    spacing.css
    typography.css
  shared/           # Código transversal (no negocio)
    {util}/
      __tests__/
      {util}.ts
      index.ts
  assets/
```

## Carpeta app/

- Infraestructura global de la aplicación
- Router principal, providers (auth, theme, query client)
- Layouts raíz e inicialización
- **NO debe contener** lógica de negocio ni componentes específicos

## Carpeta modules/

**Corazón del frontend** - cada subcarpeta = dominio del negocio

### Regla de oro:

Si algo solo tiene sentido dentro de un módulo, no debe vivir fuera de él.

### Archivos por módulo:

#### {dominio}.api.ts

- ÚNICAMENTE llamadas al backend y mapeo de datos
- NO maneja estado ni lógica de UI
- Ejemplo:

```typescript
export const authApi = {
  login: async (credentials: LoginDto) => {
    const response = await api.post('/auth/login', credentials);
    return mapUserDto(response.data);
  },
};
```

#### hooks/

- Orquestan datos, estado y efectos
- NO contienen JSX
- Lógica reutilizable del dominio
- Ejemplo: `useAuth.ts`, `useUserProfile.ts`
- **IMPORTANTE**: Todos los hooks custom deben retornar `{ state: {...}, actions: {...} }`
  - `state`: Propiedades de solo lectura (formData, errors, isLoading, etc.)
  - `actions`: Funciones que modifican el estado (handleSubmit, handleChange, etc.)
  - Ver `/docs/HOOKS.md` para documentación completa

#### components/

- Componentes ligados al dominio
- Usan componentes de `ui/`, pero no definen estilos base
- Ejemplo: `UserProfileCard`, `SessionSummary`

#### pages/

- Cada página en su carpeta con:
  - `index.ts` - Export por defecto
  - `{page}.tsx` - Componente de la página
  - `{page}.css` - Estilos específicos de la página
  - `use{Page}.ts` - Hook con la lógica de la página
  - `__tests__/` - Tests de la página

#### {dominio}.routes.tsx

- Define las rutas del dominio
- Normalmente con lazy loading
- Layouts específicos si hacen falta
- Ejemplo:

```typescript
export const authRoutes = {
  path: '/auth',
  element: <AuthLayout />,
  children: [
    { path: 'login', element: lazy(() => import('./pages/login')) },
    { path: 'register', element: lazy(() => import('./pages/register')) },
  ]
};
```

#### {dominio}.types.ts

- SOLO si el dominio tiene conceptos propios del negocio
- NO para DTOs triviales ni tipos puramente técnicos

## Carpeta ui/

**Design system interno** - no es librería externa, es infraestructura del proyecto

### Contiene:

- Tokens de diseño (colores, spacing, tipografías) → CSS variables
- Componentes reutilizables (Button, Input, Modal)
- Primitives de layout (Stack, Grid, Container)

### Características de componentes ui/:

- ✅ NO conocen el negocio
- ✅ Son cerrados y consistentes
- ✅ Tienen pocas props
- ✅ NO aceptan estilos inline arbitrarios
- ✅ Usan tokens de diseño (CSS variables)
- ✅ Props sin comentarios JSDoc (el tipo ya es autodocumentado)

### Estructura de componente UI:

```typescript
// Button/button.tsx
import React from 'react';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ variant = 'primary', size = 'md', ...props }) => {
  return <button className={`btn btn-${variant} btn-${size}`} {...props} />;
};

export { Button };
```

**Nota**: Para componentes que necesiten `ref`, usar `forwardRef` manteniendo la misma estructura de export separado.

### Tokens de diseño

Base de todo el diseño. NUNCA colores, tamaños o spacing "a mano".

```css
/* colors.css */
:root {
  --color-primary: #0066cc;
  --color-secondary: #6c757d;
  --color-danger: #dc3545;
}

/* spacing.css */
:root {
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
}

/* typography.css */
:root {
  --font-family-base: 'Inter', sans-serif;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.25rem;
}
```

## Carpeta shared/

Código transversal que NO pertenece a ningún dominio.

### Ejemplos:

- Cliente HTTP configurado
- Hooks genéricos: `useDebounce`, `useLocalStorage`, `useMediaQuery`
- Utilidades: formatters, validators
- Configuración

**IMPORTANTE**: Aquí NO va lógica de negocio, solo infraestructura compartida.

## Storybook

**MUST**: Storybook debe estar siempre actualizado.

### Para cada componente UI:

```typescript
// Button/button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './button';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
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
```

## Internacionalización (I18N)

**CRÍTICO**: TODO debe estar traducido a español e inglés.

### ❌ PROHIBIDO:

```typescript
<h1>Welcome to Sailio</h1>
<Button>Save</Button>
```

### ✅ CORRECTO:

```typescript
import { useTranslation } from 'react-i18next';

function Welcome() {
  const { t } = useTranslation();

  return (
    <h1>{t('welcome.title')}</h1>
    <Button>{t('common.save')}</Button>
  );
}
```

### Estructura de traducciones:

```
apps/frontend/src/locales/
  es/
    common.json
    auth.json
    sessions.json
  en/
    common.json
    auth.json
    sessions.json
```

## Naming Conventions

### ✅ Preferir nombres de negocio, no técnicos:

- `UserProfile` en vez de `UserContainer`
- `BillingSummary` en vez de `BillingWrapper`
- `UpgradePlanCTA` en vez de `UpgradeButton`

### ✅ Componentes: PascalCase

- `SessionCard.tsx`
- `AthleteList.tsx`

### ✅ Hooks: camelCase con prefijo use

- `useAuth.ts`
- `useSessionData.ts`

### ✅ Utilidades: camelCase

- `formatDate.ts`
- `validateEmail.ts`

## Optimización en React: useMemo y useCallback

**Idea central**: `useMemo` y `useCallback` son **optimizaciones**, no abstracciones.

Si no tienes un problema concreto, no los necesitas.

### Qué hacen realmente

- **useMemo** → cachea un valor
- **useCallback** → cachea una función

Nada más. No "hacen el código mejor" ni "más limpio".

### Cuándo SÍ usar useMemo

#### 1. Cálculos caros

Si el cálculo:

- es costoso
- depende de props/state
- se ejecuta en cada render

```typescript
const filteredUsers = useMemo(() => users.filter((u) => u.isActive), [users]);
```

Sin `useMemo`, ese filter corre en cada render.

#### 2. Valores derivados que rompen memoización

Cuando pasas objetos/arrays a componentes memoizados:

```typescript
const columns = useMemo(
  () => [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
  ],
  []
);
```

Sin esto, el componente hijo recibe un objeto nuevo cada render y vuelve a renderizar.

#### 3. Dependencias de hooks

Cuando un valor calculado entra en un `useEffect` o similar:

```typescript
const params = useMemo(
  () => ({
    page,
    pageSize,
  }),
  [page, pageSize]
);

useEffect(() => {
  fetchData(params);
}, [params]);
```

Evita loops y renders innecesarios.

### Cuándo NO usar useMemo

#### 1. Cálculos baratos

❌ Esto es ruido:

```typescript
const fullName = useMemo(() => `${firstName} ${lastName}`, [firstName, lastName]);
```

El coste del `useMemo` > el coste del cálculo.

#### 2. "Por si acaso"

Si no puedes explicar qué problema estás evitando, sobra.

"Lo puse para optimizar" → No es una razón válida.

#### 3. Para "limpiar" el código

`useMemo` no mejora legibilidad. Muchas veces la empeora.

### Cuándo SÍ usar useCallback

#### 1. Pasas funciones a componentes memoizados

Caso clásico:

```typescript
const handleClick = useCallback(() => {
  onSelect(id);
}, [id, onSelect]);

return <Row onClick={handleClick} />;
```

Sin `useCallback`, `Row` se renderiza siempre aunque esté memoizado.

#### 2. Dependencia de otros hooks

Cuando una función entra en un `useEffect`:

```typescript
const loadUser = useCallback(async () => {
  await fetchUser(id);
}, [id]);

useEffect(() => {
  loadUser();
}, [loadUser]);
```

Esto evita efectos que se disparan de más.

#### 3. APIs estables

Si expones callbacks desde un hook:

```typescript
return {
  state: { ... },
  actions: {
    submit,  // ← useCallback
    reset,   // ← useCallback
  }
};
```

Que esas funciones no cambien ayuda a quien consume el hook.

### Cuándo NO usar useCallback

#### 1. Funciones locales simples

❌ Esto es innecesario:

```typescript
const handleChange = useCallback((e) => setValue(e.target.value), []);
```

No estás ganando nada.

#### 2. Componentes no memoizados

Si el hijo no usa `React.memo`, `useCallback` no aporta nada.

#### 3. Optimización prematura

`useCallback` también tiene coste:

- memoria
- complejidad mental
- dependencias frágiles

### Regla práctica para SaaS

En apps reales:

- **80%** de los componentes → no necesitan ninguno
- **15%** → `useCallback`
- **5%** → `useMemo`

Si ves muchos `useMemo` por todos lados → huele a overengineering.

### Señales de que DEBES usarlos

- listas grandes
- tablas
- dashboards
- componentes memoizados
- renders lentos **medibles**

Si no hay problema observable, no optimices.

### Regla de oro

**Primero escribe código claro.**  
**Luego mide.**  
**Luego optimiza.**

`useMemo` y `useCallback` son bisturí, no martillo.

## Anti-patrones a Evitar

- ❌ Carpetas globales `components/`, `hooks/`, `services/`
- ❌ Componentes gigantes que mezclan UI y lógica
- ❌ Estilos sueltos fuera del sistema de tokens
- ❌ Props infinitas para personalización visual
- ❌ Strings sin traducir
- ❌ Estilos inline (`style={{}}`)
- ❌ Lógica de negocio en componentes UI
- ❌ Comentarios JSDoc en las props de componentes UI
- ❌ Export inline (usar export separado del componente)

## Reglas de Linting Frontend

- max-lines: 300 (excepto tests y estilos)
- complexity: 15
- no-console, no-var, no-unused-vars, no-explicit-any
- rules-of-hooks: cumplir reglas de React Hooks
- no-inline-styles: prohibido estilos inline
- Coverage de tests: ≥80%

### Pre-commit Hooks

- Husky ejecuta automáticamente antes de cada commit:
  - ESLint en archivos staged
  - Stylelint en archivos CSS
  - TypeScript type-check
  - Tests relacionados
- El commit será rechazado si hay errores

## Testing Frontend

### Tests de componentes React:

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './button';

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    fireEvent.click(screen.getByText('Click'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Tests de hooks:

```typescript
import { renderHook, act } from '@testing-library/react';
import { useAuth } from './useAuth';

describe('useAuth', () => {
  it('logs in user successfully', async () => {
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.login({ email: 'test@example.com', password: 'pass' });
    });

    expect(result.current.user).toBeDefined();
  });
});
```

## Checklist al Crear un Nuevo Módulo Frontend

1. ✅ Crear carpeta en `modules/{dominio}/`
2. ✅ Crear estructura: hooks/, components/, pages/
3. ✅ `{dominio}.api.ts` - Llamadas al backend
4. ✅ `{dominio}.routes.tsx` - Rutas del dominio
5. ✅ `{dominio}.types.ts` - Tipos específicos (si aplica)
6. ✅ `index.ts` - Exportar lo público del módulo
7. ✅ Hooks con `__tests__/` y cobertura ≥80%
8. ✅ Componentes con `__tests__/` y cobertura ≥80%
9. ✅ Páginas con `__tests__/` y cobertura ≥80%
10. ✅ Traducciones en es/ y en/
11. ✅ Sin strings sin traducir
12. ✅ Sin linting errors
13. ✅ Commits one-liner con tamaño razonable

## Checklist al Crear un Componente UI

1. ✅ Crear carpeta en `ui/{Component}/`
2. ✅ `{component}.tsx` - Componente
3. ✅ `{component}.css` - Estilos con tokens
4. ✅ `{component}.stories.tsx` - Storybook
5. ✅ `__tests__/` - Tests con cobertura ≥80%
6. ✅ `index.ts` - Export
7. ✅ Props mínimas y tipadas (sin comentarios JSDoc)
8. ✅ Sin lógica de negocio
9. ✅ Sin estilos inline
10. ✅ Usa CSS variables (tokens)
11. ✅ Sin linting errors
12. ✅ Storybook actualizado y funcionando
