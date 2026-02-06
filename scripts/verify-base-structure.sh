#!/bin/bash

# Script de verificación de la estructura base del proyecto Sailio
# Ejecutar: bash scripts/verify-base-structure.sh

set -e

echo "🔍 Verificando estructura base del proyecto Sailio..."
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check file
check_file() {
  if [ -f "$1" ]; then
    echo -e "${GREEN}✓${NC} $1"
    return 0
  else
    echo -e "${RED}✗${NC} $1 (falta)"
    return 1
  fi
}

# Function to check directory
check_dir() {
  if [ -d "$1" ]; then
    echo -e "${GREEN}✓${NC} $1/"
    return 0
  else
    echo -e "${RED}✗${NC} $1/ (falta)"
    return 1
  fi
}

echo "📁 Verificando archivos de configuración..."
check_file "package.json"
check_file "pnpm-workspace.yaml"
check_file "turbo.json"
check_file "tsconfig.base.json"
check_file "tsconfig.json"
check_file ".eslintrc.js"
check_file ".prettierrc"
check_file ".prettierignore"
check_file ".stylelintrc.json"
check_file ".editorconfig"
check_file ".gitignore"
check_file ".nvmrc"
check_file ".env.example"
check_file "README.md"
echo ""

echo "📂 Verificando estructura de directorios..."
check_dir "apps"
check_dir "packages"
check_dir ".github"
check_dir ".husky"
echo ""

echo "🪝 Verificando hooks de Git..."
check_file ".husky/pre-commit"
if [ -f ".husky/pre-commit" ] && [ -x ".husky/pre-commit" ]; then
  echo -e "${GREEN}✓${NC} pre-commit es ejecutable"
else
  echo -e "${YELLOW}⚠${NC} pre-commit no es ejecutable (ejecutar: chmod +x .husky/pre-commit)"
fi
echo ""

echo "📦 Verificando Node.js y pnpm..."
if command -v node &> /dev/null; then
  NODE_VERSION=$(node -v)
  echo -e "${GREEN}✓${NC} Node.js: $NODE_VERSION"
else
  echo -e "${RED}✗${NC} Node.js no está instalado"
fi

if command -v pnpm &> /dev/null; then
  PNPM_VERSION=$(pnpm -v)
  echo -e "${GREEN}✓${NC} pnpm: $PNPM_VERSION"
else
  echo -e "${RED}✗${NC} pnpm no está instalado"
fi
echo ""

echo "📋 Verificando package.json..."
if grep -q '"private": true' package.json; then
  echo -e "${GREEN}✓${NC} Proyecto configurado como privado"
fi

if grep -q '"packageManager": "pnpm' package.json; then
  echo -e "${GREEN}✓${NC} Package manager configurado (pnpm)"
fi

if grep -q '"prepare": "husky install"' package.json; then
  echo -e "${GREEN}✓${NC} Script prepare configurado para Husky"
fi
echo ""

echo "✅ Verificación completada"
echo ""
echo "📝 Próximos pasos:"
echo "  1. Ejecutar: pnpm install"
echo "  2. Verificar que Husky se instaló: ls -la .husky/"
echo "  3. Crear aplicación backend en apps/backend/"
echo "  4. Crear aplicación frontend en apps/frontend/"
echo ""
echo "🤖 Consulta los agentes especializados:"
echo "  - @orchestrator-agent para guía"
echo "  - @backend-agent para backend"
echo "  - @frontend-agent para frontend"
