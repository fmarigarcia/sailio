# Sailio

SaaS para entrenadores y regatistas de vela que permite llevar control sobre sesiones de entrenamiento.

## 🚀 Stack Tecnológico

### Monorepo
- **pnpm** - Gestor de paquetes
- **Turbo** - Build system para monorepos

### Backend
- **Node.js** - Runtime
- **Express** - Framework web
- **Prisma** - ORM
- **PostgreSQL** - Base de datos
- **TypeScript** - Lenguaje

### Frontend
- **Vite** - Build tool
- **React** - Framework UI
- **TypeScript** - Lenguaje
- **I18N** - Internacionalización (ES/EN)

## 📁 Estructura del Proyecto

```
sailio/
├── apps/                    # Aplicaciones
│   ├── backend/            # API Backend
│   └── frontend/           # Aplicación Web
├── packages/               # Paquetes compartidos
│   ├── shared/            # Tipos y utilidades compartidas
│   └── config/            # Configuraciones compartidas
├── .github/               # Configuración de GitHub y Copilot
│   ├── agents/           # Agentes especializados
│   └── prompts/          # Prompts predefinidos
├── package.json           # Configuración raíz
├── pnpm-workspace.yaml   # Configuración de workspaces
└── turbo.json            # Configuración de Turbo
```

## 🛠️ Requisitos Previos

- **Node.js**: >= 20.0.0
- **pnpm**: >= 8.0.0

## 📦 Instalación

```bash
# Instalar dependencias
pnpm install

# Preparar hooks de git
pnpm prepare
```

## 🏃‍♂️ Scripts Disponibles

### Desarrollo
```bash
pnpm dev              # Iniciar todos los proyectos en modo desarrollo
pnpm dev --filter=backend   # Solo backend
pnpm dev --filter=frontend  # Solo frontend
```

### Build
```bash
pnpm build            # Compilar todos los proyectos
pnpm build --filter=backend  # Solo backend
pnpm build --filter=frontend # Solo frontend
```

### Testing
```bash
pnpm test             # Ejecutar todos los tests
pnpm test:coverage    # Tests con reporte de cobertura (mínimo 80%)
```

### Linting y Formateo
```bash
pnpm lint             # Verificar código con ESLint
pnpm lint:fix         # Corregir automáticamente errores de linting
pnpm format           # Formatear código con Prettier
pnpm format:check     # Verificar formato sin cambios
pnpm type-check       # Verificar tipos de TypeScript
```

### Limpieza
```bash
pnpm clean            # Limpiar archivos generados
```

## 📋 Reglas de Código

### ESLint - Reglas Críticas
- ❌ `no-console` - Sin console.log en producción
- ❌ `max-lines` - Máximo 300 líneas por archivo
- ❌ `complexity` - Complejidad ciclomática máxima de 15
- ❌ `no-var` - Usar let/const, nunca var
- ❌ `@typescript-eslint/no-explicit-any` - Prohibido el tipo any

### Testing
- ✅ Cobertura mínima: **80%** en todo el proyecto
- ✅ Tests en carpetas `__tests__/` junto al código

### I18N (Frontend)
- ✅ TODO el texto debe estar traducido (ES/EN)
- ✅ Sin strings hardcoded en componentes

### Commits
- ✅ Formato: `tipo: descripción breve` (one-liner)
- ✅ Tipos: feat, fix, refactor, test, docs, style, chore

## 🎯 Pre-commit Hooks (Husky)

El proyecto utiliza Husky para ejecutar verificaciones automáticas antes de cada commit:

- ✅ ESLint (linting)
- ✅ Stylelint (CSS)
- ✅ TypeScript (type-check)
- ✅ Prettier (formatting)
- ✅ Tests relacionados

**No se permite hacer commit si hay errores.**

### Bypass (solo casos excepcionales)
```bash
git commit --no-verify -m "hotfix: descripción"
```

## 🤖 GitHub Copilot - Agentes Especializados

Este proyecto cuenta con agentes especializados para ayudarte:

### 🎯 Orchestrator (Comienza aquí)
```
@orchestrator-agent ¿qué agente necesito para implementar X?
```

### 🔧 Agentes Disponibles
- `@backend-agent` - Desarrollo backend
- `@frontend-agent` - Desarrollo frontend  
- `@testing-agent` - Estrategias de testing
- `@pr-review-agent` - Revisión de PRs

### 📝 Prompts Predefinidos
En `.github/prompts/` encontrarás plantillas para:
- Crear módulos backend completos
- Crear módulos frontend completos
- Añadir componentes UI con Storybook
- Generar tests con cobertura ≥80%

Consulta [.github/README.md](.github/README.md) para más información.

## 🏗️ Principios de Arquitectura

### SOLID
El proyecto sigue los principios SOLID en todo el código:
- **S**ingle Responsibility
- **O**pen/Closed
- **L**iskov Substitution
- **I**nterface Segregation
- **D**ependency Inversion

### Arquitectura por Dominio
- Backend: módulos organizados por dominio de negocio
- Frontend: módulos organizados por dominio de negocio

## 📚 Documentación

- [Guía de Contribución](.github/copilot-instructions.md)
- [Agentes y Prompts](.github/README.md)
- Backend: Ver `apps/backend/README.md` (próximamente)
- Frontend: Ver `apps/frontend/README.md` (próximamente)

## 🔐 Variables de Entorno

Cada aplicación tiene su propio archivo `.env.example` con las variables necesarias.

```bash
# Copiar y configurar variables de entorno
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env
```

## 📄 Licencia

Este proyecto es privado y propietario.

---

**Desarrollado con ❤️ para la comunidad de vela**
