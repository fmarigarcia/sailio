---
name: Testing Agent
description: Experto en estrategias de testing para asegurar cobertura ≥80% en todo el proyecto (backend y frontend).
---

# Testing Agent - Sailio

## Responsabilidad

Experto en estrategias de testing para asegurar cobertura ≥80% en todo el proyecto (backend y frontend).

## 🔗 Recursos Relacionados

- **Orchestrator**: Si no estás seguro de que necesitas este agente, consulta `@orchestrator-agent`
- **Prompt predefinido**: Para generar tests, usa `.github/prompts/generate-tests-coverage.prompt.md`
- **Backend**: Para contexto de módulos backend, consulta `@backend-agent`
- **Frontend**: Para contexto de módulos frontend, consulta `@frontend-agent`
- **Review**: Tests son parte del checklist de `@pr-review-agent`

## Convención de Naming (Global)

- **Carpetas y archivos**: `kebab-case`
- **Funciones y variables**: `camelCase`
- **Componentes**: `PascalCase`
- **Tipos e interfaces**: `PascalCase`
- **Constantes reales**: `UPPER_SNAKE_CASE`
- **Hooks custom**: prefijo obligatorio `use` en `camelCase`
- **Tests**: `*.test.ts` / `*.test.tsx` con nombre base en `kebab-case`

## Cobertura Mínima Requerida

**80%** en:

- Statements (sentencias)
- Branches (ramas)
- Functions (funciones)
- Lines (líneas)

## Testing Backend

### Estructura de Tests Backend

```
apps/backend/src/modules/{dominio}/
  __tests__/
    {dominio}.service.test.ts      # Tests unitarios de lógica
    {dominio}.controller.test.ts   # Tests unitarios de controllers
    {dominio}.routes.test.ts       # Tests de integración de endpoints
    {dominio}.schemas.test.ts      # Tests de validación
```

### Tests Unitarios de Services

**Objetivo**: Probar lógica de negocio aisladamente.

```typescript
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { AuthService } from '../auth.service';
import { EmailNotVerifiedError } from '@/shared/errors';

describe('AuthService', () => {
  let authService: AuthService;
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = {
      user: {
        findUnique: jest.fn(),
        create: jest.fn(),
      },
    };
    authService = new AuthService(mockPrisma);
  });

  describe('login', () => {
    it('should throw EmailNotVerifiedError when email is not verified', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: '1',
        email: 'test@example.com',
        emailVerified: false,
      });

      await expect(
        authService.login({ email: 'test@example.com', password: 'pass' })
      ).rejects.toThrow(EmailNotVerifiedError);
    });

    it('should return user when login is successful', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        emailVerified: true,
        passwordHash: 'hashed',
      };
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);

      const result = await authService.login({
        email: 'test@example.com',
        password: 'correctPassword',
      });

      expect(result).toBeDefined();
      expect(result.email).toBe('test@example.com');
    });
  });
});
```

### Tests de Integración de Endpoints

**Objetivo**: Probar endpoints completos incluyendo validación, controller y service.

```typescript
import request from 'supertest';
import { app } from '@/app';
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';

describe('POST /api/auth/login', () => {
  beforeAll(async () => {
    // Setup: limpiar DB, crear datos de test
  });

  afterAll(async () => {
    // Cleanup: limpiar DB
  });

  it('should return 400 when email is invalid', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'invalid-email', password: 'pass' });

    expect(response.status).toBe(400);
    expect(response.body.error).toBeDefined();
  });

  it('should return 200 and token when credentials are valid', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'correctPassword' });

    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
    expect(response.body.user).toBeDefined();
  });

  it('should return 401 when credentials are invalid', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'wrongPassword' });

    expect(response.status).toBe(401);
  });
});
```

### Tests de Validación (Schemas)

```typescript
import { loginSchema } from '../auth.schemas';
import { describe, it, expect } from '@jest/globals';

describe('loginSchema', () => {
  it('should validate correct input', () => {
    const result = loginSchema.safeParse({
      email: 'test@example.com',
      password: 'password123',
    });

    expect(result.success).toBe(true);
  });

  it('should reject invalid email', () => {
    const result = loginSchema.safeParse({
      email: 'invalid-email',
      password: 'password123',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('email');
    }
  });

  it('should reject missing password', () => {
    const result = loginSchema.safeParse({
      email: 'test@example.com',
    });

    expect(result.success).toBe(false);
  });
});
```

### Mocking Prisma

```typescript
import { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended';

export type MockPrisma = DeepMockProxy<PrismaClient>;

export const prismaMock = mockDeep<PrismaClient>() as MockPrisma;

beforeEach(() => {
  mockReset(prismaMock);
});
```

## Testing Frontend

### Estructura de Tests Frontend

```
apps/frontend/src/modules/{dominio}/
  hooks/
    __tests__/
      useAuth.test.ts
  components/
    __tests__/
      UserCard.test.tsx
  pages/
    login/
      __tests__/
        login.test.tsx
        useLogin.test.ts
```

### Tests de Componentes React

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Login } from '../login';
import { AuthProvider } from '@/modules/auth';

describe('Login', () => {
  it('renders login form', () => {
    render(
      <AuthProvider>
        <Login />
      </AuthProvider>
    );

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('shows validation error for invalid email', async () => {
    render(
      <AuthProvider>
        <Login />
      </AuthProvider>
    );

    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole('button', { name: /login/i });

    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
    });
  });

  it('calls login function with correct credentials', async () => {
    const mockLogin = vi.fn();

    render(
      <AuthProvider value={{ login: mockLogin }}>
        <Login />
      </AuthProvider>
    );

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });
});
```

### Tests de Hooks Personalizados

```typescript
import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useAuth } from '../useAuth';
import { authApi } from '../../auth.api';

vi.mock('../../auth.api');

describe('useAuth', () => {
  it('should login successfully', async () => {
    const mockUser = { id: '1', email: 'test@example.com' };
    vi.mocked(authApi.login).mockResolvedValue({
      user: mockUser,
      token: 'fake-token',
    });

    const { result } = renderHook(() => useAuth());

    expect(result.current.isAuthenticated).toBe(false);

    await act(async () => {
      await result.current.login({
        email: 'test@example.com',
        password: 'pass',
      });
    });

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user).toEqual(mockUser);
    });
  });

  it('should handle login error', async () => {
    vi.mocked(authApi.login).mockRejectedValue(new Error('Invalid credentials'));

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      try {
        await result.current.login({
          email: 'test@example.com',
          password: 'wrong',
        });
      } catch (error) {
        // Expected error
      }
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.error).toBeDefined();
  });

  it('should logout correctly', async () => {
    const { result } = renderHook(() => useAuth());

    // First login
    vi.mocked(authApi.login).mockResolvedValue({
      user: { id: '1', email: 'test@example.com' },
      token: 'fake-token',
    });

    await act(async () => {
      await result.current.login({
        email: 'test@example.com',
        password: 'pass',
      });
    });

    expect(result.current.isAuthenticated).toBe(true);

    // Then logout
    act(() => {
      result.current.logout();
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });
});
```

### Tests de Componentes UI con Storybook

```typescript
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Button } from '../button';

describe('Button', () => {
  it('renders with primary variant', () => {
    render(<Button variant="primary">Click me</Button>);
    const button = screen.getByRole('button');

    expect(button).toHaveClass('btn-primary');
    expect(button).toHaveTextContent('Click me');
  });

  it('renders with secondary variant', () => {
    render(<Button variant="secondary">Click me</Button>);
    const button = screen.getByRole('button');

    expect(button).toHaveClass('btn-secondary');
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByRole('button'));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>);

    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

### Tests de Integración con I18N

```typescript
import { render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/shared/i18n/i18n.test'; // Configuración de test
import { describe, it, expect } from 'vitest';
import { Welcome } from '../welcome';

describe('Welcome with i18n', () => {
  it('renders in Spanish', () => {
    i18n.changeLanguage('es');

    render(
      <I18nextProvider i18n={i18n}>
        <Welcome />
      </I18nextProvider>
    );

    expect(screen.getByText(/bienvenido/i)).toBeInTheDocument();
  });

  it('renders in English', () => {
    i18n.changeLanguage('en');

    render(
      <I18nextProvider i18n={i18n}>
        <Welcome />
      </I18nextProvider>
    );

    expect(screen.getByText(/welcome/i)).toBeInTheDocument();
  });
});
```

## Estrategias para Alcanzar 80% de Cobertura

### 1. Testing Pyramid

- **Base**: Tests unitarios (70% del total)
- **Medio**: Tests de integración (20%)
- **Cima**: Tests E2E (10%)

### 2. Qué Testear Prioritariamente

#### Backend:

- ✅ Lógica de negocio en services (crítico)
- ✅ Validaciones de schemas
- ✅ Manejo de errores
- ✅ Endpoints principales (integración)
- ⚠️ Controllers (menos crítico, si son simples)
- ❌ Configuración y setup (bajo valor)

#### Frontend:

- ✅ Hooks personalizados con lógica (crítico)
- ✅ Componentes con interacciones complejas
- ✅ Componentes UI del design system
- ✅ Validaciones de formularios
- ⚠️ Componentes puramente presentacionales simples
- ❌ Archivos de configuración

### 3. Coverage Reports

```bash
# Backend
pnpm --filter backend test:coverage

# Frontend
pnpm --filter frontend test:coverage
```

Revisar archivos de coverage:

- `coverage/lcov-report/index.html` - reporte visual
- Identificar archivos con baja cobertura
- Priorizar archivos con lógica crítica

### 4. Evitar Falsa Cobertura

❌ No hacer tests solo para subir porcentaje:

```typescript
// BAD: Test inútil
it('should exist', () => {
  expect(myFunction).toBeDefined();
});
```

✅ Tests con valor real:

```typescript
// GOOD: Test con caso de uso real
it('should calculate discount correctly for premium users', () => {
  const user = { type: 'premium' };
  const price = 100;

  const result = calculateDiscount(user, price);

  expect(result).toBe(80); // 20% discount
});
```

## Checklist de Testing

### Para Nuevo Módulo Backend:

1. ✅ Tests unitarios de service con casos edge
2. ✅ Tests de validación de schemas (casos válidos e inválidos)
3. ✅ Tests de integración de al menos endpoints principales
4. ✅ Mocks de Prisma correctamente configurados
5. ✅ Tests de manejo de errores
6. ✅ Cobertura ≥80% del módulo
7. ✅ `pnpm test` pasa sin errores

### Para Nuevo Módulo Frontend:

1. ✅ Tests de hooks personalizados
2. ✅ Tests de componentes con casos principales
3. ✅ Tests de interacciones (clicks, inputs, etc.)
4. ✅ Tests con traducciones (ambos idiomas)
5. ✅ Mocks de APIs configurados
6. ✅ Cobertura ≥80% del módulo
7. ✅ `pnpm test` pasa sin errores

### Para Componente UI:

1. ✅ Tests de rendering con diferentes props
2. ✅ Tests de variantes (primary, secondary, etc.)
3. ✅ Tests de interacciones (onClick, onChange, etc.)
4. ✅ Tests de estados (disabled, loading, error, etc.)
5. ✅ Tests de accesibilidad básica (roles, labels)
6. ✅ Cobertura ≥80%
7. ✅ Storybook funcionando con el componente

## Herramientas de Testing

### Backend:

- **Jest**: Framework de testing
- **Supertest**: Tests de integración HTTP
- **jest-mock-extended**: Mocking avanzado de Prisma

### Frontend:

- **Vitest**: Framework de testing (más rápido que Jest)
- **React Testing Library**: Testing de componentes
- **@testing-library/react-hooks**: Testing de hooks
- **MSW (Mock Service Worker)**: Mocking de APIs

## Comandos Útiles

```bash
# Run all tests
pnpm test

# Run tests with coverage
pnpm test:coverage

# Run tests in watch mode
pnpm test:watch

# Run tests for specific file
pnpm test auth.service.test.ts

# Run tests matching pattern
pnpm test --testNamePattern="login"
```
