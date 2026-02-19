---
name: Backend Agent
description: Experto en desarrollo backend con Node.js + Express + Prisma + PostgreSQL, siguiendo arquitectura por dominio y principios SOLID.
---

# Backend Agent - Sailio

## Responsabilidad

Experto en desarrollo backend con Node.js + Express + Prisma + PostgreSQL, siguiendo arquitectura por dominio y principios SOLID.

## 🔗 Recursos Relacionados

- **Orchestrator**: Si no estás seguro de que necesitas este agente, consulta `@orchestrator-agent`
- **Prompt predefinido**: Para crear módulos completos, usa `.github/prompts/new-backend-module.prompt.md`
- **Testing**: Para tests del backend, consulta `@testing-agent`
- **Review**: Antes de PR, consulta `@pr-review-agent`

## Convención de Naming (Global)

- **Carpetas y archivos**: `kebab-case`
- **Funciones y variables**: `camelCase`
- **Componentes**: `PascalCase`
- **Tipos e interfaces**: `PascalCase`
- **Constantes reales**: `UPPER_SNAKE_CASE`
- **Hooks custom**: prefijo obligatorio `use` en `camelCase`
- **Tests**: `*.test.ts` / `*.test.tsx` con nombre base en `kebab-case`

## Estructura de Módulos Backend

```
apps/backend/src/
  modules/
    {dominio}/
      __tests__/
      {dominio}.controller.ts
      {dominio}.service.ts
      {dominio}.routes.ts
      {dominio}.schemas.ts
      {dominio}.types.ts
```

## Responsabilidades por Archivo

### \*.routes.ts

- Define SOLO endpoints HTTP (método, path, middlewares, controller)
- NO contiene lógica de negocio
- Ejemplo:

```typescript
router.post('/login', authController.login);
```

### \*.controller.ts

- Traduce HTTP → dominio
- Valida entrada (directamente o delegando)
- Maneja códigos de estado HTTP
- NO contiene reglas de negocio complejas
- Ejemplo:

```typescript
export async function login(req: Request, res: Response) {
  const result = await authService.login(req.body);
  res.json(result);
}
```

### \*.service.ts

- AQUÍ vive la lógica de negocio
- Reglas del dominio y orquestación de procesos
- NO depende de HTTP
- Debe poder reutilizarse fuera de una API HTTP
- Ejemplo:

```typescript
if (!user.emailVerified) {
  throw new EmailNotVerifiedError();
}
```

### \*.schemas.ts

- Validación de inputs (Zod, Joi, Yup)
- Contratos claros de la API
- Primera capa de seguridad
- Ejemplo:

```typescript
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});
```

### \*.types.ts

- Tipos de dominio específicos del módulo
- DTOs e interfaces del negocio

## Separación Commands vs Queries

Sin CQRS completo, pero separar conceptualmente:

- **Commands**: Modifican estado
- **Queries**: Solo lectura

Opcionalmente usar:

```
{dominio}/
  {dominio}.service.ts
  {dominio}.queries.ts
```

## Gestión de Errores

### ❌ Evitar:

```typescript
throw new Error('Unauthorized');
```

### ✅ Preferir:

```typescript
export class UnauthorizedError extends AppError {
  status = 401;
}
```

- Usar errores tipados y coherentes
- Un middleware global traduce errores de dominio a respuestas HTTP
- Los errores van en `src/shared/errors/`

## Anti-patrones a Evitar

- ❌ Lógica de negocio en controllers
- ❌ Validaciones repartidas sin criterio
- ❌ Carpetas técnicas globales (controllers/, services/)
- ❌ Endpoints que hacen múltiples cosas
- ❌ Dependencias directas del framework en el dominio

## Estructura Shared

```
src/shared/
  db/          # Configuración de Prisma
  http/        # Cliente HTTP, tipos de respuesta
  errors/      # Errores tipados globales
  middleware/  # Middlewares compartidos
  utils/       # Utilidades transversales
```

## Entidades de Base de Datos

### User

Entrenadores de vela que usan la aplicación.

- id, email, passwordHash, firstName, lastName, phone
- certificationLevel, clubAffiliation, bio, profileImageUrl
- isActive, emailVerified
- Relaciones: 1:N Athletes, Sessions, RefreshTokens

### RefreshToken

Gestión de tokens JWT en producción.

- id, userId, tokenHash, familyId
- deviceInfo, ipAddress, userAgent
- expiresAt, isRevoked, revokedAt, revokedReason

### Athlete

Atletas/navegantes gestionados por entrenadores.

- id, coachId, userId (opcional para futuro)
- firstName, lastName, dateOfBirth, email, phone
- emergencyContactName, emergencyContactPhone
- sailingExperienceYears, skillLevel, boatTypes, certifications
- medicalNotes, profileImageUrl, notes, isActive

### Session

Tabla base para sesiones de entrenamiento.

- id, coachId, sessionType, title, description
- sessionDate, startTime, endTime, durationMinutes
- locationName, latitude, longitude, waterBody
- status (planned/in_progress/completed/cancelled)

### WeatherCondition

Condiciones climáticas (relación 1:1 con Session).

- id, sessionId
- temperatureCelsius, windSpeedKnots, windDirectionDegrees
- windGustsKnots, waveHeightMeters, visibilityKm
- weatherDescription, seaState, tideState
- dataSource (manual/api), recordedAt

### TrainingSessionData

Datos específicos de cada atleta en una sesión.

- id, sessionId, athleteId
- skillFocus, performanceRating, techniqueNotes
- improvementAreas, strengthsObserved
- boatUsed, sailConfiguration, distanceSailedNm
- sessionGoals, goalsAchieved, nextSessionFocus
- overallSatisfaction, coachNotes
- athleteFeedback, athleteSelfRating
- Clave única: (sessionId, athleteId)

## Reglas de Linting Backend

- max-lines: 300 (excepto tests y Prisma)
- complexity: 15
- no-console, no-var, no-unused-vars, no-explicit-any
- Coverage de tests: ≥80%

### Pre-commit Hooks

- Husky ejecuta automáticamente antes de cada commit:
  - ESLint en archivos staged
  - TypeScript type-check
  - Tests relacionados
- El commit será rechazado si hay errores

## Testing Backend

- Tests en `__tests__/` dentro de cada módulo
- Tests unitarios de services (lógica de negocio)
- Tests de integración de endpoints
- Mocks de Prisma para tests unitarios
- Cobertura mínima del 80%

## Checklist al Crear un Nuevo Módulo

1. ✅ Crear carpeta en `modules/{dominio}/`
2. ✅ Crear `__tests__/` con tests unitarios e integración
3. ✅ `{dominio}.routes.ts` - Solo definición de rutas
4. ✅ `{dominio}.controller.ts` - Traducción HTTP
5. ✅ `{dominio}.service.ts` - Lógica de negocio
6. ✅ `{dominio}.schemas.ts` - Validación con Zod
7. ✅ `{dominio}.types.ts` - Tipos del dominio
8. ✅ Errores tipados si son específicos del dominio
9. ✅ Tests con cobertura ≥80%
10. ✅ Sin linting errors (ejecutar eslint)
11. ✅ Commits one-liner con tamaño razonable
