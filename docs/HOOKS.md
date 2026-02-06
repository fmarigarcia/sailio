# Hooks - Best Practices

## Patrón de Retorno: `{ state, actions }`

**CRÍTICO**: Todos los hooks custom del proyecto DEBEN seguir este patrón de retorno.

### ¿Por qué este patrón?

1. **Claridad**: Separa claramente el estado de las acciones
2. **Escalabilidad**: Fácil añadir nuevos estados o acciones sin cambiar la estructura
3. **Documentación implícita**: El código es autodocumentado
4. **Testing**: Más fácil de testear al tener separación de responsabilidades

### Estructura

```typescript
export function useCustomHook() {
  // ... lógica del hook

  return {
    state: {
      // Todo el estado va aquí
      data,
      isLoading,
      error,
    },
    actions: {
      // Todas las funciones/acciones van aquí
      handleSubmit,
      handleChange,
      handleReset,
    },
  };
}
```

### ❌ Incorrecto

```typescript
export function useLogin() {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = () => {
    // ...
  };

  // ❌ Retorno plano
  return {
    formData,
    errors,
    isLoading,
    handleSubmit,
  };
}
```

### ✅ Correcto

```typescript
export function useLogin() {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = () => {
    // ...
  };

  // ✅ Retorno con patrón {state, actions}
  return {
    state: {
      formData,
      errors,
      isLoading,
    },
    actions: {
      handleSubmit,
    },
  };
}
```

### Uso en Componentes

```typescript
function LoginPage() {
  const { state, actions } = useLogin();

  return (
    <form onSubmit={actions.handleSubmit}>
      <Input
        value={state.formData.email}
        error={state.errors.email}
        disabled={state.isLoading}
      />
      <Button loading={state.isLoading}>Submit</Button>
    </form>
  );
}
```

### Excepciones

Este patrón NO se aplica a:

- Hooks de librerías externas (`useState`, `useEffect`, `useQuery`, etc.)
- Hooks que solo retornan un valor primitivo o simple:
  ```typescript
  // OK - retorno simple
  function useWindowWidth() {
    return windowWidth;
  }
  ```
- Hooks extremadamente simples con 1-2 valores:
  ```typescript
  // OK - hook simple
  function useToggle(initialValue = false) {
    const [value, setValue] = useState(initialValue);
    const toggle = () => setValue((v) => !v);
    return [value, toggle] as const;
  }
  ```

### Naming Conventions para State y Actions

#### State

- Usa nombres descriptivos sin verbos
- Incluye flags de estado: `isLoading`, `isError`, `hasData`
- Datos: `data`, `items`, `user`, `formData`
- Errores: `error`, `errors`, `validationError`

#### Actions

- Usa verbos en imperativo con prefijo `handle` para eventos
- `handleSubmit`, `handleChange`, `handleClick`
- O verbos directos para acciones no relacionadas con eventos:
  - `fetchData`, `resetForm`, `validateInput`

### Documentación JSDoc

Documenta siempre el retorno del hook:

```typescript
/**
 * Hook para manejar el formulario de login.
 *
 * @returns {Object} Hook state and actions
 * @returns {Object} state - Estado del formulario
 * @returns {Object} state.formData - Datos del formulario
 * @returns {Object} state.errors - Errores de validación
 * @returns {boolean} state.isLoading - Indica si está procesando
 * @returns {Object} actions - Acciones disponibles
 * @returns {Function} actions.handleSubmit - Maneja el envío del formulario
 * @returns {Function} actions.handleInputChange - Maneja cambios en inputs
 */
export function useLogin() {
  // ...
}
```

## Ubicación de Hooks

### Hooks de Página

Van dentro de la carpeta de la página:

```
modules/
  auth/
    pages/
      login/
        useLogin.ts    ← Hook específico de la página
        login.tsx
```

### Hooks del Módulo

Van en la carpeta `hooks/` del módulo:

```
modules/
  auth/
    hooks/
      useAuth.ts       ← Hook compartido en el módulo
      useProfile.ts
      index.ts
```

### Hooks Compartidos

Van en `shared/hooks/`:

```
shared/
  hooks/
    useDebounce.ts
    useLocalStorage.ts
    useMediaQuery.ts
```

## Testing Hooks

Los tests deben verificar tanto el estado como las acciones por separado:

```typescript
describe('useLogin', () => {
  it('should initialize with correct state', () => {
    const { result } = renderHook(() => useLogin());

    expect(result.current.state.formData.email).toBe('');
    expect(result.current.state.isLoading).toBe(false);
  });

  it('should handle form submission', async () => {
    const { result } = renderHook(() => useLogin());

    await act(async () => {
      await result.current.actions.handleSubmit({ preventDefault: jest.fn() });
    });

    // assertions
  });
});
```

## Resumen

**TODAS las páginas y módulos que usen hooks custom deben seguir este patrón.**

Este documento es la referencia canónica para el desarrollo de hooks en el proyecto Sailio.
