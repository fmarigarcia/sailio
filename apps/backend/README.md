# Backend - Sailio API

API Backend de Sailio construida con Node.js + Express + Prisma + PostgreSQL.

## 🏗️ Arquitectura

Este backend sigue una **arquitectura por dominio** con principios **SOLID**.

### Estructura de Directorios

```
apps/backend/
├── src/
│   ├── modules/              # Módulos por dominio
│   │   └── {dominio}/
│   │       ├── __tests__/    # Tests del módulo
│   │       ├── {dominio}.controller.ts
│   │       ├── {dominio}.service.ts
│   │       ├── {dominio}.routes.ts
│   │       ├── {dominio}.schemas.ts
│   │       ├── {dominio}.types.ts
│   │       └── index.ts
│   ├── shared/              # Código compartido
│   │   ├── db/             # Configuración de Prisma
│   │   ├── errors/         # Errores tipados
│   │   ├── http/           # Tipos de respuesta HTTP
│   │   ├── middleware/     # Middlewares globales
│   │   └── utils/          # Utilidades
│   ├── config/             # Configuración de la app
│   ├── app.ts              # Configuración de Express
│   └── index.ts            # Entry point
├── prisma/
│   ├── schema.prisma       # Schema de la base de datos
│   └── migrations/         # Migraciones
├── __tests__/              # Tests de integración globales
└── package.json
```

## 📋 Responsabilidades por Archivo

### `*.routes.ts`

- Define **solo** endpoints HTTP (método, path, middlewares)
- NO contiene lógica de negocio

### `*.controller.ts`

- Traduce HTTP → dominio
- Valida entrada usando schemas
- Maneja códigos de estado HTTP
- NO contiene reglas de negocio complejas

### `*.service.ts`

- **AQUÍ vive la lógica de negocio**
- Reglas del dominio y orquestación de procesos
- NO depende de HTTP
- Reutilizable fuera de una API HTTP

### `*.schemas.ts`

- Validación de inputs con **Zod**
- Contratos claros de la API
- Primera capa de seguridad

### `*.types.ts`

- Tipos de dominio específicos del módulo
- DTOs e interfaces del negocio

## 🚀 Scripts Disponibles

```bash
# Desarrollo
pnpm dev                    # Iniciar servidor en modo desarrollo

# Build
pnpm build                  # Compilar TypeScript
pnpm start                  # Iniciar servidor compilado

# Testing
pnpm test                   # Ejecutar tests
pnpm test:watch            # Tests en modo watch
pnpm test:coverage         # Tests con cobertura (mínimo 80%)

# Linting
pnpm lint                   # Verificar código
pnpm lint:fix              # Corregir automáticamente
pnpm type-check            # Verificar tipos TypeScript

# Prisma
pnpm prisma:generate       # Generar cliente Prisma
pnpm prisma:migrate        # Ejecutar migraciones
pnpm prisma:studio         # Abrir Prisma Studio
pnpm prisma:seed           # Ejecutar seed de datos

# Limpieza
pnpm clean                 # Limpiar archivos generados
```

## 🗄️ Base de Datos

### Modelos Principales

- **User**: Entrenadores de vela
- **RefreshToken**: Gestión de tokens JWT
- **Athlete**: Atletas/navegantes
- **Session**: Sesiones de entrenamiento
- **WeatherCondition**: Condiciones climáticas
- **TrainingSessionData**: Datos de cada atleta por sesión

Ver `prisma/schema.prisma` para detalles completos.

### Migraciones

```bash
# Crear nueva migración
pnpm prisma:migrate

# Aplicar migraciones pendientes
pnpm prisma migrate deploy

# Reset de la base de datos (¡CUIDADO!)
pnpm prisma migrate reset
```

## 🔧 Variables de Entorno

Copiar `.env.example` a `.env` y configurar:

```bash
cp .env.example .env
```

Variables requeridas:

- `DATABASE_URL`: URL de conexión a PostgreSQL
- `JWT_SECRET`: Secret para firma de JWT
- `PORT`: Puerto del servidor (default: 3000)

Ver `.env.example` para todas las variables disponibles.

## ✅ Reglas de Código

### ESLint - Reglas Críticas

- ❌ `no-console` - Sin console.log en producción
- ❌ `max-lines` - Máximo 300 líneas por archivo
- ❌ `complexity` - Complejidad ciclomática máxima de 15
- ❌ `no-var` - Usar let/const, nunca var
- ❌ `@typescript-eslint/no-explicit-any` - Prohibido el tipo any

### Testing

- ✅ Cobertura mínima: **80%** en todo el proyecto
- ✅ Tests en carpetas `__tests__/` dentro de cada módulo

### Gestión de Errores

Usar errores tipados en lugar de `throw new Error()`:

```typescript
import { NotFoundError, UnauthorizedError } from '@/shared/errors';

// ❌ Evitar
throw new Error('User not found');

// ✅ Preferir
throw new NotFoundError('User not found');
```

Errores disponibles:

- `BadRequestError` (400)
- `UnauthorizedError` (401)
- `ForbiddenError` (403)
- `NotFoundError` (404)
- `ConflictError` (409)
- `ValidationError` (422)
- `InternalServerError` (500)

## 📦 Crear un Nuevo Módulo

Para crear un nuevo módulo, usa el prompt predefinido:

```
Ver: .github/prompts/new-backend-module.prompt.md
```

O consulta el agente especializado:

```
@backend-agent crea un módulo de {dominio}
```

## 🧪 Testing

### Estructura de Tests

```
modules/{dominio}/__tests__/
├── {dominio}.service.test.ts      # Tests unitarios de lógica de negocio
├── {dominio}.controller.test.ts   # Tests unitarios de controllers
├── {dominio}.routes.test.ts       # Tests de integración de endpoints
└── {dominio}.schemas.test.ts      # Tests de validación
```

### Ejecutar Tests

```bash
# Todos los tests
pnpm test

# Con cobertura
pnpm test:coverage

# En modo watch
pnpm test:watch

# Tests de un módulo específico
pnpm test modules/auth
```

## 🔐 Seguridad

- **Helmet**: Headers de seguridad HTTP
- **CORS**: Control de acceso entre orígenes
- **Validación**: Zod para validar todas las entradas
- **JWT**: Autenticación con tokens
- **Rate Limiting**: Control de tasa de peticiones (configurar según necesidad)

## 🤖 GitHub Copilot

### Agentes Disponibles

- `@backend-agent` - Para desarrollo backend
- `@testing-agent` - Para estrategias de testing
- `@pr-review-agent` - Para revisión de PRs

### Prompts Útiles

- Crear módulo: `.github/prompts/new-backend-module.prompt.md`
- Generar tests: `.github/prompts/generate-tests-coverage.prompt.md`

## 📚 Recursos

- [Express.js](https://expressjs.com/)
- [Prisma](https://www.prisma.io/)
- [Zod](https://zod.dev/)
- [Vitest](https://vitest.dev/)

---

**Desarrollado siguiendo principios SOLID y arquitectura por dominio**
