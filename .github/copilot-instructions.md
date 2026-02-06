# GitHub Copilot - Sailio Project Instructions

## Proyecto Overview

Sailio es un SaaS para entrenadores y regatistas de vela que permite llevar control sobre sesiones de entrenamiento.

## Arquitectura General

- **Tipo**: Monorepo gestionado con pnpm y turbo
- **Frontend**: Vite + React + TypeScript
- **Backend**: Node.js + Express + Prisma + PostgreSQL
- **Principios**: SOLID aplicado en todo el proyecto

## Reglas de Linting y Code Quality

### ESLint - Reglas Críticas (deben tirar error):
- `no-console`: Sin console.log en producción
- `max-lines`: Máximo 300 líneas (excluyendo blancos y comentarios)
  - Excepciones: archivos de test, estilos y Prisma
- `complexity`: Complejidad ciclomática máxima de 15
- `no-var`: Usar let/const, nunca var
- `no-unused-vars`: Sin variables sin usar
- `no-explicit-any`: Prohibido el tipo any en TypeScript
- `rules-of-hooks`: Cumplir reglas de React Hooks
- `no-inline-styles`: Prohibido estilos inline

### Formatting
- **Prettier**: Todo el código debe estar formateado
- **Stylelint**: CSS debe cumplir las reglas de estilo

### Testing
- Cobertura mínima: **80%** en todo el proyecto

### Pre-commit Hooks (Husky)
- **Husky** está configurado en el proyecto para ejecutar verificaciones antes de cada commit
- Los hooks automáticamente ejecutan:
  - `lint-staged`: Linting solo en archivos staged
  - `type-check`: Verificación de tipos TypeScript
  - Tests relacionados con archivos modificados
- **NO se puede hacer commit** si:
  - Hay errores de linting
  - Hay errores de tipos TypeScript
  - Los tests fallan
- Para saltarse hooks (solo en casos excepcionales): `git commit --no-verify`

## Git Commit Guidelines

- **Formato**: One-liner (una sola línea)
- **Tamaño**: Commits razonables, sin incluir demasiadas líneas de código
- **Buenas prácticas**:
  - Un commit = una responsabilidad
  - Mensajes claros y descriptivos
  - Formato sugerido: `tipo: descripción breve`
  - Tipos: feat, fix, refactor, test, docs, style, chore

## Internacionalización (I18N)

**CRÍTICO**: Todo el frontend debe estar traducido a español e inglés.
- NO debe haber NINGÚN string suelto sin traducir
- Usar siempre las claves de traducción
- Verificar que cada nuevo string tenga su traducción en ambos idiomas

## Testing Requirements

- Cada módulo/componente debe tener su carpeta `__tests__/`
- Coverage mínimo del 80%
- Tests unitarios y de integración según corresponda
- Para componentes React: incluir tests de rendering y comportamiento

## Consultar Agentes Especializados

**¿No sabes qué agente necesitas?** Consulta primero `@orchestrator-agent`

Para tareas específicas, consulta los agentes especializados:
- `orchestrator.agent.md`: Analiza tu solicitud y te guía al agente apropiado
- `backend.agent.md`: Desarrollo backend y API
- `frontend.agent.md`: Desarrollo frontend y componentes
- `testing.agent.md`: Estrategias de testing
- `pr-review.agent.md`: Revisión de pull requests

## Consultar Prompts Predefinidos

En `.github/prompts/` encontrarás plantillas para:
- Crear nuevos módulos backend
- Crear nuevos módulos frontend
- Añadir componentes UI con Storybook
- Generar tests con cobertura
- Configurar Husky y pre-commit hooks
