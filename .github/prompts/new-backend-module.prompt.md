# Prompt: Crear Nuevo Módulo Backend

## Objetivo
Crear un nuevo módulo backend siguiendo la arquitectura por dominio de Sailio.

## Instrucciones para GitHub Copilot

Por favor, crea un nuevo módulo backend llamado `{NOMBRE_MODULO}` con la siguiente estructura:

```
apps/backend/src/modules/{NOMBRE_MODULO}/
  __tests__/
    {NOMBRE_MODULO}.service.test.ts
    {NOMBRE_MODULO}.controller.test.ts
    {NOMBRE_MODULO}.routes.test.ts
    {NOMBRE_MODULO}.schemas.test.ts
  {NOMBRE_MODULO}.controller.ts
  {NOMBRE_MODULO}.service.ts
  {NOMBRE_MODULO}.routes.ts
  {NOMBRE_MODULO}.schemas.ts
  {NOMBRE_MODULO}.types.ts
  index.ts
```

### Requisitos:

1. **{NOMBRE_MODULO}.routes.ts**:
   - Define los endpoints HTTP necesarios
   - Solo método, path, middlewares y controller
   - Exportar router de Express

2. **{NOMBRE_MODULO}.controller.ts**:
   - Funciones que traducen HTTP → dominio
   - Validar entrada usando schemas
   - Manejar códigos HTTP apropiados (200, 201, 400, 401, 404, 500)
   - NO incluir lógica de negocio

3. **{NOMBRE_MODULO}.service.ts**:
   - Implementar TODA la lógica de negocio aquí
   - Usar Prisma para acceso a datos
   - Lanzar errores tipados (desde shared/errors)
   - NO depender de HTTP

4. **{NOMBRE_MODULO}.schemas.ts**:
   - Usar Zod para validación
   - Esquemas para cada endpoint (create, update, query params)
   - Mensajes de error descriptivos

5. **{NOMBRE_MODULO}.types.ts**:
   - Interfaces y tipos específicos del dominio
   - DTOs necesarios

6. **index.ts**:
   - Exportar lo público del módulo

7. **__tests__/**:
   - Tests unitarios de service (lógica de negocio)
   - Tests unitarios de controller
   - Tests de integración de endpoints (supertest)
   - Tests de validación de schemas
   - Cobertura mínima: 80%

### Reglas Importantes:

- ✅ Seguir principios SOLID
- ✅ Máximo 300 líneas por archivo (excepto tests)
- ✅ Complejidad ciclomática ≤ 15
- ✅ Sin console.log
- ✅ Sin tipo `any`
- ✅ Sin variables sin usar
- ✅ Errores tipados (no `throw new Error()`)
- ✅ Uso correcto de async/await

### Funcionalidades Requeridas:

{DESCRIBIR AQUÍ LAS FUNCIONALIDADES ESPECÍFICAS DEL MÓDULO}

Ejemplo:
- Crear {entidad}
- Listar {entidades} (con paginación)
- Obtener {entidad} por ID
- Actualizar {entidad}
- Eliminar {entidad}

### Modelos de Prisma a Usar:

{ESPECIFICAR QUÉ MODELOS DE LA BD SE USARÁN}

### Errores Específicos a Manejar:

{LISTAR ERRORES ESPECÍFICOS DEL DOMINIO}

Ejemplo:
- {Entidad}NotFoundError
- {Entidad}AlreadyExistsError
- Unauthorized{Action}Error

## Checklist de Validación:

- [ ] Todos los archivos creados
- [ ] Estructura correcta por dominio
- [ ] Lógica de negocio solo en service
- [ ] Controllers solo traducen HTTP
- [ ] Validación con Zod en schemas
- [ ] Tests con cobertura ≥ 80%
- [ ] Errores tipados correctamente
- [ ] Sin linting errors
- [ ] Commits one-liner
- [ ] Documentación básica en código complejo

## Ejemplo de Uso:

Consulta el módulo `auth` como referencia de implementación.
