# Módulos del Backend

Este directorio contiene todos los módulos del backend organizados por dominio.

## Estructura de un Módulo

Cada módulo debe seguir esta estructura:

```
{dominio}/
├── __tests__/
│   ├── {dominio}.service.test.ts
│   ├── {dominio}.controller.test.ts
│   ├── {dominio}.routes.test.ts
│   └── {dominio}.schemas.test.ts
├── {dominio}.controller.ts
├── {dominio}.service.ts
├── {dominio}.routes.ts
├── {dominio}.schemas.ts
├── {dominio}.types.ts
└── index.ts
```

## Crear un Nuevo Módulo

Usa el prompt predefinido o el agente especializado:

```
@backend-agent crea un módulo de {nombre}
```

O consulta:

```
.github/prompts/new-backend-module.prompt.md
```

## Módulos Disponibles

(Esta sección se actualizará conforme se añadan módulos)

- [ ] auth - Autenticación y autorización
- [ ] users - Gestión de usuarios/entrenadores
- [ ] athletes - Gestión de atletas
- [ ] sessions - Gestión de sesiones de entrenamiento
- [ ] weather - Condiciones climáticas
