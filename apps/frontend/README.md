# Frontend - Sailio

Aplicación web frontend del proyecto Sailio, desarrollada con Vite + React + TypeScript.

## 🚀 Stack Tecnológico

- **Vite** - Build tool y dev server
- **React 18** - Framework UI
- **TypeScript** - Lenguaje de programación
- **React Router** - Enrutamiento
- **React i18next** - Internacionalización (ES/EN)
- **Axios** - Cliente HTTP
- **Vitest** - Framework de testing
- **Testing Library** - Testing de componentes React
- **Storybook** - Desarrollo aislado de componentes UI

## 📁 Estructura del Proyecto

```
src/
├── app/              # Infraestructura global (router, providers, layouts)
├── modules/          # Módulos de negocio por dominio
│   └── {dominio}/
│       ├── hooks/
│       ├── components/
│       ├── pages/
│       ├── {dominio}.api.ts
│       ├── {dominio}.routes.tsx
│       ├── {dominio}.types.ts
│       └── index.ts
├── ui/               # Design system interno (componentes reutilizables)
│   ├── colors.css
│   ├── spacing.css
│   ├── typography.css
│   └── {Component}/
│       ├── {component}.tsx
│       ├── {component}.css
│       ├── {component}.stories.tsx
│       ├── __tests__/
│       └── index.ts
├── shared/           # Código transversal (no negocio)
│   ├── i18n/
│   └── {util}/
├── locales/          # Traducciones i18n
│   ├── es/
│   └── en/
├── assets/           # Recursos estáticos
└── test/             # Configuración de tests
```

## 🛠️ Scripts Disponibles

### Desarrollo

```bash
pnpm dev              # Iniciar servidor de desarrollo (puerto 3000)
pnpm preview          # Vista previa de producción
```

### Build

```bash
pnpm build            # Compilar para producción
pnpm type-check       # Verificar tipos TypeScript
```

### Testing

```bash
pnpm test             # Ejecutar tests
pnpm test:watch       # Tests en modo watch
pnpm test:coverage    # Tests con reporte de cobertura (≥80%)
```

### Linting y Formateo

```bash
pnpm lint             # Verificar código con ESLint
pnpm lint:fix         # Corregir automáticamente errores
```

### Storybook

```bash
pnpm storybook        # Iniciar Storybook (puerto 6006)
pnpm build-storybook  # Compilar Storybook para producción
```

### Limpieza

```bash
pnpm clean            # Limpiar archivos generados
```

## 🎨 Arquitectura Frontend

### Carpeta `app/`

Infraestructura global de la aplicación:

- Router principal
- Providers (auth, theme, query client)
- Layouts raíz
- Inicialización de la app

**NO contiene** lógica de negocio ni componentes específicos.

### Carpeta `modules/`

**Corazón del frontend** - cada subcarpeta representa un dominio del negocio.

Estructura de un módulo:

```
modules/{dominio}/
  ├── hooks/              # Custom hooks (lógica reutilizable)
  ├── components/         # Componentes del dominio
  ├── pages/              # Páginas del dominio
  │   └── {page}/
  │       ├── {page}.tsx
  │       ├── use{Page}.ts
  │       ├── {page}.css
  │       └── __tests__/
  ├── {dominio}.api.ts    # Llamadas al backend
  ├── {dominio}.routes.tsx # Rutas del módulo
  ├── {dominio}.types.ts  # Tipos del dominio
  └── index.ts            # Exports públicos
```

### Carpeta `ui/`

**Design System Interno** - componentes reutilizables y tokens de diseño.

Características:

- ✅ NO conocen el negocio
- ✅ Usan tokens CSS (variables)
- ✅ Tienen pocas props
- ✅ NO aceptan estilos inline
- ✅ Todos tienen Storybook

Tokens de diseño:

- `colors.css` - Paleta de colores
- `spacing.css` - Espaciado, border radius, sombras
- `typography.css` - Tipografía

### Carpeta `shared/`

Código transversal que NO pertenece a ningún dominio:

- Cliente HTTP configurado
- Hooks genéricos (useDebounce, useLocalStorage, etc.)
- Utilidades (formatters, validators)
- Configuración i18n

**IMPORTANTE**: NO contiene lógica de negocio.

## 🌍 Internacionalización (I18N)

**CRÍTICO**: TODO debe estar traducido a español e inglés.

### ❌ PROHIBIDO:

```tsx
<h1>Welcome to Sailio</h1>
<Button>Save</Button>
```

### ✅ CORRECTO:

```tsx
import { useTranslation } from 'react-i18next';

function Welcome() {
  const { t } = useTranslation();

  return (
    <>
      <h1>{t('app.title')}</h1>
      <Button>{t('common.save')}</Button>
    </>
  );
}
```

Estructura de traducciones:

```
locales/
  es/
    common.json
    {modulo}.json
  en/
    common.json
    {modulo}.json
```

## 📐 Design Tokens (CSS Variables)

SIEMPRE usa tokens CSS, NUNCA valores hardcoded:

### ❌ PROHIBIDO:

```css
.button {
  background: #0066cc;
  padding: 16px;
  border-radius: 8px;
}
```

### ✅ CORRECTO:

```css
.button {
  background-color: var(--color-primary);
  padding: var(--space-4);
  border-radius: var(--radius-lg);
}
```

## 🧪 Testing

### Cobertura Mínima: 80%

Cada componente/hook debe tener su carpeta `__tests__/`.

### Tests de Componentes:

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './button';

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    fireEvent.click(screen.getByText('Click'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Tests de Hooks:

```tsx
import { renderHook, act } from '@testing-library/react';
import { useAuth } from './useAuth';

describe('useAuth', () => {
  it('logs in user successfully', async () => {
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.login({
        email: 'test@example.com',
        password: 'pass',
      });
    });

    expect(result.current.user).toBeDefined();
  });
});
```

## 📋 Reglas de Código

### ESLint - Reglas Críticas:

- ❌ `no-console` - Sin console.log
- ❌ `max-lines` - Máximo 300 líneas (excepto tests, estilos, stories)
- ❌ `complexity` - Complejidad ciclomática ≤ 15
- ❌ `no-var` - Usar let/const
- ❌ `@typescript-eslint/no-explicit-any` - Prohibido `any`
- ❌ `react-hooks/rules-of-hooks` - Cumplir reglas de Hooks
- ❌ `react/forbid-dom-props` - Sin estilos inline

### Naming Conventions:

- Componentes: `PascalCase` (UserProfile.tsx)
- Hooks: `camelCase` con prefijo `use` (useAuth.ts)
- Utilidades: `camelCase` (formatDate.ts)
- CSS classes: `kebab-case` (.user-profile)

## 🎯 Anti-patrones a Evitar

- ❌ Carpetas globales `components/`, `hooks/`, `services/`
- ❌ Componentes gigantes que mezclan UI y lógica
- ❌ Estilos sueltos fuera del sistema de tokens
- ❌ Props infinitas para personalización visual
- ❌ Strings sin traducir
- ❌ Estilos inline (`style={{}}`)
- ❌ Lógica de negocio en componentes UI
- ❌ Uso de `any` en TypeScript

## 🔗 Recursos

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [React Router](https://reactrouter.com/)
- [Vitest](https://vitest.dev/)
- [Testing Library](https://testing-library.com/react)
- [Storybook](https://storybook.js.org/)
- [React i18next](https://react.i18next.com/)

## 📝 Prompts Predefinidos

En `.github/prompts/` encontrarás plantillas para:

- `new-frontend-module.prompt.md` - Crear módulos completos
- `new-ui-component-storybook.prompt.md` - Crear componentes UI

## 🤖 Agentes Especializados

- `@frontend-agent` - Desarrollo frontend
- `@testing-agent` - Estrategias de testing
- `@pr-review-agent` - Revisión de PRs

---

**Desarrollado con ❤️ para la comunidad de vela**
