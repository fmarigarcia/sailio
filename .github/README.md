# GitHub Copilot - Estructura de Configuración

Esta carpeta contiene toda la configuración necesaria para que GitHub Copilot tenga el contexto completo del proyecto Sailio.

## 📁 Estructura

```
.github/
├── copilot-instructions.md    # Instrucciones principales del proyecto
├── agents/                     # Agentes especializados
│   ├── backend.agent.md
│   ├── frontend.agent.md
│   ├── testing.agent.md
│   └── pr-review.agent.md
├── prompts/                    # Prompts predefinidos para tareas comunes
│   ├── new-backend-module.prompt.md
│   ├── new-frontend-module.prompt.md
│   ├── new-ui-component-storybook.prompt.md
│   └── generate-tests-coverage.prompt.md
└── README.md                   # Este archivo
```

## 📖 Instrucciones Principales

[copilot-instructions.md](./copilot-instructions.md)

Contiene las reglas globales del proyecto:
- Arquitectura general (monorepo con pnpm y turbo)
- Reglas de linting y code quality
- Guías de commits (one-liner)
- Requisitos de I18N
- Testing requirements (cobertura ≥80%)
- Referencias a agentes especializados

**GitHub Copilot lee automáticamente este archivo** cuando trabajas en el proyecto.

## 🤖 Agentes Especializados

### 🎯 [orchestrator.agent.md](./agents/orchestrator.agent.md) - **COMIENZA AQUÍ**
Agente orquestador que analiza tu solicitud y te guía al agente apropiado.

**Cuándo consultar:**
- No estás seguro qué agente necesitas
- Quieres empezar una tarea nueva
- Necesitas saber qué prompt usar
- Quieres una recomendación de enfoque

**Uso:**
```
@orchestrator-agent necesito implementar gestión de atletas
@orchestrator-agent ¿cómo empiezo con el módulo de sesiones?
@orchestrator-agent ¿qué agente necesito para esto?
```

### [backend.agent.md](./agents/backend.agent.md)
Experto en desarrollo backend con Node.js + Express + Prisma + PostgreSQL.

**Cuándo consultar:**
- Crear nuevos módulos backend
- Implementar endpoints
- Diseñar servicios y lógica de negocio
- Configurar validaciones con Zod
- Gestión de errores tipados

**Uso:**
```
@backend-agent ayúdame a crear un módulo para gestionar sesiones de entrenamiento
```

### [frontend.agent.md](./agents/frontend.agent.md)
Experto en desarrollo frontend con Vite + React + TypeScript.

**Cuándo consultar:**
- Crear nuevos módulos frontend
- Implementar páginas y componentes
- Configurar rutas y navegación
- Hooks personalizados
- Integración con I18N

**Uso:**
```
@frontend-agent ayúdame a crear el módulo de gestión de atletas
```

### [testing.agent.md](./agents/testing.agent.md)
Experto en estrategias de testing para alcanzar cobertura ≥80%.

**Cuándo consultar:**
- Generar tests para módulos nuevos
- Mejorar cobertura de tests existentes
- Estrategias de testing (unitarios, integración, E2E)
- Configuración de mocks

**Uso:**
```
@testing-agent necesito tests para el servicio de autenticación con cobertura 80%
```

### [pr-review.agent.md](./agents/pr-review.agent.md)
Experto en revisión de Pull Requests según estándares del proyecto.

**Cuándo consultar:**
- Antes de crear un PR
- Revisar que el código cumple estándares
- Validar estructura y organización
- Verificar commits, linting, tests

**Uso:**
```
@pr-review-agent revisa mis cambios antes de abrir el PR
```

## 📝 Prompts Predefinidos

Plantillas listas para usar en tareas comunes.

### [new-backend-module.prompt.md](./prompts/new-backend-module.prompt.md)
Crea un nuevo módulo backend completo con:
- Controllers, Services, Routes, Schemas, Types
- Tests unitarios e integración
- Estructura por dominio
- Validación con Zod

**Cómo usar:**
1. Abre el archivo
2. Reemplaza `{NOMBRE_MODULO}` con el nombre de tu módulo
3. Completa las secciones variables (funcionalidades, modelos Prisma, etc.)
4. Copia y pega en el chat de Copilot

### [new-frontend-module.prompt.md](./prompts/new-frontend-module.prompt.md)
Crea un nuevo módulo frontend completo con:
- Páginas, componentes, hooks
- Integración con API
- Rutas con lazy loading
- Traducciones (es + en)

**Cómo usar:**
1. Abre el archivo
2. Reemplaza `{NOMBRE_MODULO}` con el nombre de tu módulo
3. Completa las secciones variables (páginas, componentes, hooks)
4. Copia y pega en el chat de Copilot

### [new-ui-component-storybook.prompt.md](./prompts/new-ui-component-storybook.prompt.md)
Crea un componente UI del design system con:
- Componente React tipado
- CSS con tokens (no valores hardcoded)
- Storybook con todas las variantes
- Tests completos

**Cómo usar:**
1. Abre el archivo
2. Reemplaza `{NOMBRE_COMPONENTE}` con el nombre del componente
3. Describe características específicas (variantes, tamaños, estados)
4. Copia y pega en el chat de Copilot

### [generate-tests-coverage.prompt.md](./prompts/generate-tests-coverage.prompt.md)
Genera tests para alcanzar cobertura ≥80% en:
- Services y Controllers (backend)
- Hooks y Components (frontend)
- Casos happy path, errores, edge cases

**Cómo usar:**
1. Abre el archivo
2. Reemplaza `{RUTA_DEL_ARCHIVO}` con la ruta del archivo a testear
3. Indica tipo de archivo (service/controller/hook/component)
4. Copia y pega en el chat de Copilot

### [setup-husky-precommit.prompt.md](./prompts/setup-husky-precommit.prompt.md)
Configura Husky y pre-commit hooks para:
- Verificar linting automáticamente
- Type-check de TypeScript
- Formateo con Prettier
- Evitar commits con errores

**Cómo usar:**
1. Abre el archivo (solo necesario una vez en el proyecto)
2. Sigue las instrucciones paso a paso
3. Todos los desarrolladores tendrán hooks automáticamente

## 🚀 Flujo de Trabajo Recomendado

### 0. ¿No sabes por dónde empezar?
```bash
# Consulta siempre primero al orchestrator
@orchestrator-agent [describe lo que necesitas hacer]

# El orchestrator te guiará a:
# - El agente apropiado
# - El prompt predefinido correcto
# - Los pasos a seguir
```

### 1. Crear un Nuevo Módulo Backend
```bash
# 1. Consulta el prompt predefinido
# Archivo: .github/prompts/new-backend-module.prompt.md

# 2. En el chat de Copilot:
@backend-agent [pegar contenido del prompt adaptado]

# 3. Revisar antes de PR:
@pr-review-agent revisa el nuevo módulo de sesiones

# 4. Crear PR con commits one-liner
```

### 2. Crear un Nuevo Módulo Frontend
```bash
# 1. Consulta el prompt predefinido
# Archivo: .github/prompts/new-frontend-module.prompt.md

# 2. En el chat de Copilot:
@frontend-agent [pegar contenido del prompt adaptado]

# 3. Asegurar traducciones:
# Verificar que existen archivos en:
# - src/locales/es/{modulo}.json
# - src/locales/en/{modulo}.json

# 4. Revisar antes de PR:
@pr-review-agent revisa el nuevo módulo frontend

# 5. Crear PR con commits one-liner
```

### 3. Añadir Componente UI
```bash
# 1. Consulta el prompt predefinido
# Archivo: .github/prompts/new-ui-component-storybook.prompt.md

# 2. En el chat de Copilot:
@frontend-agent [pegar contenido del prompt adaptado]

# 3. Verificar Storybook:
pnpm storybook
# Navegar a UI/{Component} y verificar stories

# 4. Revisar tests:
pnpm test:coverage

# 5. Crear PR
```

### 4. Mejorar Cobertura de Tests
```bash
# 1. Ver cobertura actual:
pnpm test:coverage

# 2. Identificar archivos con baja cobertura
# Abrir: coverage/lcov-report/index.html

# 3. Consulta el prompt predefinido
# Archivo: .github/prompts/generate-tests-coverage.prompt.md

# 4. En el chat de Copilot:
@testing-agent [pegar contenido del prompt adaptado con ruta del archivo]

# 5. Verificar nueva cobertura:
pnpm test:coverage
```

### 5. Revisión de PR
```bash
# Antes de abrir PR, autorevisión:
@pr-review-agent revisa mis cambios para el módulo X

# Verificar checklist:
# - [ ] Linting pasa (pnpm lint)
# - [ ] Tests pasan (pnpm test)
# - [ ] Cobertura ≥80% (pnpm test:coverage)
# - [ ] Commits one-liner
# - [ ] Traducciones completas (frontend)
# - [ ] Sin strings hardcoded
# - [ ] Sin estilos inline
```

## ✅ Checklist General de Desarrollo

### Antes de Empezar:
- [ ] Leer `copilot-instructions.md`
- [ ] Identificar el agente especializado relevante
- [ ] Consultar prompt predefinido si aplica

### Durante el Desarrollo:
- [ ] Seguir estructura de archivos definida
- [ ] Aplicar principios SOLID
- [ ] Respetar reglas de linting
- [ ] Commits one-liner (tipo: descripción)
- [ ] Traducir TODO (frontend)
- [ ] Usar tokens CSS (no hardcoded)

### Antes de PR:
- [ ] `pnpm lint` pasa
- [ ] `pnpm test` pasa
- [ ] `pnpm test:coverage` ≥80%
- [ ] `pnpm build` sin errores
- [ ] Consultar `@pr-review-agent`
- [ ] Sin strings sin traducir (frontend)
- [ ] Storybook actualizado (si hay componentes UI)

## 🆘 Troubleshooting

### Copilot no encuentra los agentes
Los agentes especializados deben referenciarse con `@{nombre}` en el chat de Copilot (disponible en GitHub).

### Copilot no respeta las reglas
Asegúrate de que `copilot-instructions.md` está en `.github/` en la raíz del proyecto.

### Tests no alcanzan 80%
Consulta `@testing-agent` con:
```
@testing-agent necesito tests para {archivo} que tiene {X}% de cobertura, objetivo 80%
```

### Linting errors
```bash
# Ver errores:
pnpm lint

# Auto-fix lo que se pueda:
pnpm lint:fix

# Formatting:
pnpm format
```

### Pre-commit hooks no funcionan
Si Husky no está bloqueando commits con errores:
```bash
# Reinstalar hooks
pnpm prepare

# Verificar que .husky existe
ls .husky/

# Verificar permisos (en sistemas Unix)
chmod +x .husky/pre-commit

# Probar manualmente
.husky/pre-commit
```

### Bypass de pre-commit hooks
Solo en casos excepcionales (hotfix crítico):
```bash
git commit --no-verify -m "hotfix: descripción"
```
⚠️ **Importante**: Esto debe ser excepcional y debe justificarse en el PR.

## 🔒 Pre-commit Hooks (Husky)

### ¿Qué Son?
Husky ejecuta automáticamente verificaciones antes de cada commit para asegurar calidad del código.

### ¿Qué Verifican?
- **ESLint**: Código sin errores de linting
- **Stylelint**: CSS cumple reglas de estilo (frontend)
- **TypeScript**: Sin errores de tipos
- **Prettier**: Código formateado correctamente
- **Tests**: Tests relacionados con archivos modificados pasan

### Instalación/Setup
```bash
# Husky se instala automáticamente con:
pnpm install

# Para reinstalar hooks:
pnpm prepare
```

### Flujo de Commit con Husky

```
1. Haces cambios en el código
   ↓
2. git add <archivos>
   ↓
3. git commit -m "mensaje"
   ↓
4. 🎣 HUSKY SE ACTIVA
   ├─ Ejecuta ESLint en archivos staged
   ├─ Ejecuta Stylelint (si hay CSS)
   ├─ Ejecuta TypeScript type-check
   ├─ Ejecuta tests relacionados
   └─ Verifica formato con Prettier
   ↓
5a. ✅ Todo OK → Commit exitoso
5b. ❌ Hay errores → Commit rechazado
   └─ Arregla errores y vuelve al paso 2
```

### Ejemplo de Rechazo
```bash
$ git commit -m "feat: add new feature"

⚠️ Husky - pre-commit hook
  ✗ ESLint found 3 errors
  ✗ TypeScript found 1 error

  Fix these errors and try again!
  Or use --no-verify to bypass (not recommended)

# El commit NO se realiza hasta que arregles los errores
```

### Configuración Típica

```json
// package.json
{
  "scripts": {
    "prepare": "husky install",
    "lint": "eslint . --ext ts,tsx",
    "format": "prettier --write .",
    "type-check": "tsc --noEmit"
  },
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.css": [
      "stylelint --fix",
      "prettier --write"
    ]
  }
}
```

### Beneficios
- ✅ Evita commits con errores
- ✅ Mantiene consistencia en el código
- ✅ Detecta problemas antes de PR
- ✅ Ahorra tiempo en code review
- ✅ Fuerza buenas prácticas

### Casos de Uso del Bypass (--no-verify)
Solo usar en:
- ⚠️ Hotfix crítico en producción
- ⚠️ WIP commits en rama feature (poco recomendado)
- ⚠️ Issue con el hook que impide trabajo

**Regla**: Si usas `--no-verify`, debes justificarlo en el PR.

## 📚 Recursos Adicionales

- **Base.txt**: Documento original con toda la especificación del proyecto
- **Prisma Schema**: `apps/backend/prisma/schema.prisma` - Modelos de la BD
- **Estructura Backend**: `apps/backend/src/modules/` - Módulos existentes como referencia
- **Estructura Frontend**: `apps/frontend/src/modules/` - Módulos existentes como referencia
- **Design System**: `apps/frontend/src/ui/` - Componentes UI del proyecto

## 🔄 Mantenimiento

Esta estructura debe mantenerse actualizada con:
- Nuevas reglas del proyecto
- Cambios en arquitectura
- Actualizaciones de dependencias importantes
- Mejoras en flujos de trabajo
- Nuevos prompts para tareas comunes

## 💡 Tips

1. **Use los prompts predefinidos** - Son plantillas probadas que aseguran consistencia
2. **Consulte los agentes especializados** - Tienen contexto específico de su área
3. **Revise con pr-review-agent** - Antes de crear PR para evitar rechazos
4. **Mantenga commits pequeños** - Un commit = una responsabilidad
5. **Testee primero** - Crear tests mientras desarrolla, no al final
6. **I18N desde el inicio** - No deje traducciones para después (frontend)
7. **Use Storybook** - Desarrollar componentes UI aislados es más rápido

---

**Proyecto**: Sailio  
**Stack**: Monorepo (pnpm + turbo) | Backend (Node.js + Express + Prisma) | Frontend (Vite + React + TypeScript)  
**Principios**: SOLID | Cobertura ≥80% | I18N (es/en) | Design System Interno
