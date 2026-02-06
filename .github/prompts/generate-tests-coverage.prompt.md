# Prompt: Generar Tests con Cobertura

## Objetivo
Generar tests completos para alcanzar y mantener cobertura ≥80% en módulos backend o frontend.

## Instrucciones para GitHub Copilot

Por favor, genera tests completos para `{RUTA_DEL_ARCHIVO}` para alcanzar cobertura ≥80%.

### Contexto:

**Tipo de archivo**: {backend/frontend} - {service/controller/hook/component/etc.}
**Ubicación**: `{RUTA_DEL_ARCHIVO}`
**Cobertura actual**: {X}%
**Cobertura objetivo**: ≥80%

### Análisis Requerido:

1. **Analizar el archivo para identificar**:
   - Funciones/métodos públicos
   - Casos de uso principales
   - Casos edge (errores, valores límite, null/undefined)
   - Branches no cubiertos
   - Lógica compleja que necesita tests

2. **Priorizar testing de**:
   - ✅ Lógica de negocio crítica
   - ✅ Manejo de errores
   - ✅ Validaciones
   - ✅ Transformaciones de datos
   - ✅ Casos edge y límites
   - ⚠️ Código complejo (complexity >10)
   - ⬇️ Código trivial (getters/setters simples)

### Para Backend (Services/Controllers):

**Crear tests en**: `__tests__/{nombre}.test.ts`

#### Tests de Service:
```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { {Service}Service } from '../{service}.service';
import { prismaMock } from '@/shared/testing/prisma-mock';
import { {Error}Error } from '@/shared/errors';

describe('{Service}Service', () => {
  let service: {Service}Service;

  beforeEach(() => {
    service = new {Service}Service(prismaMock);
  });

  describe('{metodo}', () => {
    it('should handle success case', async () => {
      // Arrange
      const input = { /* datos */ };
      prismaMock.{model}.{action}.mockResolvedValue({ /* resultado */ });

      // Act
      const result = await service.{metodo}(input);

      // Assert
      expect(result).toBeDefined();
      expect(prismaMock.{model}.{action}).toHaveBeenCalledWith(/* params */);
    });

    it('should throw error when {condicion}', async () => {
      // Arrange
      const input = { /* datos */ };
      prismaMock.{model}.{action}.mockResolvedValue(null);

      // Act & Assert
      await expect(service.{metodo}(input)).rejects.toThrow({Error}Error);
    });

    it('should handle edge case: {caso}', async () => {
      // Test de caso límite
    });
  });
});
```

#### Tests de Controller:
```typescript
import { describe, it, expect, vi } from 'vitest';
import { Request, Response } from 'express';
import { {controller} } from '../{module}.controller';
import { {service} } from '../{module}.service';

vi.mock('../{module}.service');

describe('{Controller}', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockJson: any;
  let mockStatus: any;

  beforeEach(() => {
    mockJson = vi.fn();
    mockStatus = vi.fn().mockReturnValue({ json: mockJson });
    mockResponse = { status: mockStatus, json: mockJson };
    mockRequest = { body: {}, params: {}, query: {} };
  });

  it('should return 200 on success', async () => {
    // Arrange
    const mockData = { /* data */ };
    vi.mocked({service}.{metodo}).mockResolvedValue(mockData);

    // Act
    await {controller}(mockRequest as Request, mockResponse as Response);

    // Assert
    expect(mockStatus).toHaveBeenCalledWith(200);
    expect(mockJson).toHaveBeenCalledWith(mockData);
  });

  it('should return 400 on validation error', async () => {
    // Test de error de validación
  });
});
```

#### Tests de Integración (Endpoints):
```typescript
import request from 'supertest';
import { app } from '@/app';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';

describe('POST /api/{modulo}/{endpoint}', () => {
  beforeAll(async () => {
    // Setup DB
  });

  afterAll(async () => {
    // Cleanup
  });

  it('should return 200 with valid input', async () => {
    const response = await request(app)
      .post('/api/{modulo}/{endpoint}')
      .send({ /* valid data */ });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
  });

  it('should return 400 with invalid input', async () => {
    const response = await request(app)
      .post('/api/{modulo}/{endpoint}')
      .send({ /* invalid data */ });

    expect(response.status).toBe(400);
    expect(response.body.error).toBeDefined();
  });

  it('should return 401 when unauthorized', async () => {
    const response = await request(app)
      .post('/api/{modulo}/{endpoint}')
      .send({ /* data */ });
      // Sin token de auth

    expect(response.status).toBe(401);
  });
});
```

### Para Frontend (Hooks/Components):

**Crear tests en**: `__tests__/{nombre}.test.tsx` o `__tests__/{nombre}.test.ts`

#### Tests de Hook:
```typescript
import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { use{Hook} } from '../use{hook}';
import { {modulo}Api } from '../../{modulo}.api';

vi.mock('../../{modulo}.api');

describe('use{Hook}', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch data successfully', async () => {
    // Arrange
    const mockData = [{ /* data */ }];
    vi.mocked({modulo}Api.getAll).mockResolvedValue(mockData);

    // Act
    const { result } = renderHook(() => use{Hook}());

    // Assert
    await waitFor(() => {
      expect(result.current.data).toEqual(mockData);
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('should handle error', async () => {
    // Arrange
    const error = new Error('API Error');
    vi.mocked({modulo}Api.getAll).mockRejectedValue(error);

    // Act
    const { result } = renderHook(() => use{Hook}());

    // Assert
    await waitFor(() => {
      expect(result.current.error).toBeDefined();
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('should refetch on demand', async () => {
    // Test de refetch
  });
});
```

#### Tests de Component:
```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { {Component} } from '../{component}';

describe('{Component}', () => {
  it('renders correctly', () => {
    render(<{Component} {props} />);
    
    expect(screen.getByRole('{role}')).toBeInTheDocument();
  });

  it('handles user interaction', async () => {
    const mockOnClick = vi.fn();
    render(<{Component} onClick={mockOnClick} />);

    fireEvent.click(screen.getByRole('button'));

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('shows loading state', () => {
    render(<{Component} isLoading />);
    
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('shows error state', () => {
    const error = 'Something went wrong';
    render(<{Component} error={error} />);
    
    expect(screen.getByText(error)).toBeInTheDocument();
  });

  it('renders with different variants', () => {
    const { rerender } = render(<{Component} variant="primary" />);
    expect(screen.getByRole('{role}')).toHaveClass('variant-primary');

    rerender(<{Component} variant="secondary" />);
    expect(screen.getByRole('{role}')).toHaveClass('variant-secondary');
  });
});
```

#### Tests con I18N:
```typescript
import { render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/shared/i18n/i18n.test';
import { describe, it, expect } from 'vitest';
import { {Component} } from '../{component}';

describe('{Component} with i18n', () => {
  it('renders in Spanish', () => {
    i18n.changeLanguage('es');
    
    render(
      <I18nextProvider i18n={i18n}>
        <{Component} />
      </I18nextProvider>
    );

    expect(screen.getByText(/{texto en español}/i)).toBeInTheDocument();
  });

  it('renders in English', () => {
    i18n.changeLanguage('en');
    
    render(
      <I18nextProvider i18n={i18n}>
        <{Component} />
      </I18nextProvider>
    );

    expect(screen.getByText(/{texto en ingles}/i)).toBeInTheDocument();
  });
});
```

### Estrategia de Tests:

1. **Casos Happy Path** (casos de éxito)
   - Inputs válidos
   - Flujo esperado
   - Resultados correctos

2. **Casos de Error**
   - Inputs inválidos
   - Errores de API/DB
   - Timeouts
   - Valores null/undefined

3. **Casos Edge**
   - Valores límite (0, máximo, negativo)
   - Arrays vacíos
   - Strings vacíos
   - Valores extremos

4. **Casos de Estado**
   - Loading
   - Error
   - Empty
   - Success

5. **Casos de Interacción**
   - Clicks
   - Form submissions
   - Input changes
   - Keyboard events

### Mocking:

#### Backend:
- Mock Prisma con `jest-mock-extended`
- Mock servicios externos
- Mock middlewares de autenticación

#### Frontend:
- Mock APIs con `vi.mock()`
- Mock React Router si necesario
- Mock contextos (Auth, Theme, etc.)

### Cobertura:

Verificar que se cubra:
- ✅ Statements ≥ 80%
- ✅ Branches ≥ 80%
- ✅ Functions ≥ 80%
- ✅ Lines ≥ 80%

```bash
# Ver reporte de cobertura
pnpm test:coverage

# Ver archivos específicos con baja cobertura
pnpm test:coverage -- {archivo}
```

### Anti-patrones a Evitar:

❌ Tests inútiles:
```typescript
it('exists', () => {
  expect(myFunction).toBeDefined();
});
```

❌ Tests que no testean nada:
```typescript
it('renders', () => {
  render(<Component />);
  // No hay expects
});
```

❌ Tests demasiado genéricos:
```typescript
it('works', () => {
  const result = doSomething();
  expect(result).toBeTruthy(); // ¿Qué es truthy?
});
```

✅ Tests específicos y con valor:
```typescript
it('calculates discount correctly for premium users', () => {
  const user = { type: 'premium' };
  const price = 100;
  
  const result = calculateDiscount(user, price);
  
  expect(result).toBe(80); // 20% discount
});
```

## Checklist de Validación:

- [ ] Tests creados en `__tests__/`
- [ ] Cobertura ≥ 80% en el archivo objetivo
- [ ] Casos happy path cubiertos
- [ ] Casos de error cubiertos
- [ ] Casos edge cubiertos
- [ ] Mocks correctamente configurados
- [ ] Tests pasan sin errores (`pnpm test`)
- [ ] Tests son específicos y descriptivos
- [ ] Sin tests inútiles
- [ ] Sin errores de linting

## Comandos de Verificación:

```bash
# Run tests del archivo
pnpm test {archivo}.test.ts

# Ver cobertura
pnpm test:coverage

# Ver cobertura en navegador
open coverage/lcov-report/index.html
```
