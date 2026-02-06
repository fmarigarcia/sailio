# Prompt: Configurar Husky y Pre-commit Hooks

## Objetivo
Configurar Husky para ejecutar verificaciones automáticas antes de cada commit en el proyecto Sailio.

## Instrucciones para GitHub Copilot

Por favor, configura Husky y pre-commit hooks para el proyecto siguiendo estos requisitos:

## Requisitos del Proyecto

### Backend (apps/backend)
Pre-commit debe verificar:
- ✅ ESLint sin errores
- ✅ TypeScript type-check sin errores
- ✅ Prettier formato correcto
- ✅ Tests relacionados pasan (opcional: puede ser lento)

### Frontend (apps/frontend)
Pre-commit debe verificar:
- ✅ ESLint sin errores
- ✅ Stylelint sin errores (archivos CSS)
- ✅ TypeScript type-check sin errores
- ✅ Prettier formato correcto
- ✅ Tests relacionados pasan (opcional: puede ser lento)

## Configuración Requerida

### 1. Instalar Dependencias

En la raíz del monorepo:
```bash
pnpm add -D husky lint-staged
```

### 2. Scripts en package.json (Raíz)

```json
{
  "scripts": {
    "prepare": "husky install",
    "lint": "turbo run lint",
    "format": "prettier --write \"**/*.{ts,tsx,js,jsx,json,css,md}\"",
    "format:check": "prettier --check \"**/*.{ts,tsx,js,jsx,json,css,md}\"",
    "type-check": "turbo run type-check",
    "test": "turbo run test"
  }
}
```

### 3. Scripts en apps/backend/package.json

```json
{
  "scripts": {
    "lint": "eslint . --ext .ts",
    "lint:fix": "eslint . --ext .ts --fix",
    "format": "prettier --write \"src/**/*.ts\"",
    "type-check": "tsc --noEmit",
    "test": "jest",
    "test:coverage": "jest --coverage"
  }
}
```

### 4. Scripts en apps/frontend/package.json

```json
{
  "scripts": {
    "lint": "eslint . --ext .ts,.tsx",
    "lint:fix": "eslint . --ext .ts,.tsx --fix",
    "format": "prettier --write \"src/**/*.{ts,tsx,css}\"",
    "type-check": "tsc --noEmit",
    "test": "vitest run",
    "test:coverage": "vitest run --coverage",
    "stylelint": "stylelint \"src/**/*.css\"",
    "stylelint:fix": "stylelint \"src/**/*.css\" --fix"
  }
}
```

### 5. Configurar lint-staged

Crear `.lintstagedrc.json` en la raíz:

```json
{
  "apps/backend/**/*.ts": [
    "eslint --fix",
    "prettier --write"
  ],
  "apps/frontend/**/*.{ts,tsx}": [
    "eslint --fix",
    "prettier --write"
  ],
  "apps/frontend/**/*.css": [
    "stylelint --fix",
    "prettier --write"
  ],
  "*.{json,md}": [
    "prettier --write"
  ]
}
```

### 6. Inicializar Husky

```bash
# Inicializar Husky
pnpm prepare

# Esto crea la carpeta .husky/
```

### 7. Crear Pre-commit Hook

Crear `.husky/pre-commit`:

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

echo "🎣 Husky pre-commit hook"
echo "Running lint-staged..."

# Ejecutar lint-staged
pnpm lint-staged

# Verificar que lint-staged pasó
if [ $? -ne 0 ]; then
  echo "❌ Lint-staged failed. Fix errors and try again."
  exit 1
fi

echo "Running type-check..."

# Type check en backend
cd apps/backend && pnpm type-check
if [ $? -ne 0 ]; then
  echo "❌ Backend type-check failed."
  exit 1
fi

# Type check en frontend
cd ../frontend && pnpm type-check
if [ $? -ne 0 ]; then
  echo "❌ Frontend type-check failed."
  exit 1
fi

echo "✅ All checks passed!"
```

### 8. Dar Permisos (Unix/Mac)

```bash
chmod +x .husky/pre-commit
```

En Windows, este paso generalmente no es necesario.

### 9. (Opcional) Pre-push Hook para Tests

Crear `.husky/pre-push` para ejecutar tests antes de push:

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

echo "🎣 Husky pre-push hook"
echo "Running tests..."

# Ejecutar tests en todo el proyecto
pnpm test

if [ $? -ne 0 ]; then
  echo "❌ Tests failed. Fix them before pushing."
  exit 1
fi

echo "✅ All tests passed!"
```

### 10. Actualizar .gitignore

Asegurarse de que `.husky/_/*` NO esté en .gitignore (los hooks deben commitearse).

```gitignore
# .gitignore

# Node modules
node_modules/

# Build outputs
dist/
build/
.turbo/

# Env files
.env
.env.local

# Coverage
coverage/

# Logs
*.log

# NO ignorar .husky/ - los hooks deben commitearse
# .husky/
```

## Configuración de Turbo (turbo.json)

Actualizar `turbo.json` para soportar los comandos:

```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**"]
    },
    "lint": {
      "outputs": []
    },
    "type-check": {
      "outputs": []
    },
    "test": {
      "outputs": ["coverage/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

## Testing de la Configuración

### Test 1: Commit con Errores de Linting
```bash
# Introducir un error de linting intencionalmente
# Por ejemplo: usar console.log en backend

git add .
git commit -m "test: intentional linting error"

# Resultado esperado:
# ❌ ESLint found errors
# Commit rechazado
```

### Test 2: Commit con Errores de Tipos
```bash
# Introducir un error de tipos
# Por ejemplo: usar 'any' en TypeScript

git add .
git commit -m "test: intentional type error"

# Resultado esperado:
# ❌ TypeScript type-check failed
# Commit rechazado
```

### Test 3: Commit Válido
```bash
# Todo el código correcto
git add .
git commit -m "feat: add new feature"

# Resultado esperado:
# ✅ All checks passed!
# Commit exitoso
```

### Test 4: Bypass (solo para verificar que funciona)
```bash
git commit -m "test: bypass" --no-verify

# Resultado esperado:
# Commit exitoso sin verificaciones
# ⚠️ Solo usar en emergencias
```

## Mensajes de Ayuda para Desarrolladores

Añadir en el README principal del proyecto:

```markdown
## 🔒 Pre-commit Hooks

Este proyecto usa Husky para verificaciones automáticas antes de commit.

Si tu commit es rechazado:
1. Lee el mensaje de error
2. Arregla los problemas indicados
3. Vuelve a intentar el commit

Comandos útiles:
- `pnpm lint:fix` - Auto-arreglar linting
- `pnpm format` - Auto-formatear código
- `pnpm type-check` - Verificar tipos

Solo en emergencias:
- `git commit --no-verify` - Bypass hooks (justificar en PR)
```

## Estructura Final de Archivos

```
sailio/
├── .husky/
│   ├── _/
│   ├── pre-commit          # ✅ Verificaciones antes de commit
│   └── pre-push            # ✅ (Opcional) Tests antes de push
├── .lintstagedrc.json      # ✅ Configuración de lint-staged
├── package.json            # ✅ Script "prepare"
├── turbo.json              # ✅ Pipeline de turbo
├── apps/
│   ├── backend/
│   │   └── package.json    # ✅ Scripts de lint, format, type-check
│   └── frontend/
│       └── package.json    # ✅ Scripts de lint, format, type-check
└── .gitignore              # ✅ NO ignorar .husky/
```

## Troubleshooting

### Husky no se ejecuta
```bash
# Reinstalar hooks
pnpm prepare

# Verificar que .husky existe
ls .husky/

# En Unix: dar permisos
chmod +x .husky/pre-commit
```

### Hooks muy lentos
Si ejecutar tests en pre-commit es muy lento, considera:
- Mover tests a pre-push en vez de pre-commit
- Solo ejecutar lint y type-check en pre-commit
- Tests se ejecutan en CI de todas formas

### Error en Windows con sh
Asegurar que Git Bash está instalado (viene con Git for Windows).

## Checklist de Validación

- [ ] Husky instalado y configurado
- [ ] lint-staged configurado
- [ ] Pre-commit hook creado
- [ ] Scripts en package.json (raíz, backend, frontend)
- [ ] turbo.json actualizado
- [ ] .gitignore NO ignora .husky/
- [ ] Tests de commit con error → rechazado ✅
- [ ] Tests de commit válido → exitoso ✅
- [ ] Documentación en README actualizada

## Beneficios para el Equipo

- ✅ Evita commits con errores
- ✅ Detecta problemas antes de PR
- ✅ Mantiene consistencia de código
- ✅ Ahorra tiempo en code review
- ✅ Fuerza cumplimiento de estándares

---

**Importante**: Los hooks de Husky DEBEN commitearse al repositorio para que todos los desarrolladores los tengan automáticamente.
